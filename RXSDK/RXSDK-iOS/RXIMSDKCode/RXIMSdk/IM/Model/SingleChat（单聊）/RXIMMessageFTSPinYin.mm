//
//  RXIMMessageFTSPinYin.m
//  RXIMSdk
//
//  Created by Elbay on 2024/8/8.
//

#import "RXIMMessageFTSPinYin.h"
#import "RXIMMessageFTSPinYin+WCTTableCoding.h"

@implementation RXIMMessageFTSPinYin

WCDB_IMPLEMENTATION(RXIMMessageFTSPinYin)
WCDB_SYNTHESIZE(msgId)
WCDB_SYNTHESIZE(sessionID)
WCDB_SYNTHESIZE(pinYin)


WCDB_VIRTUAL_TABLE_MODULE(WCTModuleFTS5)
WCDB_VIRTUAL_TABLE_TOKENIZE(WCTTokenizerPinyin)//配置 Pinyin 分词器


@end

