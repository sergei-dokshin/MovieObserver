import useMockData from '../utils/mockData';

const Firebase = () => {
	const { initialize, progress, status } = useMockData();

	function handleUpload() {
		initialize();
	}

	return (
		<div className="page-content-container">
			<h3>Инициализация данных в Firebase</h3>
			<p>Статус: {status}</p>
			<p>Загрузка: {progress}%</p>
			<button className="btn btn-primary" onClick={handleUpload} disabled>
				Upload
			</button>
		</div>
	);
};

export default Firebase;
