<template>
	<div id="player-wrapper" @click="segmentCutExpanded = false; playbackSpeedExpanded = false;">
		<div id="toolbar">
			<div id="sliders" @click="$event.stopPropagation()">
				<div class="slider" v-if="playbackSpeedExpanded">
					<input type="range" min="0.1" max="2" step="0.01" v-model="playbackSpeed">
					<span class="slider-value">{{ playbackSpeed }}x</span>
				</div>
				<div class="slider dual-slider" v-if="segmentCutExpanded">
					<input type="range" min="0" max="0.8" step="0.01" v-model="segmentA">
					<input type="range" min="0.2" max="1" step="0.01" v-model="segmentB">
				</div>
			</div>
			<div id="buttons">
				<div class="toolbar-item">
					<router-link to="/" class="material-symbols-outlined toolbar-button">arrow_back</router-link>
				</div>
				<div class="toolbar-item">
					<button id="mirror-button" class="material-symbols-outlined toolbar-button"
						:class="{ active: mirrorVid }" @click="mirrorVid = !mirrorVid">flip</button>
				</div>
				<div class="toolbar-item" @click="$event.stopPropagation()">
					<button id="speed-button"
						class="material-symbols-outlined toolbar-button"
						@click="playbackSpeedExpanded = !playbackSpeedExpanded">speed</button>
				</div>
				<div class="toolbar-item" @click="$event.stopPropagation()">
					<button id="cut-button"
					class="material-symbols-outlined toolbar-button"
					@click="segmentCutExpanded = !segmentCutExpanded">cut</button>
				</div>
				<div class="toolbar-item">
					<button id="play-pause-button" class="material-symbols-outlined toolbar-button"
						@click="isPlaying = !isPlaying">{{ isPlaying ? 'pause' : 'play_arrow' }}</button>
				</div>
			</div>
		</div>
		<video id="player" ref="player"
			v-if="route.params.url != ''" :src="route.params.url + `#t=${segmentAbsolute[0]},${segmentAbsolute[1]}`"
			:class="{ mirrored: mirrorVid }" @loadedmetadata="vidLength = $event.target.duration" loop :playbackRate="playbackSpeed" />
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const mirrorVid = ref(true)
const paused = ref(false)
const playbackSpeed = ref(1.0)
const playbackSpeedExpanded = ref(false)
const segmentA = ref(0.0)
const segmentB = ref(1.0)
const segmentCutExpanded = ref(false)
const vidLength = ref(60)
const isPlaying = ref(false)

const segmentRelative = computed(() => [Math.min(segmentA.value, segmentB.value), Math.max(segmentA.value, segmentB.value)])
const segmentAbsolute = computed(() => segmentRelative.value.map(t => t * vidLength.value))

watch(isPlaying, (to, from) => {
	if (to) player.play()
	else player.pause()
})

onMounted(() => {
})

</script>

<style scoped lang="scss">
#player-wrapper {
	position: fixed;
	top: 0;
	left: 0;
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
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	// display: flex;
	// flex-direction: column;
	// align-items: flex-start;
	#buttons {
		display: flex;
		justify-content: space-evenly;
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
		background: rgba(256, 256, 256, .1);
		background-blend-mode: lighten;
	}
}

.toolbar-item {
	* {
		text-shadow: 2px 2px rgba(100, 100, 100, .3);
	}
}

.sliders {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.slider {
	display: flex;
	align-items: center;
	padding: 1em 0;
}

$track-names: (-webkit-slider-runnable-track, -moz-range-track, -ms-track);
$thumb-names: (-webkit-slider-thumb, -moz-range-thumb, -ms-thumb);

.slider input[type="range"] {
	-webkit-appearance: none !important;
	width: 50vw;
	height: 2px;
	background: white;
	border: none;
	outline: none;

	@for $i from 1 to 3 {
		&::#{nth($track-names, $i)} {
			@extend .slider-track
		}
	}

	@for $i from 1 to 3 {
		&::#{nth($thumb-names, $i)} {
			@extend .slider-thumb
		}
	}
}

.slider-thumb {
	-webkit-appearance: none;
	margin-top: -0.7em;
	box-shadow: 2px 2px rgba(100, 100, 100, .5);
	width: 2em;
	height: 2em;
	border-radius: 50%;
	color: white;
	background: white;
	border: none;
	outline: none;
}

.slider-track {
	-webkit-appearance: none;
	position: relative;
	box-shadow: 2px 2px rgba(100, 100, 100, .5);
	background: white;
	height: 2px;
	pointer-events: none;
}

.slider .slider-value {
	color: white;
	font: sans-serif;
	font-weight: bold;
	font-size: 1.4em
}

.slider.dual-slider {
	position: relative;
}
.slider.dual-slider input[type="range"] {
	position: absolute;
	top: 0;
	left: 0;
	@for $i from 1 to 3 {
		&::#{nth($track-names, $i)} {
			box-shadow: none;
			pointer-events: none;
		}
	}
}
</style>
