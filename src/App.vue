<template>
	<router-view v-slot="{ Component, route }">
		<transition name="slide">
			<component :is="Component" />
		</transition>
	</router-view>
</template>
