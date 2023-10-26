<template>
  <div id="wrapper">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transitionName">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
setVh();
window.addEventListener("resize", setVh);
</script>

<style scoped lang="scss">
#wrapper {
  position: relative;
  height: calc(100 * var(--vh));
  width: auto;
  display: inline-block;
  max-width: 60vh;
}
</style>
