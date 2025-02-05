import MultiSelect, { MultiValue } from 'react-select';
import AvatarUpload from './avatarUpload';
import { useAppSelector } from '../../store/storeHooks';
import { getHobbies } from '../../store/hobbies';
import { User, UserWithHobbies } from '../../types/user.types';
import { Hobby } from '../../types/hobbies.types';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { userService } from '../../services/userService';

const UserForm: React.FC<UserFormProps> = ({
	inputData,
	setInputData,
	validate,
	inputErrors,
	setInputErrors,
	authUser
}) => {
	const hobbies = useAppSelector(getHobbies());
	const { register } = useParams();

	function handleBlur() {
		validate();
	}

	async function handleEmailBlur() {
		validate(); // Проверяем локальную валидацию
		if (register) {
			if (inputData?.email && !inputErrors.email) {
				try {
					const data = await userService.checkUserEmail(inputData.email);
					if (data.status === 1) {
						setInputErrors((prev) => ({
							...prev,
							email: 'Этот email уже зарегистрирован'
						}));
					}
				} catch (error) {
					console.error('Ошибка при проверке email:', error);
				}
			}
		} else {
			if (
				inputData?.email &&
				!inputErrors.email &&
				authUser &&
				authUser.email !== inputData.email
			) {
				try {
					const data = await userService.checkUserEmail(inputData.email);
					if (data.status === 1) {
						setInputErrors((prev) => ({
							...prev,
							email: 'Этот email уже зарегистрирован'
						}));
					}
				} catch (error) {
					console.error('Ошибка при проверке email:', error);
				}
			}
		}
	}

	function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
		if (target) {
			setInputData((prev) => ({
				...prev,
				[target.name]: target.value || ''
			}));
		}
	}

	function handleChangeMultiField(readOnlyArray: MultiValue<Hobby>) {
		// Преобразуем readOnlyArray в обычный массив(MultiValue - тип из библиотеки react-select.Это read only массив, т.е. только для чтения/неизменяемый)
		const array = Array.from(readOnlyArray);

		setInputData((prev) => ({
			...prev,
			hobbies: array
		}));
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			validate();
		}, 500);

		return () => clearTimeout(timer);
	}, [inputData]);

	return (
		inputData && (
			<div className="edit-page-container">
				<AvatarUpload inputData={inputData} setInputData={setInputData} />
				<label htmlFor="name" className="edit-page-label">
					Имя:
				</label>
				<div className="input-wrap">
					<input
						type="text"
						id="name"
						name="name"
						className={`edit-page-input ${inputErrors.name && 'error-input-border'}`}
						value={inputData.name}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{inputErrors.name && !inputData.name ? (
						<p
							className="input-check-icon error-cross"
							data-error-message={inputErrors?.name}
						>
							❌
						</p>
					) : (
						<p className="input-check-icon">✔️</p>
					)}
				</div>
				<label htmlFor="occupation" className="edit-page-label">
					Род деятельности:
				</label>
				<div className="input-wrap">
					<input
						type="text"
						id="occupation"
						name="occupation"
						className="edit-page-input"
						value={inputData.occupation}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{inputErrors.occupation ? (
						<p
							className="input-check-icon error-cross"
							data-error-message={inputErrors?.occupation}
						>
							❌
						</p>
					) : (
						<p className="input-check-icon">✔️</p>
					)}
				</div>
				<label htmlFor="birthDate" className="edit-page-label">
					Birth year:
				</label>
				<div className="input-wrap">
					<input
						type="text"
						id="birthDate"
						name="birthDate"
						className={`edit-page-input ${inputErrors.birthDate && 'error-input-border'}`}
						value={inputData.birthDate}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{inputErrors.birthDate && !inputData.birthDate ? (
						<p
							className="input-check-icon error-cross"
							data-error-message={inputErrors?.birthDate}
						>
							❌
						</p>
					) : (
						<p className="input-check-icon">✔️</p>
					)}
				</div>
				<label htmlFor="hobbies" className="edit-page-label">
					Hobbies:
				</label>
				<div className="input-wrap">
					<MultiSelect
						isMulti
						options={hobbies}
						defaultValue={inputData.hobbies}
						value={inputData.hobbies}
						onChange={handleChangeMultiField}
						name="hobbies"
						className="basic-multi-select"
						theme={(theme) => ({
							...theme,
							colors: {
								...theme.colors,
								neutral0: 'rgb(18, 18, 18)',
								primary25: '#21304f',
								neutral10: 'gray',
								neutral80: 'white',
								dangerLight: '#21304f'
							}
						})}
						styles={{
							control: (baseStyles) => ({
								...baseStyles,
								borderColor: 'black'
							})
						}}
					/>
					<p className="input-check-icon hidden">✔️</p>
				</div>
				<label htmlFor="email" className="edit-page-label">
					Email:
				</label>
				<div className="input-wrap">
					<input
						type="email"
						id="email"
						name="email"
						className={`edit-page-input ${inputErrors.email && 'error-input-border'}`}
						value={inputData.email}
						onChange={handleChange}
						onBlur={handleEmailBlur}
					/>
					{inputErrors.email && !inputData.email ? (
						<p
							className="input-check-icon error-cross"
							data-error-message={inputErrors?.email}
						>
							❌
						</p>
					) : (
						<p className="input-check-icon">✔️</p>
					)}
				</div>
				{register && (
					<>
						<label htmlFor="email" className="edit-page-label">
							Password:
						</label>
						<div className="input-wrap">
							<input
								type="password"
								id="password"
								name="password"
								className={`edit-page-input ${inputErrors.password && 'error-input-border'}`}
								value={inputData.password}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							{inputErrors.password && !inputData.password ? (
								<p
									className="input-check-icon error-cross"
									data-error-message={inputErrors?.password}
								>
									❌
								</p>
							) : (
								<p className="input-check-icon">✔️</p>
							)}
						</div>
					</>
				)}
				<label htmlFor="wikiPage" className="edit-page-label">
					Wikipedia:
				</label>
				<div className="input-wrap">
					<input
						type="text"
						id="wikiPage"
						name="wikiPage"
						className="edit-page-input"
						value={inputData.wikiPage}
						placeholder="https://en.wikipedia.org/..."
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{inputErrors.wikiPage ? (
						<p
							className="input-check-icon error-cross"
							data-error-message={inputErrors?.wikiPage}
						>
							❌
						</p>
					) : (
						<p className="input-check-icon">✔️</p>
					)}
				</div>
			</div>
		)
	);
};

interface UserFormProps {
	inputData: UserWithHobbies | null;
	setInputData: React.Dispatch<React.SetStateAction<UserWithHobbies>>;
	validate: () => boolean;
	inputErrors: Record<string, string>;
	setInputErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	authUser?: User;
}

export default UserForm;
