import { useNavigate } from 'react-router-dom';
import { User } from '../../../types/user.types';
import styles from './userCard.module.css';

const UserCard = ({ user }: { user: User }) => {
	const navigate = useNavigate();

	function goToUserPage(userId: string | undefined) {
		navigate(`/users/${userId}`);
	}

	return (
		<div className={styles.userCard} onClick={() => goToUserPage(user._id)}>
			<img
				src={`http://localhost:8080/${user.avatar}`}
				alt="User Photo"
				className={styles.userCardPhoto}
			/>
			<div className={styles.userCardDescription}>
				<p>{user.name}</p>
				<span>{user.birthDate}</span>
			</div>
		</div>
	);
};

export default UserCard;
