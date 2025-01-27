import { useNavigate } from 'react-router-dom';
import { User } from '../../types/user.types';

const UserCard = ({ user }: { user: User }) => {
	const navigate = useNavigate();

	function goToUserPage(userId: string | undefined) {
		navigate(`/users/${userId}`);
	}

	return (
		<div className="user-card" onClick={() => goToUserPage(user._id)}>
			<img
				src={`http://localhost:8080/${user.avatar}`}
				alt="User Photo"
				className="user-card-photo"
			/>
			<div className="user-card-description">
				<p>{user.name}</p>
				<span>{user.birthDate}</span>
			</div>
		</div>
	);
};

export default UserCard;
