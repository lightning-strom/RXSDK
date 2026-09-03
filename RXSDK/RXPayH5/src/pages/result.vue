<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import success_v from '@/assets/images/success_v.png'
import success_h from '@/assets/images/success_h.png'
import fail_v from '@/assets/images/fail_v.png'
import fail_h from '@/assets/images/fail_h.png'
import pending_v from '@/assets/images/pending_v.png'
import pending_h from '@/assets/images/pending_h.png'

const router = useRouter()
const goHome = () => {
  router.replace('/')
}

const language = localStorage.getItem('language') || ''

const confirmText = computed(() => {
  const languageDict: any = {
    zh: '确定',
    tc: '確定',
    en: 'Confirm',
    ja: '確定',
    th: 'ยืนยัน',
    vi: 'Xác nhận',
    tl: 'Kumpirmahin',
    id: 'Konfirmasi',
    ar: 'تأكيد'
  }
  return language ? languageDict[language] : 'Confirm'
})

const successText = computed(() => {
  const languageDict: any = {
    zh: '支付成功',
    tc: '支付成功',
    en: 'Payment Successful',
    ja: '支払い成功',
    th: 'ชำระเงินสำเร็จ',
    vi: 'Thanh toán thành công',
    tl: 'Matagumpay na Pagbabayad',
    id: 'Pembayaran Berhasil',
    ar: 'تم الدفع بنجاح'
  }
  return language ? languageDict[language] : 'Payment Successful'
})

const successTipText = computed(() => {
  const languageDict: any = {
    zh: '如未到账请与客服人员联系',
    tc: '如未到账请与客服人员联系。',
    en: 'If the payment has not been received, please contact customer service.',
    ja: '入金が確認できない場合は、カスタマーサービスにお問い合わせください。',
    th: 'หากยอดเงินยังไม่เข้าบัญชี โปรดติดต่อฝ่ายบริการลูกค้า',
    vi: 'Nếu chưa nhận được thanh toán, vui lòng liên hệ với nhân viên chăm sóc khách hàng.',
    tl: 'Kung hindi pa natanggap ang bayad, mangyaring makipag-ugnay sa customer service.',
    id: 'Jika pembayaran belum diterima, silakan hubungi layanan pelanggan.',
    ar: 'إذا لم يتم استلام الدفع، يرجى الاتصال بخدمة العملاء.'
  }
  return language ? languageDict[language] : 'If the payment has not been received, please contact customer service.'
})

const failText = computed(() => {
  const languageDict: any = {
    zh: '支付失败',
    tc: '支付失敗',
    en: 'Payment Failed',
    ja: '支払い失敗',
    th: 'การชำระเงินล้มเหลว',
    vi: 'Thanh toán thất bại',
    tl: 'Nabigong Pagbabayad',
    id: 'Pembayaran Gagal',
    ar: 'فشل الدفع'
  }
  return language ? languageDict[language] : 'Payment Failed'
})

const failTipText = computed(() => {
  const languageDict: any = {
    zh: '如有问题请与客服人员联系',
    tc: '如有問題請與客服人員聯繫。',
    en: 'If you have any questions, please contact customer service.',
    ja: '問題がある場合はカスタマーサービスにお問い合わせください。',
    th: 'หากมีปัญหา โปรดติดต่อฝ่ายบริการลูกค้า',
    vi: 'Nếu có vấn đề, vui lòng liên hệ với nhân viên chăm sóc khách hàng.',
    tl: 'Kung mayroon kayong mga tanong, mangyaring makipag-ugnay sa customer service.',
    id: 'Jika ada masalah, silakan hubungi layanan pelanggan.',
    ar: 'إذا كانت لديك أي أسئلة، يرجى الاتصال بخدمة العملاء.'
  }
  return language ? languageDict[language] : 'If you have any questions, please contact customer service.'
})

const failReasonText = computed(() => {
  const languageDict: any = {
    zh: '失败原因',
    tc: '失敗原因',
    en: 'Reason for failure',
    ja: '失敗理由',
    th: 'สาเหตุของความล้มเหลว',
    vi: 'Lý do thất bại',
    tl: 'Dahilan ng pagkabigo',
    id: 'Alasan kegagalan',
    ar: 'سبب الفشل'
  }
  return language ? languageDict[language] : 'Reason for failure'
})

const pendingText = computed(() => {
  const languageDict: any = {
    zh: '支付状态获取失败',
    tc: '支付狀態獲取失敗',
    en: 'Failed to retrieve payment status',
    ja: '支払いステータスの取得に失敗しました',
    th: 'การดึงสถานะการชำระเงินล้มเหลว',
    vi: 'Lấy trạng thái thanh toán thất bại',
    tl: 'Nabigo ang pagkuha ng status ng pagbabayad',
    id: 'Gagal mengambil status pembayaran',
    ar: 'فشل في الحصول على حالة الدفع'
  }
  return language ? languageDict[language] : 'Failed to retrieve payment status'
})

const pendingTipText = computed(() => {
  const languageDict: any = {
    zh: '如已支付请与客服人员联系核实',
    tc: '如已支付請與客服人員聯繫核實。',
    en: 'If you have already paid, please contact customer service to verify.',
    ja: 'すでに支払い済みの場合は、カスタマーサービスに連絡して確認してください。',
    th: 'หากคุณชำระเงินแล้ว โปรดติดต่อฝ่ายบริการลูกค้าเพื่อยืนยัน',
    vi: 'Nếu bạn đã thanh toán, vui lòng liên hệ với nhân viên chăm sóc khách hàng để xác nhận.',
    tl: 'Kung nakapagbayad ka na, mangyaring makipag-ugnay sa customer service para i-verify.',
    id: 'Jika Anda sudah melakukan pembayaran, silakan hubungi layanan pelanggan untuk verifikasi.',
    ar: 'إذا كنت قد دفعت بالفعل، يرجى الاتصال بخدمة العملاء للتحقق.'
  }
  return language ? languageDict[language] : 'If you have already paid, please contact customer service to verify.'
})

const getUrlParams = (url: string) => {
  const paramsRegex = /[?&]+([^=&]+)=([^&]*)/gi
  const params: any = {}
  let match
  while (match = paramsRegex.exec(url)) {
    params[match[1]] = match[2]
  }
  return params
}

// @ts-ignore
const isAndroid = computed(() => !!window.JsBridge)
const isVertical = ref(window.orientation !== 90 && window.orientation !== -90)
const status = ref<any>(getUrlParams(window.location.href).status)
const failReason = ref('')

const isSuccess = computed(() => {
  return status.value == 'SUCCESS'
})

const isFail = computed(() => {
  return status.value == 'FAILED'
})

const isPending = computed(() => {
  return status.value == 'PENDING'
})

const isClosed = computed(() => {
  return status.value == 'CLOSED'
})

const statusImg = computed(() => {
  if (isSuccess.value) {
    if (isVertical.value) {
      return success_v
    } else {
      return success_h
    }
  }
  if (isFail.value) {
    if (isVertical.value) {
      return fail_v
    } else {
      return fail_h
    }
  }
  if (isPending.value) {
    if (isVertical.value) {
      return pending_v
    } else {
      return pending_h
    }
  }
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

const handleConfirm = () => {
  if (isSuccess.value) {
    window.location.href = 'ruixue://pay/success'
  } else if (isFail.value) {
    window.location.href = 'ruixue://pay/failure'
  } else if (isPending.value) {
    window.location.href = 'ruixue://pay/failure?code=4300&msg='
  }
}

onMounted(() => {
  if (isClosed.value) {
    goHome()
  }
  if (isSuccess.value) {
    setTitle(successText.value)
  }
  if (isFail.value) {
    setTitle(failText.value)
  }
  if (isPending.value) {
    setTitle(pendingText.value)
  }
})
</script>

<template>
  <div class="vertical mt-[120px]" v-if="isVertical">
    <div class="flex justify-center">
      <img :src="statusImg" alt="" class="w-[292px]" />
    </div>

    <main
      v-if="isSuccess"
      class="px-[10px] box-border"
    >
      <header
        class="pt-[26px] pb-[24px] h-[24px] flex items-center justify-center">
        <iconpark-icon v-if="language !== 'ar'" name="yipeizhi" size="20" class="mr-[6px]" />
        <span class="text-[#000] text-[20px] font-bold">{{ successText }}</span>
        <iconpark-icon v-if="language === 'ar'" name="yipeizhi" size="20" class="ml-[6px]" />
      </header>

      <p class="text-center text-[14px] text-[#3d3d3d] pt-[12px] pb-[6px]">{{ successTipText }}</p>
    </main>

    <main v-else-if="isFail"
          class="px-[10px] box-border"
    >
      <header class="pt-[26px] pb-[18px] h-[24px] flex items-center justify-center">
        <iconpark-icon v-if="language !== 'ar'" name="yichang" size="20" class="mr-[6px]" />
        <span class="text-[#000] text-[20px] font-bold">{{ failText }}</span>
        <iconpark-icon v-if="language === 'ar'" name="yichang" size="20" class="ml-[6px]" />
      </header>

      <p v-if="failReason" class="text-center text-[14px] text-[#3d3d3d] pt-[12px] pb-[6px]">{{ failTipText }}</p>
      <p v-else class="text-center text-[14px] text-[#3d3d3d] pt-[12px] pb-[6px]">{{ failTipText }}</p>

      <p v-if="failReason" class="text-center text-[#3D3D3D] text-[14px]">{{ failReasonText }}</p>
    </main>

    <main v-else-if="isPending"
          class="px-[10px] box-border"
    >
      <header
        class="pt-[26px] pb-[24px] h-[24px] flex items-center justify-center">
        <iconpark-icon v-if="language !== 'ar'" name="zu313" color="#4574F5" size="20" class="mr-[6px]" />
        <span class="text-[#000] text-[20px] font-bold">{{ pendingText }}</span>
        <iconpark-icon v-if="language === 'ar'" name="zu313" color="#4574F5" size="20" class="ml-[6px]" />
      </header>

      <p class="text-center text-[14px] text-[#3d3d3d] pt-[12px] pb-[6px]">{{ pendingTipText }}</p>
    </main>

    <div class="flex justify-center w-[100%] bg-white mt-[85px] pb-[20px]">
      <div
        @click="handleConfirm"
        class="leading-[44px] bg-[#fff] text-center text-[#0256FF] border-[1px] border-[#0256FF] border-solid text-[16px] rounded-[22px] w-[292px] flex items-center justify-center"
      >
        {{ confirmText }}
      </div>
    </div>
  </div>

  <div class="horizontal" v-else>
    <div class="flex justify-center">
      <img :src="statusImg" alt="" class="w-[228px]" />
    </div>

    <main
      v-if="isSuccess"
    >
      <header
        class="pt-[26px] pb-[24px] h-[24px] flex items-center justify-center">
        <iconpark-icon v-if="language !== 'ar'" name="yipeizhi" size="20" class="mr-[6px]" />
        <span class="text-[#000] text-[20px] font-bold">{{ successText }}</span>
        <iconpark-icon v-if="language === 'ar'" name="yipeizhi" size="20" class="ml-[6px]"></iconpark-icon>
      </header>

      <p class="text-center text-[14px] text-[#3d3d3d] pt-[12px] pb-[17px]">{{ successTipText }}</p>
    </main>

    <main v-else-if="isFail">
      <header class="pt-[26px] pb-[18px] h-[24px] flex items-center justify-center">
        <iconpark-icon v-if="language !== 'ar'" name="yichang" size="20" class="mr-[6px]" />
        <span class="text-[#000] text-[20px] font-bold">{{ failText }}</span>
        <iconpark-icon v-if="language === 'ar'" name="yichang" size="20" class="ml-[6px]" />
      </header>

      <p v-if="failReason" class="text-center text-[14px] text-[#3d3d3d] pt-[12px] pb-[6px]">{{ failTipText }}</p>
      <p v-else class="text-center text-[14px] text-[#3d3d3d] pt-[12px] pb-[17px]">{{ failTipText }}</p>

      <p v-if="failReason" class="text-center text-[#3D3D3D] text-[14px] pb-[7px]">{{ failReasonText }}</p>
    </main>

    <main
      v-else
    >
      <header
        class="pt-[26px] pb-[24px] h-[24px] flex items-center justify-center">
        <iconpark-icon v-if="language !== 'ar'" name="zu313" color="#4574F5" size="20" class="mr-[6px]" />
        <span class="text-[#000] text-[20px] font-bold">{{ pendingText }}</span>
        <iconpark-icon v-if="language === 'ar'" name="zu313" color="#4574F5" size="20" class="ml-[6px]" />
      </header>

      <p class="text-center text-[14px] text-[#3d3d3d] pt-[12px] pb-[17px]">{{ pendingTipText }}</p>
    </main>

    <div class="flex justify-center w-[100%] bg-white mt-[10px] pb-[20px]">
      <div
        @click="handleConfirm"
        class="leading-[44px] bg-[#fff] text-center text-[#0256FF] border-[1px] border-[#0256FF] border-solid text-[16px] rounded-[22px] w-[292px] flex items-center justify-center"
      >
        {{ confirmText }}
      </div>
    </div>
  </div>
</template>