import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../main';
import { isAxiosError } from 'axios';
import http from '../services/httpService';
import { CommentData } from '../types/comment.types';
import { toastError } from '../utils/toastify';
import { toast } from 'react-toastify';


const initialState: CommentsState = {
	entities: [],
	isLoading: true,
	error: null
};

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		commentsRequested: (state) => {
			state.isLoading = true;
		},
		commentsRecieved: (state, action) => {
			state.entities = action.payload;
			state.isLoading = false;
		},
		commentsRequestFailed: (state, action) => {
			state.error = action.payload;
			state.isLoading = false;
		},
		commentCreated: (state, action) => {
			state.entities = [action.payload, ...state.entities];
		},
		commentDeleted: (state, action) => {
			state.entities = state.entities.filter((comment) => {
				return comment._id !== action.payload;
			});
		},
		commentDeleteFailed: (state, action) => {
			state.entities = action.payload;
		}
	}
});

const { actions, reducer: commentsReducer } = commentsSlice;
export const {
	commentsRecieved,
	commentsRequestFailed,
	commentsRequested,
	commentCreated,
	commentDeleted,
	commentDeleteFailed
} = actions;

export function loadCommentsForUser(userId: string) {
	return async (dispatch: AppDispatch) => {
		dispatch(commentsRequested());
		try {
			// добавляем params для запроса комментариев для определенного пользователя
			const { data } = await http.get(`comments/${userId}`);
			dispatch(commentsRecieved(data));
		} catch (error) {
			if (isAxiosError(error)) {
				const { message } = error.response?.data.error;
				dispatch(commentsRequestFailed(message));
				toastError(message);
			} else {
				toastError('Непредвиденная ошибка при загрузке комментариев.');
			}
		}
	};
}

export function createNewComment(newComment: NewCommentData) {
	return async (dispatch: AppDispatch) => {
		try {
			const { status, data } = await http({
				method: 'post',
				url: `comments/create`,
				data: newComment
			});
			if (status !== 201) {
				throw new Error(`Unexpected response status: ${status}`);
			}
			dispatch(commentCreated(data));
			toast('🙌 Комментарий успешно создан!');
		} catch (error) {
			if (isAxiosError(error)) {
				console.log('error: ', error);

				const { message } = error.response?.data;
				dispatch(commentsRequestFailed(message));
				toastError(message);
			} else {
				toastError(
					'Непредвиденная ошибка при загрузке комментариев. Попробуйте позже.'
				);
			}
		}
	};
}

export function deleteComment(
	prevCommentsState: CommentData[],
	commentId: string
) {
	return async (dispatch: AppDispatch) => {
		dispatch(commentDeleted(commentId));
		try {
			const response = await http.delete(`/comments/${commentId}`);
			if (response.status !== 200) {
				throw new Error(`Unexpected response status: ${response.status}`);
			}
			toast('Комментарий успешно удалён.');
		} catch (error) {
			if (isAxiosError(error)) {
				dispatch(commentDeleteFailed(prevCommentsState));
				toastError('Не удалось удалить комментарий.');
			} else {
				toastError(
					'Непредвиденная ошибка при загрузке комментариев. Попробуйте позже.'
				);
			}
		}
	};
}

//               * SELECTORS *
export function getUserComments() {
	return (state: RootState) => state.hobbies.entities;
}

export function getCommentsLoadingStatus() {
	return (state: RootState) => state.hobbies.isLoading;
}

interface CommentsState {
	entities: CommentData[];
	isLoading: boolean;
	error: null | string;
}

interface NewCommentData {
	text: string;
	userId: string;
	authorId: string;
}

export default commentsReducer;
