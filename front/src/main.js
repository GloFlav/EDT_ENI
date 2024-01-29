import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue3SimpleHtml2pdf from "vue3-simple-html2pdf";

createApp(App).use(router).use(Vue3SimpleHtml2pdf).mount('#app')
