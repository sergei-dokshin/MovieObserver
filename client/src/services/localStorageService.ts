const TOKEN_KEY = 'jwt-token';
const REFRESH_KEY = 'jwt-refresh-token';
const EXPIRES_KEY = 'jwt-expires';
const USERID_KEY = 'local-UserId';

function setTokens({
	refreshToken,
	accessToken,
	userId,
	expiresIn
}: setTokensProps) {
	const expiresDate = new Date().getTime() + Number(expiresIn) * 1000;

	localStorage.setItem(TOKEN_KEY, accessToken);
	localStorage.setItem(REFRESH_KEY, refreshToken);
	localStorage.setItem(USERID_KEY, userId);
	localStorage.setItem(EXPIRES_KEY, expiresDate.toString());
}

function removeTokens() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(REFRESH_KEY);
	localStorage.removeItem(USERID_KEY);
	localStorage.removeItem(EXPIRES_KEY);
}

function getAccessToken() {
	return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken() {
	return localStorage.getItem(REFRESH_KEY);
}

function getLocalUserId() {
	return localStorage.getItem(USERID_KEY);
}

function getTokenExpiresDate() {
	return localStorage.getItem(EXPIRES_KEY);
}

interface setTokensProps {
	refreshToken: string;
	accessToken: string;
	userId: string;
	expiresIn: string;
}

export const localStorageService = {
	setTokens,
	removeTokens,
	getAccessToken,
	getRefreshToken,
	getLocalUserId,
	getTokenExpiresDate
};
