import { Navigate, useNavigate, useParams } from 'react-router-dom';
import UserForm from '../ui/userForm';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { getAuthUser, updateUser } from '../../store/users';
import { getHobbies } from '../../store/hobbies';
import { useEffect, useState } from 'react';
import { getHobbiesByIds } from '../../utils/getHobbiesByIds';
import { UserWithHobbies } from '../../types/user.types';
import { toast } from 'react-toastify';

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
	const { userId } = useParams();
	const authUser = useAppSelector(getAuthUser());
	const hobbies = useAppSelector(getHobbies());
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	async function handleUpdateUser() {
		if (inputData) {
			await dispatch(
				updateUser({
					...inputData,
					hobbies: inputData.hobbies.map((hobby) => hobby._id)
				})
			);
		}
		navigate(`/users/${userId}`);
		toast('Данные успешно обновлены!');
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
					<UserForm inputData={inputData} setInputData={setInputData} />
					<div className="edit-page-container">
						<button onClick={handleUpdateUser} className="edit-page-button">
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
