import { OrderBy } from '../../types/usersList.types';
import '../../styles/usersCardsList.css';
import UserCard from './userCard';
import { useAppSelector } from '../../store/storeHooks';
import { getAuthUser } from '../../store/users';

const UsersCardsList = ({ userCrop }: UsersCardsProps) => {
	const authUser = useAppSelector(getAuthUser());
	return (
		<div className="users-cards-container">
			{userCrop.map((user) => {
				// не отображаем авторизированного пользователя в списке
				if (user._id === authUser?._id) {
					return;
				} else {
					return <UserCard user={user} key={user._id} />;
				}
			})}
		</div>
	);
};

interface UsersCardsProps {
	userCrop: any[];
	startIndex: number;
	handleSort: (sortType: string) => void;
	orderBy: OrderBy;
}

export default UsersCardsList;
