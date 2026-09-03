const handleError = (err) => {
  console.info('sdk handleError:', [err])
  return {
    ...err?.data,
    code: err.code || err.errCode || err.err_code || 1000000,
    msg: err.message || err.errMsg || err.msg || err,
  }
}

wx.onMessage((data) => {
  console.log('监听从主域发来的消息: ', data)
  // wx.shareMessageToFriend({
  //   ...data,
  //   openId: 'oCiIo47wSALdjT1J3ZqNxVcI5UgU',
  // })

  // wx.getUserCloudStorage({
  //   keyList: data?.keyList || [],
  //   success(res) {
  //     console.log('wx.getUserCloudStorage: ', res, { code: 0, data: res?.KVDataList || [] })
  //   },
  // })

  // wx.getFriendCloudStorage({
  //   keyList: data?.keyList || [],
  //   success(res) {
  //     console.log('wx.getFriendCloudStorage: ', res, { code: 0, data: res?.data || [] })
  //   },
  // })

  // 定向分享流程
  wx.getPotentialFriendList({
    success(res) {
      console.log('wx.getPotentialFriendList: ', res, { code: 0, data: res?.list || [] })
      const openId = res?.list?.[0].openid
      // wx.shareMessageToFriend({
      //   openId: 'oCiIo47wSALdjT1J3ZqNxVcI5UgU', // 这里填写好友的openid
      //   title   : '快来探索浩瀚星空',
      //   imageUrl: 'https://mmocgame.qpic.cn/wechatgame/TKicR7oWel4znvwMdwOpuwoy1ntVB44kT9ZSse2u0xNcO5SaxIS2UwU0GdUfA2Al0/0'
      // })
    },
    fail(err) {
      console.log('wx.getPotentialFriendList: ', handleError(err))
    },
  })

  // wx.modifyFriendInteractiveStorage({
  //   key: 'score',
  //   opNum: 1,
  //   operation: 'add',
  //   // toUser: '', // 好友的 openId
  //   title: '送你 10 个金币，赶快打开游戏看看吧', // 2.9.0 支持
  //   success: function (res) {
  //     console.log('--wx.modifyFriendInteractiveStorage success res:', res)
  //   },
  //   fail: function (res) {
  //     console.log('--wx.modifyFriendInteractiveStorage fail res:', res)
  //   },
  // })

  // wx.getUserCloudStorageKeys({
  //   success(res) {
  //     console.log('wx.getUserCloudStorageKeys: ', res, { code: 0, data: res?.keys || [] })
  //   },
  //   fail(err) {
  //     console.log('wx.getUserCloudStorageKeys: ', handleError(err))
  //   },
  // })
})
