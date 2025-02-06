import { Hobby } from '../../../types/hobbies.types';
import styles from './hobbie.module.css';

interface HobbieProps {
	hobbie: Hobby;
}

const Hobbie: React.FC<HobbieProps> = ({ hobbie }) => {
	if (hobbie && typeof hobbie !== 'string') {
		return (
			<p
				className={styles.hobbie}
				style={{ backgroundColor: hobbie.type.color }}
			>
				{hobbie.value}
			</p>
		);
	}
};

export default Hobbie;
