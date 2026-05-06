const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Funcionario extends Model {}

Funcionario.init(
  {
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [11, 11],
      },
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: true, // o RH pode por depois
    },
  },
  {
    sequelize,
    modelName: "Funcionario",
    tableName: "funcionarios",
  },
);
