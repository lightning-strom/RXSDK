<template>
  <van-dialog :class-name="`custom-dialog ${isVertical ? 'max-h-[520px]' : 'max-h-[342px]'}`" v-model:show="show"
              :show-cancel-button="false" :show-confirm-button="false">
    <main :class="`flex flex-col p-[16px] pt-0 ${isVertical ? 'max-h-[520px]' : 'max-h-[342px]'}`">
      <div class="bg-white pt-[16px]">
        <header v-if="props.language == 'ar'" class="flex justify-between items-center">
          <div class="flex items-center">
            <img class="w-[12px] h-[12px] me-[18px]" :src="close" alt="" @click="closeDialog" />
            <img class="w-[18px] h-[18px]" :src="setting" alt="" @click="handleSetting" />
          </div>
          <span class="text-black text-[16px] leading-[24px]">
            <!--银行卡支付-->
            {{ props.langText?.bankCardPayText }}
          </span>
        </header>

        <header v-else class="flex justify-between items-center">
          <span class="text-black text-[16px] leading-[24px]">
            <!--银行卡支付-->
            {{ props.langText?.bankCardPayText }}
          </span>
          <div class="flex items-center">
            <img class="w-[18px] h-[18px] me-[18px]" :src="setting" alt="" @click="handleSetting" />
            <img class="w-[12px] h-[12px]" :src="close" alt="" @click="closeDialog" />
          </div>
        </header>

        <p class="text-[#3D3D3D] text-[16px] text-center leading-[22px] mb-[7px] mt-[7px]">
          <!--是否使用下方信息进行支付-->
          {{ isSetting ? props.langText?.selectCardEditText : props.langText?.confirmUseOtherCardText }}
        </p>
      </div>

      <div v-if="cards.length == 1">
        <div
          class="flex flex-col items-center my-[18px]"
          v-for="(card) in cards" :key="card.id"
        >
          <img class="w-[40px] h-[40px]" :src="card_image" alt="" />
          <p class="text-[14px] text-[#3D3D3D]">{{ props.langText?.cardNumberText }}{{ card.card_no }}</p>
        </div>
      </div>

      <template v-else-if="isVertical">
        <div
          class="flex-1 overflow-scroll flex flex-col items-center"
        >
          <ul
            class="w-[298px] overflow-scroll flex flex-wrap"
          >
            <li
              class="box-border mt-[7px] px-[10px]"
              v-for="(card, index) in cards" :key="card.id"
              @click="handleClickIndex(index)"
            >
              <div
                :class="`${currentIndex.includes(index) ? 'card-active' : ''} ${isSetting ? 'is-setting' : ''} w-[128px] h-[78px] rounded-[10px] border-[1px] border-[#E7E7E7] box-border relative flex flex-col justify-center items-center`">
                <img class="w-[40px] h-[40px]" :src="card_image" alt="" />
                <p class="text-[14px] text-[#3D3D3D]">{{ card.card_no }}</p>

                <span v-if="card.lastest && !isSetting"
                      class="absolute top-[-1px] right-[-1px] text-white bg-[#0256FF] text-[10px] px-[10px] py-[3px] lastest">{{
                    props.langText?.recentlyText
                  }}</span>
              </div>
            </li>
          </ul>
        </div>
      </template>

      <template v-else>
        <ul
          v-if="cards.length == 3 || cards.length >= 5"
          class="flex-1 overflow-scroll flex flex-wrap"
        >
          <li
            :class="`${(index + 2) % 3 === 0 ? 'px-[28px]' : ''} box-border mt-[7px]`"
            v-for="(card, index) in cards" :key="card.id"
            @click="handleClickIndex(index)"
          >
            <div
              :class="`${currentIndex.includes(index) ? 'card-active' : ''} ${isSetting ? 'is-setting' : ''} w-[168px] h-[78px] rounded-[10px] border-[1px] border-[#E7E7E7] box-border relative flex flex-col justify-center items-center`">
              <img class="w-[40px] h-[40px]" :src="card_image" alt="" />
              <p class="text-[14px] text-[#3D3D3D]">{{ card.card_no }}</p>

              <span v-if="card.lastest && !isSetting"
                    class="absolute top-[-1px] right-[-1px] text-white bg-[#0256FF] text-[10px] px-[10px] py-[3px] lastest">{{
                  props.langText?.recentlyText
                }}</span>
            </div>
          </li>
        </ul>

        <ul
          v-if="cards.length == 4 || cards.length == 2"
          class="flex-1 overflow-scroll flex flex-wrap justify-center"
        >
          <li
            class="box-border mt-[7px] px-[20px]"
            v-for="(card, index) in cards" :key="card.id"
            @click="handleClickIndex(index)"
          >
            <div
              :class="`${currentIndex.includes(index) ? 'card-active' : ''} ${isSetting ? 'is-setting' : ''} w-[168px] h-[78px] rounded-[10px] border-[1px] border-[#E7E7E7] box-border relative flex flex-col justify-center items-center`">
              <img class="w-[40px] h-[40px]" :src="card_image" alt="" />
              <p class="text-[14px] text-[#3D3D3D]">{{ card.card_no }}</p>

              <span v-if="card.lastest && !isSetting"
                    class="absolute top-[-1px] right-[-1px] text-white bg-[#0256FF] text-[10px] px-[10px] py-[3px] lastest">{{
                  props.langText?.recentlyText
                }}</span>
            </div>
          </li>
        </ul>
      </template>

      <div v-if="isSetting" class="flex flex-col items-center w-[100%] sticky bottom-0 z-9999 bg-white pt-[16px]">
        <div
          :class="`${currentIndex.length == 0 && cards.length > 1 ? 'bg-[#FFC0C0]' : 'bg-[#F97373]'} leading-[44px] text-center text-white text-[16px] rounded-[22px] flex items-center justify-center`"
          :style="`width: ${isVertical ? '292' : '351'}px;`"
          @click="handleDelete"
        >
          <!--删除-->
          {{ props.langText?.deleteText }}
        </div>
      </div>

      <div v-else class="flex flex-col items-center w-[100%] sticky bottom-0 z-9999 bg-white pt-[16px]">
        <div
          class="leading-[44px] bg-[#0256FF] text-center text-white text-[16px] rounded-[22px] flex items-center justify-center"
          :style="`width: ${isVertical ? '292' : '351'}px;`"
          @click="handleSubmit"
        >
          <van-loading v-if="false" />
          {{ props.langText?.payText }}
        </div>

        <p
          class="text-center text-[#767676] text-[12px] pt-[12px] pb-[11px] border-b-[1px] border-b-[#D8D8D8] border-solid min-w-[186px]"
          @click="handleUseOther"
        >
          <!--使用其他卡号-->
          {{ props.langText?.useOtherCardText }}
        </p>
      </div>
    </main>
  </van-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineProps } from 'vue'
import setting from '@/assets/images/setting.png'
import close from '@/assets/images/close.png'
import card_image from '@/assets/images/card.png'
import { showConfirmDialog } from 'vant'
import { deleteCardApi } from '@/utils/request/apis.ts'

const props = defineProps({
  onConfirm: {
    type: Function,
    default: () => {
      console.log('confirm')
    }
  },
  langText: {
    type: Object,
    default() {
      return {
        payText: '',
        selectCardText: '',
        selectCardEditText: '',
        promptText: '',
        deleteText: '',
        confirmDeleteText: '',
        confirmText: '',
        cancelText: '',
        useOtherCardText: '',
        confirmUseOtherCardText: '',
        bankCardPayText: '',
        recentlyText: '',
        cardNumberText: ''
      }
    }
  },
  language: {
    type: String,
    default: 'en'
  },
  cacheKey: {
    type: String,
    default: ''
  }
})

const isVertical = ref(window.orientation !== 90 && window.orientation !== -90)

const show = ref(false)
const currentIndex = ref<number[]>([])
const isSetting = ref(false)
const cards = ref<any[]>([])
const pay_token = ref('')

function handleUseOther() {
  props.onConfirm()
  closeDialog()
}

function handleSubmit() {
  const card = cards.value[currentIndex.value[0]]
  props.onConfirm(card.id)
  closeDialog()
}

function handleSetting() {
  isSetting.value = !isSetting.value
  if (isSetting.value) {
    currentIndex.value = []
  } else {
    currentIndex.value = [0]
  }
}

function handleClickIndex(index: number) {
  const idx = currentIndex.value.findIndex((i: number) => i == index)
  if (isSetting.value) {
    if (idx > -1) {
      currentIndex.value.splice(idx, 1)
    } else {
      currentIndex.value.push(index)
    }
  } else {
    currentIndex.value = [index]
  }
}

function handleDelete() {
  showConfirmDialog({
    title: props.langText?.promptText,
    message: props.langText?.confirmDeleteText,
    cancelButtonText: props.langText?.cancelText,
    confirmButtonText: props.langText?.confirmText
  })
    .then(() => {
      const ids = cards.value.length == 1 ? [cards.value[0].id] : currentIndex.value.map((i: number) => cards.value[i].id)

      deleteCardApi({
        pay_token: pay_token.value,
        id: ids.join(',')
      }).then((res: any) => {
        if (res.code == 0) {
          cards.value = cards.value.filter((card: any) => !ids.includes(card.id))
          currentIndex.value = []

          if (cards.value.length == 0) {
            closeDialog()
          }
        }
      })
    })
    .catch(() => {
      // on cancel
    })
}

function openDialog(_cards: any[], _pay_token: string) {
  cards.value = _cards.map((item: any, idx: number) => ({ ...item, lastest: idx == 0 }))
  pay_token.value = _pay_token
  currentIndex.value = [0]
  isSetting.value = false
  show.value = true
}

function closeDialog() {
  show.value = false
}

defineExpose({
  openDialog
})
</script>

<style>
.custom-dialog {
  border-radius: 8px !important;
  width: 595px !important;
  top: 50% !important;
}

.lastest {
  border-radius: 0 10px 0 10px;
}

.card-active {
  border-color: #0256FF !important;

  &.is-setting {
    border-color: #F97373 !important;
  }
}
</style>