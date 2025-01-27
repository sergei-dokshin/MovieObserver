import { useState } from 'react';
import { LoginData } from '../../types/navBar.types';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import {
	getAuthError,
	getAuthUser,
	login,
	removeUsersError
} from '../../store/users';

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

	function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
		if (error) {
			dispatch(removeUsersError('auth'));
		}

		setloginData((prev) => ({
			...prev,
			[target.name]: target.value
		}));
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsFetching(true);
		// необходимо добавить await, иначе navigate() срабатывает до смены статуса в Redux
		await dispatch(login(loginData));
		setIsFetching(false);

		navigate(from === '/login' ? '/users' : from, { replace: true });
	};

	function goToRegisterPage() {
		navigate('/register');
	}

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
						className={`login-form-input ${error && 'error-input-border'}`}
					/>
					<input
						type="password"
						name="password"
						value={loginData.password}
						onChange={handleChange}
						placeholder="Пароль"
						required
						className={`login-form-input ${error && 'error-input-border'}`}
					/>
					<button
						onClick={handleSubmit}
						className={`login-button ${isFetching && 'disabled-button'}`}
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
