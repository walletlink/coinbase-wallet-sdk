//
//  Web3JSONRPC.swift
//  CoinbaseWalletSDK
//
//  Created by Jungho Bang on 6/28/22.
//

import Foundation

public typealias BigInt = String

public enum Web3JSONRPC: Codable {
    case eth_requestAccounts
    
    case personal_sign(
        fromAddress: String,
        data: Data
    )
    
//    case eth_signTypedData(
//        fromAddress: String,
//        data: Data
//    )
    
    case eth_signTransaction(
        fromAddress: String,
        toAddress: String?,
        weiValue: BigInt,
        data: Data,
        nonce: Int?,
        gasPriceInWei: BigInt?,
        maxFeePerGas: BigInt?,
        maxPriorityFeePerGas: BigInt?,
        gasLimit: BigInt?,
        chainId: Int
    )
    
    case eth_sendTransaction(
        fromAddress: String,
        toAddress: String?,
        weiValue: BigInt,
        data: Data,
        nonce: Int?,
        gasPriceInWei: BigInt?,
        maxFeePerGas: BigInt?,
        maxPriorityFeePerGas: BigInt?,
        gasLimit: BigInt?,
        chainId: Int
    )
    
    case wallet_switchEthereumChain(chainId: Int)
    
    case wallet_addEthereumChain(
        chainId: Int,
        blockExplorerUrls: [String]?,
        chainName: String?,
        iconUrls: [String]?,
        nativeCurrency: AddChainNativeCurrency?,
        rpcUrls: [String]
    )
    
    case wallet_watchAsset(
        type: String,
        options: WatchAssetOptions
    )
    
    var rawValues: (method: String, paramsJson: String) {
        let json = try! JSONEncoder().encode(self)
        let dictionary = try! JSONSerialization.jsonObject(with: json) as! [String: Any]
        
        let method = dictionary.keys.first!
        
        let params = dictionary[method]!
        let paramsJson = String(data: try! JSONSerialization.data(withJSONObject: params), encoding: .utf8) ?? ""
        
        return (method, paramsJson)
    }
}

public struct AddChainNativeCurrency: Codable {
    let name: String
    let symbol: String
    let decimals: Int
    
    public init(name: String, symbol: String, decimals: Int) {
        self.name = name
        self.symbol = symbol
        self.decimals = decimals
    }
}

public struct WatchAssetOptions: Codable {
    let address: String
    let symbol: String?
    let decimals: Int?
    let image: String?
    
    public init(address: String, symbol: String?, decimals: Int?, image: String?) {
        self.address = address
        self.symbol = symbol
        self.decimals = decimals
        self.image = image
    }
}
