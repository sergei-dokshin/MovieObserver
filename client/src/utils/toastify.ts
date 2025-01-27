import { toast, Bounce } from "react-toastify";

export function toastError(errorMessage: string) {
    return toast.error("🚫 " + errorMessage, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce
    });
}
