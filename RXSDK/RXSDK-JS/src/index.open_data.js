class SdkOpenDataContext {
  constructor(data) {
    switch (data.event) {
      case 'rx_shareMessageToFriend':
        wx.getFriendCloudStorage({
          keyList: [],
          success: (res) => {
            console.log('getFriendCloudStorage', res)
          }
        })
        wx.shareMessageToFriend({
          openId: data.openid,
          imageUrl: data.imageUrl,
          title: data.title,
          success(res) {
            console.log(res)
          },
          fail(err) {
            console.log(err)
          }
        })
        break
    }
  }
}

export default SdkOpenDataContext
