import { User } from './user.types';

export interface CommentData {
	_id: string;
	userId: string;
	authorId: User;
	text: string;
	createdAt: Date;
}

export interface CommentProps {
	data: CommentData;
	onDelete: Function;
	_id: string;
}

export interface CommentsProps {
	currentPageUserId: string;
}
