import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./Dashboard.css";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [dataHora, setDataHora] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setDataHora(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatarData = (date) => {
        return date.toLocaleDateString("pt-BR");
    };

    const formatarHora = (date) => {
        return date.toLocaleTimeString("pt-BR");
    };

    const handleBaterPonto = async () => {
        setLoading(true);

        try {
            await api.post("/pontos", {
                nome: user.nome,
                data: formatarData(dataHora),
                hora: formatarHora(dataHora),
            });

            toast.success("Ponto registrado com sucesso!");
        } catch (err) {
            toast.error("Erro ao registrar ponto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <main className="dashboard-container">
                <div className="dashboard-card">
                    <h1>Olá, {user?.nome}</h1>
                    <h3 className="departamento">{user?.departamento}</h3>

                    <div className="relogio">
                        <p>{formatarData(dataHora)}</p>
                        <p className="hora">{formatarHora(dataHora)}</p>
                    </div>

                    <button
                        className="btn-ponto"
                        onClick={handleBaterPonto}
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : "Bater Ponto"}
                    </button>
                </div>
            </main>
        </>
    );
}

export default Dashboard;