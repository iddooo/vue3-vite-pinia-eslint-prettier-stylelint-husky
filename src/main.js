import { createApp } from 'vue';
import './styles/tailwind.css';
import App from './App.vue';
import pinia from './stores';
import router from './router';

createApp(App).use(pinia).use(router).mount('#app');
