// a custom error handler function that takes in a status code and a message and returns an error object with the status code and message
export const errorHandler = (statusCode, message) => {
    const error = new Error()
    error.statusCode = statusCode
    error.message = message
    return error;
};