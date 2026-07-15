import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const postDetailMatch = req.url?.match(/^\/posts\/(\d+)(\?.*)?$/)
        if (postDetailMatch) {
          const mockPosts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mock/posts.json'), 'utf8'))
          const postId = Number(postDetailMatch[1])
          const foundPost = mockPosts.posts.find((post) => Number(post.postId) === postId)

          if (!foundPost) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: '게시글을 찾을 수 없습니다.' }))
            return
          }

          const response = {
            postId: foundPost.postId,
            contentTypeId: foundPost.contentTypeId,
            title: foundPost.title,
            content: foundPost.content,
            likeCount: foundPost.likeCount,
            viewCount: foundPost.viewCount,
            createdAt: foundPost.createdAt || foundPost.createAt || ''
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(response))
          return
        }

        if (req.url?.startsWith('/locations')) {
          const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mock/db.json'), 'utf8'))
          const url = new URL(req.url, 'http://localhost')
          const contentTypeId = Number(url.searchParams.get('contentTypeId') || 12)
          const areaCode = Number(url.searchParams.get('areaCode'))
          const sigunguCode = Number(url.searchParams.get('sigunguCode'))

          const locations = db.locations.filter((item) => {
            const matchesContentType = Number(item.contentTypeId ?? 12) === contentTypeId
            const matchesAreaCode = Number.isNaN(areaCode) || Number(item.areaCode) === areaCode
            const matchesSigunguCode = Number.isNaN(sigunguCode) || Number(item.sigunguCode) === sigunguCode
            return matchesContentType && matchesAreaCode && matchesSigunguCode
          })

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ locations }))
          return
        }

        if (req.url?.startsWith('/posts')) {
          const mockPosts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mock/posts.json'), 'utf8'))
          const url = new URL(req.url, 'http://localhost')
          const keyword = url.searchParams.get('keyword') || '최신순'
          const contentTypeId = Number(url.searchParams.get('contentTypeId'))
          const size = Number(url.searchParams.get('size') || 10)
          const posts = [...mockPosts.posts]

          const filteredPosts = posts.filter((post) => {
            if (Number.isNaN(contentTypeId)) return true
            return Number(post.contentTypeId) === contentTypeId
          })

          if (keyword === '추천순') {
            filteredPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
          } else {
            filteredPosts.sort((a, b) => new Date(b.createAt || 0) - new Date(a.createAt || 0))
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            posts: filteredPosts.slice(0, size),
            nextCursor: mockPosts.nextCursor,
            message: mockPosts.message
          }))
          return
        }

        next()
      })
    }
  }],
})
