import axios from "../services/httpService";
import { toast } from "react-toastify";

export const tokenValidator = async (
    storageToken: string,
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
    try {
        const response = await axios.post(
            "/protected",
            null, // Тело запроса (POST без данных передается как null)
            {
                headers: {
                    Authorization: storageToken
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Invalid token");
        }
        console.log('tokenValidator response: ',response);
        setIsAuth(true);
        toast("Вы авторизированы");
    } catch (err) {
        localStorage.setItem("token", "");
        localStorage.setItem("authUserId", "");
        localStorage.setItem("authUserAvatar", "");
        setIsAuth(false);
    }
};