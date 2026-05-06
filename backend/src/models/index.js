const sequelize = require("../config/database");

const Escala = require("./Escala");
const Departamento = require("./Departamento");
const Ponto = require("./Ponto");
const Atraso = require("./Atraso");
const Funcionario = require("./Funcionario");

Escala.hasMany(Departamento, { foreignKey: "escala_id" });
Departamento.belongsTo(Escala, { foreignKey: "escala_id" });

// Permite que um funcionário tenha uma escala diferente do departamento
Escala.hasMany(Funcionario, { foreignKey: "escala_id" });
Funcionario.belongsTo(Escala, { foreignKey: "escala_id" });

Departamento.hasMany(Funcionario, { foreignKey: "departamento_id" });
Funcionario.belongsTo(Departamento, { foreignKey: "departamento_id" });

Funcionario.hasMany(Ponto, { foreignKey: "funcionario_id" });
Ponto.belongsTo(Funcionario, { foreignKey: "funcionario_id" });

// Um ponto pode ter dois atrasos: chegou tarde (ENTRADA) e saiu cedo (SAIDA_ANTECIPADA)
Ponto.hasMany(Atraso, { foreignKey: "ponto_id" });
Atraso.belongsTo(Ponto, { foreignKey: "ponto_id" });

module.exports = {
  sequelize,
  Escala,
  Departamento,
  Funcionario,
  Ponto,
  Atraso,
};
