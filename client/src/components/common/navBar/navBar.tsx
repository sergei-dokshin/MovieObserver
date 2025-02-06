import { NavLink } from 'react-router-dom';
import NavbarProfile from '../../ui/navbarProfile/navbarProfile';
import { useEffect, useRef, useState } from 'react';
import NavProfileMenu from '../../ui/navProfileMenu/navProfileMenu';
import { useAppSelector } from '../../../store/storeHooks';
import { getAuthUser } from '../../../store/users';
import styles from './navBar.module.css';

const NavBar = () => {
	const authUser = useAppSelector(getAuthUser());
	const [isMenuActive, setIsMenuActive] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	function handleMenuClose(event: MouseEvent) {
		// Если клик вне меню и оно активно, закрываем его
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
			setIsMenuActive(false);
		}
	}

	useEffect(() => {
		// Добавляем обработчик кликов на документ
		document.addEventListener('click', handleMenuClose);

		// Убираем обработчик при размонтировании компонента
		return () => {
			document.removeEventListener('click', handleMenuClose);
		};
	}, []);

	return (
		<div className={styles.navbar}>
			<div className={styles.linksContainer}>
				<NavLink to="/" className={styles.navlink}>
					Firebase
				</NavLink>
				<NavLink to="/users" className={styles.navlink}>
					Users
				</NavLink>
			</div>
			<>
				{authUser ? (
					<div className={styles.userContainer} ref={menuRef}>
						<NavbarProfile setIsMenuActive={setIsMenuActive} />
						{isMenuActive && (
							<NavProfileMenu setIsMenuActive={setIsMenuActive} />
						)}
					</div>
				) : (
					<div className={styles.userContainer}>
						<NavLink to="/login" className={styles.navlink}>
							Вход
						</NavLink>
					</div>
				)}
			</>
		</div>
	);
};

export default NavBar;
