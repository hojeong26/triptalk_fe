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
        const postLikeMatch = req.url?.match(/^\/posts\/(\d+)\/likes(\?.*)?$/)
        if (req.method === 'POST' && postLikeMatch) {
          try {
            const postId = Number(postLikeMatch[1])
            const mockPostsPath = path.resolve(__dirname, 'mock/posts.json')
            const mockPosts = JSON.parse(fs.readFileSync(mockPostsPath, 'utf8'))
            const targetIndex = mockPosts.posts.findIndex((post) => Number(post.postId) === postId)

            if (targetIndex < 0) {
              res.statusCode = 404
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ message: '게시글을 찾을 수 없습니다.' }))
              return
            }

            const currentLikeCount = Number(mockPosts.posts[targetIndex].likeCount || 0)
            const nextLikeCount = currentLikeCount + 1
            mockPosts.posts[targetIndex] = {
              ...mockPosts.posts[targetIndex],
              likeCount: nextLikeCount
            }

            fs.writeFileSync(mockPostsPath, JSON.stringify(mockPosts, null, 2), 'utf8')

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              postId,
              likeCount: nextLikeCount,
              message: '좋아요 반영 성공'
            }))
          } catch (error) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: '좋아요 처리에 실패했습니다.' }))
          }
          return
        }

        const verifyPasswordMatch = req.url?.match(/^\/posts\/(\d+)\/verify-password(\?.*)?$/)
        if (req.method === 'POST' && verifyPasswordMatch) {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })

          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}')
              const inputPassword = String(payload.password || '').trim()
              const postId = Number(verifyPasswordMatch[1])
              const mockPosts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mock/posts.json'), 'utf8'))
              const foundPost = mockPosts.posts.find((post) => Number(post.postId) === postId)

              if (!foundPost) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ verified: false, message: '게시글을 찾을 수 없습니다.' }))
                return
              }

              const savedPassword = String(foundPost.password || '1234')
              const verified = inputPassword === savedPassword

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                verified,
                message: verified ? '비밀번호 검증 성공' : '비밀번호가 일치하지 않습니다.'
              }))
            } catch (error) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ verified: false, message: '요청 본문 파싱에 실패했습니다.' }))
            }
          })
          return
        }

        const postUpdateMatch = req.url?.match(/^\/posts\/(\d+)(\?.*)?$/)
        if (req.method === 'DELETE' && postUpdateMatch) {
          try {
            const postId = Number(postUpdateMatch[1])
            const mockPostsPath = path.resolve(__dirname, 'mock/posts.json')
            const mockPosts = JSON.parse(fs.readFileSync(mockPostsPath, 'utf8'))
            const targetIndex = mockPosts.posts.findIndex((post) => Number(post.postId) === postId)

            if (targetIndex < 0) {
              res.statusCode = 404
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ message: '게시글을 찾을 수 없습니다.' }))
              return
            }

            mockPosts.posts.splice(targetIndex, 1)
            fs.writeFileSync(mockPostsPath, JSON.stringify(mockPosts, null, 2), 'utf8')

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: '게시글 삭제 성공' }))
          } catch (error) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: '게시글 삭제 처리에 실패했습니다.' }))
          }
          return
        }

        if (req.method === 'PUT' && postUpdateMatch) {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })

          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}')
              const title = String(payload.title || '').trim()
              const content = String(payload.content || '').trim()
              const postId = Number(postUpdateMatch[1])

              if (!title || !content) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: '요청 값이 올바르지 않습니다.' }))
                return
              }

              const mockPostsPath = path.resolve(__dirname, 'mock/posts.json')
              const mockPosts = JSON.parse(fs.readFileSync(mockPostsPath, 'utf8'))
              const targetIndex = mockPosts.posts.findIndex((post) => Number(post.postId) === postId)

              if (targetIndex < 0) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: '게시글을 찾을 수 없습니다.' }))
                return
              }

              mockPosts.posts[targetIndex] = {
                ...mockPosts.posts[targetIndex],
                title,
                content
              }

              fs.writeFileSync(mockPostsPath, JSON.stringify(mockPosts, null, 2), 'utf8')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ message: '게시글 수정 성공' }))
            } catch (error) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ message: '요청 본문 파싱에 실패했습니다.' }))
            }
          })
          return
        }

        if (req.method === 'POST' && req.url === '/posts') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })

          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}')
              const title = String(payload.title || '').trim()
              const content = String(payload.content || '').trim()
              const password = String(payload.password || '').trim()
              const contentTypeId = Number(payload.contentTypeId)

              if (!title || !content || !password || Number.isNaN(contentTypeId)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: '요청 값이 올바르지 않습니다.' }))
                return
              }

              const mockPosts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mock/posts.json'), 'utf8'))
              const nextPostId = (mockPosts.posts[mockPosts.posts.length - 1]?.postId || 0) + 1
              const createdPost = {
                postId: nextPostId,
                contentTypeId,
                title,
                content,
                password,
                likeCount: 0,
                createAt: new Date().toISOString(),
                viewCount: 0
              }

              mockPosts.posts.push(createdPost)
              fs.writeFileSync(path.resolve(__dirname, 'mock/posts.json'), JSON.stringify(mockPosts, null, 2), 'utf8')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                postId: nextPostId,
                message: '게시글 생성 성공'
              }))
            } catch (error) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ message: '요청 본문 파싱에 실패했습니다.' }))
            }
          })
          return
        }

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
