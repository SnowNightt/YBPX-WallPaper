import { defineStore } from 'pinia'
import { configType } from './type'
import { ref } from 'vue'
export default defineStore(
  'config',
  () => {
    const config = ref<configType>({
      url: '',
      imageSaveDirectory: 'dddd',
      likeList: [],
      homeImageUrl: '',
      searchImages: [],
      key: '',
      currentPage: 1,
      total: 0
    })

    return { config }
  },
  {
    // persist: true
    persist: {
      paths: ['url', 'imageSaveDirectory', 'likeList', 'searchImages', 'currentPage', 'total']
    }
  }
)
