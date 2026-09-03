import { SYSTEM_INFO, USER_INFO } from '@/config'
import SdkCommon from '@/index.common'
import { handleError } from '@/utils/utils'
import { getSearchQueries, IH5Queries, listenVisibilityChange } from '@/utils/h5/utils'
import { login } from '@/api/user'
import { order } from '@/api/pay'
import { Webgame, IConfigData, IGetDialogNumberData } from '@/types/h5sdk'

class SdkWeiLe extends SdkCommon {
  private __queries!: IH5Queries
  private __sdk!: Webgame
  public __type!: SelfChannel

  constructor (params: ISdkParams) {
    super(params)
    console.info('update version time is 2022-05-16')
    SYSTEM_INFO.appid = params.appId
    SYSTEM_INFO.type = 1

    this.__h5Init()
  }

  public setFormChannel () {
    this.__type = 'weile'
  }

  private __h5Init () {
    this.setFormChannel()
    SYSTEM_INFO.fromChannel = this.__type
    const queries = getSearchQueries()
    this.__queries = queries
    if (!queries.apiSvr) {
      // throw 'can\'t get apiSvr from URI.'
    }
    const script = document.createElement('script')
    script.src = `//${atob(queries.apiSvr)}/file/jssdk?v=${queries.jssdkVersion || '2.0.0'}&t=${new Date().getTime()}`
    script.onload = () => {
      this.__sdk = window.webgameWL
    }
    document.body.appendChild(script)
  }

  public async login ({ complete }: IMethodParams) {
    if (typeof complete !== 'function')
      throw 'login complete must be function.'
    try {
      const data = {
        // openid: this.__queries.openId,
        ext: {
          ...this.__queries,
          token: this.__queries.accessToken,
        },
        type: this.__type,
      }
      const userInfo = await login(data)
      this.setUserInfo(userInfo)
      Object.assign(USER_INFO, userInfo)
      complete(userInfo)
    } catch (error) {
      complete(handleError(error))
    }
  }

  public async closeGame (methodParams?: IMethodParams) {
    try {
      this.__sdk.closeWL()
      methodParams?.complete({ code: 0 })
    } catch (error) {
      methodParams?.complete(handleError(error))
    }
  }

  public async pay ({ complete }: IMethodParams, data: IRequestPay) {
    try {
      let firstJudgment: boolean = true
      const { data: config }: IConfigData = await new Promise((resolve, reject) => {
        this.__sdk.getConfigWL((data) => {
          console.info('测试wlconfig',data)
          if (data.code === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        })
      })
      console.info('测试1config',config)
      const { data: diamondNumber }: IGetDialogNumberData = await new Promise((resolve, reject) => {
            this.__sdk.getDiamondNumberWL((callbakData) => {
              if (callbakData.code === 0) {
                resolve(callbakData)
              } else {
                reject(callbakData)
              }
            })
          })
      console.info('测试2钻石数',diamondNumber)
      console.info('测试3config',config)
      if (config) {
        const { isRMBPayEnable } = config
        console.info('通过config',config)
        console.info('config.payChannelFromCmd由大厅传入的值',config.payChannelFromCmd)
        const pay = async (
          func: Webgame['payInDiamondWL'] | Webgame["payInRMBWL"],
          feedType: any,
          payChannel: any,
        ) => {
          if (!data.ext) data.ext = {}
          data.ext['ext.feeType'] = feedType
          if(feedType == 2 && config.payChannelFromCmd!==undefined && config.payChannelFromCmd!==null){
            data.ext['ext.payChannel'] = config.payChannelFromCmd
          }else{
            data.ext['ext.payChannel'] = payChannel
          }
          data.ext.openId = this.__queries.openId
          // order
          const { ext: { transaction_id } } = await order(this.__type, data)
          // pay in diamond
          const payRes = await new Promise((resolve, reject) => {
            func(transaction_id, (callbakData) => {
              callbakData.code === 0 && resolve(callbakData) || reject(callbakData)
            })
          })
          complete(payRes)
        }
        const payJudgmentMethod = async () => {
          const { data: newDiamondNumber }: IGetDialogNumberData = await new Promise((resolve, reject) => {
            this.__sdk.getDiamondNumberWL((callbakData) => {
              if (callbakData.code === 0) {
                resolve(callbakData)
              } else {
                reject(callbakData)
              }
            })
          })
          if (data.amount / 10 <= newDiamondNumber && this.__sdk.checkIsClientWL()) {
            await pay(this.__sdk.payInDiamondWL, 1, 0)
          } else if (isRMBPayEnable) {
            await pay(this.__sdk.payInRMBWL, 2, 1)
          } 
          else {
            // 判断是否自动兑换 true：走购买钻石流程 false: 走拉起钻石商城
            if (data.autoExchange) {
              if (!firstJudgment) {
                if (newDiamondNumber >= diamondNumber) {
                  // 充值了钻石
                  complete({code: 0})
                } else{
                  // 没有充值钻石
                  complete({ code: 1000000 })
                }
              } else {
                // show diamond store
                const count = Number(data.amount / 10) - Number(diamondNumber)
                await new Promise((resolve, reject) => {
                  this.__sdk.doPayDiamondWL(count ,(callbakData: any) => {
                    if (callbakData.code === 0) {
                      firstJudgment = false
                      payJudgmentMethod()
                      resolve(callbakData)
                    } else {
                      reject(callbakData)
                    }
                  })
                })
              }
            } else {
              this.__sdk.showDiamondStoreWL(() => {})
            }
          }
        }
        payJudgmentMethod()
      } else {
        throw 'Can\'t get config.'
      }
    } catch (error) {
      complete(handleError(error))
    }
  }

  public async getBeanNumber ({ complete }: IMethodParams) {
    try {
      this.__sdk.getBeanNumberWL((data) => {
        complete(data)
      })
    } catch(error) {
      complete(handleError(error))
    }
  }

  public async getIsPlayingGame ({ complete }: IMethodParams) {
    try {
      this.__sdk.getIsPlayingGameWL((data) => {
        complete(data)
      })
    } catch(error) {
      complete(handleError(error))
    }
  }

  public async getDiamondNumber ({ complete }: IMethodParams) {
    try {
      this.__sdk.getDiamondNumberWL((data) => {
        complete(data)
      })
    } catch(error) {
      complete(handleError(error))
    }
  }

  public async showDiamondStore ({ complete }: IMethodParams) {
    try {
      this.__sdk.showDiamondStoreWL((data) => {
        complete(data)
      })
    } catch(error) {
      complete(handleError(error))
    }
  }

  public async roleLogin ({ complete }: IMethodParams, data: RoleLoginParams) {
    complete(handleError(new Error('share: 暂不支持')))
  }

  public async share ({ complete }: IMethodParams, data: IRequestShareData) {
    complete(handleError(new Error('share: 暂不支持')))
  }

  public async ad ({ complete }: IMethodParams, data: IRequestAdData) {
    complete(handleError(new Error('ad: 暂不支持')))
  }
}

export default SdkWeiLe
