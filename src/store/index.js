import Vuex from 'vuex';
import axios from 'axios';
import { toast } from 'vue3-toastify';

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('token') || '',
        appeals: [],
        user: null,
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setUser(state, user) {
            state.user = user;
        },
        setAppeals(state, appeals) {
            state.appeals = appeals;
        },
        filterAppeals(state, data) {
            state.appeals = data.data;
        }
    },
    actions: {
        async login({ commit }, credentials) {
            try {
                const response = await axios.post('https://dev.moydomonline.ru/api/auth/login/', credentials);
                commit('setToken', response.data.key);
                localStorage.setItem('token', response.data.key);
                axios.defaults.headers['Authorization'] = `Token ${response.data.key}`;
                return true;
            } catch (error) {
                return false;
            }
        },

        async fetchAppeals({ commit }, { page = 1, page_size = 10, search = '' }) {
            try {
                const response = await axios.get('appeals/v1.0/appeals/', {
                    params: {search, page, page_size },
                });

                commit('setAppeals', response.data);
            } catch (error) {
                console.error('Ошибка при получении заявок:', error.response?.data || error.message);
            }
        },

        async searchAppeals({commit}, { search = '' }) {
            try {
                const response = await axios.get(`geo/v2.0/user-premises/`, {
                    params: { search }
                });
                commit('filterAppeals', { data: response.data, query: search });
            } catch (error) {
                console.error(error);
            }
        },

        // eslint-disable-next-line no-empty-pattern
        async sendAppeals({}, data) {
            try {
                await axios.post('appeals/v1.0/appeals', data);
                toast.success('Заявка успешно создана!');
            } catch (error) {
                console.error('Error during sending appeal:', error);
            }
        },

        // eslint-disable-next-line no-empty-pattern
        async editAppeals(_, { data, appeal_id }) {
            try {
                await axios.patch(`appeals/v1.0/appeals/${appeal_id}/`, data);
                toast.success('Заявка успешно отредактирована!');
            } catch (error) {
                console.error('Error during sending appeal:', error.response?.data || error.message);
            }
        }
    }
})