import { StateUpdateListener } from '../interface';
import { SCWKeyManager } from './SCWKeyManager';
import { Communicator } from ':core/communicator/Communicator';
import { standardErrors } from ':core/error';
import { RPCRequestMessage, RPCResponse, RPCResponseMessage } from ':core/message';
import { AppMetadata, RequestArguments, Signer } from ':core/provider/interface';
import { Method } from ':core/provider/method';
import { AddressString, Chain } from ':core/type';
import { ensureChainId } from ':core/type/util';
import {
  decryptContent,
  encryptContent,
  exportKeyToHexString,
  importKeyFromHexString,
} from ':util/cipher';
import { ScopedLocalStorage } from ':util/ScopedLocalStorage';

const ACCOUNTS_KEY = 'accounts';
const ACTIVE_CHAIN_STORAGE_KEY = 'activeChain';
const AVAILABLE_CHAINS_STORAGE_KEY = 'availableChains';
const WALLET_CAPABILITIES_STORAGE_KEY = 'walletCapabilities';

export class SCWSigner implements Signer {
  private readonly metadata: AppMetadata;
  private readonly communicator: Communicator;
  private readonly updateListener: StateUpdateListener;
  private readonly keyManager: SCWKeyManager;
  private readonly storage: ScopedLocalStorage;

  private availableChains?: Chain[];
  private _accounts: AddressString[];
  private _activeChain: Chain;
  get accounts() {
    return this._accounts;
  }
  get activeChain() {
    return this._activeChain;
  }

  constructor(params: {
    metadata: AppMetadata;
    communicator: Communicator;
  }) {
    this.metadata = params.metadata;
    this.communicator = params.communicator;
    this.updateListener = params.updateListener;
    this.keyManager = new SCWKeyManager();

    this.storage = new ScopedLocalStorage('CBWSDK', 'SCWStateManager');
    this._accounts = this.storage.loadObject(ACCOUNTS_KEY) ?? [];
    this._activeChain = this.storage.loadObject(ACTIVE_CHAIN_STORAGE_KEY) || {
      id: params.metadata.appChainIds?.[0] ?? 1,
    };

    this.handshake = this.handshake.bind(this);
    this.request = this.request.bind(this);
    this.createRequestMessage = this.createRequestMessage.bind(this);
    this.decryptResponseMessage = this.decryptResponseMessage.bind(this);
  }

  get accounts() {
    return this.stateManager.accounts;
  }

  get chain() {
    return this.stateManager.activeChain;
  }

  async handshake(): Promise<AddressString[]> {
    const handshakeMessage = await this.createRequestMessage({
      handshake: {
        method: 'eth_requestAccounts',
        params: this.metadata,
      },
    });
    const response: RPCResponseMessage =
      await this.communicator.postRequestAndWaitForResponse(handshakeMessage);

    // store peer's public key
    if ('failure' in response.content) throw response.content.failure;
    const peerPublicKey = await importKeyFromHexString('public', response.sender);
    await this.keyManager.setPeerPublicKey(peerPublicKey);

    const decrypted = await this.decryptResponseMessage<AddressString[]>(response);

    if ('error' in decrypted.result) throw decrypted.result.error;

    this._accounts = decrypted.result.value;
    this.storage.storeObject(ACCOUNTS_KEY, this._accounts);
    this.updateListener.onAccountsUpdate(this._accounts);
    return this._accounts;
  }

  async request<T>(request: RequestArguments): Promise<T> {
    switch (request.method as Method) {
      case 'wallet_getCapabilities':
        return this.storage.loadObject(WALLET_CAPABILITIES_STORAGE_KEY) as T;
      case 'wallet_switchEthereumChain':
        return this.handleSwitchChainRequest(request) as T;
      default:
        return this.sendRequestToPopup<T>(request);
    }
  }

  private async sendRequestToPopup<T>(request: RequestArguments): Promise<T> {
    // Open the popup before constructing the request message.
    // This is to ensure that the popup is not blocked by some browsers (i.e. Safari)
    await this.communicator.waitForPopupLoaded();

    const response = await this.sendEncryptedRequest(request);
    const decrypted = await this.decryptResponseMessage<T>(response);

    if ('error' in decrypted.result) throw decrypted.result.error;
    return decrypted.result.value;
  }

  async disconnect() {
    this.storage.clear();
    await this.keyManager.clear();
  }

  /**
   * @returns `null` if the request was successful.
   * https://eips.ethereum.org/EIPS/eip-3326#wallet_switchethereumchain
   */
  private async handleSwitchChainRequest(request: RequestArguments) {
    const chainId = ensureChainId(request.params);

    // local handling
    const switched = this.switchChain(chainId);
    if (switched) return null;

    const result = await this.sendRequestToPopup(request);
    if (result === null) {
      this.switchChain(chainId);
    }
    return result;
  }

  private async sendEncryptedRequest(request: RequestArguments): Promise<RPCResponseMessage> {
    const sharedSecret = await this.keyManager.getSharedSecret();
    if (!sharedSecret) {
      throw standardErrors.provider.unauthorized(
        'No valid session found, try requestAccounts before other methods'
      );
    }

    const encrypted = await encryptContent(
      {
        action: request,
        chainId: this._activeChain.id,
      },
      sharedSecret
    );
    const message = await this.createRequestMessage({ encrypted });

    return this.communicator.postRequestAndWaitForResponse(message);
  }

  private async createRequestMessage(
    content: RPCRequestMessage['content']
  ): Promise<RPCRequestMessage> {
    const publicKey = await exportKeyToHexString('public', await this.keyManager.getOwnPublicKey());
    return {
      id: crypto.randomUUID(),
      sender: publicKey,
      content,
      timestamp: new Date(),
    };
  }

  private async decryptResponseMessage<T>(message: RPCResponseMessage): Promise<RPCResponse<T>> {
    const content = message.content;

    // throw protocol level error
    if ('failure' in content) {
      throw content.failure;
    }

    const sharedSecret = await this.keyManager.getSharedSecret();
    if (!sharedSecret) {
      throw standardErrors.provider.unauthorized('Invalid session');
    }

    const response: RPCResponse<T> = await decryptContent(content.encrypted, sharedSecret);

    const metadata = response.data;
    if (metadata) {
      this.cacheMetadata(metadata);
    }

    return response;
  }

  private cacheMetadata({
    chains: availableChains,
    capabilities,
  }: Exclude<RPCResponse<unknown>['data'], undefined>) {
    if (availableChains) {
      const chains = Object.entries(availableChains).map(([id, rpcUrl]) => ({
        id: Number(id),
        rpcUrl,
      }));
      this.availableChains = chains;
      this.storage.storeObject(AVAILABLE_CHAINS_STORAGE_KEY, chains);
      this.switchChain(this._activeChain.id);
    }

    if (capabilities) {
      this.storage.storeObject(WALLET_CAPABILITIES_STORAGE_KEY, capabilities);
    }
  }

  private switchChain(chainId: number): boolean {
    const chain = this.availableChains?.find((chain) => chain.id === chainId);
    if (!chain) return false;
    if (chain === this._activeChain) return true;

    this._activeChain = chain;
    this.storage.storeObject(ACTIVE_CHAIN_STORAGE_KEY, chain);
    this.updateListener.onChainUpdate(chain);
    return true;
  }
}
