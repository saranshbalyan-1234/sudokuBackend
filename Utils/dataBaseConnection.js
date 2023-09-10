
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
//Main

import User from "../User/Models/User.js";
import UserFriend from "../User/Models/UserFriend.js";


dotenv.config();
const sequelize = await createDBConnection(
  {
    db: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    host: process.env.DATABASE_HOST,
    port: 3306,
    dialect: "mysql",
  })


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize.dialect.supports.schemas = true;



db.users = User(sequelize, DataTypes);
db.userFriends = UserFriend(sequelize, DataTypes)

db.users
  .schema(process.env.DATABASE_NAME)
  .sync({ force: true, alter: true });

// db.jobs
//   .schema("automation_saransh2yopmailcom")
//   .sync({ force: true, alter: true })
// db.jobManagers
//   .schema("automation_saransh2yopmailcom")
//   .sync({ force: true, alter: true })

// db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }).then(function () {
//   db.sequelize.query(" DROP TABLE automation_m2pfintechmailsaccom.schedulers;");
// });
// db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }).then(function () {
//   db.sequelize.query(" ALTER TABLE automation_m2pfintechmailsaccom.testSteps ADD enable tinyint NOT NULL DEFAULT(1)");
// });

// await db.scheduler.schema("automation_m2pfintechmailsaccom").sync({ alter: true, });

export default db;




export async function createDBConnection(data) {

  try {
    let connectionData = data
    // console.log("Connection Details: ")
    // console.log(connectionData)
    const { host, port, dialect, user, password, db } = connectionData

    if (!host || !port || !dialect || user, !password || !db) throw new Error("Insuffiecient Connection Details")
    const sequelize = new Sequelize(db, user, password,
      {
        host,
        dialect,
        port,
        logging: false,
        dialectOptions: {
          ssl: {
            require: true, // This will help you. But you will see nwe error
            rejectUnauthorized: false // This line will fix new error
          }
        }
      },

    );

    await sequelize
      .authenticate()
      .then(() => {
        console.log("Database Connected: ", `${dialect} => ${host}:${port}`);
      })
      .catch((err) => {
        console.log("Sequalize Error");
        console.log(connectionData)
        console.log(err)
      });

    return sequelize
  } catch (err) {
    console.log(err)
  }
}
