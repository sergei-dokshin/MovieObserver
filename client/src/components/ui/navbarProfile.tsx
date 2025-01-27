import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/storeHooks';
import { getAuthUser } from '../../store/users';

const NavbarProfile = ({ setIsMenuActive }: NavbarProfileProps) => {
	const authUser = useAppSelector(getAuthUser());
	const navigate = useNavigate();

	function handleMenuClick() {
		setIsMenuActive((prev) => !prev);
	}

	function toUserPage() {
		navigate(`/users/${authUser?._id}`);
	}
	return (
		<div className="navbar-user-container">
			<h6 onClick={toUserPage}>{authUser?.name}</h6>
			<img
				src={
					authUser?.avatar ? `http://localhost:8080/${authUser.avatar}` : ''
				}
				alt="Photo"
				onClick={handleMenuClick}
			/>
		</div>
	);
};

interface NavbarProfileProps {
	setIsMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default NavbarProfile;
