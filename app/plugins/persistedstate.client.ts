// plugins/persistedstate.client.ts
import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as any
  if (pinia) {
    pinia.use(
      createPersistedState({
        storage: localStorage,
        auto: true
      })
    )
  }
})
