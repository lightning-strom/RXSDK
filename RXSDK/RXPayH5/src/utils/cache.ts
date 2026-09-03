import { isString } from 'lodash'

export const getCardStore = (CARD_KEY: string) => {
  const cards = localStorage.getItem(CARD_KEY)
  if (cards && isString(cards) && JSON.parse(cards) instanceof Object) {
    return JSON.parse(cards)
  }
  return []
}

export const setCardStore = (card: any, CARD_KEY: string) => {
  const cards = getCardStore(CARD_KEY)
  const idx = cards.findIndex((item: any) => item.id == card.id)
  if (!idx) {
    cards.unshift(card)
    localStorage.setItem(CARD_KEY, JSON.stringify(cards))
  }
}

export const removeCardStore = (card: any, CARD_KEY: string) => {
  const cards = getCardStore(CARD_KEY)
  const idx = cards.findIndex((item: any) => item.id == card.id)
  if (idx > -1) {
    cards.splice(idx, 1)
    localStorage.setItem(CARD_KEY, JSON.stringify(cards))
  }
}
