export default (sequelize, DataTypes) => {
  const UserRole = sequelize.define("userFriends", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
      },
      references: {
        model: "users",
        key: "id",
      },
      onDelete: 'CASCADE',
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
      },
      references: {
        model: "users",
        key: "id",
      },
      onDelete: 'CASCADE',
    },
  });


  sequelize.models.users.hasMany(sequelize.models.userFriends, {
    foreignKey: "userId",
    constraints: false,
  });

  sequelize.models.userFriends.hasOne(sequelize.models.users, {
    foreignKey: "id",
    constraints: false,
  });

  return UserRole;
};
