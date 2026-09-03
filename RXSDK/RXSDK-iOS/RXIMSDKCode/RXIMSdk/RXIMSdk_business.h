//
//  RXIMSdk-business.h
//  RXIMSdk
//
//  Created by weiyongjian on 2023/1/10.
//

#ifndef RXIMSdk_business_h
#define RXIMSdk_business_h

#import <Foundation/Foundation.h>

//! Project version number for RXIMSdk.
FOUNDATION_EXPORT double RXIMSdkVersionNumber;

//! Project version string for RXIMSdk.
FOUNDATION_EXPORT const unsigned char RXIMSdkVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <RXIMSdk/PublicHeader.h>

#import <RXIMSdk_business/RXIMSDKManager.h>
#import <RXIMSdk_business/RXIMChatService.h>
#import <RXIMSdk_business/RXIMSessionService.h>
#import <RXIMSdk_business/RXIMGroupService.h>
#import <RXIMSdk_business/RXIMSendMessage.h>
#import <RXIMSdk_business/RXIMSession.h>
#import <RXIMSdk_business/RXIMDownload.h>
#import <RXIMSdk_business/RXIMMessage.h>
#import <RXIMSdk_business/RXIMMsgTextContent.h>
#import <RXIMSdk_business/RXIMMsgFaceContent.h>
#import <RXIMSdk_business/RXIMMsgImageContent.h>
#import <RXIMSdk_business/RXIMMsgAudioContent.h>
#import <RXIMSdk_business/RXIMMsgVideoContent.h>
#import <RXIMSdk_business/RXIMMsgFileContent.h>
#import <RXIMSdk_business/RXIMMsgLBSContent.h>
#import <RXIMSdk_business/RXIMMsgCustomContent.h>
#import <RXIMSdk_business/RXIMMsgReplyContent.h>
#import <RXIMSdk_business/RXIMMsgCombineTransmitContent.h>
#import <RXIMSdk_business/RXIMError.h>
#import <RXIMSdk_business/RXIMSearch.h>
#import <RXIMSdk_business/RXIMSocketEngine.h>
#import <RXIMSdk_business/RXIMCollectionService.h>
#import <RXIMSdk_business/RXIMGroupMember.h>
#import <RXIMSdk_business/RXIMRTCService.h>
#import <RXIMSdk_business/RXIMRTCAuthInfo.h>
#import <RXIMSdk_business/RXIMSessionService_business.h>
#import <RXIMSdk_business/RXIMChatService_business.h>
#import <RXIMSdk_business/RXIMSearchRequestModel.h>
#import <RXIMSdk_business/RXIMSearchResultModel.h>
#import <RXIMSdk_business/RXIMSearchService.h>

//额外依赖类

//RXIMSessionService、RXIMChatService、RXIMInternalApi、BS
#import <RXIMSdk_business/RXIMInternalApi.h>
//RXIMSessionService、RXIMChatService、RXIMSocketEngine、BS
#import <RXIMSdk_business/RXIMSocket.h>

//RXIMSessionService、BS
#import <RXIMSdk_business/RXIMWebSocket.h>
#import <RXIMSdk_business/RXIMSessionInterfaceModel.h>
#import <RXIMSdk_business/RXIMMsgHandle.h>

//RXIMSessionService、RXIMChatService、BS
#import <RXIMSdk_business/RXIMNetworkError.h>
#import <RXIMSdk_business/RXIMErrorCode.h>

//RXIMSessionService、RXIMWCDB、RXModelTransform
#import <RXIMSdk_business/NSObject+RXUAddition.h>

//RXIMSessionService、RXIMChatService、RXIMWCDB、BS
#import <RXIMSdk_business/RXIMWCDB.h>

//RXIMSessionServiceBS
#import <RXIMSdk_business/RXIMSessionService+Inner.h>
#import <RXIMSdk_business/RXIMChatService+Inner.h>
#import <RXIMSdk_business/RXIMLogManager.h>
#import <RXIMSdk_business/RXIMBaseInterfaceModel.h>

//RXIMSessionService、RXIMChatService、RXIMWCDB、RXIMInternalApi、RXModelTransform、BS
#import <RXIMSdk_business/RXIMUserUtility.h>
#import <RXIMSdk_business/RXIMCommonTool.h>

//RXIMInternalApi
#import <RXIMSdk_business/RXIMApiUrl.h>

//wcdb
#import <RXIMSdk_business/RXIMMessageDB.h>
#import <RXIMSdk_business/RXIMMessage.h>
#import <RXIMSdk_business/RXIMSession.h>
#import <RXIMSdk_business/RXIMSessionService.h>
#import <RXIMSdk_business/RXModelTransform.h>



#endif /* RXIMSdk_business_h */


