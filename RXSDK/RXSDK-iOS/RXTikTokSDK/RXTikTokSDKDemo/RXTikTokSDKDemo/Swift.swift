//
//  Swift.swift
//  RXTikTokSDKDemo
//
//  Created by 陈汉 on 2023/7/31.
//

import Foundation
import TikTokOpenShareSDK

@objcMembers public class ShareTest: NSObject {
   
    let shareRequest = TikTokShareRequest(localIdentifiers: [""],
                                          mediaType: .video,
                                          redirectURI: "https://www.example.com/path")
    
    /* Step 2 */
//    shareRequest.send { response in
//        /* Step 3 */
//        let shareResponse = response as? TikTokShareResponse else { return }
//        if shareResponse.errorCode == .noError {
//            print("Share succeeded!")
//        } else {
////            print("Share Failed!
////                   Error Code: \(shareResponse.errorCode.rawValue)
////                   Error Message: \(shareResponse.errorMessage ?? "")
////                   Share State: \(shareResponse.shareState)")
//        }
//    }
    
}
