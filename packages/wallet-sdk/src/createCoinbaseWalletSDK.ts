import { createCoinbaseWalletProvider } from './createCoinbaseWalletProvider.js';
import { LIB_VERSION } from './version.js';
import {
  AppMetadata,
  ConstructorOptions,
  Preference,
  ProviderInterface,
} from ':core/provider/interface.js';
import { ScopedLocalStorage } from ':core/storage/ScopedLocalStorage.js';
import { checkCrossOriginOpenerPolicy } from ':util/crossOriginOpenerPolicy.js';

export type CreateCoinbaseWalletSDKOptions = Partial<AppMetadata> & {
  preference?: Preference;
};

const DEFAULT_PREFERENCE: Preference = {
  options: 'all',
};

export function createCoinbaseWalletSDK(params: CreateCoinbaseWalletSDKOptions) {
  const versionStorage = new ScopedLocalStorage('CBWSDK');
  versionStorage.setItem('VERSION', LIB_VERSION);

  void checkCrossOriginOpenerPolicy();

  const options: ConstructorOptions = {
    metadata: {
      appName: params.appName || 'Dapp',
      appLogoUrl: params.appLogoUrl || '',
      appChainIds: params.appChainIds || [],
    },
    preference: Object.assign(DEFAULT_PREFERENCE, params.preference ?? {}),
  };
  let provider: ProviderInterface | null = null;

  return {
    getProvider: () => {
      if (!provider) {
        provider = createCoinbaseWalletProvider(options);
      }
      return provider;
    },
  };
}
