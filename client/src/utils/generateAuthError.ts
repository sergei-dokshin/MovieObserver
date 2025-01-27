export function generateAuthError(message: string) {
    switch (message) {
        case "INVALID_LOGIN_CREDENTIALS":
            return "Неверный логин или пароль.";

        case "EMAIL_EXISTS":
            return "Аккаунт с таким email уже существует.";
        case "USER_DISABLED":
            return "Аккаунт заблокирован. Обратитесь в службу поддержки.";
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
            return "Слишком много попыток входа. Попробуйте позже.";
        default:
            return "Ошибка входа. Попробуйте позже.";
    }
}
