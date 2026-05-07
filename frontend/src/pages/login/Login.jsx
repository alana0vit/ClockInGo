import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"
import { toast } from "react-toastify";
import "./Login.css";

function Login() {
  const [cpf, setCpf] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", {
        cpf,
      });

      localStorage.setItem("user", JSON.stringify(response.data.funcionario));

      toast.success("Acesso liberado!");
      navigate("/dashboard");

    } catch (err) {
      toast.error("CPF não encontrado");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>ClockInGo</h2>

        <input
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>

        <p className="helper-text">
          Use seu CPF cadastrado para acessar
        </p>
      </form>
    </div>
  );
}

export default Login;