import { EventEmitter } from 'eventemitter3';

export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

interface ProviderConnectInfo {
  readonly chainId: string;
}

type ProviderEventMap = {
  connect: ProviderConnectInfo;
  disconnect: ProviderRpcError;
  chainChanged: string; // hex string
  accountsChanged: string[];
};

export class ProviderEventEmitter extends EventEmitter<keyof ProviderEventMap> {}

export interface ProviderInterface extends ProviderEventEmitter {
  request(args: RequestArguments): Promise<unknown>;
  disconnect(): Promise<void>;
  emit<K extends keyof ProviderEventMap>(event: K, ...args: [ProviderEventMap[K]]): boolean;
  on<K extends keyof ProviderEventMap>(event: K, listener: (_: ProviderEventMap[K]) => void): this;
}

export type ProviderEventCallback = ProviderInterface['emit'];

export interface AppMetadata {
  /** Application name */
  appName: string;
  /** Application logo image URL; favicon is used if unspecified */
  appLogoUrl: string | null;
  /** Array of chainIds your dapp supports */
  appChainIds: number[];
}

type PostOnboardingAction = 'none' | 'onramp' | 'magicspend';

type OnrampPrefillOptions = {
  contractAddress?: string;
  amount: string;
  chainId: number;
};

export type Preference = {
  /**
   * @param options
   */
  options: 'all' | 'smartWalletOnly' | 'eoaOnly';
  /**
   * @param postOnboardingAction
   * @type {PostOnboardingAction}
   * @description Displays CTAs to the user based on the preference of the dapp.
   * These CTAs are part of prebuilt UI components that are available to the Coinbase
   * Smart Wallet.
   *
   * Possible values:
   * - `none`: No action is recommended post-onboarding. (Default experience)
   * - `onramp`: Recommends initiating the onramp flow, allowing users to prefill their account with an optional asset.
   * - `magicspend`: Suggests linking the users retail Coinbase account for seamless transactions.
   */
  postOnboardingAction?: PostOnboardingAction;
  /**
   * @param onrampPrefillOptions
   * @type {OnrampPrefillOptions}
   * @description This option only functions when `postOnboardingAction` is set to `onramp`. Defaults to an asset selector
   * with 0 as the initial amount
   *
   * - Prefills the onramp flow with the specified asset, chain, and suggested amount, allowing users to prefill their account.
   * - Ensure the asset and chain are supported by the onramp provider (e.g., Coinbase Pay - CBPay).
   *
   * See https://docs.cdp.coinbase.com/onramp/docs/layer2#available-assets for a list of supported assets and networks.
   */
  onrampPrefillOptions?: OnrampPrefillOptions;
  /**
   * @param attributionDataSuffix
   * @type {Hex}
   * @description Data suffix to be appended to the initCode or executeBatch calldata
   * Expects a 4 byte hex string
   */
  attributionDataSuffix?: string;
} & Record<string, unknown>;

export interface ConstructorOptions {
  metadata: AppMetadata;
  preference: Preference;
}
