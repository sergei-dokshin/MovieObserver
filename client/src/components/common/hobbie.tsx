import { Hobby } from '../../types/hobbies.types';

interface HobbieProps {
	hobbie: Hobby;
}

const Hobbie: React.FC<HobbieProps> = ({ hobbie }) => {
	if (hobbie && typeof hobbie !== 'string') {
		return (
			<p className="hobbie" style={{ backgroundColor: hobbie.type.color }}>
				{hobbie.value}
			</p>
		);
	}
};

export default Hobbie;
