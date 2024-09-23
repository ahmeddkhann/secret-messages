class ApiResponse {
    constructor(success, message, isAcceptingMessage = undefined, messages = undefined) {
        this.success = success;
        this.message = message;
        this.isAcceptingMessage = isAcceptingMessage;
        this.messages = messages;
    }
}

export default ApiResponse;
