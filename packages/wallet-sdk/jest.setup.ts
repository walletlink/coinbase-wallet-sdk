import "@testing-library/jest-dom";

import { Crypto } from "@peculiar/webcrypto";
import { TextDecoder, TextEncoder } from "util";

global.crypto = new Crypto();

global.TextEncoder = TextEncoder;

// @ts-expect-error Use util TextDecoder
global.TextDecoder = TextDecoder;

expect.extend({
  toThrowEIPError(received, code, message) {
    const expected = expect.objectContaining({
      code,
      message,
      data: expect.objectContaining({
        docUrl: expect.stringContaining("https://docs.cloud.coinbase.com/"),
        version: expect.stringMatching(/^\d+\.\d+\.\d+$/),
      }),
    });
    return {
      pass: this.equals(received, expected),
      message: () =>
        this.utils.printDiffOrStringify(
          expected,
          received,
          "Expected",
          "Received",
          true,
        ),
    };
  },
});
