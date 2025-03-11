export default class NotFoundError {
    statusCode: number = 404;

    constructor(message?: string) {
        super(message);
    }
}