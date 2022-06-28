//
//  EncryptedResponseContent.swift
//  WalletSegue
//
//  Created by Jungho Bang on 6/23/22.
//

import Foundation
import CryptoKit

@available(iOS 13.0, *)
public enum EncryptedResponseContent: EncryptedContent {
    case response(requestId: UUID, data: Data)
    case failure(requestId: UUID, description: String)
    
    public func decrypt(with symmetricKey: SymmetricKey?) throws -> ResponseContent {
        switch self {
        case let .response(requestId, encryptedResults):
            guard let symmetricKey = symmetricKey else {
                throw CoinbaseWalletSDKError.missingSymmetricKey
            }
            let values: [ReturnValue] = try Cipher.decrypt(encryptedResults, with: symmetricKey)
            return .response(requestId: requestId, values: values)
        case let .failure(requestId, description):
            return .failure(requestId: requestId, description: description)
        }
    }
}

@available(iOS 13.0, *)
extension ResponseContent {
    public func encrypt(with symmetricKey: SymmetricKey?) throws -> EncryptedResponseContent {
        switch self {
        case let .response(requestId, results):
            guard let symmetricKey = symmetricKey else {
                throw CoinbaseWalletSDKError.missingSymmetricKey
            }
            let encrypted = try Cipher.encrypt(results, with: symmetricKey)
            return .response(requestId: requestId, data: encrypted)
        case let .failure(requestId, description):
            return .failure(requestId: requestId, description: description)
        }
    }
}

@available(iOS 13.0, *)
typealias EncryptedResponseMessage = EncryptedMessage<EncryptedResponseContent>
