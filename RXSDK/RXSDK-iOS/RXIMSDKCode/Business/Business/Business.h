//
//  Busniess.h
//  Busniess
//
//  Created by Elbay on 2024/5/28.
//  内部使用文档：https://nctpoatgf0.feishu.cn/docx/PxfidE1FQohvlQxDDP9ciptqnPc

#import <Foundation/Foundation.h>

//! Project version number for Busniess.
FOUNDATION_EXPORT double BusniessVersionNumber;

//! Project version string for Busniess.
FOUNDATION_EXPORT const unsigned char BusniessVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <Busniess/PublicHeader.h>
//
#import <Business/RXIMSDKManager_BS.h>
#import <Business/RXIMChatService_BS.h>
#import <Business/RXIMSessionService_BS.h>
#import <Business/RXIMGroupService_BS.h>
#import <Business/RXIMDownload_BS.h>
#import <Business/RXIMSearch_BS.h>
#import <Business/RXIMSocketEngine_BS.h>
#import <Business/RXIMCollectionService_BS.h>
#import <Business/RXIMRTCService_BS.h>
#import <Business/RXIMSessionService_business_BS.h>
#import <Business/RXIMChatService_business_BS.h>
#import <Business/RXIMSearchService_BS.h>
#import <Business/ExtendedRXIMInternalApi.h>

//从sdk直接对外暴露的模型
#import <RXIMSdk_business/RXIMSession.h>
#import <RXIMSdk_business/RXIMSearchRequestModel.h>
#import <RXIMSdk_business/RXIMSearchResultModel.h>
#import <RXIMSdk_business/RXIMRTCAuthInfo.h>
#import <RXIMSdk_business/RXIMGroupMember.h>
#import <RXIMSdk_business/RXIMMsgCombineTransmitContent.h>
#import <RXIMSdk_business/RXIMMsgTextContent.h>
#import <RXIMSdk_business/RXIMMsgFaceContent.h>
#import <RXIMSdk_business/RXIMMsgImageContent.h>
#import <RXIMSdk_business/RXIMMsgAudioContent.h>
#import <RXIMSdk_business/RXIMMsgVideoContent.h>
#import <RXIMSdk_business/RXIMMsgFileContent.h>
#import <RXIMSdk_business/RXIMMsgLBSContent.h>
#import <RXIMSdk_business/RXIMMsgCustomContent.h>
#import <RXIMSdk_business/RXIMMsgReplyContent.h>
#import <RXIMSdk_business/RXIMMessage.h>
#import <RXIMSdk_business/RXIMSession.h>
#import <RXIMSdk_business/RXIMSendMessage.h>

//可以选择对外暴露的类

