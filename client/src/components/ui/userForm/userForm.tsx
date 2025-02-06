import AvatarUpload from '../avatarUpload/avatarUpload';
import { useAppSelector } from '../../../store/storeHooks';
import { getHobbies } from '../../../store/hobbies';
import { UserWithHobbies } from '../../../types/user.types';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { userService } from '../../../services/userService';
import FormInput from '../formInput/formInput';
import MultiSelectInput from '../multiSelectInput/multiSelectInput';

const UserForm: React.FC<UserFormProps> = ({
	inputData,
	setInputData,
	validate,
	inputErrors,
	setInputErrors
}) => {
	const hobbies = useAppSelector(getHobbies());
	const { register } = useParams();

	function handleBlur() {
		validate();
	}

	async function handleEmailBlur(value: string, error: string) {
		validate(); // Проверяем локальную валидацию

		if (register && value && !error) {
			try {
				const data = await userService.checkUserEmail(value);
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

	function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
		if (target) {
			setInputData((prev) => ({
				...prev,
				[target.name]: target.value || ''
			}));
		}
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			validate();
		}, 500);

		return () => clearTimeout(timer);
	}, [inputData]);

	return (
		inputData && (
			<div className="flex-column">
				<AvatarUpload inputData={inputData} setInputData={setInputData} />
				<FormInput
					label={true}
					labelText="Имя: "
					inputType="name"
					placeholder="Имя"
					error={inputErrors.name}
					errorType="isEmail"
					value={inputData.name}
					handleChange={handleChange}
					handleBlur={handleBlur}
				/>
				<FormInput
					label={true}
					labelText="Род деятельности: "
					inputType="occupation"
					placeholder="Чем вы занимаетесь"
					error={inputErrors.occupation}
					errorType="isEmail"
					value={inputData.occupation}
					handleChange={handleChange}
					handleBlur={handleBlur}
				/>
				<FormInput
					label={true}
					labelText="Год рождения: "
					inputType="birthDate"
					placeholder="Укажите год рождения"
					error={inputErrors.birthDate}
					errorType="isCorrectBirthDate"
					value={inputData.birthDate}
					handleChange={handleChange}
					handleBlur={handleBlur}
				/>
				<MultiSelectInput
					labelText="Хобби: "
					optionsArray={hobbies}
					value={inputData.hobbies}
					setInputData={setInputData}
				/>
				{register && (
					<FormInput
						label={true}
						labelText="Email: "
						inputType="email"
						placeholder="email"
						error={inputErrors.email}
						errorType="isEmail"
						value={inputData.email}
						handleChange={handleChange}
						handleBlur={handleBlur}
						handleEmailBlur={handleEmailBlur}
					/>
				)}
				{register && (
					<FormInput
						label={true}
						labelText="Пароль: "
						inputType="password"
						placeholder="password"
						error={inputErrors.password}
						errorType="isCorrectPassword"
						value={inputData.password}
						handleChange={handleChange}
						handleBlur={handleBlur}
					/>
				)}
				<FormInput
					label={true}
					labelText="Страница Википедии: "
					inputType="text"
					placeholder="wikiPage"
					error={inputErrors.wikiPage}
					errorType="isEmail"
					value={inputData.wikiPage}
					handleChange={handleChange}
					handleBlur={handleBlur}
				/>
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
}

export default UserForm;
