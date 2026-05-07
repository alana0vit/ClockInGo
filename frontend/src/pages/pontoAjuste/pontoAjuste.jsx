import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./PontoAjuste.css";

function PontoAjuste() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [atrasos, setAtrasos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [motivos, setMotivos] = useState({});

    useEffect(() => {
        carregarAtrasos();
    }, []);

    async function carregarAtrasos() {
        try {

            const response = await api.get(
                `/api/atrasos/funcionario/${user.cpf}`
            );

            setAtrasos(response.data);

        } catch (err) {

            toast.error("Erro ao carregar atrasos");

        } finally {

            setLoading(false);

        }
    }

    function handleMotivoChange(id, value) {

        setMotivos((prev) => ({
            ...prev,
            [id]: value,
        }));

    }

    async function justificarAtraso(id) {

        try {

            const motivo = motivos[id];

            if (!motivo || motivo.trim() === "") {
                toast.error("Digite uma justificativa");
                return;
            }

            await api.put(
                `/api/atrasos/${id}/justificar`,
                { motivo }
            );

            toast.success("Justificativa enviada");

            carregarAtrasos();

        } catch (err) {

            toast.error(
                err.response?.data?.erro ||
                "Erro ao justificar atraso"
            );

        }
    }

    return (
        <>
            <Header />

            <main className="ajuste-container">

                <div className="ajuste-card">

                    <h1>Ajuste de Ponto</h1>

                    <p className="subtitulo">
                        Justifique atrasos e saídas antecipadas
                    </p>

                    {
                        loading
                            ? (
                                <p>Carregando...</p>
                            )
                            : (
                                <div className="lista-atrasos">

                                    {
                                        atrasos.length === 0
                                            ? (
                                                <p>
                                                    Nenhum atraso encontrado
                                                </p>
                                            )
                                            : (
                                                atrasos.map((atraso) => (

                                                    <div
                                                        key={atraso.id}
                                                        className="atraso-item"
                                                    >

                                                        <div className="info-atraso">

                                                            <h3>
                                                                {
                                                                    atraso.tipo === "ENTRADA"
                                                                        ? "Atraso na entrada"
                                                                        : "Saída antecipada"
                                                                }
                                                            </h3>

                                                            <p>
                                                                {atraso.tempo_minutos} minutos
                                                            </p>

                                                            <span
                                                                className={
                                                                    atraso.justificado
                                                                        ? "status-ok"
                                                                        : "status-pendente"
                                                                }
                                                            >
                                                                {
                                                                    atraso.justificado
                                                                        ? "Justificado"
                                                                        : "Pendente"
                                                                }
                                                            </span>

                                                        </div>

                                                        {
                                                            !atraso.justificado && (
                                                                <div className="justificativa-box">

                                                                    <textarea
                                                                        placeholder="Digite sua justificativa..."
                                                                        value={motivos[atraso.id] || ""}
                                                                        onChange={(e) =>
                                                                            handleMotivoChange(
                                                                                atraso.id,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />

                                                                    <button
                                                                        onClick={() =>
                                                                            justificarAtraso(atraso.id)
                                                                        }
                                                                    >
                                                                        Enviar justificativa
                                                                    </button>

                                                                </div>
                                                            )
                                                        }

                                                    </div>

                                                ))
                                            )
                                    }

                                </div>
                            )
                    }

                </div>

            </main>
        </>
    );
}

export default PontoAjuste;