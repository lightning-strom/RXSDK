import { computed, ref } from 'vue'
import { SYSTEM_INFO } from '@/utils/utils.ts'

const params = JSON.stringify({
  init_data: JSON.stringify({
    'cp': {
      'of': false
    }
  }),
  order_info: JSON.stringify({
    'country_code': 'CN',
    'goods_tag': '842000099',
    'goods_name': '测试商品',
    'currency_symbol': 'ALL',
    'openid': 'rxugkX-lJbOZB9zhvmHXdEww3trQRk7wB6dMxpjA',
    'indulge_auth': 0,
    'pay_type': 'ruixue_h5_trade',
    'currency': 'USD',
    'source': '',
    'sub_channel_id': '',
    'age': 0,
    'env': 1
  }),
  api_params: JSON.stringify({
    'country_code': 'CN',
    'productid': '1002',
    'devicecode': '3BBEFEB39BA19A9745F5D4C72FB8BB54',
    'cpid': '119',
    'domain': '',
    'language': 'zh',
    'platformid': '1',
    'version': '3.5.26_6a47a1a2',
    'channelid': '1000',
    'tzoffset': '8.00'
  }),
  device: JSON.stringify({
    'tabbarSafeHeight': 0,
    'naviBarHeight': 0
  }),
  request_headers: JSON.stringify({
    'ruixue-channelid': '1000',
    'ruixue-accesstoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDUElEIjoxMTksIkFjY291bnRJRCI6NTM5MjUxODg4LCJVc2VySUQiOjAsIlByb2R1Y3RJRCI6IjEwMDIiLCJPcGVuSUQiOiJyeHVTb2o0ZWRWek05azhka0hfT1VCSEFrUlotaldPRS1sTjFQUkRnIiwiQXBwdXNlcklEIjoyMDAwMDAxNjUsIlN0YW5kYXJkQ2xhaW1zIjp7ImV4cCI6MTc1MzUxMDM5MH0sIlRva2VuSUQiOiI2YTAzMTk2My1kN2I4LTRmYjYtOGZlNi0wMGE1OGU4ZTkwNmUifQ.PyWHbJYCmWLKS783zCNnTCWMHV0fTSYXBr0ILGp-zQk',
    'ruixue-devicecode': '3BBEFEB39BA19A9745F5D4C72FB8BB54',
    'ruixue-traceid': '5103dd2c-baed-468f-ab98-1a27757a27f6',
    'ruixue-language': 'zh',
    'ruixue-platformid': '1',
    'ruixue-tzoffset': '8.00',
    'ruixue-cpid': '119',
    'ruixue-version': '3.5.26_6a47a1a2',
    'ruixue-productid': '1002'
  })
})

const useParams = () => {
  const initParams: any = ref({})
  const api_params: any = ref({})
  const init_data: any = ref({})
  const request_headers: any = ref({})
  const device: any = ref({})
  const order_info: any = ref({})
  const country_code: any = ref('')
  // @ts-ignore
  const isAndroid = computed(() => !!window.JsBridge)
  const getInitParams = () => {
    // @ts-ignore
    initParams.value = isAndroid.value ? JSON.parse(window.JsBridge.getInitParams()) : window.getInitParams
    // initParams.value = JSON.parse(params)
    api_params.value = JSON.parse(initParams.value.api_params)
    init_data.value = JSON.parse(initParams.value.init_data || null)
    request_headers.value = JSON.parse(initParams.value.request_headers)
    device.value = JSON.parse(initParams.value.device)
    order_info.value = JSON.parse(initParams.value.order_info)
    country_code.value = order_info.value.country_code
    localStorage.setItem('language', api_params.value.language)

    Object.assign(SYSTEM_INFO, {
      request_headers: request_headers.value,
      domain: api_params.value.domain,
      cpof: init_data.value?.cp?.of || false
    })
  }

  const payText = computed(() => {
    const languageDict: any = {
      zh: '立即支付',
      tc: '立即支付',
      en: 'Pay now',
      ja: '今すぐ支払う',
      th: 'จ่ายทันที',
      vi: 'Thanh toán',
      tl: 'Bayad na',
      id: 'Bayar sekarang',
      ar: 'ادفع الآن'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Pay now'
  })

  const morePayType = computed(() => {
    const languageDict: any = {
      zh: '更多支付方式',
      tc: '更多支付方式',
      en: 'More payments',
      ja: 'もっと支払い',
      th: 'เพิ่มเติมการจ่ายเงิน',
      vi: 'Thêm phương thức thanh toán',
      tl: 'Mas maraming bayad',
      id: 'Lebih banyak bayar',
      ar: 'المزيد من الدفع'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'More payments'
  })

  const morePayTypePlaceholder = computed(() => {
    const languageDict: any = {
      zh: '请选择支付方式',
      tc: '請選擇支付方式',
      en: 'Choose payment method',
      ja: '支払い方法選択',
      th: 'เลือกวิธีจ่ายเงิน',
      vi: 'Chọn cách thanh toán',
      tl: 'Pili paraan ng bayad',
      id: 'Pilih cara bayar',
      ar: 'اختر طريقة الدفع'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Choose payment method'
  })

  const selectCardText = computed(() => {
    const languageDict: any = {
      zh: '请先选择支付卡号',
      tc: '請先選擇支付卡號',
      en: 'Please select a payment card number first',
      ja: 'まず支払いカード番号を選択してください',
      th: 'กรุณาเลือกหมายเลขบัตรชำระเงินก่อน',
      vi: 'Vui lòng chọn số thẻ thanh toán trước',
      tl: 'Pumili muna ng numero ng payment card',
      id: 'Silakan pilih nomor kartu pembayaran terlebih dahulu',
      ar: 'يرجى اختيار رقم بطاقة الدفع أولاً'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Please select a payment card number first'
  })

  const selectCardEditText = computed(() => {
    const languageDict: any = {
      zh: '选择信用卡进行编辑',
      tc: '選擇信用卡進行編輯',
      en: 'Select a credit card for editing',
      ja: 'クレジットカードを選択して編集します',
      th: 'เลือกบัตรเครดิตเพื่อแก้ไข',
      vi: 'Chọn thẻ tín dụng để sửa đổi',
      tl: 'Pumili ng credit card para i-edit',
      id: 'Pilih kartu kredit untuk diedit',
      ar: 'اختر بطاقة الائتمان للتعديلً'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Select a credit card for editing'
  })

  const promptText = computed(() => {
    const languageDict: any = {
      zh: '提示',
      tc: '提示',
      en: 'Prompt',
      ja: 'ヒント',
      th: 'คำใบ้',
      vi: 'gợi ý',
      tl: 'pahiwatig ',
      id: 'petunjuk ',
      ar: 'إشعار'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Prompt'
  })

  const deleteText = computed(() => {
    const languageDict: any = {
      zh: '删除',
      tc: '刪除',
      en: 'Delete ',
      ja: '削除',
      th: 'ลบ',
      vi: 'xóa',
      tl: 'tanggalin ',
      id: 'hapus ',
      ar: 'حذف'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Delete'
  })

  const confirmDeleteText = computed(() => {
    const languageDict: any = {
      zh: '是否确认删除',
      tc: '是否確認刪除',
      en: 'Are you sure you want to delete',
      ja: '削除を確認しますか',
      th: 'คุณแน่ใจหรือว่าจะลบ?',
      vi: 'Bạn có chắc chắn muốn xóa không',
      tl: 'Sigurado ka bang tanggalin',
      id: 'Apakah Anda yakin ingin menghapus',
      ar: 'هل أنت متأكد من الحذف'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Are you sure you want to delete'
  })

  const confirmText = computed(() => {
    const languageDict: any = {
      zh: '确认',
      tc: '確認',
      en: 'Confirm ',
      ja: '確認',
      th: 'ยืนยัน',
      vi: 'xác nhận',
      tl: 'tukuyin ',
      id: 'konfirmasi ',
      ar: 'تأكيد'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Confirm'
  })

  const cancelText = computed(() => {
    const languageDict: any = {
      zh: '取消',
      tc: '取消',
      en: 'Cancel ',
      ja: 'キャンセル',
      th: 'ยกเลิก',
      vi: 'hủy bỏ',
      tl: 'kanselahin ',
      id: 'batal ',
      ar: 'إلغاء'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Cancel'
  })

  const confirmUseOtherCardText = computed(() => {
    const languageDict: any = {
      zh: '是否使用下方信息进行支付',
      tc: '是否使用下方信息進行支付',
      en: 'Do you want to use the information below for payment',
      ja: '下の情報を支払いに使用しますか',
      th: 'คุณต้องการใช้ข้อมูลด้านล่างเพื่อชำระเงินหรือไม่',
      vi: 'Bạn có muốn sử dụng thông tin bên dưới để thanh toán không',
      tl: 'Gusto mo bang gamitin ang impormasyon sa ibaba upang magbayad',
      id: 'Apakah Anda ingin menggunakan informasi di bawah ini untuk melakukan pembayaran',
      ar: 'هل تريد استخدام المعلومات أدناه للدفع'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Do you want to use the information below for payment?'
  })

  const useOtherCardText = computed(() => {
    const languageDict: any = {
      zh: '使用其他卡号',
      tc: '使用其他卡號',
      en: 'Use another card number',
      ja: '他のカード番号を使用する',
      th: 'ใช้หมายเลขบัตรอื่น',
      vi: 'Sử dụng số thẻ khác',
      tl: 'Gumamit ng ibang numero ng card',
      id: 'Gunakan nomor kartu lain',
      ar: 'استخدم رقم بطاقة آخر'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Use another card number'
  })

  const bankCardPayText = computed(() => {
    const languageDict: any = {
      zh: '银行卡支付',
      tc: '銀行卡支付',
      en: 'Bank card payment',
      ja: '銀行カード支払い',
      th: 'ชำระเงินด้วยบัตรธนาคาร',
      vi: 'Thanh toán bằng thẻ ngân hàng',
      tl: 'Pagbabayad gamit ang bank card',
      id: 'Pembayaran dengan kartu bank',
      ar: 'دفع ببطاقة البنك'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Bank card payment'
  })

  const saveCardText = computed(() => {
    const languageDict: any = {
      zh: '允许保存支付信息，以便下次使用',
      tc: '允許保存支付信息，以便下次使用',
      en: 'Allow saving payment information for next use',
      ja: '支払い情報を保存して次回使用することを許可します',
      th: 'อนุญาตให้บันทึกข้อมูลการชำระเงินเพื่อใช้ในครั้งต่อไป',
      vi: 'Cho phép lưu thông tin thanh toán để sử dụng lần sau',
      tl: 'Payagan ang pag-iimbak ng impormasyon sa pagbabayad para sa susunod na paggamit',
      id: 'Izinkan menyimpan informasi pembayaran untuk digunakan di lain waktu',
      ar: 'اسمح بحفظ معلومات الدفع للاستخدام في المرة القادمة'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Allow saving payment information for next use'
  })

  const cardNumberText = computed(() => {
    const languageDict: any = {
      zh: '卡号：',
      tc: '卡號：',
      en: 'Card number:',
      ja: 'カード番号：',
      th: 'หมายเลขบัตร:',
      vi: 'Số thẻ:',
      tl: 'Numero ng card:',
      id: 'Nomor kartu:',
      ar: 'رقم البطاقة:'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Card number:'
  })

  const recentlyText = computed(() => {
    const languageDict: any = {
      zh: '最近使用',
      tc: '最近使用',
      en: 'Recently used',
      ja: '最近使用した',
      th: 'ใช้ล่าสุด',
      vi: 'Đã sử dụng gần đây',
      tl: 'Kamakailan lamang ginamit',
      id: 'Baru-baru ini digunakan',
      ar: 'استخدم مؤخراً'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Card number:'
  })

  const checkoutLoadingText = computed(() => {
    const languageDict: any = {
      zh: 'checkout sdk 加载中，请稍后重试',
      tc: 'checkout sdk 加載中，請稍後重試',
      en: 'The checkout sdk is loading. Please try again later',
      ja: 'checkout sdk を読み込んでいます。しばらくしてから再度お試しください',
      th: 'กำลังโหลด checkout sdk กรุณาลองใหม่อีกครั้งในภายหลัง',
      vi: 'Đang tải checkout sdk. Vui lòng thử lại sau',
      tl: 'Naglo-load ang checkout sdk. Pakisubukan muli mamaya',
      id: 'Checkout sdk sedang dimuat. Silakan coba lagi nanti',
      ar: 'جاري تحميل checkout sdk. يرجى المحاولة مرة أخرى لاحقًاً'
    }
    return api_params.value.language ? languageDict[api_params.value.language] : 'Card number:'
  })

  const langTextDict = computed(() => {
    return {
      payText: payText.value,
      selectCardText: selectCardText.value,
      selectCardEditText: selectCardEditText.value,
      promptText: promptText.value,
      deleteText: deleteText.value,
      confirmDeleteText: confirmDeleteText.value,
      confirmText: confirmText.value,
      cancelText: cancelText.value,
      useOtherCardText: useOtherCardText.value,
      confirmUseOtherCardText: confirmUseOtherCardText.value,
      bankCardPayText: bankCardPayText.value,
      recentlyText: recentlyText.value,
      cardNumberText: cardNumberText.value
    }
  })

  return {
    isAndroid,
    initParams,
    api_params,
    request_headers,
    device,
    order_info,
    country_code,
    payText,
    morePayType,
    morePayTypePlaceholder,
    selectCardText,
    promptText,
    deleteText,
    confirmDeleteText,
    confirmText,
    cancelText,
    confirmUseOtherCardText,
    useOtherCardText,
    bankCardPayText,
    saveCardText,
    cardNumberText,
    recentlyText,
    checkoutLoadingText,
    langTextDict,
    getInitParams
  }
}

export default useParams