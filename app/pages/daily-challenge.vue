<script setup lang="ts">
const { data: dailyWords, pending } = await useFetch('/api/daily')
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Thử thách ngày {{ new Date().toLocaleDateString() }}</h1>
    <div v-if="pending" class="text-center py-10">Đang chuẩn bị đề bài...</div>

    <div v-else>
      <LayoutExercise :data="dailyWords" />
    </div>
  </div>
</template>
