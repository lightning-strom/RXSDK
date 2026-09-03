export const zaloLogin = (params: {
  appId: string
}) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    ZaloSocialSDK.init({
      appId: params.appId, // 替换为你的 Zalo App ID
      version: '2.0'
    });

    // @ts-ignore
    ZaloSocialSDK.login(function(response) {
      if (response.authResponse) {
        // 登录成功，获取 access token
        const accessToken = response.authResponse.access_token;
        console.log('Access Token:', accessToken);
        resolve({
          access_token: accessToken
        })
      } else {
        console.log('Login failed:', response);
        reject({
          code: 3001,
          msg: '取消登录'
        })
      }
    });
  })
}
