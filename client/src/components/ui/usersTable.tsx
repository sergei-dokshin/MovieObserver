import { useAppSelector } from '../../store/storeHooks';
import { getAuthUser } from '../../store/users';
import { User } from '../../types/user.types';
import { OrderBy } from '../../types/usersList.types';
import TableHeadRow from '../common/tableHeadRow';
import UserRow from '../common/userRow';

const UsersTable = ({
	userCrop,
	tableHeadData,
	handleSort,
	orderBy,
	startIndex
}: UserTableProps) => {
	const authUser = useAppSelector(getAuthUser());
	return (
		<table className="table table-striped table-dark table-bordered">
			<thead>
				<TableHeadRow
					handleSort={handleSort}
					orderBy={orderBy}
					tableHeadData={tableHeadData}
				/>
			</thead>
			<tbody>
				{userCrop.map((user: User, index: number) => {
					// не отображаем авторизированного пользователя в списке
					if (user._id === authUser?._id) {
						return;
					} else {
						return (
							<UserRow user={user} index={startIndex + index} key={user._id} />
						);
					}
				})}
			</tbody>
		</table>
	);
};

interface UserTableProps {
	userCrop: any[];
	tableHeadData: {
		name: string;
		sortType: string;
	}[];
	startIndex: number;
	handleSort: (sortType: string) => void;
	orderBy: OrderBy;
}

export default UsersTable;
