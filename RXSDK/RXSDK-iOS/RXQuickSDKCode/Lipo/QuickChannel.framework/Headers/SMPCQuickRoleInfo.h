//
//  SMPCQuickRoleInfo.h
//  QuickChannel
//
//  Created by IOS-Developer on 14/12/24.
//  Copyright (c) 2014年 HanDong. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SMPCQuickRoleInfo : NSObject
@property (copy, nonatomic) NSString *serverId;         //服务器Id
@property (copy, nonatomic) NSString *serverName;       //服务器名称
@property (copy, nonatomic) NSString *gameRoleName;     //角色名
@property (copy, nonatomic) NSString *gameRoleID;       //角色ID
@property (copy, nonatomic) NSString *gameUserBalance;  //玩家虚拟货币余额
@property (copy, nonatomic) NSString *roleCreatTime;        //角色创建时间
@property (nonatomic,copy) NSString * _Nullable vipLevel;         //玩家vip等级，选填，默认值0
@property (nonatomic,copy) NSString * _Nullable gameUserLevel;    //玩家等级，选填，默认值0
@property (nonatomic,copy) NSString * _Nullable partyName;        //公会名称，选填，默认空字符串
@property (nonatomic,copy) NSString * _Nullable partyId;        //公会id，选填，默认空字符串
@property (nonatomic, copy) NSString * _Nullable fightPower;     //战力，选填，默认值0
@property (nonatomic, copy) NSString * _Nullable professionId;     //角色职业id, 选填，默认值，空字符串
@property (nonatomic, copy) NSString * _Nullable profession;     //角色职业, 选填，默认值，空字符串
@property (nonatomic,copy) NSString * _Nullable roleGender;        //角色性别，选填，默认值男
@property (nonatomic,copy) NSString * _Nullable partyRoleId;        //公会角色id，选填，默认空字符串
@property (nonatomic,copy) NSString * _Nullable partyRoleName;        //公会角色名，选填，默认空字符串
@end
