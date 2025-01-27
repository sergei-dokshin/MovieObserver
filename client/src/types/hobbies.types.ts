export interface HobbyType {
    _id: string;
    name: string;
    color: string;
}

export interface Hobby {
    _id: string;
    value: string;
    label: string;
    type: HobbyType;
    color: string;
}


