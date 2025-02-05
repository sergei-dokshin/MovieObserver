import { useEffect, useRef } from 'react';
import Comment from './comment';
import { CommentData, CommentsProps } from '../../types/comment.types';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { deleteComment, loadCommentsForUser } from '../../store/comments';
import NewCommentArea from './newCommentArea';

const Comments: React.FC<CommentsProps> = ({ currentPageUserId }) => {
	const dispatch = useAppDispatch();
	const commentsPrevState = useRef<CommentData[]>();
	const { entities: comments, isLoading } = useAppSelector(
		(state) => state.comments
	);

	function getCommentsForUser(userId: string) {
		dispatch(loadCommentsForUser(userId));
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
			<NewCommentArea
				currentPageUserId={currentPageUserId}
			/>
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
