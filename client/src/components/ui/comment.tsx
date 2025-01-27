import { formatDate } from '../../utils/dateFormatter';
import { CommentProps } from '../../types/comment.types';
import { useAppSelector } from '../../store/storeHooks';
import { getAuthUser } from '../../store/users';

const Comment: React.FC<CommentProps> = ({ data, onDelete, _id }) => {
	const authUser = useAppSelector(getAuthUser());
	const author = data.authorId;
	const isAllowedToDelete =
		authUser?._id === author._id || authUser?._id === data.userId;

	return (
		<div className="comment-container">
			<div className="comment-photo">
				<img
					className="comment-img"
					src=""
					alt="user photo"
					// src={`http://localhost:5000/${data.authorId.avatar}`}
					// alt={`${data.authorId.name} \nPhoto`}
				/>
			</div>
			<div className="comment-content">
				<div className="comment-header">
					<div className="comment-author">
						<p className="comment-author-name">{author.name}</p>
						<p className="comment-date">{formatDate(data.createdAt)}</p>
					</div>
					{isAllowedToDelete && (
						<i
							className="bi bi-x-circle delete-icon"
							onClick={() => onDelete(_id)}
						></i>
					)}
				</div>
				<div className="comment-text">{data.text}</div>
			</div>
		</div>
	);
};

export default Comment;
