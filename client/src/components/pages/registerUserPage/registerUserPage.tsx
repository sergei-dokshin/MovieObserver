import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/storeHooks';
import { signUp } from '../../../store/users';
import UserForm from '../../ui/userForm/userForm';
import { useState } from 'react';
import { UserWithHobbies } from '../../../types/user.types';
import { toast } from 'react-toastify';
import { validator } from '../../../utils/validator';
import styles from './registerUserPage.module.css';

const RegisterUserPage = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
	const [inputData, setInputData] = useState<UserWithHobbies>({
		name: '',
		occupation: '',
		birthDate: '',
		hobbies: [],
		email: '',
		password: '',
		wikiPage: '',
		avatar: null
	});
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
		},
		name: {
			isRequired: {
				message: 'Необходимо указать имя'
			},
			isCorrectName: {
				message: 'Имя должно содержать от 4 до 35 символов'
			}
		},
		birthDate: {
			isRequired: {
				message: 'Необходимо указать год рождения'
			},
			isCorrectBirthDate: {
				message: 'Укажите корректный год рождения'
			}
		}
	};

	function validate() {
		const errors: Record<string, string> = validator(
			inputData,
			validatorConfig
		);

		setInputErrors(errors);
		return !(Object.keys(inputErrors).length === 0);
	}

	async function registerUser() {
		validate();
		if (Object.keys(inputErrors).length === 0) {
			const UserWithoutHobbies = {
				...inputData,
				hobbies: inputData.hobbies.map((hobbie) => hobbie._id)
			};

			await dispatch(signUp(UserWithoutHobbies));
			navigate(`/users`);
			toast('Вы успешно зарегистрировались!👏');
			toast('Добро пожаловать!🥳');
		}
	}

	return (
		<div className="user-page-container">
			<h3>Регистрация:</h3>
			<UserForm
				inputData={inputData}
				setInputData={setInputData}
				inputErrors={inputErrors}
				setInputErrors={setInputErrors}
				validate={validate}
			/>
			<div className="flex-column">
				<button
					onClick={registerUser}
					className={styles.formButton}
					disabled={!(Object.keys(inputErrors).length === 0)}
				>
					Зарегистрироваться
				</button>
				<button
					onClick={() => navigate('/login')}
					className={styles.formButton}
				>
					Отмена
				</button>
			</div>
		</div>
	);
};

export default RegisterUserPage;
