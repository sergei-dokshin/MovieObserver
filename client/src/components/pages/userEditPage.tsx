import { Navigate, useNavigate, useParams } from 'react-router-dom';
import UserForm from '../ui/userForm';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { getAuthUser, updateUser } from '../../store/users';
import { getHobbies } from '../../store/hobbies';
import { useEffect, useState } from 'react';
import { getHobbiesByIds } from '../../utils/getHobbiesByIds';
import { UserWithHobbies } from '../../types/user.types';
import { toast } from 'react-toastify';
import { validator } from '../../utils/validator';

const UserEditPage = () => {
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
	const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
	const { userId } = useParams();
	const authUser = useAppSelector(getAuthUser());
	const hobbies = useAppSelector(getHobbies());
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	function validate() {
		const errors: Record<string, string> = validator(
			inputData,
			validatorConfig
		);

		setInputErrors(errors);
		return !(Object.keys(inputErrors).length === 0);
	}

	async function handleUpdateUser() {
		const errors = validate();
		if (!errors) {
			await dispatch(
				updateUser({
					...inputData,
					hobbies: inputData.hobbies.map((hobby) => hobby._id)
				})
			);
			navigate(`/users/${userId}`);
			toast('Данные успешно обновлены!👍');
		}
	}

	useEffect(() => {
		if (authUser && hobbies) {
			setInputData({
				...authUser,
				hobbies: getHobbiesByIds(authUser.hobbies, hobbies)
			});
		}
	}, [authUser, hobbies]);

	return userId === authUser?._id ? (
		<div className="edit-page-container">
			<h3>Редактировать данные:</h3>
			{!authUser ? (
				<h4>Загрузка...</h4>
			) : (
				<>
					<UserForm
						inputData={inputData}
						setInputData={setInputData}
						inputErrors={inputErrors}
						setInputErrors={setInputErrors}
						validate={validate}
						authUser={authUser}
					/>
					<div className="edit-page-container">
						<button
							onClick={handleUpdateUser}
							className="edit-page-button"
							disabled={!(Object.keys(inputErrors).length === 0)}
						>
							Сохранить
						</button>
						<button
							onClick={() => navigate(`/users/${userId}`)}
							className="edit-page-button"
						>
							Отмена
						</button>
					</div>
				</>
			)}
		</div>
	) : (
		<Navigate to={`/${userId}`} replace />
	);
};

export default UserEditPage;
