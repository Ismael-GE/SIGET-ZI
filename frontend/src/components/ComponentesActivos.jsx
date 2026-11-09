import { useState } from "react";
import "./ComponentesActivos.css";
function ComponentesActivos({
  equipos = [],
  componentes = [],
  setComponentes,
}) {
  const formularioInicial = {
    id_activo: "",
    tipo_componente: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    descripcion: "",
  };

  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [componenteEditando, setComponenteEditando] = useState(null);

  // Actualiza los campos del formulario.
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // Abre el formulario para registrar un componente.
  const abrirRegistro = () => {
    setFormulario(formularioInicial);
    setComponenteEditando(null);
    setMostrarFormulario(true);
  };

  // Guarda un componente nuevo o actualiza uno existente.
  const guardarComponente = (e) => {
    e.preventDefault();

    if (!formulario.id_activo || !formulario.tipo_componente.trim()) {
      alert("Selecciona un activo e indica el tipo de componente.");
      return;
    }

    if (typeof setComponentes !== "function") {
      alert("No se ha conectado el almacenamiento de componentes.");
      return;
    }

    if (componenteEditando !== null) {
      setComponentes((anteriores) =>
        anteriores.map((componente) =>
          componente.id === componenteEditando
            ? {
                ...formulario,
                id: componenteEditando,
              }
            : componente
        )
      );

      alert("Componente actualizado correctamente.");
    } else {
      const nuevoComponente = {
        ...formulario,
        id: Date.now(),
      };

      setComponentes((anteriores) => [
        ...anteriores,
        nuevoComponente,
      ]);

      alert("Componente registrado correctamente.");
    }

    cancelarRegistro();
  };

  // Prepara los datos para editar.
  const editarComponente = (componente) => {
    setFormulario({
      id_activo: String(componente.id_activo || ""),
      tipo_componente: componente.tipo_componente || "",
      marca: componente.marca || "",
      modelo: componente.modelo || "",
      numero_serie: componente.numero_serie || "",
      descripcion: componente.descripcion || "",
    });

    setComponenteEditando(componente.id);
    setMostrarFormulario(true);
  };

  // Elimina un componente.
  const eliminarComponente = (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este componente?"
    );

    if (!confirmar) return;

    setComponentes((anteriores) =>
      anteriores.filter((componente) => componente.id !== id)
    );

    alert("Componente eliminado correctamente.");
  };

  // Cierra y limpia el formulario.
  const cancelarRegistro = () => {
    setFormulario(formularioInicial);
    setComponenteEditando(null);
    setMostrarFormulario(false);
  };

  // Busca el activo relacionado.
  const obtenerActivo = (idActivo) => {
    return equipos.find(
      (equipo) =>
        String(equipo.id_activo || equipo.id) === String(idActivo)
    );
  };

  // Obtiene el nombre del activo.
  const obtenerNombreActivo = (idActivo) => {
    const activo = obtenerActivo(idActivo);

    return (
      activo?.numero_inventario ||
      activo?.numero_serie ||
      activo?.marca ||
      `Activo ${idActivo}`
    );
  };

  // Filtra los componentes.
  const componentesFiltrados = componentes.filter((componente) => {
    const activo = obtenerActivo(componente.id_activo);
    const textoBusqueda = busqueda.toLowerCase().trim();

    const datos = [
      componente.tipo_componente,
      componente.marca,
      componente.modelo,
      componente.numero_serie,
      componente.descripcion,
      activo?.numero_inventario,
      activo?.numero_serie,
    ];

    return datos.some((dato) =>
      String(dato || "").toLowerCase().includes(textoBusqueda)
    );
  });

  return (
    <div className="componentes-container">
      {/* ENCABEZADO */}
      <div className="componentes-header">
        <div>
          <h1>Componentes de activos</h1>
          <p>
            Administra los componentes asociados a los equipos tecnológicos.
          </p>
        </div>

        <button
          type="button"
          className="componente-btn componente-btn-primary"
          onClick={abrirRegistro}
        >
          + Registrar componente
        </button>
      </div>

      {/* BÚSQUEDA */}
      <div className="componentes-filtros">
        <input
          type="text"
          placeholder="Buscar componente o activo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* FORMULARIO */}
      {mostrarFormulario && (
        <form
          className="componentes-formulario"
          onSubmit={guardarComponente}
        >
          <h2>
            {componenteEditando !== null
              ? "Editar componente"
              : "Registrar componente"}
          </h2>

          <div className="componentes-formulario-grid">
            <div>
              <label htmlFor="id_activo">Activo relacionado</label>

              <select
                id="id_activo"
                name="id_activo"
                value={formulario.id_activo}
                onChange={manejarCambio}
                required
              >
                <option value="">Selecciona un activo</option>

                {equipos.map((equipo) => {
                  const id = equipo.id_activo || equipo.id;

                  return (
                    <option key={id} value={id}>
                      {equipo.numero_inventario ||
                        equipo.numero_serie ||
                        `Activo ${id}`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor="tipo_componente">Tipo de componente</label>

              <input
                id="tipo_componente"
                type="text"
                name="tipo_componente"
                value={formulario.tipo_componente}
                onChange={manejarCambio}
                placeholder="Ej. Memoria RAM"
                required
              />
            </div>

            <div>
              <label htmlFor="marca">Marca</label>

              <input
                id="marca"
                type="text"
                name="marca"
                value={formulario.marca}
                onChange={manejarCambio}
                placeholder="Marca del componente"
              />
            </div>

            <div>
              <label htmlFor="modelo">Modelo</label>

              <input
                id="modelo"
                type="text"
                name="modelo"
                value={formulario.modelo}
                onChange={manejarCambio}
                placeholder="Modelo del componente"
              />
            </div>

            <div>
              <label htmlFor="numero_serie">Número de serie</label>

              <input
                id="numero_serie"
                type="text"
                name="numero_serie"
                value={formulario.numero_serie}
                onChange={manejarCambio}
                placeholder="Número de serie"
              />
            </div>

            <div>
              <label htmlFor="descripcion">Descripción</label>

              <textarea
                id="descripcion"
                name="descripcion"
                value={formulario.descripcion}
                onChange={manejarCambio}
                placeholder="Descripción del componente"
              />
            </div>
          </div>

          <div className="componentes-formulario-acciones">
            <button
              type="button"
              className="componente-btn componente-btn-secondary"
              onClick={cancelarRegistro}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="componente-btn componente-btn-primary"
            >
              {componenteEditando !== null
                ? "Guardar cambios"
                : "Guardar componente"}
            </button>
          </div>
        </form>
      )}

      {/* TABLA DE COMPONENTES */}
      <div className="componentes-tabla-contenedor">
        <table className="componentes-tabla">
          <thead>
            <tr>
              <th>Activo</th>
              <th>Componente</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Número de serie</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {componentesFiltrados.length > 0 ? (
              componentesFiltrados.map((componente) => (
                <tr key={componente.id}>
                  <td>{obtenerNombreActivo(componente.id_activo)}</td>
                  <td>{componente.tipo_componente}</td>
                  <td>{componente.marca || "—"}</td>
                  <td>{componente.modelo || "—"}</td>
                  <td>{componente.numero_serie || "—"}</td>
                  <td>{componente.descripcion || "—"}</td>

                  <td>
                    <div className="componentes-acciones-tabla">
                      <button
                        type="button"
                        onClick={() => editarComponente(componente)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarComponente(componente.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="tabla-vacia">
                  {busqueda
                    ? "No se encontraron componentes."
                    : "Todavía no hay componentes registrados."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComponentesActivos;