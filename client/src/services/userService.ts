import http from '../services/httpService';
import { User } from '../types/user.types';

const getUser = async (userId: string) => {
	const { data } = await http.get(`/users/${userId}`, {
		withCredentials: true
	});
	return data;
};

const getAuthUser = async () => {
	const { data } = await http.get('/users/authUser', { withCredentials: true });
	return data;
};

const getAllUsers = async () => {
	const { data } = await http.get(`/users`, { withCredentials: true });
	return data;
};

const updateUser = async (payload: User) => {
	const { data } = await http({
		method: 'patch',
		url: `/users/${payload._id}/update`,
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		data: payload,
		withCredentials: true
	});
	return data;
};

const checkUserEmail = async (email: string) => {
	const { data } = await http.get(`/users/email?email=${email}`);
	return data;
};

export const userService = {
	getUser,
	getAuthUser,
	getAllUsers,
	updateUser,
	checkUserEmail
};
