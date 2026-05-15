<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
const lessonStore = useLessonStore()
onMounted(() => {
  lessonStore.fetchLessons()
  window.addEventListener('storage', (event) => {
    if (event.key === 'my-english-pod-storage' && event.newValue !== event.oldValue) {
      try {
        const newState = JSON.parse(event.newValue || '{}')

        if (newState.masteredWords) {
          lessonStore.masteredWords = newState.masteredWords
        }
        if (newState.favorites) {
          lessonStore.favorites = newState.favorites
        }

        console.log('Đã đồng bộ dữ liệu từ tab khác thành công!')
      } catch (e) {
        console.error('Lỗi khi parse dữ liệu từ localStorage', e)
      }
    }
  })
})
</script>
