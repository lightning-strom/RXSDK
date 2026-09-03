<template>
  <!-- 等待参数加载 -->
  <div v-if="!paramsReady" class="loading-container">
    <div class="loading-content">
      <van-loading size="36px" color="#0256FF" />
      <p class="loading-text">{{ waitingText }}</p>
    </div>
  </div>

  <!-- 主要内容 -->
  <div
    v-else
    class="pay-page"
    :class="{ 'is-mobile': isMobile, 'is-pc': !isMobile, 'is-rtl': isRTL }"
  >
    <!-- 关闭按钮 -->
    <button class="close-btn" @click="handleClose" :title="closeText">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path
          fill="currentColor"
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        />
      </svg>
    </button>

    <!-- 头部区域 -->
    <header class="pay-header">
      <div class="header-content">
        <h1 class="order-amount">
          <span class="currency">{{ currency_symbol }}</span>
          <span class="price">{{ display_price }}</span>
        </h1>
        <p class="order-name" v-if="order_info.goods_name">{{ order_info.goods_name }}</p>
      </div>
    </header>

    <!-- 支付方式选择区域 -->
    <main class="pay-main" v-if="!loading">
      <div class="section-title" v-if="!isMobile">
        <span>{{ paymentMethodTitle }}</span>
      </div>

      <!-- 支付方式列表 -->
      <ul class="payment-list" :class="{ 'center-items': tableData.length < (isMobile ? 2 : 4) }">
        <li
          v-for="item in tableData"
          :key="item.id"
          class="payment-item"
          :class="{ selected: currentId === item.id }"
          @click="currentId = item.id"
        >
          <span v-if="!isRTL" class="radio-indicator" :class="{ active: currentId === item.id }" />
          <div class="payment-icon">
            <img :src="item.icon" :alt="item.name || 'payment'" />
          </div>
          <span class="payment-name" v-if="!isMobile && item.name">{{ item.name }}</span>
          <span v-if="isRTL" class="radio-indicator" :class="{ active: currentId === item.id }" />
        </li>
      </ul>
    </main>

    <!-- 加载中 -->
    <div v-else class="loading-main">
      <van-loading size="24px" color="#0256FF" />
      <span>{{ loadingText }}</span>
    </div>

    <!-- 底部操作区域 -->
    <footer class="pay-footer">
      <div class="footer-content">
        <!-- 支付按钮 -->
        <button
          class="pay-button"
          :class="{ loading: loading }"
          :disabled="loading"
          @click="handlePay"
        >
          <van-loading v-if="loading" size="20px" color="#fff" />
          <span>{{ payText }}</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { showNotify } from 'vant'
import { getH5PageApi, getPayTypeApi, orderApi } from '@/utils/request/apis.ts'
import usePostMessage from '@/hooks/usePostMessage.ts'

// ==================== 响应式状态 ====================
const loading = ref<boolean>(false)
const tableData = ref<any[]>([])
const currentId = ref('')

// 屏幕尺寸相关
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 768)

// ==================== PostMessage Hook ====================
const {
  order_info,
  country_code,
  paramsReady,
  currentLang,
  payText,
  morePayTypePlaceholder,
  waitingText,
  loadingText,
  paymentMethodTitle,
  initPostMessage,
  closePay,
  cleanup
} = usePostMessage()

// 关闭按钮多语言
const closeTextMap: Record<string, string> = {
  zh: '关闭',
  tc: '關閉',
  en: 'Close',
  ja: '閉じる',
  th: 'ปิด',
  vi: 'Đóng',
  id: 'Tutup',
  ar: 'إغلاق',
  ko: '닫기',
  ru: 'Закрыть',
  de: 'Schließen',
  fr: 'Fermer',
  es: 'Cerrar',
  pt: 'Fechar'
}
const closeText = computed(() => closeTextMap[currentLang.value] || closeTextMap['en'])

// 关闭处理
const handleClose = () => {
  closePay()
}

// RTL 语言判断
const isRTL = computed(() => currentLang.value === 'ar')

// ==================== 支付相关状态 ====================
const currency_symbol = ref('')
const foreign_price = ref(0.0)
const setting_id = ref('')

// ==================== 计算属性 ====================
function formatNumber(number: any) {
  return Number(number)
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const display_price = computed(() =>
  foreign_price.value ? formatNumber(foreign_price.value / 100) : '0.00'
)

// ==================== 支付逻辑 ====================
const handlePay = async () => {
  // 如果正在加载，则返回
  if (loading.value) return

  // 如果支付方式为空，则提示用户选择支付方式
  if (!currentId.value) {
    showNotify({ type: 'warning', message: morePayTypePlaceholder.value })
    return
  }

  // 设置加载状态
  loading.value = true

  try {
    // 获取类型
    getPayTypeApi({
      h5_setting_id: setting_id.value,
      h5_platform_id: currentId.value,
      country_code: country_code.value
    })
      .then((res: any) => {
        console.log(res)
        // 下单支付信息
        orderApi({
          ...order_info.value,
          pay_type: 'ruixue_h5_trade',
          ext: {
            ...(order_info.value?.ext || {}),
            ...(res?.data || {}),
            failure_url:
              order_info.value.return_url ||
              `${window.location.origin}/static/pay/#/pay-result?status=PENDING`,
            cancel_url:
              order_info.value.return_url ||
              `${window.location.origin}/static/pay/#/pay-result?status=PENDING`,
            success_url:
              order_info.value.return_url ||
              `${window.location.origin}/static/pay/#/pay-result?status=PENDING`,
            return_url:
              order_info.value.return_url ||
              `${window.location.origin}/static/pay/#/pay-result?status=PENDING`
          },
          h5_setting_id: setting_id.value,
          h5_platform_id: currentId.value
        })
          .then((res: any) => {
            // 跳转支付渠道页面
            console.log(res)
            window.open(res?.data?.ext?.url, '_blank')
          })
          .catch(() => {
            loading.value = false
          })
      })
      .catch(() => {
        loading.value = false
      })
  } catch (err: any) {
    console.log('err', err)
  } finally {
    loading.value = false
  }
}

// ==================== 加载支付方式 ====================
function loadPaymentMethods() {
  document.title = order_info.value.goods_name || 'Payment'
  loading.value = true

  getH5PageApi({
    goods_tag: order_info.value.goods_tag,
    country: country_code.value
  })
    .then((res: any) => {
      if (res.code === 0) {
        tableData.value = res.data.platform || []
        foreign_price.value = res.data.foreign_price
        setting_id.value = res.data.setting_id
        currency_symbol.value = res.data.currency

        if (tableData.value.length) {
          currentId.value = tableData.value[0].id
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// ==================== 窗口尺寸监听 ====================
function handleResize() {
  windowWidth.value = window.innerWidth
}

// ==================== 生命周期 ====================
watch(paramsReady, (ready) => {
  if (ready) {
    loadPaymentMethods()
  }
})

onMounted(() => {
  initPostMessage()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
// ==================== 变量 ====================
$primary-color: #0256ff;
$text-color: #333;
$text-secondary: #666;
$text-light: #999;
$border-color: #e5e5e5;
$bg-color: #f5f5f5;
$white: #fff;

// ==================== 加载页面 ====================
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $white;

  .loading-content {
    text-align: center;
  }

  .loading-text {
    margin-top: 16px;
    color: $text-secondary;
    font-size: 14px;
  }
}

// ==================== 主页面 ====================
.pay-page {
  min-height: 100vh;
  background: $bg-color;
  display: flex;
  flex-direction: column;

  &.is-rtl {
    direction: rtl;
  }
}

// ==================== 移动端样式 ====================
.is-mobile {
  .pay-header {
    position: sticky;
    top: 0;
    background: $white;
    padding: 20px 16px;
    text-align: center;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .order-amount {
      font-size: 32px;
      font-weight: 600;
      color: $text-color;

      .currency {
        font-size: 20px;
        margin-right: 4px;
      }
    }

    .order-name {
      margin-top: 8px;
      font-size: 14px;
      color: $text-secondary;
    }
  }

  .pay-main {
    flex: 1;
    padding: 16px;
    background: $white;
    margin: 12px;
    border-radius: 12px;
  }

  .payment-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -8px;

    &.center-items {
      justify-content: center;
    }
  }

  .payment-item {
    width: calc(50% - 16px);
    margin: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    background: $white;
    border: 1px solid $border-color;
    border-radius: 8px;
    cursor: pointer;

    &.selected {
      border-color: $primary-color;
    }

    .radio-indicator {
      width: 16px;
      height: 16px;
      border: 1px solid #d0d3d6;
      border-radius: 50%;
      margin-right: 10px;
      flex-shrink: 0;

      &.active {
        border: 5px solid $primary-color;
      }
    }

    .payment-icon {
      width: 100px;
      height: 70px;
      border: 1px solid $border-color;
      border-radius: 6px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .pay-footer {
    position: sticky;
    bottom: 0;
    background: $white;
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);

    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .pay-button {
      width: 100%;
      max-width: 320px;
      height: 44px;
      background: $primary-color;
      color: $white;
      border: none;
      border-radius: 22px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      &.loading {
        opacity: 0.8;
      }
    }
  }
}

// ==================== PC 端样式 ====================
.is-pc {
  padding: 40px 20px;
  align-items: center;

  .pay-header {
    width: 100%;
    max-width: 600px;
    background: $white;
    padding: 32px 40px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 24px;

    .order-amount {
      font-size: 48px;
      font-weight: 600;
      color: $text-color;

      .currency {
        font-size: 24px;
        vertical-align: super;
        margin-right: 4px;
      }
    }

    .order-name {
      margin-top: 12px;
      font-size: 16px;
      color: $text-secondary;
    }
  }

  .pay-main {
    width: 100%;
    max-width: 600px;
    background: $white;
    padding: 32px 40px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 500;
      color: $text-color;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid $border-color;

      .title-icon {
        font-size: 24px;
      }
    }
  }

  .payment-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    &.center-items {
      display: flex;
      justify-content: center;
    }
  }

  .payment-item {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: $white;
    border: 2px solid $border-color;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: rgba($primary-color, 0.5);
      transform: translateY(-2px);
    }

    &.selected {
      border-color: $primary-color;
    }

    .radio-indicator {
      display: none;
    }

    .payment-icon {
      width: 120px;
      height: 80px;
      border: 1px solid $border-color;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 8px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .payment-name {
      font-size: 13px;
      color: $text-secondary;
      text-align: center;
    }
  }

  .pay-footer {
    width: 100%;
    max-width: 600px;
    background: $white;
    padding: 32px 40px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-top: 24px;

    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .pay-button {
      width: 280px;
      height: 48px;
      background: $primary-color;
      color: $white;
      border: none;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;

      &:hover {
        background: darken($primary-color, 5%);
      }

      &.loading {
        opacity: 0.8;
      }
    }

    .secure-tip {
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: $text-light;
    }
  }
}

// ==================== 共用样式 ====================
.loading-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: $text-secondary;
  font-size: 14px;
  min-height: 200px;
}

// ==================== 关闭按钮 ====================
.close-btn {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 100;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  color: $text-secondary;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
    color: $text-color;
  }

  &:active {
    transform: scale(0.95);
  }
}

// RTL 模式下关闭按钮在左上角
.is-rtl .close-btn {
  right: auto;
  left: 12px;
}
</style>
