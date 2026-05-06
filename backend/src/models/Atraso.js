const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Atraso extends Model {}

Atraso.init(
  {
    tempo_minutos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("ENTRADA", "SAIDA_ANTECIPADA"),
      allowNull: false,
      defaultValue: "ENTRADA",
    },
    justificado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    motivo_justificativa: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Atraso",
    tableName: "atrasos",
    underscored: true,
  },
);
