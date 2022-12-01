<template>
	<div id="wrapper">
		<h1>Title</h1>
		<p>Paste a TikTok link to get started</p>
		<div id="input-wrapper">
			<input type="text" id="link-input" @input="debounce(() => { ttlink = $event.target.value }, 1000)" placeholder="tiktok.com/..." />
			<button id="paste-button" class="material-symbols-outlined" @click="paste">content_paste</button>
			<router-link :to="'/' + CDNLink" id="arrow-button" :disabled="CDNLink == ''">
				<span v-if="!loading" class="material-symbols-outlined">arrow_forward</span>
				<span v-else class="spinner"></span>
			</router-link>
		</div>
		<p v-if="message != ''" class="error">{{ message }}</p>
	</div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const ttlink = ref('')
const CDNLink = ref('')
const loading = ref(false)
const message = ref('')

function createDebounce() {
	let timout = null
	return (fn, delay) => {
		clearTimeout(timout)
		timout = setTimeout(fn, delay)
	}
}

const debounce = createDebounce()

watchEffect(async () => {
	if (ttlink.value == '')
		return

	loading.value = true;
	message.value = ''

	const r = await tryGetLink()

	loading.value = false
	if (!r) {
		message.value = 'Couldn\'t find video. Are you sure this is a valid TikTok link?' 
		return
	}
	CDNLink.value = await r.text()
})

async function paste() {
	ttlink.value = await navigator.clipboard.readText()
}

// Retry fetching link in case of rate limiting
async function tryGetLink(depth = 2) {
	const url = (import.meta.env.DEV ? 'http://localhost:9999/' : '') + `.netlify/functions/cors-bypass/?url=${ttlink.value}`
	const r = await fetch(url, {
		method: 'POST',
	})

	if (r.status != 200) {
		console.error('failed to fetch CDN link')
		if (depth == 1) {
			return null
		}
		else {
			return await new Promise((res) => setTimeout(() => res(), 3000)).then(() => tryGetLink(depth - 1))
		}
	}
	return r
}
</script>

<style scoped lang="scss">
@import '../styles/vars.scss';

#wrapper {
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
		background-color: $acc-color;
	}

	&[disabled="true"] {
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

p.error {
	color: #b55;
}
</style>
