<template>
	<div id="player-wrapper" ref="playerWrapper" @click="segmentCutExpanded = false; playbackSpeedExpanded = false;">
		<span id="loading">Loading...</span>
		<div id="top-buttons">
			<button @click="router.go(-1)" class="material-symbols-outlined ui-btn">arrow_back</button>
			<button @click="toggleFullscreen" class="material-symbols-outlined ui-btn" v-if="!isIPhone">
				{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</button>
			<div v-else></div>
		</div>
		<div id="toolbar">
			<div id="sliders" @click="$event.stopPropagation()">
				<Slider v-if="playbackSpeedExpanded" v-model="playbackSpeed" class="no-connect" :min="0.5" :max="1.5" :step="0.01" :format="{ decimals: 1, suffix: 'x' }" />
				<Slider v-if="segmentCutExpanded" v-model="segmentAbsolute" :min="0" :max="vidLength" :step="0.01" :format="{ decimals: 1, suffix: 's' }" />
			</div>
			<div id="buttons">
				<div class="toolbar-item">
					<button id="mirror-button" class="material-symbols-outlined ui-btn"
						:class="{ active: mirrorVid }" @click="mirrorVid = !mirrorVid">flip</button>
				</div>
				<div class="toolbar-item" @click="$event.stopPropagation()">
					<button id="speed-button"
						class="material-symbols-outlined ui-btn"
						:class="{ active: playbackSpeedExpanded }"
						@click="playbackSpeedExpanded = !playbackSpeedExpanded; segmentCutExpanded = false">speed</button>
				</div>
				<div class="toolbar-item" @click="$event.stopPropagation()">
					<button id="cut-button"
					class="material-symbols-outlined ui-btn"
					:class="{ active: segmentCutExpanded }"
					@click="segmentCutExpanded = !segmentCutExpanded; playbackSpeedExpanded = false;">cut</button>
				</div>
				<div class="toolbar-item">
					<button id="play-pause-button" class="material-symbols-outlined ui-btn"
						@click="isPlaying = !isPlaying">{{ isPlaying ? 'pause' : 'play_arrow' }}</button>
				</div>
			</div>
		</div>
		<video id="player" ref="player" playsinline
			v-if="route.params.url != ''" :src="route.params.url + '#t=0.1'"
			:class="{ mirrored: mirrorVid }" @loadedmetadata="vidLength = $event.target.duration" loop :playbackRate="playbackSpeed"
			preload="auto" />
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, watchEffect, defineExpose } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

const isIPhone = !!navigator.platform && /iPhone/.test(navigator.platform)

const router = useRouter()
const route = useRoute()

const mirrorVid = ref(true)
const paused = ref(false)
const playbackSpeed = ref(1.0)
const playbackSpeedExpanded = ref(false)
const segmentCutExpanded = ref(false)
const vidLength = ref(60)
const isPlaying = ref(false)
const isFullscreen = ref(false)

const segmentAbsolute = ref([0, 10000000])

watch(isPlaying, (to, from) => {
	if (to) player.value.play()
	else player.value.pause()
})

const player = ref(null)
const playerWrapper = ref(null)

defineExpose({ player, playerWrapper })

watch(segmentAbsolute, (to, from) => {
	player.value.pause()
	if (to[0] == from[0]) {
		player.value.currentTime = to[1] - 1 
	} else {
		player.value.currentTime = to[0]
	}
	if (isPlaying.value) player.value.play()
})

onMounted(() => {
	player.value.addEventListener('timeupdate', e => {
		if (player.value.currentTime > segmentAbsolute.value[1]) {
			player.value.pause()
			player.value.currentTime = segmentAbsolute.value[0]
			player.value.play()
		}
	})
})

function requestFullscreen(element) {
	const requestMethod = element.requestFullScreen ||
		element.webkitRequestFullScreen || element.mozRequestFullScreen ||
		element.msRequestFullscreen

	requestMethod.call(element)
}
function exitFullscreen() {
	const exitMethod = document.exitFullscreen || document.webkitExitFullscreen ||
		document.mozCancelFullscreen || document.msExitFullscreen
	exitMethod.call(document)
}

const toggleFullscreen = () => {
	if (!isFullscreen.value)
		requestFullscreen(playerWrapper.value)
	else
		exitFullscreen()

	isFullscreen.value = !isFullscreen.value

}
</script>

<style lang="scss">
@import '../styles/vars.scss';
$text-shadow: 0px 0px 8px rgba($acc-color, 1);

#player-wrapper {
	width: 100%;
	height: 100%;
	z-index: -1;
	display: flex;
	align-items: center;
}

video#player {
	height: 100%;
	width: 100%;
	&.mirrored {
		-moz-transform: scale(-1, 1);
		-webkit-transform: scale(-1, 1);
		-o-transform: scale(-1, 1);
		-ms-transform: scale(-1, 1);
		transform: scale(-1, 1);
	}
}

#top-buttons {
	z-index: 1;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 1em;
}

#toolbar {
	z-index: 1;
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	#buttons {
		display: flex;
		width: 100%;
		justify-content: space-between;
		padding: 1em;
	}
	#sliders {
		width: 100%;
		padding: 1.5em 3em;
		
		--slider-connect-bg: #{$acc-color};
		--slider-handle-shadow-active: none;
		--slider-handle-shadow: none;
		--slider-height: 12px;
		--slider-handle-width: 23px;
		--slider-handle-height: 23px;
		--slider-tooltip-bg: #{$acc-color};

		.slider-base {
			box-shadow: 0px 0px 2px rgba($acc-color, 0.4);
		}

		.no-connect {
			--slider-connect-bg: none;
		}
	}
}

.ui-btn {
	border: 0;
	outline: 0;
	background: 0;
	font-size: 2.3em;
	color: white;
	text-decoration: none;
	padding: .2em;
	margin: .2em;
	border-radius: 50%;
	cursor: pointer;

	&.active {
		background: rgba(0, 0, 0, 0.15);
		background-blend-mode: lighten;
	}

	@media (hover: hover) {
		&:hover {
			background: rgba(0, 0, 0, 0.15);
			background-blend-mode: lighten;
		}
	}
}

.toolbar-item, .ui-btn {
	&, * {
		text-shadow: $text-shadow;
	}
}

#loading {
	position: absolute;
	transform: translate(-50%, -50%);
	top: 50%;
	left: 50%;
	z-index: -1;
	color: white;
	font-size: 2em;
	font-weight: bold;
}
</style>
