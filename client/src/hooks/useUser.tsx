// import {
//     useContext,
//     createContext,
//     ReactNode,
//     useState,
//     useEffect
// } from "react";
// import { toast } from "react-toastify";
// import { tokenValidator } from "../utils/tokenValidator";
// import { FirebaseUserData } from "../types/user.types";
// import configFile from "../config.json";
// import { userService } from "../services/userService";
// import { useAuth } from "./useAuth";
// import { NavigateFunction, useNavigate } from "react-router-dom";

// const UserContext = createContext<UserContextType | null>(null);

// const useUser = () => {
//     const context = useContext(UserContext);
//     if (!context) {
//         throw new Error("useUsers must be used within a UserProvider");
//     }
//     return context;
// };

// const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
//     const [users, setUsers] = useState<FirebaseUserData[]>([]);
//     const { authUser } = useAuth();
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     async function getUsers() {
//         try {
//             const response = await userService.getAllUsers();
//             if (configFile.isFirebase) {
//                 const transformedResponse = transformData(response);
//                 setUsers(transformedResponse);
//             } else {
//                 setUsers(response.data);
//             }
//         } catch (err) {
//             console.log("Ошибка получения данных о пользователях: ", err);
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     function transformData(
//         data: InputData | null | undefined
//     ): FirebaseUserData[] {
//         return data
//             ? Object.keys(data).map((key) => ({
//                   ...data[key as keyof InputData]
//               }))
//             : [];
//     }

//     function getUserById(userId: string) {
//         return users.find((user) => user._id === userId);
//     }

//     useEffect(() => {
//         if (!isLoading && authUser && users) {
//             const newUsers = [...users];
//             const userIndex = newUsers.findIndex(
//                 (user) => user._id === authUser?._id
//             );
//             newUsers[userIndex] = authUser;
//             setUsers(newUsers);
//         }
//     }, [authUser]);

//     const value: UserContextType = {
//         users,
//         setUsers,
//         getUserById,
//         isLoading,
//         setIsLoading,
//         navigate
//     };

//     interface InputData {
//         userId: FirebaseUserData;
//     }

//     return (
//         <UserContext.Provider value={value}>{children}</UserContext.Provider>
//     );
// };

// // ИНТЕРФЕЙСЫ
// interface UserContextType {
//     users: FirebaseUserData[];
//     setUsers: React.Dispatch<React.SetStateAction<FirebaseUserData[]>>;
//     getUserById: Function;
//     isLoading: boolean;
//     setIsLoading: Function;
//     navigate: NavigateFunction;
// }

// interface UserProviderProps {
//     children: ReactNode | null;
// }

// export { UserProvider, useUser };
