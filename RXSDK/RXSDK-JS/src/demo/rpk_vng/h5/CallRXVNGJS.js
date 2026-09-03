function callRXJSOnMounted(unityInstance) {
	let sdk

	// 将对象挂载到全局
	unityInstance.CallJsRX = {
		_logEnabled: false,

		// unity 回调
		_callBackToUnity: function (funcName, data) {
			const ret = { 'key': funcName, 'rslt': JSON.stringify(data) }
			var retStr = JSON.stringify(ret)
			unityInstance.Module.SendMessage('GameApp', 'CallBack', retStr)
		},

		// 初始化
		jsrx_init: function (json_str) {
			const json_obj = JSON.parse(json_str)
			sdk = new window.channelSDK({
				productId: json_obj.app_id,  //产品 id
				channelId: json_obj.channel_id,  //渠道id
				cpid: json_obj.cp_id,  //CP id
				baseUrlList: json_obj.base_url,//请求域名队列
				logSwitch: json_obj.log_switch, //是否开启请求日志，true 开启 false 关闭，默认 true
				gameImplType: 'unity',
				complete: (data) => {
                    console.log('初始化结果：' + data)
					this._callBackToUnity('onRxInited', data)
				}
			})
		},

		// 登录
		jsrx_login_ui: function (json_str) {
            console.log('开始登录：')
			const json_obj = JSON.parse(json_str)
			sdk.login(json_obj,
				{
					complete: (data) => {
						console.log('登录：' + data)
						this._callBackToUnity('onLoginUIResult', data)
					}
				}
			)
		},

        // 修改用户信息
        jsrx_update_userinfo: function (json_str) {
            const json_obj = JSON.parse(json_str)
            sdk.updateInfo(json_obj,
                {
                    complete: (data) => {
                        console.log('修改用户信息：' + data)
                        this._callBackToUnity('onUpdateUserInfo', data)
                    }
                }
            )
        },

		// 注销
		jsrx_logoff: function () {
			sdk.logoff(
				{
					complete: (data) => {
						console.log('注销：' + data)
						this._callBackToUnity('rx_logoff', data)
					}
				}
			)
		},

		// 实名认证
		jsrx_realauth: function () {
			sdk.realName(
				{
					complete: (data) => {
						console.log('实名认证：' + data)
						this._callBackToUnity('onCertificationResult', data)
					}
				}
			)
		},

		// 帮助中心
		jsrx_openHelpCenter: function (json_str) {
			const json_obj = JSON.parse(json_str)
			sdk.openHelpCenter(json_obj)
		},

		// 客服中心
		jsrx_openService: function (json_str) {
			const json_obj = JSON.parse(json_str)
			sdk.openService(json_obj)
		},

		// 支付
		jsrx_pay: function (json_str) {
			const json_obj = JSON.parse(json_str)
			sdk.pay(json_obj, {
				complete: (res) => {
					console.log('支付: ', res)
					this._callBackToUnity('onZhifuResult', res)
				}
			})
		},
		
		// 展示协议
		jsrx_show_privacy: function (json_str) {
			const json_obj = JSON.parse(json_str)
			sdk.openProtocol({
				protocol: {
					key: json_obj.key,
					key_list: json_obj.keys
				}
			})
		},

		// 获取设备码
		jsrx_get_devicecode: function () {
			return sdk.getDeviceCode()
		},
		
		// 大数据上报
		jsrx_track: function (json_str) {
			const json_obj = JSON.parse(json_str)
			sdk.track(json_obj,   {
				complete: (data) => {
					console.log('上报: ', data)
					this._callBackToUnity('onTrack', data)
				}
			})
		},
		
		// 上报区服角色
		jsrx_role_report: function (json_str) {
			const json_obj = JSON.parse(json_str)
			sdk.roleReport(json_obj,   {
				complete: (data) => {
					console.log('上报区服角色: ', data)
					// this._callBackToUnity('onTrack', data)
				}
			})
		},

		// 获取临时公告
		jsrx_get_tempNotice: function () {
			sdk.getTempNotice({
				complete: (data) => {
					console.log('临时公告: ', data)
					this._callBackToUnity('onGetTempNotice', data)
				}
			})
		},

		// 获取游戏登录地址
		jsrx_get_loginConfig: function () {
			sdk.getH5LoginConfig({
				complete: (data) => {
					console.log('游戏登录地址: ', data)
					this._callBackToUnity('onGetLoginConfig', data)
				}
			})
		},

		// 获取游戏平台
		jsrx_get_platform: function () {
			sdk.getPlatform({
				complete: (data) => {
					console.log('getPlatform: ', data)
					this._callBackToUnity('onGetPlatform', data)
				}
			})
		},

		// 获取商品信息
		jsrx_get_product_list: function (json_str) {
			const json_obj = JSON.parse(json_str)
			sdk.getPlatform({
				productIds: json_obj.product_list,
				complete: (data) => {
					this._callBackToUnity('onGetProductList', data)
				}
			})
		},

		// 设置语言
		jsrx_set_language: function (json_str) {
			console.log('设置语言：', json_str)
			sdk.setLanguage(json_str)
		},

		// 获取 Zalo 遮挡区域
		jsrx_get_blocked_regiones: function () {
			sdk.getBlockedRegions({
				complete: (data) => {
					console.log('getBlockedRegions: ', data)
					this._callBackToUnity('onBlockedRegions', data)
				}
			})
		},

        // 设置区服角色
        jsrx_set_gameinfo: function (json_str) {
            console.log('设置区服角色：', json_str)
            const json_obj = JSON.parse(json_str)
            sdk.setGameInfo(json_obj.roleId, json_obj.region_tag)
        },
        
        // 渠道信息上报
        jsrx_vng_analytics: function (json_str) {
            const json_obj = JSON.parse(json_str)
            sdk.analyticsTrack({
                type: json_obj.type,
                params: json_obj.params,
            })
        },
	}
}
