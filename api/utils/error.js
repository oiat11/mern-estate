export const errorHandler = (statusCode, message) => {
    const error = new Error()
    error.statusCOde = statuseCode
    error.message = message
    return error;
};