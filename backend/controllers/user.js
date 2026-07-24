const { UnauthorizedError, ValidationError } = require("../helper/customErrors");
const { bcryptHash, bcryptCompare } = require("../helper/bcrypt");

//* Current User
const currentUser = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    loggedUser.dataValues.email = req.headers.email;
    delete req.headers.email;

    res.json({ user: loggedUser });
  } catch (error) {
    next(error);
  }
};

//* Update User
const updateUser = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const {
      user: { password },
      user,
    } = req.body;

    Object.entries(user).forEach((entry) => {
      const [key, value] = entry;

      if (value !== undefined && key !== "password") loggedUser[key] = value;
    });

    if (password !== undefined || password !== "") {
      loggedUser.password = await bcryptHash(password);
    }

    await loggedUser.save();

    res.json({ user: loggedUser });
  } catch (error) {
    next(error);
  }
};

//* Change Password
const changePassword = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { user } = req.body;
    if (!user) throw new ValidationError("body is invalid");

    const { currentPassword, newPassword } = user;

    if (!currentPassword) {
      return res
        .status(422)
        .json({ errors: { currentPassword: ["is required"] } });
    }

    if (!newPassword) {
      return res.status(422).json({ errors: { newPassword: ["is required"] } });
    }

    if (newPassword.length < 8) {
      return res.status(422).json({ errors: { newPassword: ["is too short"] } });
    }

    const pwdOk = await bcryptCompare(currentPassword, loggedUser.password);
    if (!pwdOk) {
      return res
        .status(422)
        .json({ errors: { currentPassword: ["is incorrect"] } });
    }

    loggedUser.password = await bcryptHash(newPassword);
    await loggedUser.save();

    res.json({ user: loggedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { currentUser, updateUser, changePassword };
