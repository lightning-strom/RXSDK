//
//  RXRequest.m
//  RXPushSDK
//
//  Created by 陈汉 on 2022/2/16.
//

#import "RXRequest.h"
#import "RXPushCommon.h"

@implementation RXRequest

+ (void)requestWithUrl:(NSString *)urlString requestType:(NSString *)type dictionary:(NSDictionary *)dictionary SuccessBlock:(void(^)(NSDictionary *responseObject))successBlock ErrorBlock:(void(^)(id error))errorBlock
{
    NSURLSession *session = [NSURLSession sharedSession];
    
    NSString *url = [[NSURL URLWithString:urlString relativeToURL:[NSURL URLWithString:[RXPushCommon sharedSDK].baseUrlList[0]]] absoluteString];

    NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithDictionary:dictionary];
    NSLog(@"接口请求url:%@",url);
    NSLog(@"接口请求参数:%@",dict);
    //创建对象 采用可变的网络请求对象
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]];
    //如果请求方式是POST
    if ([type isEqualToString:@"POST"]){
        [request setHTTPMethod:type];//设置请求方式
        if (dictionary.count != 0){
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:0 error:nil];
            NSString *dataStr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            [request setHTTPBody:[dataStr dataUsingEncoding:NSUTF8StringEncoding]];
        }
    }
    
    NSMutableDictionary *headerParams = [[RXPushCommon sharedSDK] getHeaderParams];
    for (int i = 0; i < headerParams.allKeys.count; i++) {
        [request setValue:headerParams.allValues[i] forHTTPHeaderField:headerParams.allKeys[i]];
    }
    
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error){
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error == nil){
                //获得的json先转换成字符串
                NSString *receiveStr = [[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
                //字符串再生成NSData
                NSData * data = [receiveStr dataUsingEncoding:NSUTF8StringEncoding];
                //再解析
                NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
//                NSLog(@"接口响应数据:%@",dict);
                if([dict objectForKey:@"code"]){
                    if([dict[@"code"]intValue]==0){
                        successBlock(dict);
                    }else{
                        errorBlock(dict);
                    }
                }
            }else{
                errorBlock(error);
            }
        });
        
    }];
    [task resume];
}

@end
