//
//  CHDownImage.m
//  Night7App-iOS
//
//  Created by 陈汉 on 2021/7/8.
//

#import "CHDownImage.h"

@implementation CHDownImage

//异步下载
+ (void)asyurlToData:(NSString *)imageUrl withHandler:(void (^)(NSURLResponse* response, NSData* data, NSError* connectionError)) handler
{
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:imageUrl] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:TRUrlToData_TimeOut];
    NSOperationQueue *queue=[[NSOperationQueue alloc] init];
    [NSURLConnection sendAsynchronousRequest:request queue:queue completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
        if (handler) {
            handler(response,data,connectionError);
        }
    }];
}

+ (NSData *)urlScaledToDataBytes:(long)bytes withImageUrl:(NSString *)imageUrl
{
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:imageUrl] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:TRUrlToData_TimeOut];
    NSURLResponse *response;
    NSData *data = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:nil];

    while (data.length >= bytes)
    {
        UIImage *image = [UIImage imageWithData:data];
        CGSize newSize = CGSizeMake(image.size.width/1.1, image.size.height/1.1);
        UIGraphicsBeginImageContext(newSize);
        [image drawInRect:CGRectMake(0,0,newSize.width,newSize.height)];
        UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        data = UIImageJPEGRepresentation(newImage, 1);
        
    }
    return data;
}

+ (NSData *)dataScaleToBytes:(long)bytes withImageData:(NSData *)imageData
{
    while (imageData.length >= bytes)
    {
        UIImage *image = [UIImage imageWithData:imageData];
        CGSize newSize = CGSizeMake(image.size.width/1.1, image.size.height/1.1);
        UIGraphicsBeginImageContext(newSize);
        [image drawInRect:CGRectMake(0,0,newSize.width,newSize.height)];
        UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        imageData = UIImageJPEGRepresentation(newImage, 1);
    }
    return imageData;
}

@end
