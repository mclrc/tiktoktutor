<template>
	<div id="wrapper">
		<h1>Title</h1>
		<div id="input-wrapper">
			<input type="text" id="link-input" v-model="ttlink" placeholder="tiktok.com/..." />
			<button id="paste-button" class="material-symbols-outlined" @click="paste">content_paste</button>
			<router-link :to="'/' + CDNLink" id="arrow-button" :disabled="CDNLink == ''">
				<span v-if="!loading" class="material-symbols-outlined">arrow_forward</span>
				<span v-else class="spinner"></span>
			</router-link>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const ttlink = ref('')
const CDNLink = ref('')
const loading = ref(false)

watchEffect(async () => {
	if (ttlink.value == '')
		return

	loading.value = true;

	const r = await fetch(`http://localhost:9999/.netlify/functions/cors-bypass/?url=${ttlink.value}`, {
		method: 'POST',
	})

	if (r.status != 200) {
		console.error('failed to fetch CDN link')
		loading.value = false
		return
	}

	CDNLink.value = await r.text()
	loading.value = false
})

async function paste() {
	ttlink.value = await navigator.clipboard.readText()
	console.log('called', ttlink.value)
}
</script>

<style scoped lang="scss">
#wrapper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	padding-top: 40%;

	display: flex;
	flex-direction: column;
	align-items: center;

	color: white;
	font-family: sans-serif;
}

#input-wrapper {
	border: 0px solid lightgrey;
	background-color: white;
	border-radius: 9999px;

	display: flex;
	width: 90vw;
	margin: 0 auto;

	overflow: hidden;

	& > * {
		font-size: 1rem;
	}
}

input {
	border: none;
	outline: none;
	background: none;

	display: inline-block;
	width: 100%;
	
	line-height: 1.2;
	padding: 1em 0;
	padding-left: 1.2em;
	
}

button, a {
	background: none;
	font-size: 1.6em !important;
	width: 3.5em;
	border: none;
	outline: none;
	text-decoration: none;

	cursor: pointer;

	display: flex;
	justify-content: center;
	align-items: center;

	&:last-child {
		color: white;
		background-color: #BF1326;
	}

	&:disabled {
		opacity: .8 !important;
	}
}

@keyframes spinner {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.spinner {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.spinner::before {
	animation: 1.5s linear infinite spinner;
	animation-play-state: inherit;

	border: solid 5px rgba(256, 256, 256, 0.3);
	border-bottom-color: white;
	border-radius: 50%;

	content: "";
	height: 20px;
	width: 20px;
}
</style>
