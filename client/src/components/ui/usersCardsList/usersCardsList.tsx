import { OrderBy } from '../../../types/usersList.types';
import UserCard from '../userCard/userCard';
import { useAppSelector } from '../../../store/storeHooks';
import { getAuthUser } from '../../../store/users';
import styles from './usersCardsList.module.css';

const UsersCardsList = ({ userCrop }: UsersCardsProps) => {
	const authUser = useAppSelector(getAuthUser());
	return (
		<div className={styles.usersCardsContainer}>
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
