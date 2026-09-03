//
//  RXIMMessageFTSPinYin+WCTTableCoding.h
//  RXIMSdk
//
//  Created by Elbay on 2024/8/8.
//

#import "RXIMMessageFTSPinYin.h"
#import <WCDB/WCDB.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMMessageFTSPinYin (WCTTableCoding) <WCTTableCoding>

WCDB_PROPERTY(msgId)
WCDB_PROPERTY(sessionID)
WCDB_PROPERTY(pinYin)

@end

NS_ASSUME_NONNULL_END
