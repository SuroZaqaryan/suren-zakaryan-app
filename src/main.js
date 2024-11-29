import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import '../src/scss/main.scss';
import Vue3Toastify, {toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

axios.defaults.baseURL = 'https://dev.moydomonline.ru/api';
axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            toast.error(`Ошибка: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            toast.error('Сервер не ответил. Проверьте соединение с сетью.');
        } else {
            toast.error(`Ошибка при настройке запроса: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Vue3Toastify, {autoClose: 3000});
app.mount('#app');
