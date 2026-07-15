import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('../views/HomeView.vue')
const CategoryView = () => import('../views/CategoryView.vue')
const MapView = () => import('../views/MapView.vue')
const CommunityListView = () => import('../views/CommunityListView.vue')
const PostDetailView = () => import('../views/PostDetailView.vue')
const PostCreateView = () => import('../views/PostCreateView.vue')
const PostEditView = () => import('../views/PostEditView.vue')

const routes = [
	{ path: '/', name: 'Home', component: HomeView },
	{ path: '/category/:id', name: 'Category', component: CategoryView },
	{ path: '/map', name: 'Map', component: MapView },
	{ path: '/community', name: 'Community', component: CommunityListView },
	{ path: '/community/:board', name: 'CommunityBoard', component: CommunityListView },
	{ path: '/post/new', name: 'PostCreate', component: PostCreateView },
	{ path: '/post/:id/edit', name: 'PostEdit', component: PostEditView },
	{ path: '/post/:id', name: 'PostDetail', component: PostDetailView }
]

const router = createRouter({ history: createWebHistory(), routes })

export default router
