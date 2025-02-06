import { useEffect, useState } from 'react';
import { LoginData } from '../../../types/navBar.types';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/storeHooks';
import {
	getAuthError,
	getAuthUser,
	login,
	removeUsersError
} from '../../../store/users';
import { validator } from '../../../utils/validator';
import styles from './loginPage.module.css';
import ErrorInfo from '../../common/ErrorInfo/errorInfo';
import { inputReqs } from '../../../utils/inputReqs';
import FormInput from '../../ui/formInput/formInput';

const LoginPage = () => {
	const [loginData, setloginData] = useState<LoginData>({
		email: '',
		password: ''
	});
	const [isFetching, setIsFetching] = useState(false);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from || '/';
	const authUser = useAppSelector(getAuthUser());
	const error = useAppSelector(getAuthError());
	const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
	const validatorConfig = {
		email: {
			isRequired: {
				message: 'Необходимо указать email'
			},
			isEmail: {
				message: 'Неверный email'
			}
		},
		password: {
			isRequired: {
				message: 'Необходимо указать пароль'
			},
			isCorrectPassword: {
				message: 'Некорректный пароль'
			}
		}
	};

	function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
		if (error) {
			dispatch(removeUsersError('auth'));
		}

		setloginData((prev) => ({
			...prev,
			[target.name]: target.value
		}));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const isValid = validate();
		if (!isValid) return;

		setIsFetching(true);
		// необходимо добавить await, иначе navigate() срабатывает до смены статуса в Redux
		await dispatch(login(loginData));
		setIsFetching(false);

		navigate(from === '/login' ? '/users' : from, { replace: true });
	}

	function validate() {
		const errors: Record<string, string> = validator(
			loginData,
			validatorConfig
		);

		setInputErrors(errors);
		return Object.keys(errors).length === 0;
	}

	function handleBlur() {
		validate();
	}

	function goToRegisterPage() {
		navigate('/register');
	}

	useEffect(() => {
		validate();
	}, [loginData]);

	return (
		<div className="page-content-container">
			{authUser ? (
				<Navigate to="/users" replace />
			) : (
				<form className={styles.loginFormContainer}>
					{error && <p className={styles.errorMessage}>{error}</p>}
					<FormInput
						label={false}
						inputType="email"
						placeholder="Email"
						error={inputErrors.email}
						errorType="isEmail"
						value={loginData.email}
						handleChange={handleChange}
						handleBlur={handleBlur}
					/>
					<FormInput
						label={false}
						inputType="password"
						placeholder="Password"
						error={inputErrors.password}
						errorType="isCorrectPassword"
						value={loginData.password}
						handleChange={handleChange}
						handleBlur={handleBlur}
					/>
					<button
						onClick={handleSubmit}
						className={`${styles.formButton} ${isFetching && styles.disabledButton}`}
						disabled={!(Object.keys(inputErrors).length === 0)}
					>
						<i className="bi bi-door-open"></i>
						Вход
					</button>
					<p className={styles.registerMessage}>Или создайте аккаунт:</p>
					<a className={styles.link} onClick={goToRegisterPage}>
						Регистрация
					</a>
				</form>
			)}
		</div>
	);
};

export default LoginPage;
