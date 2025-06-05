const signup = (req, res) => {
  res.send("SignUp Route");
};

const login = (req, res) => {
  res.send("Login Route");
};
const logout = (req, res) => {
  res.send("Logout Route");
};

module.exports = {
  signup,
  login,
  logout,
};
