import { useAppDispatch, useAppSelector } from '../../../store/storeHooks';
import { getAuthUser, logOut } from '../../../store/users';
import { NavLink } from 'react-router-dom';
import styles from './navProfileMenu.module.css';

const NavProfileMenu = ({ setIsMenuActive }: NavProfileMenuProps) => {
	const authUser = useAppSelector(getAuthUser());
	const dispatch = useAppDispatch();

	function handleLogout() {
		handleMenuClose();
		dispatch(logOut());

		// middleware по аналогии с axios interceptor перехватывает запрос dispatch и выполняет логику обработки, а затем передает результат самому dispatch
		// пользователя не нужно дополнительно перенаправлять на LoginPage, т.к.после удаления данных о пользователе из redux store автоматически сработает проверка ProtectedRoute
	}

	function handleMenuClose() {
		setIsMenuActive(false);
	}

	return (
		authUser && (
			<div className={styles.mainContainer}>
				<p className={styles.userName}>{authUser.name}</p>
				<span className={styles.email}>{authUser.email}</span>
				<hr className={styles.hr} />
				<NavLink
					to={`/users/${authUser._id}`}
					className={styles.navlink}
					onClick={handleMenuClose}
				>
					Моя страница
				</NavLink>
				<NavLink
					to={`/users/${authUser._id}/edit`}
					className={styles.navlink}
					onClick={handleMenuClose}
				>
					Редактировать профиль
				</NavLink>
				<hr className={styles.hr} />
				<NavLink
					to={`/users`}
					className={`${styles.navlink} ${styles.exitButton}`}
					onClick={handleLogout}
				>
					Выйти
				</NavLink>
			</div>
		)
	);
};

interface NavProfileMenuProps {
	setIsMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default NavProfileMenu;
