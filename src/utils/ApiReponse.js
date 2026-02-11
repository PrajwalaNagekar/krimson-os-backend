class ApiResponse {
    constructor(statusCode, data, message = "Success", metadata = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        if (metadata) {
            this.metadata = metadata;
        }
    }

}

export { ApiResponse };
