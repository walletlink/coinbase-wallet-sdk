import { SignHandler } from './SignHandler';

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
jest.mock(':util/ScopedLocalStorage', () => {
  return {
    ScopedLocalStorage: jest.fn().mockImplementation(() => {
      return {
        getItem: mockGetItem,
        removeItem: jest.fn(),
        clear: jest.fn(),
        setItem: mockSetItem,
      };
    }),
  };
});

const mockPostMessage = jest.fn();
const mockHandshake = jest.fn();
const mockRequest = jest.fn();
jest.mock('./scw/SCWSigner', () => {
  return {
    SCWSigner: jest.fn().mockImplementation(() => {
      return {
        handshake: mockHandshake,
        request: mockRequest,
      };
    }),
  };
});

describe('SignerConfigurator', () => {
  function createSignHandler() {
    const handler = new SignHandler({
      metadata: { appName: 'Test App', appLogoUrl: null, appChainIds: [1] },
      preference: { options: 'all' },
    });
    handler.postMessage = mockPostMessage;
    return handler;
  }

  describe('handshake', () => {
    it('should complete signerType selection correctly', async () => {
      mockHandshake.mockResolvedValueOnce(['0x123']);
      mockPostMessage.mockResolvedValueOnce({
        data: 'scw',
      });

      const handler = createSignHandler();
      const accounts = await handler.handshake();
      expect(accounts).toEqual(['0x123']);
      expect(mockHandshake).toHaveBeenCalledWith();
    });

    it('should throw error if signer selection failed', async () => {
      const error = new Error('Signer selection failed');
      mockPostMessage.mockRejectedValueOnce(error);

      const handler = createSignHandler();
      await expect(handler.handshake()).rejects.toThrow(error);
      expect(mockHandshake).not.toHaveBeenCalled();
      expect(mockSetItem).not.toHaveBeenCalled();

      await expect(handler.request({} as any)).rejects.toThrow('Signer is not initialized');
    });

    it('should not store signer type unless handshake is successful', async () => {
      const error = new Error('Handshake failed');
      mockHandshake.mockRejectedValueOnce(error);
      mockPostMessage.mockResolvedValueOnce({
        data: 'scw',
      });

      const handler = createSignHandler();
      await expect(handler.handshake()).rejects.toThrow(error);
      expect(mockHandshake).toHaveBeenCalled();
      expect(mockSetItem).not.toHaveBeenCalled();

      await expect(handler.request({} as any)).rejects.toThrow('Signer is not initialized');
    });
  });

  it('should load signer from storage when available', async () => {
    mockGetItem.mockReturnValueOnce('scw');
    const handler = createSignHandler();
    await handler.request({} as any);
    expect(mockRequest).toHaveBeenCalledWith({} as any);
  });

  it('should throw error if signer is not initialized', async () => {
    const handler = createSignHandler();
    await expect(handler.request({} as any)).rejects.toThrow('Signer is not initialized');
  });
});
