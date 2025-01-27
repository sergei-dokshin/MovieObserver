export const formatDate = (date: string | Date) => {
    const dateObj = new Date(date); // Преобразуем строку в объект Date
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} - ${hours}:${minutes}`;
};