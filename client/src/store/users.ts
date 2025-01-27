import { createAction, createSlice } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../main';
import { userService } from '../services/userService';
import { isOutdated } from '../utils/isOutdated';
import authService from '../services/authService';
import { localStorageService } from '../services/localStorageService';
import { generateAuthError } from '../utils/generateAuthError';
import { toastError } from '../utils/toastify';
import { User, UserWithHobbies } from '../types/user.types';

const initialState: UsersState = {
	authUser: null,
	authUserIsLoading: true,
	isLoggedIn: false,
	entities: [],
	currentPageUser: null,
	isLoading: true,
	lastFetch: null,
	error: null
};

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		authRequested: (state) => {
			state.authUserIsLoading = true;
		},
		authRequestSuccess: (state) => {
			state.isLoggedIn = true;
			state.authUserIsLoading = false;
		},
		authRequestFailed: (state, action) => {
			state.error = { ...state.error, auth: action.payload };
			state.authUserIsLoading = false;
		},
		usersRequested: (state) => {
			state.isLoading = true;
		},
		usersRecieved: (state, action) => {
			state.entities = action.payload;
			state.lastFetch = Date.now();
			state.isLoading = false;
		},
		usersRequestFailed: (state, action) => {
			state.error = { ...state.error, getAllUsers: action.payload };
			state.isLoading = false;
		},
		currentPageUserRecieved: (state, action) => {
			state.currentPageUser = action.payload;
			state.isLoading = false;
		},
		authUserLoadingFalse: (state) => {
			state.authUserIsLoading = false;
		},
		authUserRecieved: (state, action) => {
			state.authUser = action.payload;
		},
		authUserLoggedOut: (state) => {
			state.isLoggedIn = false;
			state.authUser = null;
		},
		authUserUpdated: (state, action) => {
			state.authUser = action.payload;
		},

		userUpdateFailed: (state, action) => {
			state.error = { ...state.error, userUpdate: action.payload };
		},
		removeError: (state, action) => {
			if (state.error) {
				delete state.error[action.payload];
			}
		}
	}
});

// EXTRA ACTIONS
const updateUserRequested = createAction('users/updateUserRequested');
const updateUserFailed = createAction('users/updateUserFailed');

const { actions, reducer: usersReducer } = usersSlice;
export const {
	authRequested,
	authRequestSuccess,
	authRequestFailed,
	usersRecieved,
	currentPageUserRecieved,
	usersRequestFailed,
	usersRequested,
	authUserLoadingFalse,
	authUserRecieved,
	authUserLoggedOut,
	authUserUpdated,
	removeError
} = actions;

export function signUp(payload: User) {
	return async (dispatch: AppDispatch) => {
		try {
			dispatch(authRequested());
			const data = await authService.register(payload);

			dispatch(authUserRecieved(data.user));
			dispatch(authRequestSuccess());
			localStorageService.setTokens(data.tokens);
		} catch (error) {
			if (isAxiosError(error)) {
				dispatch(authRequestFailed(error.message));
			}
		}
	};
}

export function login(payload: LogInProps) {
	return async (dispatch: AppDispatch) => {
		try {
			dispatch(authRequested());
			const data = await authService.login(payload);

			dispatch(authUserRecieved(data.user));
			dispatch(authRequestSuccess());
			localStorageService.setTokens(data.tokens);
		} catch (error) {
			if (isAxiosError(error)) {
				console.log(error);
				const { code, message } = error.response?.data.error;
				if (code === 400) {
					const errorMessage = generateAuthError(message);
					dispatch(authRequestFailed(errorMessage));
					toastError(errorMessage);
				} else {
					dispatch(authRequestFailed(message));
					toastError(message);
				}
			}
		}
	};
}

export function logInAuthUser() {
	return async (dispatch: AppDispatch) => {
		try {
			dispatch(authRequested());
			const authUser = await userService.getAuthUser();

			dispatch(authUserRecieved(authUser));
			dispatch(authRequestSuccess());
		} catch (error) {
			if (isAxiosError(error)) {
				console.log(error);
				dispatch(authRequestFailed(error.response?.data.message));
				//toast(error.response?.data.message);
			}
		}
	};
}

export function updateUser(userData: User) {
	return async (dispatch: AppDispatch) => {
		dispatch(updateUserRequested());
		try {
			const updatedUser = await userService.updateUser(userData);
			dispatch(authUserUpdated(updatedUser));
		} catch (error) {
			dispatch(updateUserFailed());
			if (isAxiosError(error)) {
				dispatch(usersRequestFailed(error.message));
			} else {
				console.log(
					'Возникла непредвиденная ошибка при обновлении данных пользователя: ',
					error
				);
			}
		}
	};
}

export function logOut() {
	return (dispatch: AppDispatch) => {
		dispatch(authUserLoggedOut());
		localStorageService.removeTokens();
	};
}

export function loadUsersList() {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		const lastFetch = getState().users.lastFetch;
		if (!lastFetch || isOutdated(lastFetch)) {
			dispatch(usersRequested());
			try {
				const response = await userService.getAllUsers();
				dispatch(usersRecieved(response));
			} catch (error) {
				if (isAxiosError(error)) {
					dispatch(usersRequestFailed(error.message));
				} else {
					console.log(
						'Возникла непредвиденная ошибка при запросе Users: ',
						error
					);
				}
			}
		}
	};
}

export function getUserById(userId: string | undefined) {
	return async (dispatch: AppDispatch) => {
		if (userId) {
			dispatch(usersRequested());
			try {
				const data = await userService.getUser(userId);
				if (data) {
					dispatch(currentPageUserRecieved(data));
				} else {
					dispatch(usersRequestFailed('Пользователь с таким id не найден'));
				}
			} catch (error) {
				if (isAxiosError(error)) {
					dispatch(usersRequestFailed(error.message));
				} else {
					console.log(
						'Возникла непредвиденная ошибка при запросе Users: ',
						error
					);
				}
			}
		}
	};
}

export function removeUsersError(type: string) {
	return (dispatch: AppDispatch) => dispatch(removeError(type));
}

//           * SELECTORS *
export function getLoginStatus() {
	return (state: RootState) => state.users.isLoggedIn;
}

export function getAuthUserLoadingStatus() {
	return (state: RootState) => state.users.authUserIsLoading;
}

export function getUsers() {
	return (state: RootState) => state.users.entities;
}

export function getAuthUser() {
	return (state: RootState) => state.users.authUser;
}

export function getUsersLoadingStatus() {
	return (state: RootState) => state.users.isLoading;
}

export function getAuthError() {
	return (state: RootState) => state.users.error?.auth;
}

interface UsersState {
	authUser: null | User;
	authUserIsLoading: boolean;
	isLoggedIn: boolean;
	entities: User[];
	currentPageUser: null | UserWithHobbies;
	isLoading: boolean;
	lastFetch: null | number;
	error: null | Record<string, string | null>;
}

interface LogInProps {
	email: string;
	password: string;
}

export default usersReducer;
