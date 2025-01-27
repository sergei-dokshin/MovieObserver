import { useEffect, useState } from 'react';
import Pagination from '../common/pagination';
import { paginate } from '../../utils/paginate';
import FilterInput from '../ui/filterInput';
import _ from 'lodash';
import { OrderBy } from '../../types/usersList.types';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import {
	getUsers,
	getUsersLoadingStatus,
	loadUsersList
} from '../../store/users';
import UsersTable from '../ui/usersTable';
import UsersCardsList from '../ui/usersCardsList';

const UsersList = () => {
	const users = useAppSelector(getUsers());
	const isLoading = useAppSelector(getUsersLoadingStatus());
	const dispatch = useAppDispatch();
	const [viewSwitcher, setViewSwitcher] = useState(true);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [orderBy, setOrderBy] = useState<OrderBy>({
		iter: 'name',
		order: 'asc'
	});
	const [filter, setFilter] = useState<string>('');
	const tableHeadData = [
		{ name: '#', sortType: '' },
		{ name: 'Имя', sortType: 'name' },
		{ name: 'Вид деятельности', sortType: 'occupation' },
		{ name: 'Год рождения', sortType: 'birthDate' },
		{ name: 'Избранное', sortType: '' }
	];
	// фильтрация и пагинация
	const count = users.length;
	const pageSize = 8;
	const startIndex = (currentPage - 1) * pageSize;
	const filteredUsers = users.filter((user) =>
		user.name.toLowerCase().includes(filter.toLowerCase())
	);
	const orderedUsers = _.orderBy(
		filteredUsers,
		[orderBy.iter],
		[orderBy.order]
	);
	const userCrop = paginate(orderedUsers, startIndex, pageSize);

	function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		setFilter(event.target.value);
	}

	function handlePageChange(pageIndex: number) {
		setCurrentPage(pageIndex);
	}

	function handleSort(head: string) {
		if (orderBy.iter === head) {
			setOrderBy((prev) => ({
				...prev,
				order: prev.order === 'asc' ? 'desc' : 'asc'
			}));
		} else {
			setOrderBy({
				iter: head,
				order: 'asc'
			});
		}
	}

	function handleViewSwitch() {
		setViewSwitcher((prev) => !prev);
	}

	useEffect(() => {
		dispatch(loadUsersList());
	}, []);

	return (
		<div className="page-content-container">
			<div className="users-list-page-container">
				<div className="users-list-page-sidebar">
					<div className="view-switcher-container">
						<i
							className={
								viewSwitcher
									? 'bi bi-person-square bi-active'
									: 'bi bi-person-square'
							}
							onClick={handleViewSwitch}
						></i>
						<i
							className={
								viewSwitcher ? 'bi bi-card-list' : 'bi bi-card-list bi-active'
							}
							onClick={handleViewSwitch}
						></i>
					</div>
				</div>

				{isLoading ? (
					<h4>Загружаем данные о пользователях...</h4>
				) : count > 0 ? (
					<div className="users-container">
						<FilterInput filter={filter} handleChange={handleChange} />
						{viewSwitcher ? (
							<UsersCardsList
								userCrop={userCrop}
								handleSort={handleSort}
								orderBy={orderBy}
								startIndex={startIndex}
							/>
						) : (
							<UsersTable
								userCrop={userCrop}
								tableHeadData={tableHeadData}
								handleSort={handleSort}
								orderBy={orderBy}
								startIndex={startIndex}
							/>
						)}

						<Pagination
							numberOfItems={count}
							pageSize={pageSize}
							currentPage={currentPage}
							onPageChange={handlePageChange}
						/>
					</div>
				) : (
					<h4>Не удалось получить данные о пользователях...</h4>
				)}
			</div>
		</div>
	);
};

export default UsersList;
