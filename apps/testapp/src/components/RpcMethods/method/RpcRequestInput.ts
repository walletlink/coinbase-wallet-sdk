type FormattedParamsType = Record<string, unknown> | string;

export type RpcRequestInput = {
  connected?: boolean;
  method: string;
  params: Array<{ key: string; required?: boolean }>;
  format?: (data: Record<string, string>) => FormattedParamsType[];
};
