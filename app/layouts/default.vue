<template>
  <div class="flex h-screen bg-[#0f1115] text-slate-200 overflow-hidden">
    <aside class="w-72 border-r border-slate-800 shrink-0">
      <LayoutSidebar />
    </aside>

    <main class="flex-1 flex flex-col relative overflow-hidden">
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
    <Transition
      enter-active-class="transform transition duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transform transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <LayoutPlayerBar v-if="lessonStore.activeTab === 'Transcript'" />
    </Transition>
    </main>
  </div>
</template>
<script setup lang="ts">
const lessonStore = useLessonStore()
</script>