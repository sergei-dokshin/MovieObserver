import axios from 'axios';
import { localStorageService } from './localStorageService';
import config from '../config.json';
import { User } from '../types/user.types';

export const httpAuth = axios.create({
	baseURL: `${config.apiEndpoint}/auth`
});

const authService = {
	register: async (payload: User) => {
		const { data } = await httpAuth({
			method: 'post',
			url: '/signUp',
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			data: payload
		});
		return data;
	},

	login: async ({ email, password }: LogInProps) => {
		const { data } = await httpAuth.post('/signInWithPassword', {
			email,
			password,
			returnSecureToken: true
		});
		return data;
	},
	refresh: async () => {
		const { data } = await httpAuth.post('/token', {
			grant_type: 'refresh_token',
			refresh_token: localStorageService.getRefreshToken()
		});
		return data;
	}
};

interface LogInProps {
	email: string;
	password: string;
}

export default authService;
