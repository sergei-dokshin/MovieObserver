// import {
// 	createContext,
// 	ReactNode,
// 	useContext,
// 	useEffect,
// 	useState
// } from 'react';
// import axios, { AxiosError } from 'axios';
// import { userService } from '../services/userService';
// import { User } from '../types/user.types';
// import { localStorageService } from '../services/localStorageService';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// export const httpAuth = axios.create({
// 	baseURL: 'https://identitytoolkit.googleapis.com/v1/',
// 	params: {
// 		key: import.meta.env.VITE_FIREBASE_KEY
// 	}
// });
// const AuthContext = createContext<AuthContextType | null>(null);

// const useAuth = () => {
// 	const context = useContext(AuthContext);
// 	if (!context) {
// 		throw new Error('useAuth must be used within an AuthProvider');
// 	}
// 	return context;
// };

// const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// 	const [authUser, setAuthUser] = useState<User | null>(null);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [error, setError] = useState();
// 	const navigate = useNavigate();

// 	async function signUp({ email, password, ...rest }: User) {
// 		try {
// 			const { data }: { data: authResponse } = await httpAuth.post(
// 				'accounts:signUp',
// 				{
// 					email,
// 					password,
// 					returnSecureToken: true
// 				}
// 			);
// 			if (data) {
// 				localStorageService.setTokens(data);
// 				createUser({
// 					...(rest as Omit<User, '_id' | 'email'>),
// 					_id: data.localId,
// 					email
// 				});
// 			}
// 		} catch (error) {
// 			if (error instanceof AxiosError && error.response) {
// 				const { code, message } = error.response.data.error;
// 				if (code === 400 && message === 'EMAIL_EXISTS') {
// 					const errorObject = {
// 						email: 'Пользователь с таким Email уже существует.'
// 					};
// 					throw errorObject;
// 				}
// 			} else {
// 				// Обработка других типов ошибок
// 				console.error('Unexpected error:', error);
// 			}
// 		}
// 	}

// 	async function logIn({ email, password }: SignUpProps) {
// 		try {
// 			const { data }: { data: authResponse } = await httpAuth.post(
// 				'accounts:signInWithPassword',
// 				{
// 					email,
// 					password,
// 					returnSecureToken: true
// 				}
// 			);
// 			if (data) {
// 				localStorageService.setTokens(data);
// 				await getAuthUser();
// 			}
// 		} catch (error) {
// 			if (error instanceof AxiosError && error.response) {
// 				const { code, message } = error.response.data.error;
// 				if (code === 400) {
// 					const errorObject = {
// 						message: ''
// 					};
// 					if (message === 'INVALID_LOGIN_CREDENTIALS') {
// 						errorObject.message = 'Неверный email или пароль.';
// 					}
// 					if (message.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
// 						errorObject.message =
// 							'Слишком много попыток входа. Попробуйте позже.';
// 					}
// 					throw errorObject;
// 				}
// 			} else {
// 				console.error('Unexpected error:', error);
// 			}
// 		}
// 	}

// 	function logOut() {
// 		localStorageService.removeTokens();
// 		setAuthUser(null);
// 		navigate('/login');
// 	}

// 	async function createUser(data: User) {
// 		try {
// 			const user = await userService.createUser(data);
// 			if (user) {
// 				setAuthUser(user);
// 				setIsLoading(false);
// 				console.log('createUser user: ', user);
// 			}
// 		} catch (error) {
// 			console.log('createUser error: ', error);
// 		}
// 	}

// 	const getAuthUser = async () => {
// 		try {
// 			// получаем пользователя БЕЗ хобби
// 			const userId = localStorageService.getUserLocalId();
// 			if (userId) {
// 				const user = await userService.getUser(userId);
// 				if (user) {
// 					setAuthUser(user);
// 				}
// 			}
// 		} catch (error) {
// 			toast('Не удалось получить данные пользователя');
// 			console.error('Произошла ошибка:', error);
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};

// 	async function updateUserData(data: User) {
// 		try {
// 			const response = await userService.updateUser(data);
// 			if (!response) {
// 				throw new Error('Данные не обновились. Попробуйте позже.');
// 			}
// 			setAuthUser(response);
// 			toast('Данные успешно обновлены!');
// 			return response;
// 		} catch (error) {
// 			toast('Не удалось побновить данные пользователя');
// 			console.error('Ошибка обновления данных пользователя:', error);
// 		}
// 	}

// 	// useEffect(() => {
// 	//     if (localStorageService.getAccessToken()) {
// 	//         getAuthUser();
// 	//     } else {
// 	//         setIsLoading(false);
// 	//     }
// 	// }, []);

// 	const value: AuthContextType = {
// 		signUp,
// 		logIn,
// 		logOut,
// 		authUser,
// 		setAuthUser,
// 		updateUserData,
// 		isLoading
// 	};

// 	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // ИНТЕРФЕЙСЫ
// interface AuthContextType {
// 	signUp: (props: User) => Promise<void>;
// 	logIn: (props: SignUpProps) => Promise<void>;
// 	logOut: () => void;
// 	authUser: User | null;
// 	setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
// 	updateUserData: (data: User) => Promise<any>;
// 	isLoading: boolean;
// }

// interface AuthProviderProps {
// 	children: ReactNode | null;
// }

// interface SignUpProps {
// 	email: string;
// 	password: string;
// }

// export interface authResponse {
// 	idToken: string;
// 	refreshToken: string;
// 	expiresIn: string;
// 	localId: string;
// }

// export { AuthProvider, useAuth };
