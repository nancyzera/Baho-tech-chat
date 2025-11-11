
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Payment = sequelize.define("Payment", {
  amount: DataTypes.FLOAT,
  status: { type: DataTypes.STRING, defaultValue: "pending" },
});

Payment.belongsTo(User, { foreignKey: "userId" });

export default Payment;







