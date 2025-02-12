import axios from 'axios';
import configFile from '../config.json';
import { localStorageService } from './localStorageService';
import authService from './authService';

const http = axios.create({
	baseURL: configFile.apiEndpoint,
	withCredentials: true // чтобы cookies отправлялись с каждым запросом
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
			// обновленный accessToken должен придти в Cookies в ответе от сервера
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

http.interceptors.response.use(
	(res) => res,
	async (error) => {
		// настраиваем обновление токенов и повторный запрос при ошибке авторизации
		const originalRequest = error.config;

		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			try {
				// Получаем refresh_token
				const refreshToken = localStorageService.getRefreshToken();
				if (!refreshToken) {
					throw new Error('No refresh token available');
				}

				const data = await authService.refresh();
				// обновленные данные устанавливаем в localstorage
				localStorageService.setTokens(data);
				// обновленный accessToken должен придти в Cookies в ответе от сервера
				// Повторяем исходный запрос
				return http(originalRequest);
			} catch (refreshError) {
				console.error('Refresh token error:', refreshError);
				window.location.href = '/login'; // перенаправляем на страницу логина
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error); // Позволяет другим обработчикам работать с ошибкой
	}
);

export default http;
