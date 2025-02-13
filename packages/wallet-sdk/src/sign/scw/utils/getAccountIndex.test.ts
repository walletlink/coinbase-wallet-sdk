import { createPublicClient, http } from 'viem';
import { readContract } from 'viem/actions';
import { describe, expect, it, Mock, vi } from 'vitest';

import { getAccountIndex } from './getAccountIndex.js';
import { standardErrors } from ':core/error/errors.js';

const client = createPublicClient({
  transport: http('http://localhost:8545'),
});

vi.mock('viem/actions', () => ({
  readContract: vi.fn(),
}));

describe('getAccountIndex', () => {
  it('returns correct index when owner found', async () => {
    const mockReadContract = vi
      .fn()
      .mockResolvedValueOnce(BigInt(3)) // ownerCount
      .mockResolvedValueOnce('0x46440ECd6746f7612809eFED388347d476369f6D') // owner at index 2
      .mockResolvedValueOnce('0xd9Ec1a8603125732c1ee35147619BbFA769A062b') // owner at index 1
      .mockResolvedValueOnce('0x7838d2724FC686813CAf81d4429beff1110c739a'); // owner at index 0

    (readContract as Mock).mockImplementation(mockReadContract);

    const result = await getAccountIndex({
      address: '0xe6c7D51b0d5ECC217BE74019447aeac4580Afb54',
      client,
      publicKey: '0x7838d2724FC686813CAf81d4429beff1110c739a',
    });

    expect(result).toBe(0);
    expect(mockReadContract).toHaveBeenCalledTimes(4);
  });

  it('only calls readContract as needed', async () => {
    const mockReadContract = vi
      .fn()
      .mockResolvedValueOnce(BigInt(3)) // ownerCount
      .mockResolvedValueOnce('0x46440ECd6746f7612809eFED388347d476369f6D') // owner at index 2
      .mockResolvedValueOnce('0xd9Ec1a8603125732c1ee35147619BbFA769A062b') // owner at index 1
      .mockResolvedValueOnce('0x7838d2724FC686813CAf81d4429beff1110c739a'); // owner at index 0

    (readContract as Mock).mockImplementation(mockReadContract);

    const result = await getAccountIndex({
      address: '0xe6c7D51b0d5ECC217BE74019447aeac4580Afb54',
      client,
      publicKey: '0x46440ECd6746f7612809eFED388347d476369f6D',
    });

    expect(result).toBe(2);
    expect(mockReadContract).toHaveBeenCalledTimes(2);
  });

  it('is case insensitive when matching owners', async () => {
    const mockReadContract = vi
      .fn()
      .mockResolvedValueOnce(BigInt(2)) // ownerCount
      .mockResolvedValueOnce('0xAAA') // owner at index 1
      .mockResolvedValueOnce('0xBBB'); // owner at index 0

    (readContract as Mock).mockImplementation(mockReadContract);

    const result = await getAccountIndex({
      address: '0xabc',
      client,
      publicKey: '0xaaa',
    });

    expect(result).toBe(1);
  });

  it('throws error when owner not found', async () => {
    const mockReadContract = vi
      .fn()
      .mockResolvedValueOnce(BigInt(2)) // ownerCount
      .mockResolvedValueOnce('0xaaa') // owner at index 1
      .mockResolvedValueOnce('0xbbb'); // owner at index 0

    (readContract as Mock).mockImplementation(mockReadContract);

    await expect(
      getAccountIndex({
        address: '0xabc',
        client,
        publicKey: '0xccc',
      })
    ).rejects.toThrow(standardErrors.rpc.internal('account owner not found'));
  });

  it('handles empty owner list', async () => {
    const mockReadContract = vi.fn().mockResolvedValueOnce(BigInt(0)); // ownerCount

    (readContract as Mock).mockImplementation(mockReadContract);

    await expect(
      getAccountIndex({
        address: '0xabc',
        client,
        publicKey: '0xccc',
      })
    ).rejects.toThrow(standardErrors.rpc.internal('account owner not found'));
  });
});
