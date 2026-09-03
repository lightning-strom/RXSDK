export const appleLogin = (params: {
  clientId: string,
  scope: string,
  state: string,
  nonce: string,
  redirectURI: string,
  usePopup: boolean
}) => {
  return new Promise((resolve, reject) => {

    // @ts-ignore
    AppleID.auth.init(params)

    // @ts-ignore
    AppleID.auth.signIn()
      .then((response: any) => {
        console.log(response)
        resolve({
          identityToken: response.authorization.id_token
          // nickname: response.user?.name ? (response.user.name.firstName + ' ' + response.user.name.lastName) : ''
        })
      }).catch((err: any) => {
      console.log(err)
      reject({
        code: 3002,
        msg: err.error
      })
    })
  })
}
