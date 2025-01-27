const hobbiesService = require("../services/hobbiesService");

// Получить все хобби
exports.getAllHobbies = async (req, res) => {
    try {
        const hobbies = await hobbiesService.getAllHobbies();
        res.status(200).json(hobbies);
    } catch (error) {
        console.error("Error fetching hobbies:", error);
        res.status(500).json({ message: "Error fetching hobbies" });
    }
};
