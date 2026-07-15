import { defineStore } from 'pinia'

export const useCommunityStore = defineStore('community', {
  state: () => ({ posts: [] }),
  actions: {
    setPosts(list) { this.posts = list }
  }
})
