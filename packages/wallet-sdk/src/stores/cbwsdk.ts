import { Address, Hex, LocalAccount, type OneOf } from 'viem';
import { WebAuthnAccount } from 'viem/account-abstraction';
import { createStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { VERSION } from '../sdk-info.js';
import { AppMetadata, Preference } from ':core/provider/interface.js';

export type GetSubAccountSigner = () => Promise<{
  account: OneOf<LocalAccount | WebAuthnAccount> | null;
}>;

export type SubAccountInfo = {
  address: Address;
  factory?: Address;
  factoryData?: Hex;
};

type SubAccountState = {
  getSigner?: GetSubAccountSigner;
  account?: SubAccountInfo;
  universalAccount?: Address;
};

type ScwState = {
  accounts?: Address[];
  chain?: {
    id: number;
    rpcUrl?: string;
    nativeCurrency?: {
      name?: string;
      symbol?: string;
      decimal?: number;
    };
  };
  capabilities?: Record<string, unknown>;
  keys?: {
    [key: string]: string | null;
  };
};

type Storage = {
  preference: Preference;
  metadata: AppMetadata;
  chains: {
    id: number;
    rpcUrl?: string;
    nativeCurrency?: {
      name?: string;
      symbol?: string;
      decimal?: number;
    };
  }[];
  subaccount: SubAccountState;
  version: string;
  scw?: ScwState;
  keys?: {
    [key: string]: string | null;
  };
};

export const storage = createStore(
  persist<Partial<Storage>>(
    () => ({
      chains: [],
      keys: {},
      scw: {},
      subaccount: {},
      version: VERSION,
    }),
    {
      name: 'cbwsdk.store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chains: state.chains,
        keys: state.keys,
        scw: state.scw,
        subaccount: {
          universalAccount: state.subaccount?.universalAccount,
          account: state.subaccount?.account,
        },
        version: state.version,
      }),
    }
  )
);
