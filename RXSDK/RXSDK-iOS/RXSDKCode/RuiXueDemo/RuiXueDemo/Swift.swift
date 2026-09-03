//
//  Swift.swift
//  RuiXueDemo
//
//  Created by 陈汉 on 2024/1/26.
//

// StoreManager.swift
import Foundation
import StoreKit

@available(iOS 15.0, *)
@objc public class StoreManager: NSObject {
    
    @objc static let shared = StoreManager()
    
    // 获取商品信息的方法
    @objc public func fetchProductInfo(withProductIdentifiers identifiers: [String], completion: @escaping ([NSDictionary]?, NSError?) -> Void) {
        Task {
            do {
                let products = try await Product.products(for: identifiers)
                let productDictionaries = products.map { product in
                    return [
                        "id": product.id as NSString,
                        "title": product.displayName as NSString,
                        "price": product.displayPrice as NSString
                    ] as NSDictionary
                }
                completion(productDictionaries, nil)
            } catch {
                completion(nil, error as NSError)
            }
        }
    }
    
    /// 检查并结束所有未完成的交易
    @objc public func finishUncompletedTransactions(completion: @escaping () -> Void) {
        Task {
            for await result in Transaction.unfinished {
                if case let .verified(transaction) = result {
                    await transaction.finish()
                    print("有未结束订单")
                }
            }
            completion()
        }
    }
    
    // 购买商品的方法
    @objc public func purchaseProduct(withProductID productID: String, completion: @escaping (NSDictionary?, NSError?) -> Void) {
        
//        Task {
//            for await result in Transaction.unfinished {
//                if case let .verified(transaction) = result {
//                    await transaction.finish()
//                    
//                    print("有未结束订单")
//                }
//            }
////            completion()
//        }
        finishUncompletedTransactions {
            Task {
                do {
                    guard let product = try await Product.products(for: [productID]).first else {
                        completion(nil, NSError(domain: "ProductNotFound", code: 404, userInfo: [NSLocalizedDescriptionKey: "Product not found"]))
                        return
                    }
                    
                    let result = try await product.purchase()
                    switch result {
                    case .success(let verification):
                        switch verification {
                        case .verified(let transaction):
                            await transaction.finish()
                            let transactionData: NSDictionary = [
                                "transactionID": transaction.productID as NSString,
                                "productID": transaction.productID as NSString
                            ]
                            print("交易成功")
                            completion(transactionData, nil)
                        case .unverified(_, let error):
                            completion(nil, error as NSError)
                        }
                    case .pending:
                        completion(nil, NSError(domain: "PurchasePending", code: 0, userInfo: [NSLocalizedDescriptionKey: "Purchase is pending"]))
                    case .userCancelled:
                        completion(nil, NSError(domain: "UserCancelled", code: 1, userInfo: [NSLocalizedDescriptionKey: "User cancelled the purchase"]))
                    }
                } catch {
                    completion(nil, error as NSError)
                }
            }
        }
        
    }
}
