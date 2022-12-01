<template>
	<div id="player-wrapper" @click="segmentCutExpanded = false; playbackSpeedExpanded = false;">
		<span id="loading">Loading...</span>
		<div id="toolbar">
			<div id="sliders" @click="$event.stopPropagation()">
				<Slider v-if="playbackSpeedExpanded" v-model="playbackSpeed" class="no-connect" :min="0.5" :max="1.5" :step="0.01" :format="{ decimals: 1, suffix: 'x' }" />
				<Slider v-if="segmentCutExpanded" v-model="segmentAbsolute" :min="0" :max="vidLength" :step="0.01" :format="{ decimals: 1, suffix: 's' }" />
			</div>
			<div id="buttons">
				<div class="toolbar-item">
					<button @click="router.go(-1)" class="material-symbols-outlined toolbar-button">arrow_back</button>
				</div>
				<div class="toolbar-item">
					<button id="mirror-button" class="material-symbols-outlined toolbar-button"
						:class="{ active: mirrorVid }" @click="mirrorVid = !mirrorVid">flip</button>
				</div>
				<div class="toolbar-item" @click="$event.stopPropagation()">
					<button id="speed-button"
						class="material-symbols-outlined toolbar-button"
						:class="{ active: playbackSpeedExpanded }"
						@click="playbackSpeedExpanded = !playbackSpeedExpanded; segmentCutExpanded = false">speed</button>
				</div>
				<div class="toolbar-item" @click="$event.stopPropagation()">
					<button id="cut-button"
					class="material-symbols-outlined toolbar-button"
					:class="{ active: segmentCutExpanded }"
					@click="segmentCutExpanded = !segmentCutExpanded; playbackSpeedExpanded = false;">cut</button>
				</div>
				<div class="toolbar-item">
					<button id="play-pause-button" class="material-symbols-outlined toolbar-button"
						@click="isPlaying = !isPlaying">{{ isPlaying ? 'pause' : 'play_arrow' }}</button>
				</div>
			</div>
		</div>
		<video id="player" ref="player"
			v-if="route.params.url != ''" :src="route.params.url"
			:class="{ mirrored: mirrorVid }" @loadedmetadata="vidLength = $event.target.duration" loop :playbackRate="playbackSpeed"
			preload="auto" />
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

const router = useRouter()
const route = useRoute()

const mirrorVid = ref(true)
const paused = ref(false)
const playbackSpeed = ref(1.0)
const playbackSpeedExpanded = ref(false)
const segmentCutExpanded = ref(false)
const vidLength = ref(60)
const isPlaying = ref(false)

const segmentAbsolute = ref([0, 10000000])

watch(isPlaying, (to, from) => {
	if (to) player.play()
	else player.pause()
})

watch(segmentAbsolute, (to, from) => {
	player.pause()
	if (to[0] == from[0]) {
		player.currentTime = to[1] - 1 
	} else {
		player.currentTime = to[0]
	}
	if (isPlaying.value) player.play()
})

onMounted(() => {
	player.addEventListener('timeupdate', e => {
		if (player.currentTime > segmentAbsolute.value[1]) {
			player.pause()
			player.currentTime = segmentAbsolute.value[0]
			player.play()
		}
	})
})

</script>

<style lang="scss">
@import '../styles/vars.scss';
$text-shadow: 0px 0px 8px rgba($acc-color, 1);

#player-wrapper {
	width: 100%;
	height: 100%;
	z-index: -1;
}

video#player {
	min-height: 100%;
	width: 100%;
	&.mirrored {
		-moz-transform: scale(-1, 1);
		-webkit-transform: scale(-1, 1);
		-o-transform: scale(-1, 1);
		-ms-transform: scale(-1, 1);
		transform: scale(-1, 1);
	}
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
		justify-content: space-evenly;
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

.toolbar-button {
	border: 0;
	outline: 0;
	background: 0;
	font-size: 2.7em;
	color: white;
	text-decoration: none;
	padding: .3em;
	margin: .2em;
	border-radius: 50%;
	cursor: pointer;

	&:hover, &.active {
		background: rgba(0, 0, 0, 0.15);
		background-blend-mode: lighten;
	}
}

.toolbar-item {
	* {
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
