import { defineStore } from 'pinia'
import { IUserInfo } from './type'
import { reactive } from 'vue'

export default defineStore(
  'user',
  () => {
    const userInfo = reactive<IUserInfo>({
      username: '',
      id: ''
    })
    return { userInfo }
  },
  {
    persist: true
  }
)
