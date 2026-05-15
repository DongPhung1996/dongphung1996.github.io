<template>
  <div class="p-4 flex flex-col h-full">
    <div class="flex items-center gap-2 mb-6 px-2">
      <div
        class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20"
      >
        <Icon name="lucide:headphones" class="text-white text-lg" />
      </div>
      <div>
        <h1 class="text-lg font-bold text-white leading-none">EnglishPod</h1>
        <p class="text-[10px] text-slate-500 mt-1">Learn English 300+</p>
      </div>
    </div>

    <div class="relative mb-6 px-2">
      <Icon
        name="lucide:search"
        class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search episodes..."
        class="w-full bg-[#1a1d23] border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
      />
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar space-y-1 px-2">
      <button
        v-for="lesson in filteredLessons"
        :key="lesson.id"
        :class="[
          'w-full flex items-center gap-4 p-3 rounded-xl transition-all group',
          lessonStore.currentLessonId === lesson.id
            ? 'bg-[#1e232d] border border-slate-700'
            : 'hover:bg-slate-800/30 border border-transparent'
        ]"
        @click="lessonStore.setCurrentLesson(lesson.id)"
      >
        <span class="text-xs font-medium text-slate-600 w-4">{{ lesson.id }}</span>
        <div class="text-left flex-1">
          <p
            :class="[
              'text-sm font-medium',
              lessonStore.currentLessonId === lesson.id ? 'text-blue-400' : 'text-slate-300'
            ]"
          >
            {{ lesson.title }}
          </p>
          <p class="text-[11px] text-slate-500">{{ lesson.level }}</p>
        </div>
        <Icon
          v-if="lessonStore.currentLessonId === lesson.id"
          name="lucide:play-circle"
          class="text-blue-500 text-lg"
        />
      </button>
    </div>
    <div class="flex flex-col p-4">
      <div class="mt-auto pt-6 border-t border-slate-800">
        <div class="flex justify-between text-xs mb-2">
          <span>Tiến độ học tập</span>
          <span>%</span>
        </div>
        <div v-for="lesson in lessonStore.lessons" :key="lesson.id" class="lesson-item">
          <div class="flex justify-between items-center">
            <span>{{ lesson.title }}</span>
            <span class="text-[10px] text-green-400"> {{ getLessonProgress(lesson.id) }}% </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const lessonStore = useLessonStore()
const searchQuery = ref('')
const filteredLessons = computed(() => {
  if (!searchQuery.value) return lessonStore.lessons

  return lessonStore.lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      lesson.level.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
// Hàm bổ trợ để lấy tiến độ của bất kỳ bài học nào
const getLessonProgress = (id) => {
  const lesson = lessonStore.lessons.find((l) => l.id === id)
  const mastered = lessonStore.masteredWordsByLesson[id] || []
  if (!lesson || !lesson.vocabulary.length) return 0
  return Math.round((mastered.length / lesson.vocabulary.length) * 100)
}
</script>

<style scoped>
/* Làm đẹp thanh cuộn cho Sidebar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #2d333d;
  border-radius: 10px;
}
</style>
