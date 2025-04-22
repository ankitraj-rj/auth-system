const registerUser = async (req, res) => {
  res.send("Registerd !");
};

const loginUser = async (req, res) => {
  res.send("loggedin Successfully");
};

export { registerUser, loginUser };
