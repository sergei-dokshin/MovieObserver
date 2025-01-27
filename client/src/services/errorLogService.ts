import Rollbar from 'rollbar';

// Тип для контекста, который передается в методы логирования
type LogContext = Record<string, any>;

export const rollbarConfig = {
    accessToken: "b92949df62964bf18a0178915250007a",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        client: {
            javascript: {
                code_version: "1.0.0",
                source_map_enabled: true
            }
        }
    }
};

const rollbar = new Rollbar(rollbarConfig);

// Экспортируем функции для логирования ошибок
export const logError = (error: Error | string, context: LogContext = {}): void => {
  rollbar.error(error, context);
};

export const logInfo = (message: string, context: LogContext = {}): void => {
  rollbar.info(message, context);
};

export const logWarning = (message: string, context: LogContext = {}): void => {
  rollbar.warning(message, context);
};

export const logCritical = (error: Error | string, context: LogContext = {}): void => {
  rollbar.critical(error, context);
};

export default rollbar;
