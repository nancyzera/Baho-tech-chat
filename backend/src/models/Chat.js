import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Chat = sequelize.define("Chat", {
  message: DataTypes.TEXT,
  response: DataTypes.TEXT,
});

Chat.belongsTo(User, { foreignKey: "userId" });

export default Chat;
