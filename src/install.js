import VuePianoComponent from "./components/VuePiano.vue";

const VuePiano = {
    install(Vue) {
        // Let's register our component globally
        // https://vuejs.org/v2/guide/components-registration.html
        Vue.component("vue-piano", VuePianoComponent);
    }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VuePiano);
}

export default VuePiano;