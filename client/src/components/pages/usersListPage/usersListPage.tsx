import { useEffect, useMemo, useState } from 'react';
import Pagination from '../../common/pagination/pagination';
import { paginate } from '../../../utils/paginate';
import FilterInput from '../../ui/filterInput';
import _ from 'lodash';
import { OrderBy } from '../../../types/usersList.types';
import { useAppDispatch, useAppSelector } from '../../../store/storeHooks';
import {
	getUsers,
	getUsersLoadingStatus,
	loadUsersList
} from '../../../store/users';
import UsersTable from '../../ui/usersTable/usersTable';
import UsersCardsList from '../../ui/usersCardsList/usersCardsList';
import { User } from '../../../types/user.types';
import styles from './usersListPage.module.css';

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
	// Состояние для значения в input, обновляется мгновенно:
	const [filter, setFilter] = useState<string>('');
	// Состояние для фильтрации, обновляется с задержкой:
	const [debouncedFilter, setDebouncedFilter] = useState<string>(filter);

	const tableHeadData = [
		{ name: '#', sortType: '' },
		{ name: 'Имя', sortType: 'name' },
		{ name: 'Вид деятельности', sortType: 'occupation' },
		{ name: 'Год рождения', sortType: 'birthDate' },
		{ name: 'Избранное', sortType: '' }
	];

	// Обновляем debouncedFilter через 300 мс после последнего изменения filter
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedFilter(filter);
		}, 400);

		// Если значение filter изменилось до истечения таймера — очищаем предыдущий timeout
		return () => {
			clearTimeout(handler);
		};
	}, [filter]);

	// Фильтрация
	const filteredUsers = useMemo(() => {
		return debouncedFilter
			? users.filter((user: User) =>
					user.name.toLowerCase().includes(debouncedFilter.toLowerCase())
				)
			: users;
	}, [users, debouncedFilter]);

	// Пагинация
	const count = filteredUsers.length;
	const pageSize = 8;
	const startIndex = (currentPage - 1) * pageSize;

	// Сортировка
	const orderedUsers = _.orderBy(
		filteredUsers,
		[orderBy.iter],
		[orderBy.order]
	);
	// Итоговый массив пользователей
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
	}, [dispatch]);

	return (
		<div className="page-content-container">
			<div className={styles.usersMainContainer}>
				<div className={styles.sidebar}>
					<div className={styles.viewSwitcher}>
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
				) : (
					<div className="flex-column">
						<FilterInput filter={filter} handleChange={handleChange} />
						{count > 0 ? (
							viewSwitcher ? (
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
							)
						) : (
							<div className="users-cards-container">
								<p>Пользователя с таким именем нет</p>
							</div>
						)}

						<Pagination
							numberOfItems={orderedUsers.length}
							pageSize={pageSize}
							currentPage={currentPage}
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default UsersList;
