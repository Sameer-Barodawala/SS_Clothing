exports.successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

exports.errorResponse = (message, details = null) => {
  return {
    success: false,
    error: {
      message,
      ...(details && { details })
    }
  };
};