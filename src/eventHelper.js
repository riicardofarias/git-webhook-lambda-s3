exports.validateHookEvent = (event) => {
  if(process.env.GIT_WEBHOOK_SECRET !== event.secret) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid webhook secret" }),
    }
  }

  return false
}