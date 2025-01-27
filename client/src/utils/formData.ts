import { User } from '../types/user.types';

export function formData(userData: User) {
	const formData = new FormData();

	// Добавляем аватар, если он существует
	if (userData.avatar) {
		formData.append('avatar', userData.avatar); // Добавляем файл
	}

	// Проверка и добавление других данных
	if (userData._id) {
		formData.append('_id', userData._id);
	}

	if (userData.name) {
		formData.append('name', userData.name);
	}

	if (userData.occupation) {
		formData.append('occupation', userData.occupation);
	}
	if (userData.birthDate !== undefined) {
		// Для числовых значений
		formData.append('birthDate', userData.birthDate.toString());
	}
	if (userData.email) {
		formData.append('email', userData.email);
	}
	if (userData.password) {
		formData.append('password', userData.password);
	}
	if (userData.wikiPage) {
		formData.append('wikiPage', userData.wikiPage);
	}

	// Добавляем хобби
	if (Array.isArray(userData.hobbies) && userData.hobbies.length > 0) {
		userData.hobbies.forEach((hobby) => {
			if (typeof hobby === 'string' || typeof hobby === 'object') {
				formData.append('hobbies[]', JSON.stringify(hobby));
			} else {
				console.warn('Некорректный формат хобби:', hobby);
			}
		});
	}

	return formData;
}
