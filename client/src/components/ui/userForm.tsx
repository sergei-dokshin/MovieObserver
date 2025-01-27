import MultiSelect, { MultiValue } from 'react-select';
import AvatarUpload from './avatarUpload';
import { useAppSelector } from '../../store/storeHooks';
import { getHobbies } from '../../store/hobbies';
import { UserWithHobbies } from '../../types/user.types';
import { Hobby } from '../../types/hobbies.types';
import { useParams } from 'react-router-dom';

const UserForm: React.FC<UserFormProps> = ({ inputData, setInputData }) => {
	const hobbies = useAppSelector(getHobbies());
	const { register } = useParams();

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
					className="edit-page-input"
					value={inputData.name}
					onChange={handleChange}
				/>
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
					className="edit-page-input"
					value={inputData.birthDate}
					onChange={handleChange}
				/>
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
					className="edit-page-input"
					value={inputData.email}
					onChange={handleChange}
				/>
				{register && (
					<>
						<label htmlFor="email" className="edit-page-label">
							Password:
						</label>
						<input
							type="password"
							id="password"
							name="password"
							className="edit-page-input"
							value={inputData.password}
							onChange={handleChange}
						/>
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
