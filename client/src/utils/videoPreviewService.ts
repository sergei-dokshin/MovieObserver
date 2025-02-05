import axios from 'axios';

// функция ищет и возвращает ID видео(youtube)
export function extractYouTubeID(text: string): string | null {
	const regex =
		/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = text.match(regex);
	return match ? match[1] : null;
}

export async function getVideoData(
	text: string,
	setState: React.Dispatch<
		React.SetStateAction<{
			videoURL: string;
			videoDescription: string;
		}>
	>
) {
	const url = extractYouTubeURL(text);

	if (url) {
		try {
			const response = await axios.get(
				`https://www.youtube.com/oembed?url=${url}&format=json`
			);
			setState({
				videoURL: url,
				videoDescription: response.data.title
			});
		} catch (error) {
			setState({
				videoURL: '',
				videoDescription: ''
			});
		}
	} else {
		setState({
			videoURL: '',
			videoDescription: ''
		});
	}
}

// проверяем содержит ли комментарий ссылку на youtube видео. Возвращает ссылку если она найдена
const extractYouTubeURL = (text: string): string | null => {
	const regex =
		/(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[a-zA-Z0-9_-]+(?:[^\s]*)?)/;
	const match = text.match(regex);

	return match ? match[1] : null;
};

export function splitText(text: string, url: string) {
	if (url) {
		const parts = text.split(url); // Разбиваем текст на до и после ссылки
		return parts;
	} else {
		return null;
	}
}
