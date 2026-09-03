//
//  Test.swift
//  RXSDK
//
//  Created by 陈汉 on 2023/5/24.
//

import Foundation
import StoreKit // StoreKit 2
import CryptoKit

public enum StoreError: Error {
    case failedVerification
}

@available(iOS 15.0, *)
@objcMembers public class StoreKit2Manager: NSObject {
    
    // 订单号
    private var orderId: String = ""
    
    // 产品队列
    private var products: [Product] = []
    
    // 产品 ID
    private var purchasedProductID: Set<String> = []
    
    // 是否已经获取完所有产品
    private var isLoadProducts: Bool = false
    
//    private var trans: Transaction? = nil
    
    private var updates: Task<Void, Never>? = nil
    
//    private var transcationP: Transaction?
    
    // 获取产品
    @objc public func fetchProducts(orderInfo: String) async throws -> Bool {
        guard !isLoadProducts else {
            return false
        }
        
        let products = try await Product.products(for: [orderInfo])
        orderId = orderInfo
        
        await MainActor.run {
            self.products = products
        }
        print(self.products)
        self.isLoadProducts = true
//        return products
        return true
    }
    
    /// 检查并结束所有未完成的交易
    @objc public func finishUncompletedTransactions(completion: @escaping ([String]?) -> Void) {
        Task {
            var receipts: [String] = []
            for await result in Transaction.unfinished {
                if case let .verified(transaction) = result {
                    await transaction.finish()
                    receipts.append(result.jwsRepresentation)
                    print("有未结束订单")
                }
            }
            completion(receipts)
        }
    }
    
    /// 订阅补单：先查未完成交易，再查当前活跃订阅权益，确保已 finish 但服务端验证失败的订阅也能拿到凭证
    @objc public func restoreSubscriptionReceipts(completion: @escaping ([String]?) -> Void) {
        Task {
            var receipts: [String] = []
            var foundProductIDs: Set<String> = []
            
            // 1. 先检查未完成交易（场景二：付款成功但回调失败）
            for await result in Transaction.unfinished {
                if case let .verified(transaction) = result {
                    if transaction.productType == .autoRenewable {
                        await transaction.finish()
                        receipts.append(result.jwsRepresentation)
                        foundProductIDs.insert(transaction.productID)
                    }
                }
            }
            
            // 2. 再检查当前活跃订阅权益（场景一：交易已 finish 但服务端验证失败）
            for await result in Transaction.currentEntitlements {
                if case let .verified(transaction) = result {
                    if transaction.productType == .autoRenewable && !foundProductIDs.contains(transaction.productID) {
                        receipts.append(result.jwsRepresentation)
                        foundProductIDs.insert(transaction.productID)
                    }
                }
            }
            
            completion(receipts)
        }
    }
   
    // 产品
    @objc public func purchaseProducts(uid: String) async throws -> [String : Any] {
        guard let product = self.products.first else {
            return ["msg": "没有商品", "code" : -1]
        }
        
        let uuid = Product.PurchaseOption.appAccountToken(UUID.init(uuidString: uid)!)
        let result = try await product.purchase(options: [uuid])
        
        switch result {
        case .success(let verificationResult):
            switch verificationResult {
            case .unverified(let signedType, let verificationResult):
                // 凭证失效原因
                var errorDes = ""
                switch verificationResult {
                case .revokedCertificate:
                    errorDes = "The certificate chain was parsable, but was invalid due to one or more revoked certificates. Trying again later may retrieve valid signed data from the App Store."
                    break
                case .invalidCertificateChain:
                    errorDes = "The certificate chain was parsable, but it was invalid for signing this data."
                    break
                case .invalidDeviceVerification:
                    errorDes = "The device verification properties were invalid for this device."
                    break
                case .invalidEncoding:
                    errorDes = "Th JWS header and any data included in it or it's certificate chain had an invalid encoding."
                    break
                case .invalidSignature:
                    errorDes = "The certificate chain was valid for signing this data, but the leaf's public key was invalid for the JWS signature."
                    break
                case .missingRequiredProperties:
                    errorDes = "Either the JWS header or any certificate in the chain was missing necessary properties for verification."
                    break
                default:
                    errorDes = "交易凭证解析失败"
                }
//                let properties = ["orderId" : orderId, "state" : "交易失败", "des" : errorDes]
//                let rxlog = RXLogService.sharedSDK().addLogSingle(withEvent: "#rxsdk_transactions", distinctId: "", properties: properties)
                
                print("失败")
                return ["msg": errorDes, "code" : -2, "uuid" : uuid]
                break
            case .verified(let transaction):
                //                trans = transaction
//                transcationP = transaction
                print("成功")
                
                await transaction.finish()
                
                // 获取当前所有有效凭证
                var receipts: [String] = []
                for await transactions in Transaction.currentEntitlements {
                    switch transactions {
                    case .verified(let transaction1):
                        receipts.append(transactions.jwsRepresentation)
                        await transaction1.finish()
                        
                    case .unverified(_, let error):
                        // Handle unverified transaction (if needed)
                        print("Transaction verification failed: \(error)")
                    }
                }
                
                let notificationName = Notification.Name("sk2Success")
                NotificationCenter.default.post(name: notificationName, object: ["msg": "成功", "code" : 0, "jws" : verificationResult.jwsRepresentation, "uuid" : uuid, "jwsList" : receipts])
                
                return ["msg": "成功", "code" : 0, "jws" : verificationResult.jwsRepresentation, "uuid" : uuid, "jwsList" : receipts]
                break
            }
        case .userCancelled:
//            let properties = ["orderId" : orderId, "state" : "交易取消"]
//            let rxlog = RXLogService.sharedSDK().addLogSingle(withEvent: "#rxsdk_transactions", distinctId: "", properties: properties)
            
            print("交易取消")
            return ["msg": "取消", "code" : -3, "uuid" : uuid]
            break
        case .pending:
//            let properties = ["orderId" : orderId, "state" : "正在交易"]
//            let rxlog = RXLogService.sharedSDK().addLogSingle(withEvent: "#rxsdk_transactions", distinctId: "", properties: properties)
            
            print("正在交易")
            return ["msg": "正在交易", "code" : -4, "uuid" : uuid]
            break
        @unknown default:
            fatalError()
            return ["msg": "未知错误", "code" : -5, "uuid" : uuid]
        }
    }
    
//    @objc public func finishTransaction () async throws {
//        try await Task.sleep(nanoseconds: 2_000_000_000)
//        await transcationP?.finish()
//    }
    
    // 更新产品
    func updatePurchasedProducts() async {
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result else {
                continue
            }
            if transaction.revocationDate == nil {
                purchasedProductID.insert(transaction.productID)
            } else {
                purchasedProductID.remove(transaction.productID)
            }
        }
    }
    
    //    // 监听交易更新状态
    private func observeTransactionUpdates() -> Task<Void, Never> {
        return Task.detached {
            for await verificationResult in Transaction.updates {
                // Using verificationResult directly would be better
                // but this way works for this tutorial
                switch verificationResult {
                case .unverified(_, _):
                    break
                case .verified(_):
                    break
                }
                await self.updatePurchasedProducts()
            }
        }
    }
    
    
    func verifiedAndFinish(_ verification:VerificationResult<Transaction>) async throws -> Transaction?{
        //Check whether the transaction is verified. If it isn't,
        //this function rethrows the verification error.
        let transaction = try checkVerified(verification)
        
        //The transaction is verified. Deliver content to the user.
        // 这里将订单提交给服务器进行验证 ~~~
        //        await updateCustomerProductStatus()
        
        //Always finish a transaction.
        await transaction.finish()
        print("iap: finish")
        return transaction
    }
    
    func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        //Check whether the JWS passes StoreKit verification.
        switch result {
        case .unverified:
            //StoreKit parses the JWS, but it fails verification.
            throw StoreError.failedVerification
        case .verified(let safe):
            //The result is verified. Return the unwrapped value.
            print("iap: verified success")
            return safe
        }
    }
}

// 生成uuid
@available(iOS 15.0, *)
extension StoreKit2Manager {
    func initUUID(uid: String) throws -> String {
        let uidint:Int? = Int("ffff14f6dfde34eb0000000000000000")
        let uuuuid = String(uidint ?? 0,radix:16)
        
        let namespace = ""
        let inputString = uid
        
        let fullString = namespace + inputString
        let hash = SHA256.hash(data: Data(uuuuid.utf8))
        var truncatedHash = Array(hash.prefix(16))
        truncatedHash[6] &= 0x0F    // Clear version field
        truncatedHash[6] |= 0x50    // Set version to 5
        truncatedHash[8] &= 0x3F    // Clear variant field
        truncatedHash[8] |= 0x80    // Set variant to DCE 1.1
        let uuidString = NSUUID(uuidBytes: truncatedHash).uuidString
        
        return uuidString
    }
}
