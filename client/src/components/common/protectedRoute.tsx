import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/storeHooks';
import { getAuthUser, getAuthUserLoadingStatus } from '../../store/users';

const ProtectedRoute = () => {
	const authUser = useAppSelector(getAuthUser());
	const isAuthUserLoading = useAppSelector(getAuthUserLoadingStatus());

	if (!authUser && !isAuthUserLoading) {
		// Объект location автоматически передается в <Navigate /> -  не нужно объявлять переменную "const location = useLocation();"
		return <Navigate to="/login" state={{ from: location.pathname }} replace />;
	}

	if (isAuthUserLoading) {
		return <h2>Загрузка...</h2>;
	}

	if (authUser) {
		return <Outlet />;
	}
};

export default ProtectedRoute;
