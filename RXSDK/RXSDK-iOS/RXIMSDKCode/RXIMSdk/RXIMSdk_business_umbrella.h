//
//  RXIMSdk-business-umbrella.h
//  RXIMSdk
//
//  Created by Elbay on 2024/5/24.
//

#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import <RXIMSdk-business/RXIMSDKManager.h>
#import <RXIMSdk-business/RXIMChatService.h>
#import <RXIMSdk-business/RXIMSessionService.h>
#import <RXIMSdk-business/RXIMGroupService.h>
#import <RXIMSdk-business/RXIMSendMessage.h>
#import <RXIMSdk-business/RXIMSession.h>
#import <RXIMSdk-business/RXIMDownload.h>
#import <RXIMSdk-business/RXIMMessage.h>
#import <RXIMSdk-business/RXIMMsgTextContent.h>
#import <RXIMSdk-business/RXIMMsgFaceContent.h>
#import <RXIMSdk-business/RXIMMsgImageContent.h>
#import <RXIMSdk-business/RXIMMsgAudioContent.h>
#import <RXIMSdk-business/RXIMMsgVideoContent.h>
#import <RXIMSdk-business/RXIMMsgFileContent.h>
#import <RXIMSdk-business/RXIMMsgLBSContent.h>
#import <RXIMSdk-business/RXIMMsgCustomContent.h>
#import <RXIMSdk-business/RXIMMsgReplyContent.h>
#import <RXIMSdk-business/RXIMMsgCombineTransmitContent.h>
#import <RXIMSdk-business/RXIMError.h>
#import <RXIMSdk-business/RXIMSearch.h>
#import <RXIMSdk-business/RXIMSocketEngine.h>
#import <RXIMSdk-business/RXIMCollectionService.h>
#import <RXIMSdk-business/RXIMGroupMember.h>
#import <RXIMSdk-business/RXIMRTCService.h>
#import <RXIMSdk-business/RXIMRTCAuthInfo.h>
#import <RXIMSdk-business/RXIMSessionService_business.h>
#import <RXIMSdk-business/RXIMChatService_business.h>
#import <RXIMSdk-business/RXIMSearchRequestModel.h>
#import <RXIMSdk-business/RXIMSearchResultModel.h>
#import <RXIMSdk-business/RXIMSearchService.h>

FOUNDATION_EXPORT double RXIMSdkVersionNumber;
FOUNDATION_EXPORT const unsigned char RXIMSdkVersionString[];
