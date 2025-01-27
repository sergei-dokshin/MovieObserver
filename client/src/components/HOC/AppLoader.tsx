import React, { useEffect } from 'react';
import { localStorageService } from '../../services/localStorageService';
import { loadHobbiesList } from '../../store/hobbies';
import { useAppDispatch } from '../../store/storeHooks';
import { authUserLoadingFalse, logInAuthUser } from '../../store/users';

const AppLoader = ({ children }: Children) => {
	const dispatch = useAppDispatch();
	const userId = localStorageService.getLocalUserId();
	const expiresDate = localStorageService.getTokenExpiresDate();
	const refreshToken = localStorageService.getRefreshToken();

	useEffect(() => {
		dispatch(loadHobbiesList());
		if (userId && refreshToken && expiresDate) {
			dispatch(logInAuthUser());
		} else {
			dispatch(authUserLoadingFalse());
		}
	}, []);

	return children;
};

interface Children {
	children: React.ReactNode;
}

export default AppLoader;
