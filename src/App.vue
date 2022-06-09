<template>
  <div id="app">
    <vue-piano :octave-count="3" />
  </div>
</template>

<script>
import VuePiano from './components/VuePiano.vue'

export default {
  name: 'App',
  components: {
    VuePiano: VuePiano
  }
}
</script>

<style>
</style>
