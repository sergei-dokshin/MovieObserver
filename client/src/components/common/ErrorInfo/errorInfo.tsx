import styles from './errorInfo.module.css';

const ErrorInfo = ({ array, inputType, error }: ErrorInfoProps) => {
	return (
		<>
			<span className={`${styles.errorInfoIcon} ${error && styles.visible}`}>
				🛈
			</span>
			<ul className={styles.ul}>
				<li key="description">{`Требования к ${inputType}:`}</li>
				{array.map((message) => {
					return (
						<li className={styles.li} key={message.replace(/ /g, '')}>
							{`• ${message}`}
						</li>
					);
				})}
			</ul>
		</>
	);
};

interface ErrorInfoProps {
	array: string[];
	inputType: string;
	error: string;
}

export default ErrorInfo;
