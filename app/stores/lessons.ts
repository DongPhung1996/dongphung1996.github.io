import { defineStore } from 'pinia'

// 1. Định nghĩa các Interface cho Type Safety
export interface Vocabulary {
  word: string
  meaning: string
  example: string
}

export interface TranscriptLine {
  speaker: string
  text: string
}

export interface Language {
  vi: string
  en: string
}

export interface Sentences {
  category: string
  list: Language[]
}

export interface Lesson {
  id: number
  title: string
  level: 'Elementary' | 'Intermediate' | 'Advanced'
  audioUrl: string
  transcript: TranscriptLine[]
  vocabulary: Vocabulary[]
  sample_sentences: Sentences[]
}

interface LessonState {
  activeTab: string
  lessons: Lesson[]
  currentLessonId: number | null
  favorites: number[]
  lastPlayedId: number | null
  isLoading: boolean
  masteredWordsByLesson: Record<number, string[]>
}

// 2. Khởi tạo Store
export const useLessonStore = defineStore('lessonStore', {
  state: (): LessonState => ({
    activeTab: 'Transcript',
    lessons: [],
    currentLessonId: null,
    favorites: [],
    lastPlayedId: null,
    isLoading: false,
    masteredWordsByLesson: {}
  }),

  // Tự động lưu vào LocalStorage (Yêu cầu cài pinia-plugin-persistedstate)
  persist: {
    key: 'my-english-pod-storage',
    syncTab: true,
    // storage: 'localStorage',
    paths: ['currentLessonId', 'favorites', 'lastPlayedId', 'masteredWordsByLesson']
  },

  getters: {
    // Lấy thông tin chi tiết bài học đang chọn
    activeLesson: (state): Lesson | undefined => {
      if (!Array.isArray(state.lessons)) return undefined
      return state.lessons.find((l) => l.id === state.currentLessonId)
    },
    activeLessonProgress: (state): number => {
      const lessonId = state.currentLessonId
      if (!lessonId || !state.lessons.length) return 0

      const lesson = state.lessons.find((l) => l.id === lessonId)
      const masteredInLesson = state.masteredWordsByLesson[lessonId] || []

      if (!lesson || !lesson.vocabulary.length) return 0

      return Math.round((masteredInLesson.length / lesson.vocabulary.length) * 100)
    },
    // MỚI: Tính tổng số từ vựng từ tất cả các bài học (hoặc bài hiện tại)
    totalVocabularyCount: (state): number => {
      return state.lessons.reduce((acc, lesson) => acc + lesson.vocabulary.length, 0)
    },

    // MỚI: Tính phần trăm tiến độ dựa trên số từ đã thuộc
    progressPercentage: (state): number => {
      const total = state.lessons.reduce((acc, lesson) => acc + (lesson.vocabulary?.length || 0), 0)

      if (total === 0 || state.masteredWords.length === 0) return 0

      const percent = Math.round((state.masteredWords.length / total) * 100)

      return percent > 100 ? 100 : percent
    },

    // Kiểm tra bài học có được đánh sao không
    isFavorite:
      (state) =>
      (id: number): boolean => {
        return state.favorites.includes(id)
      },

    // Lọc danh sách bài học yêu thích
    favoriteLessons: (state): Lesson[] => {
      return state.lessons.filter((l) => state.favorites.includes(l.id))
    }
  },

  actions: {
    async fetchLessons(): Promise<void> {
      this.isLoading = true
      try {
        const data = await $fetch<Lesson[]>('/data/lessons.json')
        console.log('data', data)
        console.log(Array.isArray(data))
        if (data && Array.isArray(data)) {
          this.lessons = data
        } else {
          this.lessons = []
        }
        this.currentLessonId = this.lessons[0].id

        // Khôi phục ID bài học
        if (this.lastPlayedId && !this.currentLessonId) {
          this.currentLessonId = this.lastPlayedId
        }
      } catch (error) {
        console.error('Failed to load lessons:', error)
        this.lessons = []
      } finally {
        this.isLoading = false
      }
    },

    markAsMastered(word: string): void {
      const lessonId = this.currentLessonId
      if (!lessonId) return

      // Khởi tạo mảng cho bài học nếu chưa có
      if (!this.masteredWordsByLesson[lessonId]) {
        this.masteredWordsByLesson[lessonId] = []
      }

      // Thêm từ vào đúng "ngăn" của bài học đó
      if (!this.masteredWordsByLesson[lessonId].includes(word)) {
        this.masteredWordsByLesson[lessonId].push(word)
      }
    },

    setActiveTab(tabName: string): void {
      this.activeTab = tabName
    },

    setCurrentLesson(id: number): void {
      this.currentLessonId = id
      this.lastPlayedId = id
    },

    toggleFavorite(id: number): void {
      const index = this.favorites.indexOf(id)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(id)
      }
    }
  }
})
