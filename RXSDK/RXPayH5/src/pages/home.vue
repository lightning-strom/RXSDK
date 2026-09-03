<template>
  <bank-card-list
    ref="bankRef"
    @confirm="handleDirectPay"
    :lang-text="langTextDict"
    :cache-key="cache_key"
    :language="api_params.language"
  />

  <div v-if="loading" class="text-center fixed top-[40%] left-[50%]" style="transform: translate(-50%,-50%)">
    <van-loading />
  </div>

  <div v-else class="pt-[88px] box-border bg-white" :style="containerStyle">
    <div class="fixed top-0 w-[100%] bg-white z-[100]">
      <h1 class="pb-[30px] pt-[14px] text-center text-[32px] font-[500] leading-[36px]">
        {{ currency_symbol }} {{ display_price }}
      </h1>
    </div>
    <ul
      :class="listClass"
    >
      <li
        v-for="item in showTableData"
        :key="item.id"
        class="float-left flex justify-center items-center mb-[18px] bg-white"
        :style="itemStyle"
        @click="currentId = item.id"
      >
        <span v-if="api_params.language !== 'ar'"
              :class="`w-[16px] h-[16px] mr-[10px] box-border ${currentId === item.id ? 'active' : 'normal'}`" />
        <div class="w-[100px] h-[70px] overflow-hidden border border-solid border-[#CDCDCD] rounded-[6px]">
          <img :src="item.icon" class="w-[100px] h-[70px]" alt="" />
        </div>
        <span v-if="api_params.language === 'ar'"
              :class="`w-[16px] h-[16px] ml-[10px] box-border ${currentId === item.id ? 'active' : 'normal'}`" />
      </li>

      <li :class="`float-left w-[100%] bg-white`"
          v-if="hasMore">
        <div class="flex items-center justify-center"
             @click="hasMore = !hasMore">
          <div class="gradient-line w-[100px] h-[2px]" />
          <span class="text-[#0256FF] text-[16px] mx-[11px]">{{ morePayType }}</span>
          <div class="gradient-line-reverse w-[100px] h-[2px]" />
        </div>
      </li>

      <li class="clear-both"></li>
    </ul>

    <div class="fixed bottom-0 flex flex-col items-center w-[100%] bg-white"
         :style="`padding-bottom: ${safeHeight + 20}px; padding-top: 20px`">
      <div
        class="leading-[44px] bg-[#0256FF] text-center text-white text-[16px] rounded-[22px] flex items-center justify-center"
        :style="`width: ${isVertical ? '292' : '480'}px;`"
        @click="handleConfirm"
      >
        <van-loading v-if="loading || cardLoading" />
        {{ payText }}
      </div>

      <div :class="isVertical ? 'vertical' : 'horizontal'" :dir="api_params.language === 'ar' ? 'rtl' : ''">
        <van-checkbox class="mt-[14px]" shape="square" v-model="save_card">
          {{ saveCardText }}
        </van-checkbox>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, ComputedRef } from 'vue'
import { showNotify } from 'vant'
import { getH5PageApi, getPayTypeApi, orderApi } from '@/utils/request/apis.ts'
import BankCardList from '@/components/bank-card-list/index.vue'
import useParams from '@/hooks/useParams.ts'

const loading = ref<boolean>(false)
const cardLoading = ref<boolean>(false)
const tableData = ref<any[]>([])
const isVertical = ref(window.orientation !== 90 && window.orientation !== -90)
const innerWidth = ref(window.innerWidth)
const cachePayTypesNum = ref<number>(0)
const hasMore = ref(false)
const currentId = ref('')
const bankRef = ref()
const save_card = ref(true)

const {
  isAndroid,
  api_params,
  device,
  order_info,
  country_code,
  payText,
  saveCardText,
  morePayType,
  morePayTypePlaceholder,
  checkoutLoadingText,
  langTextDict,
  getInitParams
} = useParams()

const safeHeight = computed(() => {
  if (isAndroid.value || !isVertical.value) {
    return (device.value.tabbarSafeHeight || 0)
  }
  return (device.value.naviBarHeight || 0) + (device.value.tabbarSafeHeight || 0)
})

const currency_symbol = ref('')
const foreign_price = ref(0.00)
const setting_id = ref('')
const pay_type = ref('')
const pay_token = ref('')
const tag = ref('')
const checkout_public_key = ref('')
const checkout_sdk_loaded = ref(false)
const card_id = ref('')
const openid = ref('')

const cache_key = computed(() => {
  return pay_token.value + '_' + openid.value
})

function formatNumber(number: any) {
  return Number(number).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const display_price = computed(() => foreign_price.value ? formatNumber(foreign_price.value / 100) : '0.00')

const containerStyle = computed(() => {
  return `padding-bottom: ${safeHeight.value + 84 + 34}px`
})

const listClass = computed(() => {
  return (isVertical.value && tableData.value.length < 2 || !isVertical.value && tableData.value.length < 4) ? 'flex justify-center' : ''
})

const listLimit: ComputedRef<any> = computed(() => {
  const limit: number = isVertical.value ? 12 : 8
  return cachePayTypesNum.value > limit ? cachePayTypesNum : limit
})

const listWidth = computed(() => {
  return innerWidth.value
})

const itemStyle = computed(() => {
  return `width: ${(Math.floor((listWidth.value) / (isVertical.value ? 2 : 4)))}px; transform: translateY(1px)`
})

const showTableData = computed(() => {
  return hasMore.value ? tableData.value.slice(0, listLimit.value) : tableData.value
})

const setTitle = (str: string) => {
  try {
    if (isAndroid.value) {
      // @ts-ignore
      window.JsBridge.setTitle(str)
    } else {
      // @ts-ignore
      window.webkit.messageHandlers.setTitle.postMessage(str)
    }
  } catch (e) {
    document.title = str
  }
}

const setBackVisible = (bool: boolean) => {
  try {
    if (isAndroid.value) {
      // @ts-ignore
      window.JsBridge.setBackVisible(bool)
    }
  } catch (e) {

  }
}

const handleDirectPay = (id?: any) => {
  card_id.value = id || ''
  handlePay()
}

const handleConfirm = () => {
  cardLoading.value = true
  getPayTypeApi({
    h5_setting_id: setting_id.value,
    h5_platform_id: currentId.value,
    country_code: country_code.value
  }).then((res: any) => {
    console.log(res)
    pay_type.value = res.data.pay_type
    pay_token.value = res.data.pay_token
    tag.value = res.data.tag
    if (pay_type.value == 'checkout') {
      checkout_public_key.value = res.data?.ext?.checkout_public_key || ''
    }
    const cards = (res.data.cards || [])
    if (res.data.pay_type == 'checkout' && (res.data.tag == 'card' || res.data.tag == '__NORMAL__') && cards.length) {
      bankRef.value.openDialog(cards, pay_token.value)
    } else {
      handleDirectPay()
    }
  }).finally(() => {
    cardLoading.value = false
  })
}

const handlePay = async () => {
  if (loading.value) {
    return
  }
  if (currentId.value === '') {
    showNotify({ type: 'warning', message: morePayTypePlaceholder.value })
  } else {
    loading.value = true
    let pay_card_info: any = {
      pay_token: pay_token.value,
      save_card: save_card.value
    }
    if (card_id.value) {
      pay_card_info.card_id = card_id.value
      pay_card_info.use_save_card = true
      pay_card_info.save_card = save_card.value
    }

    try {
      if (pay_type.value == 'checkout') {
        if (checkout_sdk_loaded.value) {
          // @ts-ignore
          const risk = window.Risk.init(checkout_public_key.value)
          const deviceSessionId = await risk.publishRiskData()
          console.log('checkout deviceSessionId:' + deviceSessionId)
          pay_card_info.deviceSessionId = deviceSessionId
        } else {
          showNotify({ type: 'warning', message: checkoutLoadingText.value })
          loading.value = false
          return
        }
      }
    } catch (e: any) {
      console.log(e)
    }

    orderApi({
      ...order_info.value,
      env: order_info.value.env,
      ext: {
        ...(order_info.value.ext || {}),
        country_code: country_code.value,
        return_url: order_info?.value?.return_url || order_info?.value?.ext?.return_url || `${window.location.origin}/static/pay/#/result?status=PENDING`,
        ...pay_card_info
      },
      h5_setting_id: setting_id.value,
      h5_platform_id: currentId.value
    }).then((res: any) => {
      setCacheSuccessPayTypes()
      if (res.code === 0) {
        switch (res.data.pay_type) {
          case 'mycard':
            window.location.href = res.data.ext.TransactionUrl
            break
          case 'payermax':
            window.location.href = res.data.ext.redirectUrl
            break
          case 'utg':
            const base64String = res.data.ext.url
            const decodedHtml = atob(base64String)
            document.open()
            document.write(decodedHtml)
            document.close()
            break
          default:
            window.location.href = res.data.ext.url
        }

        setTitle(morePayType.value)
        setBackVisible(true)
      }
    }).catch(() => {
      loading.value = false
    })
  }
}

function getCacheSuccessPayTypes() {
  const _cacheSuccessPayTypes: any = localStorage.getItem('cacheSuccessPayTypes')
  if (!_cacheSuccessPayTypes) {
    return []
  }
  return JSON.parse(_cacheSuccessPayTypes)
}

function setCacheSuccessPayTypes() {
  const cacheSuccessPayTypes = getCacheSuccessPayTypes()
  const index = cacheSuccessPayTypes.indexOf(currentId.value)
  if (index > -1) {
    const item = cacheSuccessPayTypes.splice(index, 1)[0]
    cacheSuccessPayTypes.unshift(item)
  } else {
    cacheSuccessPayTypes.unshift(currentId.value)
  }
  localStorage.setItem('cacheSuccessPayTypes', JSON.stringify(cacheSuccessPayTypes))
}

function moveItemsToFront(arr: any[]) {
  const indices = getCacheSuccessPayTypes()
  const temp: any[] = []

  indices.forEach((item: any) => {
    const ids = arr.map((i: any) => i.id)
    const index = ids.indexOf(item)
    if (index > -1) {
      const _item = arr[index]
      arr.splice(index, 1)
      temp.push(_item)
    }
  })
  cachePayTypesNum.value = temp.length
  return temp.concat(arr)
}

function loadCheckoutSdk() {
  const loadScript = async (url: string) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = url
      script.onload = () => resolve(script)
      script.onerror = (error) => reject(error)
      document.head.appendChild(script)
    })
  }

  const scriptUrl = order_info.value.env == 1 ? 'https://risk.sandbox.checkout.com/cdn/risk/1/risk.js' : 'https://risk.checkout.com/cdn/risk/1/risk.js'
  loadScript(scriptUrl)
    .then(() => {
      checkout_sdk_loaded.value = true
    })
    .catch((error) => {
      console.error('Error loading script:', error)
      checkout_sdk_loaded.value = false
    })
}

onMounted(() => {
  getInitParams()
  setTitle(order_info.value.goods_name)
  setBackVisible(false)
  loadCheckoutSdk()
  getH5PageApi({
    goods_tag: order_info.value.goods_tag,
    country: country_code.value
  }).then((res: any) => {
    if (res.code === 0) {
      const platforms = res.data.platform || []
      tableData.value = moveItemsToFront(platforms)
      foreign_price.value = res.data.foreign_price
      setting_id.value = res.data.setting_id
      currency_symbol.value = res.data.currency

      if (tableData.value.length) {
        currentId.value = tableData.value[0].id
      }

      if (!hasMore.value && tableData.value.length > listLimit.value) {
        hasMore.value = true
      }
    }
  })
})

/*
支付情景1-有accesstoken

  用户选择支付方式后 点击支付按钮时
  调用接口 /v1/ke/platform_h5/hw/pay_type https://app.apifox.com/link/project/2489942/apis/api-212417605
  返回结构中cards数组为绑定卡列表
  如果用户选择了卡
  在调用下单接口时 ext传入
  pay_token:""   (/v1/ke/platform_h5/hw/pay_type 接口中返回cards的pay_token)
  use_save_card:true
  card_id:cards[selectIndedx].id         (/v1/ke/platform_h5/hw/pay_type 接口中返回cards的id)
  如果用户没有卡或者选择了其他卡支付
  在调用下单接口时 ext传入
  pay_token:""   (/v1/ke/platform_h5/hw/pay_type 接口中返回cards的pay_token)

支付情景2-无accesstoken 客户端sdk无此情景

  用户选择支付方式后 点击支付按钮时
  调用接口 /v1/ke/platform_h5/hw/pay_type_unlogin https://app.apifox.com/link/project/2489942/apis/api-212650829
  获取返回结构中的 pay_token
  用 pay_token+瑞雪openid作为 key 读取本地缓存中的卡列表信息
  如果用户选择了卡
  在调用下单接口时 ext传入
  pay_token:""   (/v1/ke/platform_h5/hw/pay_type_unlogin 接口中返回cards的pay_token)
  use_save_card:true
  card_id:id         (用户选择卡的id)
  如果用户没有卡或者选择了其他卡支付
  在调用下单接口时 ext传入
  pay_token:""   (/v1/ke/platform_h5/hw/pay_type_unlogin 接口中返回cards的pay_token)
  client_token: 随机UUID 客户端生成
  支付成功后的回调页面
   调用 (/v1/ke/platform_h5/hw/query_card https://app.apifox.com/link/project/2489942/apis/api-212650956)  传入 下单时的client_token
  获取卡信息后  用 pay_token+瑞雪openid作为 key 把信息存到本地缓存
*/
</script>

<style>
.gradient-line {
  background: linear-gradient(270deg, #D8D8D8 0%, rgba(216, 216, 216, 0) 100%);
}

.gradient-line-reverse {
  background: linear-gradient(90deg, #D8D8D8 0%, rgba(216, 216, 216, 0) 100%);
}

.active {
  border: 5px solid #3370FF;
  border-radius: 100%;
}

.normal {
  border: 1px solid #D0D3D6;
  border-radius: 100%;
}

.van-checkbox__icon .van-icon {
  border-radius: 4px !important;
}

.van-checkbox__label {
  font-size: 14px !important;
  color: #767676 !important;
  transform: translateY(1.5px) !important;
  max-width: 262px !important;
  margin: 0 8px !important;
}

.horizontal {
  .van-checkbox__label {
    max-width: 452px !important;
  }
}

.van-checkbox__icon--checked {
  .van-icon-success {
    border-color: #3370FF !important;
    background-color: #3370FF !important;
  }
}
</style>