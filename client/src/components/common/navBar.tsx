import { NavLink } from 'react-router-dom';
import NavbarProfile from '../ui/navbarProfile';
import { useEffect, useRef, useState } from 'react';
import NavProfileMenu from '../ui/navProfileMenu';
import { useAppSelector } from '../../store/storeHooks';
import { getAuthUser } from '../../store/users';

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
		<div className="navbar">
			<div className="navbar-links-container">
				<NavLink to="/" className="navbar-navlink">
					Firebase
				</NavLink>
				<NavLink to="/users" className="navbar-navlink">
					Users
				</NavLink>
			</div>
			<div>
				{authUser ? (
					<div ref={menuRef}>
						<NavbarProfile setIsMenuActive={setIsMenuActive} />
						{isMenuActive && (
							<NavProfileMenu setIsMenuActive={setIsMenuActive} />
						)}
					</div>
				) : (
					<div className="navbar-user-container">
						<NavLink to="/login" className="navbar-navlink">
							Вход
						</NavLink>
					</div>
				)}
			</div>
		</div>
	);
};

export default NavBar;
