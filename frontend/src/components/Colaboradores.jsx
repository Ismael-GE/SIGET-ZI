import { useState } from "react";
import "./Colaboradores.css";

function Colaboradores({ colaboradores = [], setColaboradores }) {
  const formularioInicial = {
    departamento: "",
    numero_empleado: "",
    nombre: "",
    apellidos: "",
    correo: "",
    puesto: "",
    telefono: "",
    estado_colaborador: "Activo",
  };

  const [formulario, setFormulario] = useState(formularioInicial);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [colaboradorEditando, setColaboradorEditando] = useState(null);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setModoEdicion(false);
    setColaboradorEditando(null);
    setMostrarFormulario(false);
  };

  const guardarColaborador = (e) => {
    e.preventDefault();

    if (
      !formulario.numero_empleado.trim() ||
      !formulario.nombre.trim() ||
      !formulario.apellidos.trim()
    ) {
      alert("Completa el número de empleado, nombre y apellidos.");
      return;
    }

    const numeroDuplicado = colaboradores.some(
      (colaborador) =>
        String(colaborador.numero_empleado).toLowerCase() ===
          formulario.numero_empleado.trim().toLowerCase() &&
        colaborador.id_colaborador !== colaboradorEditando
    );

    if (numeroDuplicado) {
      alert("Ya existe un colaborador con ese número de empleado.");
      return;
    }

    const datosColaborador = {
      ...formulario,
      departamento: formulario.departamento.trim(),
    };

    if (modoEdicion) {
      setColaboradores((anteriores) =>
        anteriores.map((colaborador) =>
          colaborador.id_colaborador === colaboradorEditando
            ? {
                ...datosColaborador,
                id_colaborador: colaboradorEditando,
              }
            : colaborador
        )
      );

      alert("Colaborador actualizado correctamente.");
    } else {
      const nuevoColaborador = {
        ...datosColaborador,
        id_colaborador: Date.now(),
      };

      setColaboradores((anteriores) => [
        ...anteriores,
        nuevoColaborador,
      ]);

      alert("Colaborador registrado correctamente.");
    }

    limpiarFormulario();
  };

  const editarColaborador = (colaborador) => {
    setFormulario({
      departamento: colaborador.departamento || "",
      numero_empleado: colaborador.numero_empleado || "",
      nombre: colaborador.nombre || "",
      apellidos: colaborador.apellidos || "",
      correo: colaborador.correo || "",
      puesto: colaborador.puesto || "",
      telefono: colaborador.telefono || "",
      estado_colaborador: colaborador.estado_colaborador || "Activo",
    });

    setColaboradorEditando(colaborador.id_colaborador);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const eliminarColaborador = (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este colaborador?"
    );

    if (!confirmar) return;

    setColaboradores((anteriores) =>
      anteriores.filter(
        (colaborador) => colaborador.id_colaborador !== id
      )
    );
  };

  const colaboradoresFiltrados = colaboradores.filter((colaborador) =>
    [
      colaborador.numero_empleado,
      colaborador.nombre,
      colaborador.apellidos,
      colaborador.departamento,
      colaborador.correo,
      colaborador.puesto,
    ]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <section className="colaboradores-container">
      <div className="colaboradores-header">
        <div>
          <h2>Colaboradores</h2>
          <p>Administración de colaboradores de la organización.</p>
        </div>

        <button
          className="colaboradores-btn-principal"
          onClick={() => {
            limpiarFormulario();
            setMostrarFormulario(true);
          }}
        >
          + Nuevo colaborador
        </button>
      </div>

      {mostrarFormulario && (
        <form
          className="colaboradores-formulario"
          onSubmit={guardarColaborador}
        >
          <h3>
            {modoEdicion ? "Editar colaborador" : "Registrar colaborador"}
          </h3>

          <div className="colaboradores-grid">
            <div className="colaborador-campo">
              <label>Número de empleado *</label>
              <input
                type="text"
                name="numero_empleado"
                value={formulario.numero_empleado}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="colaborador-campo">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="colaborador-campo">
              <label>Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={formulario.apellidos}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="colaborador-campo">
              <label>Departamento</label>
              <input
                type="text"
                name="departamento"
                value={formulario.departamento}
                onChange={manejarCambio}
                placeholder="Escribe el departamento"
              />
            </div>

            <div className="colaborador-campo">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={manejarCambio}
              />
            </div>

            <div className="colaborador-campo">
              <label>Puesto</label>
              <input
                type="text"
                name="puesto"
                value={formulario.puesto}
                onChange={manejarCambio}
              />
            </div>

            <div className="colaborador-campo">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formulario.telefono}
                onChange={manejarCambio}
              />
            </div>

            <div className="colaborador-campo">
              <label>Estado del colaborador</label>
              <select
                name="estado_colaborador"
                value={formulario.estado_colaborador}
                onChange={manejarCambio}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="colaboradores-acciones">
            <button
              type="submit"
              className="colaboradores-btn-principal"
            >
              {modoEdicion ? "Guardar cambios" : "Registrar colaborador"}
            </button>

            <button
              type="button"
              className="colaboradores-btn-secundario"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="colaboradores-busqueda">
        <input
          type="text"
          placeholder="Buscar por número, nombre, departamento, correo o puesto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="colaboradores-tabla-contenedor">
        <table className="colaboradores-tabla">
          <thead>
            <tr>
              <th>No. empleado</th>
              <th>Nombre completo</th>
              <th>Departamento</th>
              <th>Correo</th>
              <th>Puesto</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {colaboradoresFiltrados.length > 0 ? (
              colaboradoresFiltrados.map((colaborador) => (
                <tr key={colaborador.id_colaborador}>
                  <td>{colaborador.numero_empleado}</td>
                  <td>
                    {colaborador.nombre} {colaborador.apellidos}
                  </td>
                  <td>{colaborador.departamento || "—"}</td>
                  <td>{colaborador.correo || "—"}</td>
                  <td>{colaborador.puesto || "—"}</td>
                  <td>{colaborador.telefono || "—"}</td>
                  <td>
                    <span
                      className={
                        colaborador.estado_colaborador === "Activo"
                          ? "colaborador-estado activo"
                          : "colaborador-estado inactivo"
                      }
                    >
                      {colaborador.estado_colaborador}
                    </span>
                  </td>
                  <td>
                    <div className="colaborador-acciones-tabla">
                      <button
                        type="button"
                        onClick={() => editarColaborador(colaborador)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarColaborador(colaborador.id_colaborador)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="colaboradores-vacio">
                  No se encontraron colaboradores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="colaboradores-total">
        Total de colaboradores: {colaboradores.length}
      </p>
    </section>
  );
}

export default Colaboradores;