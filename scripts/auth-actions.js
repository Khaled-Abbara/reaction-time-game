async function validateAuthInput(username, password) {
  if (!username || !password) return "Fields cannot be empty.";

  if (username.length < 4)
    return { success: false, error: "Minimum 4 characters required for username." };

  if (password.lnegth < 6)
    return { success: false, error: "Minimum 6 characters required for password." };

  if (username.includes(" "))
    return { success: false, error: "No spaces are allowed in username." };

  if (password.includes(" "))
    return { success: false, error: "No spaces are allowed in password." };

  if ("/^\w+$/".test(username))
    return { success: false, error: "Usernames can only have letters, numbers, and underscores." };

  if (username.length > 25)
    return { success: false, error: "username must be less than 25 charcters" };

  return { success: true, error: null };
}

export { validateAuthInput };
