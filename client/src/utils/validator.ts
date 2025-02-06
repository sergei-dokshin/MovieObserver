export function validator<T>(
	data: T,
	config: ValidatorConfig<T>
): ValidationErrors<T> {
	const errors: ValidationErrors<T> = {};

	for (const fieldName in data) {
		const fieldConfig = config[fieldName as keyof T];
		if (!fieldConfig) continue;

		for (const validateMethod in fieldConfig) {
			const error = validate(
				validateMethod as ValidatorMethods,
				data[fieldName as keyof T],
				fieldConfig[validateMethod as ValidatorMethods] as ValidationRule
			);

			if (error && !errors[fieldName as keyof T]) {
				errors[fieldName as keyof T] = error;
			}
		}
	}

	return errors;
}

// validate("isRequired", "test@mail.com", { message: 'Необходимо указать email'})
function validate(
	validateMethod: ValidatorMethods,
	value: any,
	config: ValidationRule
): string | undefined {
	let statusValidate: boolean = false;

	switch (validateMethod) {
		case 'isRequired': {
			if (typeof value === 'boolean') {
				statusValidate = value === false;
				break;
			}
			if (Array.isArray(value)) {
				statusValidate = value.length === 0;
				break;
			}
			statusValidate = typeof value === 'string' && value.trim() === '';
			break;
		}
		case 'isEmail': {
			const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			statusValidate = typeof value === 'string' && !emailRegex.test(value);
			break;
		}
		case 'isCorrectPassword': {
			const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,30}$/;
			statusValidate = typeof value === 'string' && !passRegex.test(value);
			break;
		}
		case 'isCorrectName': {
			const nameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9 ]{4,35}$/u;
			statusValidate = typeof value === 'string' && !nameRegex.test(value);
			break;
		}
		case 'isCorrectBirthDate': {
			const birthDateRegex = /^(19|20)\d{2}$/;
			function checkAge(year: string) {
				const currentYear = new Date().getFullYear();
				const birthYear = parseInt(year, 10);
				const age = currentYear - birthYear;
				// Проверяем, что год валиден и пользователю минимум 14 лет
				return birthDateRegex.test(year) && age >= 14;
			}

			statusValidate =
				typeof value === 'string' &&
				checkAge(value) &&
				!birthDateRegex.test(value);
			break;
		}
		default:
			break;
	}

	if (statusValidate) {
		return config.message;
	}
}

// Типы для методов валидации
export type ValidatorMethods =
	| 'isRequired'
	| 'isEmail'
	| 'isCorrectPassword'
	| 'isCorrectName'
	| 'isCorrectBirthDate';

// Типы для правил валидации
export interface ValidationRule {
	message: string;
}

// Тип конфигурации валидации
export type ValidatorConfig<T> = {
	[K in keyof T]?: Partial<Record<ValidatorMethods, ValidationRule>>;
};

// Тип результата валидации
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;
