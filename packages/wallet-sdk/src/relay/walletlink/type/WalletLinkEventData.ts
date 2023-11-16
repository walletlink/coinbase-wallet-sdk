// Copyright (c) 2018-2023 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0

import { Web3Request } from ':core/type/Web3Request';
import { Web3Response } from ':core/type/Web3Response';

type Type =
  | 'SESSION_ID_REQUEST'
  | 'SESSION_ID_RESPONSE'
  | 'LINKED'
  | 'UNLINKED'
  | 'WEB3_REQUEST'
  | 'WEB3_REQUEST_CANCELED'
  | 'WEB3_RESPONSE';

export type WalletLinkEventData = {
  type: Type;
  id: string;
} & (
  | {
      type: 'WEB3_RESPONSE';
      response: Web3Response;
    }
  | {
      type: 'WEB3_REQUEST';
      request: Web3Request;
    }
  | {
      type: 'WEB3_REQUEST_CANCELED';
    }
);

export type WalletLinkResponseEventData = Extract<WalletLinkEventData, { type: 'WEB3_RESPONSE' }>;
