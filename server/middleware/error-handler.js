export const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Invalid request data',
      response: "I'm sorry, there was an issue with your request. Please try rephrasing your message."
    });
  }

  if (err.message && err.message.includes('Python process')) {
    return res.status(503).json({
      error: 'AI service temporarily unavailable',
      response: "I'm experiencing some technical difficulties with my AI agents right now. Please try again in a moment, or contact support if the issue persists."
    });
  }

  if (err.message && err.message.includes('timeout')) {
    return res.status(504).json({
      error: 'Request timeout',
      response: "I'm taking longer than usual to respond. Please try again with a shorter message or try again in a moment."
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    response: "I'm sorry, I'm experiencing technical difficulties right now. Please try again in a moment."
  });
};