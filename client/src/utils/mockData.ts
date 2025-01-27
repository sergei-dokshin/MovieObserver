import { useEffect, useState } from "react";
import data from "../data-firebase";
import axios from "../services/httpService";

const useMockData = () => {
    const statusConsts = {
        idle: "Not started",
        pending: "In process",
        successed: "Ready",
        error: "Error occured"
    };
    const [error, setError] = useState<null | unknown>(null);
    const [status, setStatus] = useState(statusConsts.idle);
    const [progress, setProgress] = useState(0);
    const [count, setCount] = useState(0);
    const summCount =
        data.comments.length +
        data.hobbies.length +
        data.hobbyTypes.length +
        data.users.length;

    async function initialize() {
        try {
            for (const hobby of data.hobbies) {
                await axios.put("hobbies/" + hobby._id, hobby);
                incrementCount();
            }
            for (const user of data.users) {
                await axios.put("users/" + user._id, user);
                incrementCount();
            }
            for (const hType of data.hobbyTypes) {
                await axios.put("hobbyTypes/" + hType._id, hType);
                incrementCount();
            }
            for (const comment of data.comments) {
                await axios.put("comments/" + comment._id, comment);
                incrementCount();
            }
        } catch (error) {
            setError(error);
            setStatus(statusConsts.error);
        }
    }

    function incrementCount() {
        setCount((prev) => prev + 1);
    }

    function updateProgress() {
        if (count !== 0 && status === statusConsts.idle) {
            setStatus(statusConsts.pending);
        }
        const newProgress = Math.floor((count / summCount) * 100);
        if (progress < newProgress) {
            setProgress(() => newProgress);
        }
        if (newProgress == 100) {
            setStatus(statusConsts.successed);
        }
    }

    useEffect(() => {
        updateProgress();
    }, [count]);

    return { error, initialize, progress, status };
};

export default useMockData;
