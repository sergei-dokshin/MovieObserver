import axios from "../services/httpService";

const getHobbies = async () => {
    const response = await axios.get(`/hobbies`);
    return response.data;
};

export const hobbiesService = {
    getHobbies
};
