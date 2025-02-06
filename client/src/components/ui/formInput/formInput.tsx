import { ChangeEvent, useState } from 'react';
import ErrorInfo from '../../common/ErrorInfo/errorInfo';
import { inputReqs } from '../../../utils/inputReqs';
import styles from './formInput.module.css';

const FormInput = (props: FormInputProps) => {
	const {
		label,
		labelText,
		inputType,
		placeholder,
		error,
		errorType,
		value,
		handleChange,
		handleBlur,
		handleEmailBlur
	} = props;
	const [showPassword, setShowPassword] = useState(false);

	function toggleShowPassword() {
		setShowPassword((prev) => !prev);
	}

	function getType(type: string, showPassword: boolean) {
		if (type === 'password') {
			return showPassword ? 'text' : 'password';
		} else {
			return type;
		}
	}

	function onBlur() {
		if (handleEmailBlur && inputType === 'email') {
			handleEmailBlur(value, error);
		} else if (handleBlur) {
			handleBlur();
		}
	}

	return (
		<div className="flex-column">
			{label && (
				<label htmlFor="name" className={styles.label}>
					{labelText && labelText}
				</label>
			)}
			<div className={styles.inputWrap}>
				<input
					type={getType(inputType, showPassword)}
					id={inputType}
					name={inputType}
					placeholder={placeholder}
					className={`${styles.input} ${error && styles.errorBorder}`}
					value={value}
					onChange={handleChange}
					onBlur={onBlur}
				/>
				{inputType === 'password' && (
					<i
						className={`${styles.passwordEye} bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
						onClick={toggleShowPassword}
						role="button"
						aria-label="Показать или скрыть пароль"
					></i>
				)}
				<ErrorInfo
					error={error}
					array={inputReqs[errorType]}
					inputType={inputType}
				/>
			</div>
			{
				<div className={styles.errorContainer}>
					<p className={`${styles.errorMessage} ${error && styles.visible}`}>
						{error || 'Заполнено корректно'}
					</p>
				</div>
			}
		</div>
	);
};

interface FormInputProps {
	label: boolean;
	labelText?: string;
	inputType: string;
	placeholder: string;
	error: string;
	errorType: keyof InputReqs;
	value: string;
	handleChange: ({ target }: ChangeEvent<HTMLInputElement>) => void;
	handleBlur: () => void;
	handleEmailBlur?: (value: string, error: string) => Promise<void>;
}

type InputReqs = {
	isRequired: string[];
	isEmail: string[];
	isCorrectPassword: string[];
	isCorrectName: string[];
	isCorrectBirthDate: string[];
};

export default FormInput;
