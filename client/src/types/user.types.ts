import { Hobby } from './hobbies.types';

export interface User {
	_id?: string;
	name: string;
	occupation: string;
	birthDate: '';
	hobbies: string[];
	email: string;
	password: string;
	wikiPage: string;
	avatar: File | string | null;
}

export interface UserWithHobbies extends Omit<User, 'hobbies'> {
	hobbies: Hobby[];
}
