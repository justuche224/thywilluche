export const logger = (message: string, type: "info" | "error" | "warn" | "debug", file: string) => {
    console.log(`[${type.toUpperCase()}] ${message} - ${file}`);
};