import { defineStore } from 'pinia'
import { store } from '@/store'
interface LocalState {
  local: string
}
export const useLocalStore = defineStore({
  id: 'local',
  state: (): LocalState => ({
    local: 'zh'
  }),
  getters: {
    getLocal(): string {
      return this.local
    }
  },
  actions: {
    setLocal(local: string) {
      this.local = local
    }
  }
})

// Need to be used outside the setup
export function useLocalStoreWithOut() {
  return useLocalStore(store)
}
