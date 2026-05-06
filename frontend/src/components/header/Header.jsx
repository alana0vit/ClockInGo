import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/dashboard")}>
        ClockInGo
      </div>

      <nav className="nav">
        <button onClick={() => navigate("/historico")}>
          Histórico
        </button>

        <button onClick={() => navigate("/perfil")}>
          Perfil
        </button>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;