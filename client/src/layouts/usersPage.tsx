import UsersList from "../components/pages/usersListPage";
import User from "../components/pages/userPage";
import UserEditPage from "../components/pages/userEditPage";
import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../store/storeHooks";
import { getAuthUser } from "../store/users";

const Users = () => {
    const { userId, edit } = useParams();
    const authUser = useAppSelector(getAuthUser());

    if (userId && !edit) {
        return <User />;
    }
    if (userId && edit) {
        return userId === authUser?._id ? (
            <UserEditPage />
        ) : (
            <Navigate to={`/users/${authUser?._id}/edit`} />
        );
    }
    return <UsersList />;
};

export default Users;
