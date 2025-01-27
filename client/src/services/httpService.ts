import axios from 'axios';
import configFile from '../config.json';
import { localStorageService } from './localStorageService';
import authService from './authService';

const http = axios.create({
	baseURL: configFile.apiEndpoint
});

// меняем request перед тем, как он уйдёт на сервер
http.interceptors.request.use(
	async (config) => {
		const expiresDate = localStorageService.getTokenExpiresDate();
		const refreshToken = localStorageService.getRefreshToken();

		const isTokenExpired =
			refreshToken && expiresDate && Number(expiresDate) < Date.now();

		// проверяем не истёк ли токен и делаем запрос для обновления если необходимо
		if (isTokenExpired) {
			const data = await authService.refresh();
			// обновленные данные устанавливаем в localstorage
			localStorageService.setTokens(data);
		}
		const accessToken = localStorageService.getAccessToken();

		// Добавляем токен в заголовки
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

http.interceptors.response.use(
	(res) => res,
	(error) => {
		const isExpectedError =
			error.response &&
			error.response.status >= 400 &&
			error.response.status <= 499;
		if (isExpectedError && error.message) {
			console.log('Ecpected error: ', error.message);
		} else if (!isExpectedError && error.message) {
			console.log('Unecpected error: ', error.message);
		} else {
			console.log('Something went wrong: ', error);
		}
		return Promise.reject(error); // Позволяет другим обработчикам работать с ошибкой
	}
);

export default http;
