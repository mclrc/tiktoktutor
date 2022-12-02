<template>
	<router-view v-slot="{ Component, route }">
		<transition :name="route.meta.transitionName">
			<component :is="Component" />
		</transition>
	</router-view>
</template>

<script setup lang="ts">
function setVh() {
	const vh = window.innerHeight * 0.01
	document.documentElement.style.setProperty('--vh', `${vh}px`)
}
setVh()
window.addEventListener('resize', setVh)
</script>
