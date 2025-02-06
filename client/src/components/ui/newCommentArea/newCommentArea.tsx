import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/storeHooks';
import { getAuthUser } from '../../../store/users';
import { createNewComment } from '../../../store/comments';
import {
	extractYouTubeID,
	getVideoData,
	splitText
} from '../../../utils/videoPreviewService';
import styles from './newCommentArea.module.css';

const NewCommentArea = ({ currentPageUserId }: NewCommAreaProps) => {
	const authUser = useAppSelector(getAuthUser());
	const dispatch = useAppDispatch();
	const [newComment, setNewComment] = useState('');
	const [videoData, setVideoData] = useState({
		videoURL: '',
		videoDescription: ''
	});
	const videoID = extractYouTubeID(newComment);
	// создаем массив, если в тексте присутствует ссылка на видео
	const splittedText = splitText(newComment, videoData.videoURL);

	function handleChange({ target }: React.ChangeEvent<HTMLTextAreaElement>) {
		if (target) {
			setNewComment(() => target.value);
		}
	}

	async function createComment(text: string) {
		if (authUser?._id) {
			const newComment = {
				text: text,
				userId: currentPageUserId,
				authorId: authUser._id
			};
			await dispatch(createNewComment(newComment));
			setNewComment('');
		}
	}

	useEffect(() => {
		getVideoData(newComment, setVideoData);
	}, [newComment]);

	return (
		<div>
			<p style={{ margin: '5px' }}>Создать новый комментарий: </p>
			<div className={styles.container}>
				<textarea
					className={styles.textarea}
					name="text"
					value={newComment}
					onChange={handleChange}
					placeholder="Напишите ваш комментарий..."
				></textarea>
				{videoID && splittedText && (
					<>
						<div className={styles.text}>{splittedText[0]}</div>
						<div className={styles.videoPreviewContainer}>
							{/* iframe - возвращает html разметку */}
							<iframe
								src={`https://www.youtube.com/embed/${videoID}`}
								allowFullScreen
								className={styles.videoPreviewIframe}
							></iframe>
							<p className={styles.videoPreviewDescription}>
								{videoData?.videoDescription}
							</p>
						</div>
						<div className={styles.text}>{splittedText[1]}</div>
					</>
				)}
				<button
					className={styles.button}
					onClick={() => createComment(newComment)}
				>
					Опубликовать
				</button>
			</div>
		</div>
	);
};

interface NewCommAreaProps {
	currentPageUserId: string;
}

export default NewCommentArea;
