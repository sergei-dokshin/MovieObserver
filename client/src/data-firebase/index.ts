import users from "./users.json";
import hobbies from "./hobbies.json";
import { comments } from "./comments";
import { hobbyTypes } from "./hobby_types";

function parseUsers(data: any[]): any[] {
    return data.map((item) => ({
        _id: item._id.$oid,
        name: item.name,
        birthDate: item.birthDate,
        hobbies: item.hobbies.map((hobby: { $oid: string }) => hobby.$oid),
        email: item.email,
        password: item.password,
        wikiPage: item.wikiPage,
        avatar: item.avatar,
        occupation: item.occupation
    }));
}

function parseHobbies(data: any[]): any[] {
    return data.map((item) => ({
        _id: item._id.$oid,
        type: item.type.$oid,
        value: item.value,
        label: item.label
    }));
}

const data = {
    users: parseUsers(users),
    hobbies: parseHobbies(hobbies),
    hobbyTypes,
    comments
};

export default data;
