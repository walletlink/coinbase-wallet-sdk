import { decodeAbiParameters, encodeFunctionData, toHex } from 'viem';

import { createCoinbaseWalletProvider } from './createCoinbaseWalletProvider.js';
import { VERSION } from './sdk-info.js';
import {
  AppMetadata,
  ConstructorOptions,
  Preference,
  ProviderInterface,
} from ':core/provider/interface.js';
import { WalletConnectResponse } from ':core/rpc/wallet_connect.js';
import { ScopedLocalStorage } from ':core/storage/ScopedLocalStorage.js';
import { abi } from ':sign/scw/utils/constants.js';
import { subaccounts, SubAccountState } from ':stores/sub-accounts/store.js';
import { checkCrossOriginOpenerPolicy } from ':util/checkCrossOriginOpenerPolicy.js';
import { validatePreferences, validateSubAccount } from ':util/validatePreferences.js';
export type CreateCoinbaseWalletSDKOptions = Partial<AppMetadata> & {
  preference?: Preference;
  subaccount?: {
    getSigner: SubAccountState['getSigner'];
  };
};

const DEFAULT_PREFERENCE: Preference = {
  options: 'all',
};

/**
 * Create a Coinbase Wallet SDK instance.
 * @param params - Options to create a Coinbase Wallet SDK instance.
 * @returns A Coinbase Wallet SDK object.
 */
export function createCoinbaseWalletSDK(params: CreateCoinbaseWalletSDKOptions) {
  const versionStorage = new ScopedLocalStorage('CBWSDK');
  versionStorage.setItem('VERSION', VERSION);

  void checkCrossOriginOpenerPolicy();

  const options: ConstructorOptions = {
    metadata: {
      appName: params.appName || 'Dapp',
      appLogoUrl: params.appLogoUrl || '',
      appChainIds: params.appChainIds || [],
    },
    preference: Object.assign(DEFAULT_PREFERENCE, params.preference ?? {}),
  };

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
    subaccounts.setState({
      getSigner: params.subaccount.getSigner,
    });
  }

  let provider: ProviderInterface | null = null;

  const sdk = {
    getProvider() {
      if (!provider) {
        provider = createCoinbaseWalletProvider(options);
      }
      // @ts-expect-error - provider
      provider.sdk = sdk;
      return provider;
    },
    subaccount: {
      async create({ key, chainId }: { key: `0x${string}`; chainId: number }) {
        const state = subaccounts.getState();
        if (!state.getSigner) {
          throw new Error('no signer found');
        }

        if (state.account) {
          throw new Error('subaccount already exists');
        }
        return sdk.getProvider()?.request({
          method: 'wallet_addSubAccount',
          params: [
            {
              chainId,
              capabilities: {
                createAccount: {
                  signer: key,
                },
              },
            },
          ],
        });
      },
      async get(chainId: number) {
        const state = subaccounts.getState();
        if (!state.account) {
          const response = (await sdk.getProvider()?.request({
            method: 'wallet_connect',
            params: [
              {
                version: 1,
                capabilities: {
                  getAppAccounts: {
                    chainId,
                  },
                },
              },
            ],
          })) as WalletConnectResponse;
          return response.accounts[0].capabilities?.getSubAccounts?.[0];
        }
        return state.account;
      },
      async addOwner({
        address,
        publicKey,
      }:
        | {
            address: `0x${string}`;
            publicKey?: never;
          }
        | {
            address?: never;
            publicKey: `0x${string}`;
          }) {
        const state = subaccounts.getState();
        if (!state.getSigner) {
          throw new Error('no signer found');
        }

        if (!state.account) {
          throw new Error('subaccount does not exist');
        }

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

        return sdk.getProvider()?.request({
          method: 'wallet_sendCalls',
          params: [
            {
              version: 1,
              calls,
              from: state.account.universalAccount,
            },
          ],
        });
      },
      setSigner(params: SubAccountState['getSigner']) {
        validateSubAccount(params);
        subaccounts.setState({
          getSigner: params,
        });
      },
    },
  };

  return sdk;
}
