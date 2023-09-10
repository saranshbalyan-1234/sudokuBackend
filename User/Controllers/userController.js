import db from "../../Utils/dataBaseConnection.js";
import bcrypt from "bcryptjs";
import getError from "../../Utils/sequelizeError.js";

//Tenant
const User = db.users;

const register = async (req, res) => {
  /*  #swagger.tags = ["Auth"] */

  try {
    const user = await User.create({
      ...req.body,
    });

    return res.status(200).json({
      message: user,
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

    return res.status(200).json(user);
  } catch (error) {
    getError(error, res);
  }
};

export { login, register };
