#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#import "RuiXueIOSBridgeBase.h"
#import "RuiXueIOSBridgeUtils.h"
#import <RXFirebaseSDK/RXFirebaseSDK.h>
#import <RXFirebaseSDK/RXFirebasePush.h>
#import "RuiXueIOSBridgeFirebaseDelegate.h"

@implementation RuiXueIOSBridgeFirebaseDelegate

static RuiXueIOSBridgeFirebaseDelegate *_sharedInstance = nil;

+(instancetype) shareInstance
{
    static dispatch_once_t onceToken ;
    dispatch_once(&onceToken, ^{
        _sharedInstance = [[self alloc] init] ;
    }) ;

    return _sharedInstance ;
}

@end
