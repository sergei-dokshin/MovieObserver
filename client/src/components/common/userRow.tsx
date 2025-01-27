import { useNavigate } from 'react-router-dom';
import { User } from '../../types/user.types';

const UserRow: React.FC<UserRowProps> = ({ user, index }) => {
	const navigate = useNavigate();

	function goToUserPage(userId: string | undefined) {
		navigate(`/users/${userId}`);
	}
	return (
		<tr key={user._id}>
			<th scope="row">{index + 1}</th>
			<td>
				<span
					onClick={() => goToUserPage(user._id)}
					style={{
						cursor: 'pointer',
						color: 'skyblue'
					}}
				>
					{user.name}
				</span>
			</td>
			<td>{user.occupation}</td>
			<td>{user.birthDate}</td>
			<td>
				<i className="bi bi-bookmark-star"></i>
			</td>
		</tr>
	);
};

interface UserRowProps {
	user: User;
	index: number;
}

export default UserRow;
