class UnexpectedResponseError extends Error {
  constructor(message, response) {
    super(message);
    this.extraData = response?.data; // Step 2: Add custom fields
    this.name = "UnexpectedResponseError";
  }
}

export default UnexpectedResponseError;
