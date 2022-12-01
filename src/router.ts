import { createWebHistory, createRouter } from 'vue-router'
import LinkInput from './routes/LinkInput.vue'
import Player from './routes/Player.vue'

const routes = [
	{
		path: '/',
		name: 'Start',
		component: LinkInput,
	},
	{
		path: '/:url(.*)',
		name: 'Player',
		component: Player,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.afterEach((to, from) => {
	const toDepth = to.path.split('/').length
	const fromDepth = from.path.split('/').length
	to.meta.transitionName = toDepth > fromDepth ? 'slide-left' : 'slide-right'
})

export default router
