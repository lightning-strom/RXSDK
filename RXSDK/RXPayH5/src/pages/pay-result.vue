<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import pending_v from '@/assets/images/pending_v.png'
import pending_h from '@/assets/images/pending_h.png'

const language = localStorage.getItem('language') || ''

const pendingText = computed(() => {
  const languageDict: any = {
    zh: '请返回游戏确认支付结果',
    tc: '請返回遊戲確認支付結果',
    en: 'Please return to the game to confirm the payment result',
    ja: 'ゲームに戻って支払い結果を確認してください',
    th: 'กรุณากลับไปที่เกมเพื่อยืนยันผลการชำระเงิน',
    vi: 'Vui lòng quay lại trò chơi để xác nhận kết quả thanh toán',
    tl: 'Mangyaring bumalik sa laro upang matiyak ang resulta ng pagbabayad',
    id: 'Harap kembali ke permainan untuk memverifikasi hasil pembayaran',
    ar: 'يرجى العودة إلى اللعبة للتحقق من نتيجة الدفع'
  }
  return language
    ? languageDict[language]
    : 'Please return to the game to confirm the payment result'
})

const pendingTipText = computed(() => {
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
  return language ? languageDict[language] : 'Please wait while we process your payment'
})

const isVertical = ref(window.orientation !== 90 && window.orientation !== -90)

const statusImg = computed(() => {
  return isVertical.value ? pending_v : pending_h
})

onMounted(() => {
  document.title = pendingText.value
})
</script>

<template>
  <!-- 竖屏 -->
  <div class="vertical mt-[120px]" v-if="isVertical">
    <div class="flex justify-center">
      <img :src="statusImg" alt="" class="w-[292px]" />
    </div>

    <main class="px-[10px] box-border">
      <header class="pt-[26px] pb-[24px] h-[24px] flex items-center justify-center">
        <span class="text-[#000] text-[20px] font-bold">{{ pendingText }}</span>
        <iconpark-icon
          v-if="language === 'ar'"
          name="zu313"
          color="#4574F5"
          size="20"
          class="ml-[6px]"
        />
      </header>

      <p class="text-center text-[14px] text-[#3d3d3d] pt-[12px] pb-[6px]">{{ pendingTipText }}</p>
    </main>
  </div>

  <!-- 横屏 -->
  <div class="horizontal" v-else>
    <div class="flex justify-center">
      <img :src="statusImg" alt="" class="w-[228px]" />
    </div>

    <main>
      <header class="pt-[26px] pb-[24px] h-[24px] flex items-center justify-center">
        <iconpark-icon
          v-if="language !== 'ar'"
          name="zu313"
          color="#4574F5"
          size="20"
          class="mr-[6px]"
        />
        <span class="text-[#000] text-[20px] font-bold">{{ pendingText }}</span>
        <iconpark-icon
          v-if="language === 'ar'"
          name="zu313"
          color="#4574F5"
          size="20"
          class="ml-[6px]"
        />
      </header>

      <p class="text-center text-[14px] text-[#3d3d3d] pt-[12px] pb-[17px]">{{ pendingTipText }}</p>
    </main>
  </div>
</template>
