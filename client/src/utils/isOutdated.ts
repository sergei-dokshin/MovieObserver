export function isOutdated(date: number) {
    // если данные были получены более 10 минут назад
    if (Date.now() - date > 10 * 60 * 1000) {
        return true;
    }
    return false;
}
