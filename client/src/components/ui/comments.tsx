import { useEffect, useRef, useState } from 'react';
import Comment from './comment';
import { CommentData, CommentsProps } from '../../types/comment.types';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { getAuthUser } from '../../store/users';
import {
	createNewComment,
	deleteComment,
	loadCommentsForUser
} from '../../store/comments';

const Comments: React.FC<CommentsProps> = ({ currentPageUserId }) => {
	const dispatch = useAppDispatch();
	const { entities: comments, isLoading } = useAppSelector(
		(state) => state.comments
	);

	const authUser = useAppSelector(getAuthUser());
	const [newComment, setNewComment] = useState('');
	const commentsPrevState = useRef<CommentData[]>();

	function handleChange({ target }: React.ChangeEvent<HTMLTextAreaElement>) {
		if (target) {
			setNewComment(() => target.value);
		}
	}

	function getCommentsForUser(userId: string) {
		dispatch(loadCommentsForUser(userId));
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

	function removeComment(commentId: string) {
		commentsPrevState.current = comments;
		dispatch(deleteComment(commentsPrevState.current, commentId));
	}

	useEffect(() => {
		getCommentsForUser(currentPageUserId);
	}, [currentPageUserId]);

	return (
		<div className="comment-main-container">
			<div>
				<p style={{ margin: '5px' }}>Создать новый комментарий: </p>
				<div className="new-comment-container">
					<textarea
						className="comment-textarea"
						name="text"
						value={newComment}
						onChange={handleChange}
						placeholder="Напишите ваш комментарий..."
					></textarea>
					<button
						className="publish-button"
						onClick={() => createComment(newComment)}
					>
						Опубликовать
					</button>
				</div>
			</div>
			<div>
				<h3 style={{ margin: '5px' }}>Комментарии: </h3>
				{isLoading ? (
					<p>Загружаем комментарии...</p>
				) : comments && comments.length > 0 ? (
					<div>
						{comments.map((comment) => {
							return (
								<Comment
									key={comment._id.toString()}
									data={comment}
									onDelete={() => removeComment(comment._id)}
									_id={comment._id}
								/>
							);
						})}
					</div>
				) : (
					<p>Здесь пока никто не оставлял комментарии 😯</p>
				)}
			</div>
		</div>
	);
};

export default Comments;
