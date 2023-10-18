class UnexpectedResponseError extends Error {
  constructor(message, response) {
    super(message);
    this.responseData = response?.data; // Step 2: Add custom fields
    this.name = "UnexpectedResponseError";
  }
}

export default UnexpectedResponseError;
