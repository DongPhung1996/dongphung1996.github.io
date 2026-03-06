<template>
  <div v-if="lessonStore.activeLesson" class="max-w-4xl mx-auto p-8 pb-32">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-black text-white tracking-tight">
          {{ lessonStore.activeLesson.title }}
        </h1>
        <p class="text-slate-500 mt-2 font-medium">{{ lessonStore.activeLesson.level }} Episode</p>
      </div>
      <button 
        @click="lessonStore.toggleFavorite(lessonStore.activeLesson.id)"
        class="group p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-white/5 transition-all"
      >
        <Icon 
          :name="lessonStore.isFavorite(lessonStore.activeLesson.id) ? 'lucide:star' : 'lucide:star'" 
          :class="lessonStore.isFavorite(lessonStore.activeLesson.id) ? 'text-yellow-400' : 'text-slate-600'"
          :fill="lessonStore.isFavorite(lessonStore.activeLesson.id) ? 'currentColor' : 'none'"
          size="24"
        />
      </button>
    </div>

    <div class="flex gap-2 p-1 bg-slate-900/50 rounded-xl w-fit mb-8 border border-white/5">
      <button 
        v-for="tab in ['Transcript', 'Vocabulary', 'Sample Sentences', 'Exercises']"
        :key="tab"
        @click="setTab(tab)"
        :class="[
          'px-6 py-2 rounded-lg text-sm font-bold transition-all',
          lessonStore.activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <div class="transition-all duration-300">
      <div v-if="lessonStore.activeTab === 'Transcript'">
        <LessonTranscript :lesson="lessonStore.activeLesson" />
      </div>

      <div v-if="lessonStore.activeTab === 'Vocabulary'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="item in lessonStore.activeLesson.vocabulary" 
          :key="item.word"
          class="p-5 bg-[#16181d] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-colors group"
        >
          <div class="flex items-center gap-2 mb-2">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span class="text-blue-400 font-black text-lg">{{ item.word }} - <span class="text-blue-300">{{ item.ipa }}</span></span>
          </div>
          <p class="text-slate-300 text-sm font-medium leading-relaxed">{{ item.meaning }}</p>
          <div class="mt-4 p-3 bg-black/20 rounded-lg">
            <p class="text-xs text-slate-400 italic">"{{ item.example }}"</p>
          </div>
        </div>
      </div>

      <div v-if="lessonStore.activeTab === 'Sample Sentences'" class="bg-[#16181d] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <Icon name="lucide:quote" size="80" />
        </div>
        <p class="text-slate-300 leading-loose text-lg font-serif italic relative z-10">
          <LayoutSampleSentences :data="lessonStore.activeLesson.sample_sentences" />
        </p>
      </div>

      <div v-if="lessonStore.activeTab === 'Exercises'" class="bg-[#10172a] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <LayoutExercise :key="Date.now()" :data="lessonStore.activeLesson.exercises" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const lessonStore = useLessonStore()
// const activeTab = ref('Transcript')
const setTab = (tab) => {
  lessonStore.setActiveTab(tab)
}
</script>