import MultiSelect, { MultiValue } from 'react-select';
import styles from './multiSelectInput.module.css';

const MultiSelectInput = <T extends Record<string, any>>(
	props: MultiSelectProps<T>
) => {
	const { labelText, optionsArray, value, setInputData } = props;

	function handleChangeMultiField(readOnlyArray: MultiValue<Option>) {
		// Преобразуем readOnlyArray в обычный массив (MultiValue - тип из библиотеки react-select)
		const array = Array.from(readOnlyArray);

		setInputData((prev: T) => ({
			...prev,
			hobbies: array
		}));
	}

	return (
		<div className={styles.mainContainer}>
			<label htmlFor="hobbies">
				{labelText}
			</label>
			<div>
				<MultiSelect
					isMulti
					options={optionsArray}
					defaultValue={value}
					value={value}
					onChange={handleChangeMultiField}
					name="hobbies"
					className={styles.MultiInput}
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
			</div>
		</div>
	);
};

interface MultiSelectProps<T> {
	labelText: string;
	optionsArray: Option[];
	value: Option[];
	setInputData: (updateFn: (prevState: T) => T) => void;
}

interface Option {
	value: string;
	label: string;
	[key: string]: any; // Допускаем любые другие свойства с любыми типами
}

export default MultiSelectInput;
