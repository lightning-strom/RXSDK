import { computed, ref } from 'vue'
import { SYSTEM_INFO } from '@/utils/utils.ts'

/**
 * postMessage 传入的数据结构
 */
export interface PostMessageData {
  type: 'INIT_PAY_PARAMS'
  api_params: {
    country_code: string
    productid: string
    devicecode: string
    cpid: string
    domain: string
    language: string
    platformid: string
    version: string
    channelid: string
    tzoffset: string
  }
  request_headers: {
    'ruixue-channelid': string
    'ruixue-accesstoken': string
    'ruixue-devicecode': string
    'ruixue-traceid': string
    'ruixue-language': string
    'ruixue-platformid': string
    'ruixue-tzoffset': string
    'ruixue-cpid': string
    'ruixue-version': string
    'ruixue-productid': string
  }
  order_info: {
    country_code: string
    goods_tag: string
    goods_name: string
    openid: string
    env: number
    return_url?: string
    ext?: any
  }
}

const usePostMessage = () => {
  // 响应式数据
  const api_params = ref<any>({})
  const request_headers = ref<any>({})
  const order_info = ref<any>({})
  const country_code = ref<string>('')
  const paramsReady = ref<boolean>(false)
  const parentOrigin = ref<string>('*')

  let messageHandler: ((event: MessageEvent) => void) | null = null
  let readyRetryTimer: ReturnType<typeof setInterval> | null = null
  let readyRetryCount = 0
  const MAX_READY_RETRY = 10 // 最多重试10次
  const READY_RETRY_INTERVAL = 500 // 每500ms重试一次

  // 外部关闭回调
  let onCloseCallback: (() => void) | null = null

  /**
   * 初始化 postMessage 监听
   */
  const initPostMessage = (options?: { onClose?: () => void }) => {
    // 保存关闭回调
    onCloseCallback = options?.onClose || null

    messageHandler = (event: MessageEvent) => {
      console.log('[PostMessage] Received:', event.data)

      const data = event.data as PostMessageData

      if (data && data.type === 'INIT_PAY_PARAMS') {
        // 收到参数，停止重试
        stopReadyRetry()

        parentOrigin.value = event.origin

        // 存储参数
        api_params.value = data.api_params || {}
        request_headers.value = data.request_headers || {}
        order_info.value = data.order_info || {}
        country_code.value = data.order_info?.country_code || data.api_params?.country_code || ''

        // 保存语言
        if (api_params.value.language) {
          localStorage.setItem('language', api_params.value.language)
        }

        // 更新全局 SYSTEM_INFO（供 request.ts 使用）
        Object.assign(SYSTEM_INFO, {
          request_headers: request_headers.value,
          domain: api_params.value.domain || ''
        })

        paramsReady.value = true

        // 通知父页面
        sendMessageToParent({ type: 'PAY_PARAMS_RECEIVED', success: true })

        console.log('[PostMessage] Params ready:', { api_params: api_params.value, order_info: order_info.value })
      }

      // 监听外部关闭消息
      if (event.data?.type === 'CLOSE_PAY') {
        console.log('[PostMessage] Received CLOSE_PAY from parent')
        closePay()
      }
    }

    window.addEventListener('message', messageHandler)

    // 发送 ready 信号（带重试机制）
    sendReadySignal()
  }

  /**
   * 发送 ready 信号，如果没收到响应则重试
   */
  const sendReadySignal = () => {
    // 立即发送一次
    sendMessageToParent({ type: 'PAY_IFRAME_READY', ready: true })
    console.log('[PostMessage] Sent PAY_IFRAME_READY (attempt 1)')

    // 设置重试定时器
    readyRetryTimer = setInterval(() => {
      if (paramsReady.value) {
        // 已收到参数，停止重试
        stopReadyRetry()
        return
      }

      readyRetryCount++
      if (readyRetryCount >= MAX_READY_RETRY) {
        console.warn('[PostMessage] Max retry reached, giving up')
        stopReadyRetry()
        return
      }

      sendMessageToParent({ type: 'PAY_IFRAME_READY', ready: true })
      console.log(`[PostMessage] Sent PAY_IFRAME_READY (attempt ${readyRetryCount + 1})`)
    }, READY_RETRY_INTERVAL)
  }

  /**
   * 停止 ready 重试
   */
  const stopReadyRetry = () => {
    if (readyRetryTimer) {
      clearInterval(readyRetryTimer)
      readyRetryTimer = null
    }
    readyRetryCount = 0
  }

  /**
   * 发送消息给父页面
   */
  const sendMessageToParent = (data: any) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(data, parentOrigin.value)
    }
  }

  /**
   * 关闭支付页面
   */
  const closePay = () => {
    console.log('[PostMessage] Closing pay page')
    // 通知父页面关闭
    sendMessageToParent({ type: 'close_pay', code: -1, msg: '用户关闭支付' })
    // 执行回调
    if (onCloseCallback) {
      onCloseCallback()
    }
  }

  /**
   * 清理监听器和定时器
   */
  const cleanup = () => {
    stopReadyRetry()
    if (messageHandler) {
      window.removeEventListener('message', messageHandler)
      messageHandler = null
    }
    onCloseCallback = null
  }

  // ==================== 多语言 ====================
  const i18n: any = {
    zh: {
      payText: '立即支付',
      morePayTypePlaceholder: '请选择支付方式',
      waitingText: '等待支付参数...',
      loadingText: '加载中...',
      paymentMethodTitle: '选择支付方式',
      securePaymentText: '安全支付'
    },
    tc: {
      payText: '立即支付',
      morePayTypePlaceholder: '請選擇支付方式',
      waitingText: '等待支付參數...',
      loadingText: '加載中...',
      paymentMethodTitle: '選擇支付方式',
      securePaymentText: '安全支付'
    },
    en: {
      payText: 'Pay now',
      morePayTypePlaceholder: 'Please select a payment method',
      waitingText: 'Waiting for payment parameters...',
      loadingText: 'Loading...',
      paymentMethodTitle: 'Select Payment Method',
      securePaymentText: 'Secure Payment'
    },
    ja: {
      payText: '今すぐ支払う',
      morePayTypePlaceholder: '支払い方法を選択してください',
      waitingText: '支払いパラメータを待っています...',
      loadingText: '読み込み中...',
      paymentMethodTitle: '支払い方法を選択',
      securePaymentText: '安全な支払い'
    },
    th: {
      payText: 'จ่ายทันที',
      morePayTypePlaceholder: 'กรุณาเลือกวิธีการชำระเงิน',
      waitingText: 'รอพารามิเตอร์การชำระเงิน...',
      loadingText: 'กำลังโหลด...',
      paymentMethodTitle: 'เลือกวิธีการชำระเงิน',
      securePaymentText: 'การชำระเงินที่ปลอดภัย'
    },
    vi: {
      payText: 'Thanh toán ngay',
      morePayTypePlaceholder: 'Vui lòng chọn phương thức thanh toán',
      waitingText: 'Đang chờ tham số thanh toán...',
      loadingText: 'Đang tải...',
      paymentMethodTitle: 'Chọn phương thức thanh toán',
      securePaymentText: 'Thanh toán an toàn'
    },
    id: {
      payText: 'Bayar sekarang',
      morePayTypePlaceholder: 'Silakan pilih metode pembayaran',
      waitingText: 'Menunggu parameter pembayaran...',
      loadingText: 'Memuat...',
      paymentMethodTitle: 'Pilih Metode Pembayaran',
      securePaymentText: 'Pembayaran Aman'
    },
    ar: {
      payText: 'ادفع الآن',
      morePayTypePlaceholder: 'يرجى اختيار طريقة الدفع',
      waitingText: 'في انتظار معلمات الدفع...',
      loadingText: 'جاري التحميل...',
      paymentMethodTitle: 'اختر طريقة الدفع',
      securePaymentText: 'دفع آمن'
    },
    ko: {
      payText: '지금 결제',
      morePayTypePlaceholder: '결제 방법을 선택하세요',
      waitingText: '결제 매개변수 대기 중...',
      loadingText: '로딩 중...',
      paymentMethodTitle: '결제 방법 선택',
      securePaymentText: '안전한 결제'
    },
    ru: {
      payText: 'Оплатить',
      morePayTypePlaceholder: 'Выберите способ оплаты',
      waitingText: 'Ожидание параметров оплаты...',
      loadingText: 'Загрузка...',
      paymentMethodTitle: 'Выберите способ оплаты',
      securePaymentText: 'Безопасный платеж'
    },
    de: {
      payText: 'Jetzt bezahlen',
      morePayTypePlaceholder: 'Bitte wählen Sie eine Zahlungsmethode',
      waitingText: 'Warten auf Zahlungsparameter...',
      loadingText: 'Laden...',
      paymentMethodTitle: 'Zahlungsmethode wählen',
      securePaymentText: 'Sichere Zahlung'
    },
    fr: {
      payText: 'Payer maintenant',
      morePayTypePlaceholder: 'Veuillez sélectionner un mode de paiement',
      waitingText: 'En attente des paramètres de paiement...',
      loadingText: 'Chargement...',
      paymentMethodTitle: 'Choisir le mode de paiement',
      securePaymentText: 'Paiement sécurisé'
    },
    es: {
      payText: 'Pagar ahora',
      morePayTypePlaceholder: 'Por favor seleccione un método de pago',
      waitingText: 'Esperando parámetros de pago...',
      loadingText: 'Cargando...',
      paymentMethodTitle: 'Seleccionar método de pago',
      securePaymentText: 'Pago seguro'
    },
    pt: {
      payText: 'Pagar agora',
      morePayTypePlaceholder: 'Por favor selecione um método de pagamento',
      waitingText: 'Aguardando parâmetros de pagamento...',
      loadingText: 'Carregando...',
      paymentMethodTitle: 'Selecionar método de pagamento',
      securePaymentText: 'Pagamento seguro'
    }
  }

  const currentLang = computed(() => api_params.value.language || 'en')

  const t = (key: string) => i18n[currentLang.value]?.[key] || i18n['en']?.[key] || key

  const payText = computed(() => t('payText'))
  const morePayTypePlaceholder = computed(() => t('morePayTypePlaceholder'))
  const waitingText = computed(() => t('waitingText'))
  const loadingText = computed(() => t('loadingText'))
  const paymentMethodTitle = computed(() => t('paymentMethodTitle'))
  const securePaymentText = computed(() => t('securePaymentText'))

  return {
    // 数据
    api_params,
    request_headers,
    order_info,
    country_code,
    paramsReady,

    // 方法
    initPostMessage,
    sendMessageToParent,
    closePay,
    cleanup,

    // 多语言
    currentLang,
    payText,
    morePayTypePlaceholder,
    waitingText,
    loadingText,
    paymentMethodTitle,
    securePaymentText
  }
}

export default usePostMessage
