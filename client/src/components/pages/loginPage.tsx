import { useEffect, useState } from 'react';
import { LoginData } from '../../types/navBar.types';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import {
	getAuthError,
	getAuthUser,
	login,
	removeUsersError
} from '../../store/users';
import { validator } from '../../utils/validator';

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
	const [showPassword, setShowPassword] = useState(false);

	function toggleShowPassword() {
		setShowPassword((prev) => !prev);
	}

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
				<form className="login-form-container">
					{error && <p className="error-message-p">{error}</p>}
					<input
						type="email"
						name="email"
						value={loginData.email}
						onChange={handleChange}
						placeholder="Email"
						required
						className={`login-form-input ${inputErrors.email && 'error-input-border'}`}
					/>
					{inputErrors.email && (
						<p className="error-message-p">{inputErrors.email}</p>
					)}
					<div className="password-input-container">
						<input
							type={showPassword ? 'text' : 'password'}
							name="password"
							value={loginData.password}
							onChange={handleChange}
							placeholder="Пароль"
							required
							className={`input-password login-form-input ${inputErrors.password && 'error-input-border'}`}
						/>
						<i
							className={`password-eye bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
							onClick={toggleShowPassword}
							role="button"
							aria-label="Показать или скрыть пароль"
						></i>
					</div>
					{inputErrors.password && (
						<p className="error-message-p">{inputErrors.password}</p>
					)}
					<button
						onClick={handleSubmit}
						className={`login-button ${isFetching && 'disabled-button'}`}
						disabled={!(Object.keys(inputErrors).length === 0)}
					>
						<i className="bi bi-door-open"></i>
						Вход
					</button>
					<p className="login-form-p">Или создайте аккаунт:</p>
					<span className="link-span" onClick={goToRegisterPage}>
						Регистрация
					</span>
				</form>
			)}
		</div>
	);
};

export default LoginPage;
