<template>
  <div>
    <div class="keys" :style="{ 'height': height, 'width': `${100 + addedMargin}%` }">
      <div class="piano-loader" v-if="loading">
        Loading...
      </div>
      <div v-for="(key, id) in keys" :key="id" class="key"
           :class="{ 'sharp': isSharp(key) }"
           :style="getStyle(key)"
           @mousedown="playNote(key, $event)"
           @mouseup="stopNote(key, $event)"
           @mouseleave="stopNote(key, $event)">
      </div>
    </div>
  </div>
</template>

<script>
import {Piano} from '@tonejs/piano'
import keysHelper from "@/helpers/keys";

export default {
  name: 'VuePiano',
  props: {
    height: {
      type: String,
      default: "350px"
    },
    pianoOptions: {
      type: Object,
      default: null
    },
    octave: {
      type: Number,
      default: 3
    },
    octaveCount: {
      type: Number,
      default: 2
    },
  },
  emits: ["loaded", "keyPlayed"],
  data() {
    return {
      piano: new Piano(this.pianoOptions ?? {velocities: 1}),
      keys: this.setupKeys(),
      loading: true,
      addedMargin: 0
    };
  },
  computed: {
    sharpsCount() {
      return this.keys.filter(key => this.isSharp(key)).length;
    },
    natsCount() {
      return this.keys.length - this.sharpsCount;
    },
    natWidth() {
      return (100 / this.natsCount);
    }
  },
  mounted() {
    const sharps = document.querySelectorAll('.keys .key.sharp').length;

    this.addedMargin = 6 * sharps;

    // Set up piano
    this.piano.toDestination();
    this.piano.load().then(() => {
      this.loading = false;
      this.$emit("loaded");
    });
  },
  methods: {
    playNote(key, event) {
      this.piano.keyDown({note: key});
      this.$emit("keyPlayed", key);

      event.currentTarget.classList.add("pressed");
    },
    stopNote(key, event) {
      this.piano.keyUp({note: key});

      event.currentTarget.classList.remove("pressed");
    },
    ko(key, octave) {
      return key + octave.toString();
    },
    setupKeys() {
      const keysArray = [];

      console.log(keysHelper);

      for(let i = 0; i < this.octaveCount; i++) {
        keysHelper.forEach(key => keysArray.push(this.ko(key, this.octave + i)));
      }

      return keysArray;
    },
    isSharp: (key) => key.includes('#'),
    getStyle(key) {
      const width = this.natWidth * (this.isSharp(key) ? 0.6 : 1);
      return {
        'width': width.toString() + '%',
        'margin': this.isSharp(key) ? `0 -${width / 2}%` : '0',
      }
    }
  }
}
</script>

<style scoped>
.keys {
  display: flex;
  width: 100%;
  max-width: 100%;
  flex-wrap: nowrap;
  margin: 0;
  /*cursor: none;*/
}

.key {
  position: relative;
  border: 4px solid black;
  border-radius: .5rem;
  transition: all .07s ease;
  display: block;
  white-space: nowrap;
  box-sizing: border-box;
  z-index: 2;
}

.key:not(.sharp) {
  float: left;
  height: 100%;
  background: rgba(255, 255, 255, .8);
}

.key.sharp {
  /*position: absolute;*/
  float: left;
  height: 60%;
  background: #000;
  color: #eee;
  top: 0;
  z-index: 3;
}

.key.pressed {
  /*transform: scale(.95);*/
  border-color: #028ae9;
  box-shadow: inset 0 0 1rem rgba(0,0,0,0.2);
}

.piano-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  background-color: rgba(0,0,0,0.4);
  font-size: 1.4em;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
