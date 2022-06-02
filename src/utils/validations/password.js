export const validationPassword = (password) => {
  if (!password) {
    return { error: "Password is required", status: 422 };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      error: "Password must be at least one capital letter",
      status: 422,
    };
  }
  if (!/^(?=.*[a-z])/.test(password)) {
    return {
      error: "Password must be at least one lowercase letter",
      status: 422,
    };
  }
  if (!/(?=.*[0-9])/.test(password)) {
    return {
      error: "Password must have at least one number",
      status: 422,
    };
  }
  if (!/(?=.*[!@#\$%\^&\*])/.test(password)) {
    return {
      error: "Password must have at least one special character",
      status: 422,
    };
  }
  if (password.length < 8) {
    return {
      error: "Password is too short, minimum is 8 characters",
      status: 411,
    };
  }

  return false;
};
