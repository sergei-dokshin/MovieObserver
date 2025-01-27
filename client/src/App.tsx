import { Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/common/navBar";
import Firebase from "./layouts/FirebaseUpload";
import Users from "./layouts/usersPage";
import RegisterUserPage from "./components/pages/registerUserPage";
import LoginPage from "./components/pages/loginPage";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/common/protectedRoute";
import AppLoader from "./components/HOC/AppLoader";

function App() {
    return (
        <AppLoader>
            <NavBar />
            <Routes>
                {/* Открытые маршруты */}
                <Route path="/" element={<Firebase />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/:register" element={<RegisterUserPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                {/* Защищенные маршруты */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/users/:userId?/:edit?" element={<Users />} />
                </Route>
            </Routes>
            <ToastContainer />
        </AppLoader>
    );
}

export default App;
