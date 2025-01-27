import {
    useContext,
    ReactNode,
    useState,
    createContext,
    useEffect,
    useRef
} from "react";
import { CommentData } from "../types/comment.types";
import http from "../services/httpService";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { useAppSelector } from "../store/storeHooks";
import { getAuthUser } from "../store/users";

const CommentsContext = createContext<CommentsContextType | null>(null);

const useComments = () => {
    const context = useContext(CommentsContext);
    if (!context) {
        throw new Error("useComments must be used within a CommentsProvider");
    }
    return context;
};

const CommentsProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [comments, setComments] = useState<CommentData[]>([]);
    const { userId } = useParams();
    const authUser = useAppSelector(getAuthUser())
    const commentsPrevState = useRef<CommentData[]>();

    async function getAllCommentsForUser() {
        try {
            // добавляем params для запроса комментариев для определенного пользователя
            const { data } = await http.get(`comments/`, {
                params: {
                    orderBy: '"userId"',
                    equalTo: `"${userId}"`
                }
            });
            if (data) {
                // создаем массив из объекта
                const transformedResponse = transformData(data);
                // сортируем по дате публикации(сначала новые)
                const orderedComments = transformedResponse.sort(
                    (a, b) => Number(b.createdAt) - Number(a.createdAt)
                );
                setComments(orderedComments);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const { code } = error;
                console.log(`Ошибка: ${code}`);
            } else {
                console.log("Не удалось загрузить комментарии: ", error);
            }
        }
    }

    function transformData(data: InputData | null | undefined): CommentData[] {
        return data
            ? Object.keys(data).map((key) => ({
                  ...data[key as keyof InputData]
              }))
            : [];
    }

    async function handleNewComment(newComment: string) {
        const commentToPost = {
            text: newComment,
            userId: userId,
            authorId: authUser?._id,
            createdAt: Date.now(),
            _id: nanoid()
        };
        try {
            const response = await http({
                method: "put",
                url: `comments/${commentToPost._id}`,
                data: commentToPost
            });

            if (response.status === 200) {
                const savedComment = response.data;
                setComments((prev: CommentData[]) => [savedComment, ...prev]);
                toast("Комментарий успешно создан!");
            } else {
                toast("Не удалось опубликовать комментарий");
                console.log(
                    "Не удалось опубликовать комментарий",
                    response.statusText
                );
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast("Не удалось опубликовать комментарий");
                console.error(
                    `Ошибка при публикации комментария: ${
                        error.response?.data?.message || "Неизвестная ошибка"
                    }`
                );
            } else {
                console.error("Ошибка при публикации комментария:", error);
            }
        }
    }

    const handleDeleteComment = async (_id: string) => {
        // сохраняем текущее состояние на случай ошибки
        commentsPrevState.current = comments;
        // сразу удаляем комментарий со страницы
        setComments((prev: CommentData[]) =>
            prev.filter((comment) => comment._id !== _id)
        );
        try {
            const response = await http.delete(`/comments/${_id}`);
            if (response.status !== 200) {
                throw new Error(
                    `Unexpected response status: ${response.status}`
                );
            }
        } catch (error) {
            toast("Не удалось удалить комментарий.");
            // в случае ошибки возвращаем состояние комментариев к прежнему
            setComments(commentsPrevState.current);
            console.error(
                "Ошибка при удалении комментария:",
                axios.isAxiosError(error)
                    ? error.response?.data?.message
                    : error
            );
        }
    };

    useEffect(() => {
        getAllCommentsForUser();
    }, [userId]);

    const value: CommentsContextType = {
        comments,
        setComments,
        userId,
        handleNewComment,
        handleDeleteComment
    };

    return (
        <CommentsContext.Provider value={value}>
            {children}
        </CommentsContext.Provider>
    );
};

// ИНТЕРФЕЙСЫ
interface CommentsContextType {
    comments: CommentData[];
    setComments: React.Dispatch<React.SetStateAction<CommentData[]>>;
    userId: string | undefined;
    handleNewComment: (newComment: string) => Promise<void>;
    handleDeleteComment: (_id: string) => Promise<void>;
}

interface UserProviderProps {
    children: ReactNode | null;
}

interface InputData {
    commentId: CommentData;
}

export { CommentsProvider, useComments };
