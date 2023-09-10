import db from "../../Utils/dataBaseConnection.js";
import bcrypt from "bcryptjs";
import getError from "../../Utils/sequelizeError.js";

//Tenant
const User = db.users;

const register = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */

  try {
    const { password } = req.body;

    const hash = await bcrypt.hash(password, 8);
    await User.create({
      ...req.body,
      password: hash,
    });

    return res.status(200).json({
      message: "Registered successfuly",
    });
  } catch (error) {
    getError(error, res);
  }
};
const login = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: UserFriend,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });

    if (!user) throw new Error("User Not Registered");

    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated) throw new Error("Incorrect Password");

    if (isAuthenticated) return res.status(200).json(user);
    else return res.status(400).json({ error: "Invalid Credentials" });
  } catch (error) {
    getError(error, res);
  }
};

export { login, register };
