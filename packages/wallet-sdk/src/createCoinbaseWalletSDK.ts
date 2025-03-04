import { decodeAbiParameters, encodeFunctionData, toHex } from 'viem';

import { createCoinbaseWalletProvider } from './createCoinbaseWalletProvider.js';
import { GetSubAccountSigner, storage, SubAccountInfo } from './stores/cbwsdk.js';
import {
  AppMetadata,
  ConstructorOptions,
  Preference,
  ProviderInterface,
} from ':core/provider/interface.js';
import { AddSubAccountAccount } from ':core/rpc/wallet_addSubAccount.js';
import { WalletConnectResponse } from ':core/rpc/wallet_connect.js';
import { abi } from ':sign/scw/utils/constants.js';
import { assertPresence } from ':util/assertPresence.js';
import { checkCrossOriginOpenerPolicy } from ':util/checkCrossOriginOpenerPolicy.js';
import { validatePreferences, validateSubAccount } from ':util/validatePreferences.js';

export type CreateCoinbaseWalletSDKOptions = Partial<AppMetadata> & {
  preference?: Preference;
  subaccount?: {
    getSigner: GetSubAccountSigner;
  };
};

const DEFAULT_PREFERENCE: Preference = {
  options: 'all',
};

type SubAccountAddOwnerParams = {
  address?: `0x${string}`;
  publicKey?: `0x${string}`;
  chainId: number;
};

/**
 * Create a Coinbase Wallet SDK instance.
 * @param params - Options to create a Coinbase Wallet SDK instance.
 * @returns A Coinbase Wallet SDK object.
 */
export function createCoinbaseWalletSDK(params: CreateCoinbaseWalletSDKOptions) {
  // rehydrate the store from storage
  storage.persist.rehydrate();

  // check the cross origin opener policy
  void checkCrossOriginOpenerPolicy();

  const options: ConstructorOptions = {
    metadata: {
      appName: params.appName || 'Dapp',
      appLogoUrl: params.appLogoUrl || '',
      appChainIds: params.appChainIds || [],
    },
    preference: Object.assign(DEFAULT_PREFERENCE, params.preference ?? {}),
  };

  // set the options in the store
  storage.setState(options);

  /**
   * Validate user supplied preferences. Throws if key/values are not valid.
   */
  validatePreferences(options.preference);

  /**
   * Set the sub account signer inside the store.
   */
  if (params.subaccount) {
    validateSubAccount(params.subaccount.getSigner);
    // store the signer in the sub account store
    storage.setState({
      subaccount: {
        getSigner: params.subaccount.getSigner,
      },
    });
  }

  let provider: ProviderInterface | null = null;

  const sdk = {
    getProvider() {
      if (!provider) {
        provider = createCoinbaseWalletProvider(options);
      }
      // @ts-expect-error - store reference to the sdk on the provider
      provider.sdk = sdk;
      return provider;
    },
    subaccount: {
      async create(account: AddSubAccountAccount): Promise<SubAccountInfo> {
        const state = storage.getState().subaccount;
        assertPresence(state);
        assertPresence(state.getSigner, new Error('no sub account signer'));
        assertPresence(state.account, new Error('subaccount already exists'));

        return (await sdk.getProvider()?.request({
          method: 'wallet_addSubAccount',
          params: [
            {
              version: '1',
              account,
            },
          ],
        })) as SubAccountInfo;
      },
      async get(): Promise<SubAccountInfo> {
        const state = storage.getState().subaccount;
        assertPresence(state);
        if (state.account) {
          return state.account;
        }

        const response = (await sdk.getProvider()?.request({
          method: 'wallet_connect',
          params: [
            {
              version: 1,
              capabilities: {
                getAppAccounts: true,
              },
            },
          ],
        })) as WalletConnectResponse;
        return response.accounts[0].capabilities?.getSubAccounts?.[0] as SubAccountInfo;
      },
      async addOwner({ address, publicKey, chainId }: SubAccountAddOwnerParams): Promise<string> {
        const state = storage.getState().subaccount;
        assertPresence(state);
        assertPresence(state.getSigner, new Error('no sub account signer'));
        assertPresence(state.account, new Error('subaccount does not exist'));

        const calls = [];
        if (publicKey) {
          const [x, y] = decodeAbiParameters([{ type: 'bytes32' }, { type: 'bytes32' }], publicKey);
          calls.push({
            to: state.account.address,
            data: encodeFunctionData({
              abi,
              functionName: 'addOwnerPublicKey',
              args: [x, y] as const,
            }),
            value: toHex(0),
          });
        }

        if (address) {
          calls.push({
            to: state.account.address,
            data: encodeFunctionData({
              abi,
              functionName: 'addOwnerAddress',
              args: [address] as const,
            }),
            value: toHex(0),
          });
        }

        return (await sdk.getProvider()?.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls,
              chainId: toHex(chainId),
              from: state.universalAccount,
              version: 1,
            },
          ],
        })) as string;
      },
      setSigner(params: GetSubAccountSigner): void {
        validateSubAccount(params);
        storage.setState({
          subaccount: {
            getSigner: params,
          },
        });
      },
    },
  };

  return sdk;
}
