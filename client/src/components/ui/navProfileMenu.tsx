import { useAppDispatch, useAppSelector } from "../../store/storeHooks";
import { getAuthUser, logOut } from "../../store/users";
import "../../styles/navProfileMenu.css";
import { NavLink } from "react-router-dom";

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
            <div className="navbar-profile-menu">
                <h4>{authUser.name}</h4>
                <span>{authUser.email}</span>
                <hr />
                <NavLink
                    to={`/users/${authUser._id}`}
                    className="profile-menu-navlink"
                    onClick={handleMenuClose}
                >
                    Моя страница
                </NavLink>
                <NavLink
                    to={`/users/${authUser._id}/edit`}
                    className="profile-menu-navlink"
                    onClick={handleMenuClose}
                >
                    Редактировать профиль
                </NavLink>
                <hr />
                <NavLink
                    to={`/users`}
                    className="profile-menu-navlink"
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
