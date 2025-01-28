import MultiSelect, { MultiValue } from 'react-select';
import AvatarUpload from './avatarUpload';
import { useAppSelector } from '../../store/storeHooks';
import { getHobbies } from '../../store/hobbies';
import { UserWithHobbies } from '../../types/user.types';
import { Hobby } from '../../types/hobbies.types';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { validator } from '../../utils/validator';

const UserForm: React.FC<UserFormProps> = ({
	inputData,
	setInputData,
	inputErrors,
	setInputErrors,
	validatorConfig
}) => {
	const hobbies = useAppSelector(getHobbies());
	const { register } = useParams();

	function validate() {
		const errors: Record<string, string> = validator(
			inputData,
			validatorConfig
		);

		setInputErrors(errors);
		return Object.keys(errors).length === 0;
	}

	useEffect(() => {
		validate();
	}, [inputData]);

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

	return (
		inputData && (
			<div className="edit-page-container">
				<AvatarUpload inputData={inputData} setInputData={setInputData} />
				<label htmlFor="name" className="edit-page-label">
					Имя:
				</label>
				<input
					type="text"
					id="name"
					name="name"
					className={`edit-page-input ${inputErrors.name && 'error-input-border'}`}
					value={inputData.name}
					onChange={handleChange}
				/>
				{inputErrors.name && (
					<p className="error-message-p">{inputErrors.name}</p>
				)}
				<label htmlFor="occupation" className="edit-page-label">
					Род деятельности:
				</label>
				<input
					type="text"
					id="occupation"
					name="occupation"
					className="edit-page-input"
					value={inputData.occupation}
					onChange={handleChange}
				/>
				<label htmlFor="birthDate" className="edit-page-label">
					Birth year:
				</label>
				<input
					type="text"
					id="birthDate"
					name="birthDate"
					className={`edit-page-input ${inputErrors.birthDate && 'error-input-border'}`}
					value={inputData.birthDate}
					onChange={handleChange}
				/>
				{inputErrors.birthDate && (
					<p className="error-message-p">{inputErrors.birthDate}</p>
				)}
				<label htmlFor="hobbies" className="edit-page-label">
					Hobbies:
				</label>
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
				<label htmlFor="email" className="edit-page-label">
					Email:
				</label>
				<input
					type="email"
					id="email"
					name="email"
					className={`edit-page-input ${inputErrors.email && 'error-input-border'}`}
					value={inputData.email}
					onChange={handleChange}
				/>
				{inputErrors.email && (
					<p className="error-message-p">{inputErrors.email}</p>
				)}
				{register && (
					<>
						<label htmlFor="email" className="edit-page-label">
							Password:
						</label>
						<input
							type="password"
							id="password"
							name="password"
							className={`edit-page-input ${inputErrors.password && 'error-input-border'}`}
							value={inputData.password}
							onChange={handleChange}
						/>
						{inputErrors.password && (
							<p className="error-message-p">{inputErrors.password}</p>
						)}
					</>
				)}
				<label htmlFor="wikiPage" className="edit-page-label">
					Wikipedia:
				</label>
				<input
					type="text"
					id="wikiPage"
					name="wikiPage"
					className="edit-page-input"
					value={inputData.wikiPage}
					placeholder="https://en.wikipedia.org/..."
					onChange={handleChange}
				/>
			</div>
		)
	);
};

interface UserFormProps {
	inputData: UserWithHobbies | null;
	setInputData: React.Dispatch<React.SetStateAction<UserWithHobbies>>;
	inputErrors: Record<string, string>;
	setInputErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	validatorConfig: Record<string, any>;
}

export default UserForm;

// REGISTER
// const response = await axios({
//     method: "post",
//     url: `users/register`,
//     headers: {
//         "Content-Type": "multipart/form-data"
//     },
//     data: firebaseUserFormat
// });
// if (response.status !== 201) {
//     toast("Не удалось зарегистрировать пользователя");
//     console.log(
//         "Не удалось зарегистрировать пользователя",
//         response.statusText
//     );
// }
// console.log(response.data.message, response.data.user);
