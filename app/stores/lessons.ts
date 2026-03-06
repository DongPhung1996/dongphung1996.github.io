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
  lessons: Lesson[]
  currentLessonId: number | null
  favorites: number[] // Lưu danh sách ID các bài học được đánh sao
  lastPlayedId: number | null
  isLoading: boolean
}

// 2. Khởi tạo Store
export const useLessonStore = defineStore('lessonStore', {
  state: (): LessonState => ({
    lessons: [],
    currentLessonId: null,
    favorites: [],
    lastPlayedId: null,
    isLoading: false
  }),

  // Tự động lưu vào LocalStorage (Yêu cầu cài pinia-plugin-persistedstate)
 persist: {
    key: 'my-english-pod-storage',
    storage: 'localStorage',
    paths: ['currentLessonId', 'favorites', 'lastPlayedId']
  },

  getters: {
    // Lấy thông tin chi tiết bài học đang chọn
    activeLesson: (state): Lesson | undefined => {
      // Thêm kiểm tra Array.isArray để tránh lỗi "is not a function"
      if (!Array.isArray(state.lessons)) return undefined
      return state.lessons.find((l) => l.id === state.currentLessonId)
    },

    // Kiểm tra bài học có được đánh sao không
    isFavorite: (state) => (id: number): boolean => {
      return state.favorites.includes(id)
    },

    // Lọc danh sách bài học yêu thích
    favoriteLessons: (state): Lesson[] => {
      return state.lessons.filter((l) => state.favorites.includes(l.id))
    }
  },

  actions: {
    // Gọi dữ liệu từ file JSON
    async fetchLessons(): Promise<void> {
      this.isLoading = true
      try {
        const data = await $fetch<Lesson[]>('/data/lessons.json');
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

    // Chọn bài học mới
    setCurrentLesson(id: number): void {
      this.currentLessonId = id
      this.lastPlayedId = id
    },

    // Bật/Tắt trạng thái yêu thích
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