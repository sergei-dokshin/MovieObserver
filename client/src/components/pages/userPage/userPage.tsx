import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Hobbie from '../../common/hobbie/hobbie';
import 'react-toastify/dist/ReactToastify.css';
import Comments from '../../ui/comments/comments';
import { useAppDispatch, useAppSelector } from '../../../store/storeHooks';
import { getHobbiesLoadingStatus } from '../../../store/hobbies';
import { getAuthUser, getUserById } from '../../../store/users';
import styles from './userPage.module.css';

const User = () => {
	const { userId } = useParams();
	const { currentPageUser, isLoading, error } = useAppSelector(
		(state) => state.users
	);
	const hobbiesIsLoading = useAppSelector(getHobbiesLoadingStatus());
	const authUser = useAppSelector(getAuthUser());
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getUserById(userId));
	}, [userId]);

	if (isLoading || hobbiesIsLoading) {
		return <h4>Загрузка...</h4>;
	}

	if (!isLoading && typeof error === 'string') {
		return <h4>{error}</h4>;
	}

	return (
		<div className="page-content-container ">
			<div className="user-page-container">
				{currentPageUser && userId ? (
					<>
						{authUser?._id === userId && (
							<p className={styles.yourProfile}>(Ваш профиль)</p>
						)}
						<img
							className={styles.avatar}
							src={
								currentPageUser.avatar
									? `http://localhost:8080/${currentPageUser.avatar}`
									: ''
							}
							alt="Фото пользователя"
						/>
						<h4>{currentPageUser.name}</h4>
						<p>Род деятельности: {currentPageUser.occupation}</p>
						<p>Год рождения: {currentPageUser.birthDate}</p>
						<div style={{ textAlign: 'center' }}>
							<p
								style={{
									display: 'inline-block',
									marginRight: '10px'
								}}
							>
								Хобби:
							</p>
							{currentPageUser.hobbies &&
								currentPageUser.hobbies.map((hobbie) => {
									return <Hobbie hobbie={hobbie} key={hobbie._id} />;
								})}
						</div>
						<p>{currentPageUser.email}</p>
						<a href={currentPageUser.wikiPage} target="_blank">
							{currentPageUser.wikiPage}
						</a>
						<Comments currentPageUserId={userId} />
					</>
				) : (
					<h4>Пользователь не найден😯</h4>
				)}
			</div>
		</div>
	);
};

export default User;
