import { Hobby } from "../types/hobbies.types";

export function getHobbiesByIds(hobbiesIds: string[], allHobbies: Hobby[]) {
    const array = [];
    for (const hobbyId of hobbiesIds) {
        for (const hobby of allHobbies) {
            if (hobbyId === hobby._id) {
                array.push(hobby);
                break; // останавливаем проход по внутреннему циклу, если найдено совпадение
            }
        }
    }
    return array;
}
