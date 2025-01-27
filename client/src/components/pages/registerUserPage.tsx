import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/storeHooks';
import { signUp } from '../../store/users';
import UserForm from '../ui/userForm';
import { useState } from 'react';
import { UserWithHobbies } from '../../types/user.types';
import { toast } from 'react-toastify';

const RegisterUserPage = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
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

	async function registerUser() {
		if (inputData) {
			const UserWithoutHobbies = {
				...inputData,
				hobbies: inputData.hobbies.map((hobbie) => hobbie._id)
			};

			await dispatch(signUp(UserWithoutHobbies));
			navigate(`/users`);
			toast('Вы успешно зарегистрировались! \nДобро пожаловать!');
		}
	}

	return (
		<div className="edit-page-container">
			<h3>Регистрация:</h3>
			<UserForm inputData={inputData} setInputData={setInputData} />
			<div className="edit-page-container">
				<button onClick={registerUser} className="edit-page-button">
					Зарегистрироваться
				</button>
				<button onClick={() => navigate('/login')} className="edit-page-button">
					Отмена
				</button>
			</div>
		</div>
	);
};

export default RegisterUserPage;
