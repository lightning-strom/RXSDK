// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_gank'

// import eruda from 'eruda'

// eruda.init()
// eruda.show()

let rotate = 1

export default function() {
  let sdk: any
  Vue.component('Demo', {
    template: `
      <div>
        <section class='hero is-primary'>
          <div class='hero-body'>
            <div class='container'>
              <h3 class='title'>
                A Demo for gank h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for gank h5 SDK.
              </h4>
            </div>
          </div>
        </section>

        <section class='hero is-info actions'>
          <div class='hero-body'>
            <div class='container'>
              <button class='button is-primary is-inverted is-outlined' @click='init'>
                初始化
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='reportData'>
                创角
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='login'>
                登录
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='pay'>
                支付
              </button>
               <button class='button is-primary is-inverted is-outlined' @click='logout'>
                退出登录
              </button>
               <button class='button is-primary is-inverted is-outlined' @click='setGameInfo'>
                setGameInfo
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='getThirdChannelData'>
                获取渠道信息
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='roleReport'>
                上报信息
              </button>
            </div>
          </div>
        </section>
      </div>
    `,
    data() {
      return {
        sdkLoaded: false
      }
    },
    methods: {
      init() {
        sdk = new SdkH5({
          productId: '1002',
          channelId: 'unicorn',
          gameid: 'J9J4bFZQHrtoY',
          cpid: '114',
          baseUrlList: ['https://cn-api-test.ruixueyun.com'],
          complete(res: any) {
            console.log('初始化成功:', res)
            if(res?.code == 0) {
              alert('初始化成功')
            } else {
              alert('初始化失败')
            }
          }
        })
      },
      login() {
        sdk.login({
          gameid: 'J9J4bFZQHrtoY',
          method: 'unicornh5',
        }, {
          complete: (res: any) => {
            console.log('登录成功:', res)
            if(res?.code == 0) {
              alert('登录成功')
            } else {
              alert('登录失败')
            }
          }
        })
      },

      logout() {
        sdk.logout()
      },

      pay() {
        sdk.pay({
          pay_type: 'unicornh5', // 支付方式
          goods_tag: 'test', // 计费点标识
          trade_no: `${new Date().getTime()}`, // 订单号
          serverid: '区服ID', // 区服ID	
          username: 'username' // 角色名称
        }, {
          complete: (res: any) => {
            console.log('拉起支付成功: ', res)
            if(res?.code == 0) {
              alert('拉起支付成功')
            } else {
              alert('拉起支付失败')
            }
          }
        })
      },

      getThirdChannelData() {
        sdk.getThirdChannelData({
          complete: (res: any) => {
            console.log('获取三方渠道数据成功: ', res)
          }
        })
      },

      setGameInfo() {
        sdk.setGameInfo('1234567890', 'abcdefg')
      },

      reportData() {
        sdk.reportData({
          action: 'register',
          data:{
            who: 'who',
            serverid: 'serverid',
            level: 'level',
            system: 'system',
            rolename:'rolename',
            power:'power',
            server_name:'server_name',
            vip:'vip',
            ip: 'ip'
          }
        },{
          complete(res: any) {
            console.log(res)
            if(res?.code == 0) {
              alert('创角成功')
            } else {
              alert('创角失败')
            }
          }
        })
      },

      roleReport() {
        sdk.roleReport({
          type: "上报类型",
          isCreateRole: true,
          roleCreateTime: 1732326024,
          serverId: '1',
          serverName: '内测1区',
          userRoleId: 'roleId1',
          userRoleName: '小朋友',
          userRoleBalance: 1000,
          vipLevel: 1,
          userRoleLevel: '1',
          partyId: 1,
          partyName: '行会名称',
          gameRoleGender: '男',
          gameRolePower: 100,
          partyRoleId: 1,
          partyRoleName: '会长',
          professionId: '1',
          profession: '武士',
          gameType: 'xx',
          createRole: 1,
          friendlist: '',
        }, {
          complete(res: any) {
            console.log(res)
            if(res?.code == 0) {
              alert('上报成功')
            } else {
              alert('上报失败')
            }
          }
        })
      }
    }
  })

  new Vue({
    el: '#app'
  })
}
