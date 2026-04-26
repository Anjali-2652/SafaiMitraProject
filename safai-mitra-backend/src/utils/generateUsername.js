import User from "../models/user.model.js";

const generateUsername = async (full_name) => {
  const base = full_name.toLowerCase().replace(/[^a-z0-9]/g, "");
  let username = base;
  let count = 0;

  while (await User.findOne({ username })) {
    count++;
    username = `${base}${count}`; // Append count to base username
  }

  return username;
};

export default generateUsername;