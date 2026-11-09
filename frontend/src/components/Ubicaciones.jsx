
import { useState } from "react";
import "./Ubicaciones.css";

const formularioInicial = {
  nombre_ubicacion: "",
  edificio: "",
  piso: "",
  oficina_area: "",
  descripcion: "",
  estado: "Activo",
};

function Ubicaciones({ ubicaciones = [], setUbicaciones }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [busqueda, setBusqueda] = useState("");
  const [ubicacionEditando, setUbicacionEditando] = useState(null);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setUbicacionEditando(null);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!formulario.nombre_ubicacion.trim()) {
      alert("Escribe el nombre de la ubicación.");
      return;
    }

    if (ubicacionEditando !== null) {
      setUbicaciones((ubicacionesAnteriores) =>
        ubicacionesAnteriores.map((ubicacion) =>
          ubicacion.id_ubicacion === ubicacionEditando
            ? { ...formulario, id_ubicacion: ubicacionEditando }
            : ubicacion
        )
      );
    } else {
      const nuevaUbicacion = {
        ...formulario,
        id_ubicacion: Date.now(),
      };

      setUbicaciones((ubicacionesAnteriores) => [
        ...ubicacionesAnteriores,
        nuevaUbicacion,
      ]);
    }

    limpiarFormulario();
  };

  const editarUbicacion = (ubicacion) => {
    setFormulario({
      nombre_ubicacion: ubicacion.nombre_ubicacion || "",
      edificio: ubicacion.edificio || "",
      piso: ubicacion.piso || "",
      oficina_area: ubicacion.oficina_area || "",
      descripcion: ubicacion.descripcion || "",
      estado: ubicacion.estado || "Activo",
    });

    setUbicacionEditando(ubicacion.id_ubicacion);
  };

  const eliminarUbicacion = (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar esta ubicación?"
    );

    if (!confirmar) return;

    setUbicaciones((ubicacionesAnteriores) =>
      ubicacionesAnteriores.filter(
        (ubicacion) => ubicacion.id_ubicacion !== id
      )
    );

    if (ubicacionEditando === id) {
      limpiarFormulario();
    }
  };

  const ubicacionesFiltradas = ubicaciones.filter((ubicacion) => {
    const texto = busqueda.toLowerCase();

    return (
      ubicacion.nombre_ubicacion?.toLowerCase().includes(texto) ||
      ubicacion.edificio?.toLowerCase().includes(texto) ||
      ubicacion.piso?.toLowerCase().includes(texto) ||
      ubicacion.oficina_area?.toLowerCase().includes(texto) ||
      ubicacion.descripcion?.toLowerCase().includes(texto)
    );
  });

  return (
    <section className="ubicaciones-container">
      <div className="ubicaciones-encabezado">
        <div>
          <h2>Ubicaciones</h2>
          <p>Administra las ubicaciones físicas de los equipos tecnológicos.</p>
        </div>

        <div className="ubicaciones-total">
          <span>Total de ubicaciones</span>
          <strong>{ubicaciones.length}</strong>
        </div>
      </div>

      <form className="ubicaciones-formulario" onSubmit={manejarEnvio}>
        <h3>
          {ubicacionEditando !== null
            ? "Editar ubicación"
            : "Registrar ubicación"}
        </h3>

        <div className="ubicaciones-grid">
          <div className="ubicaciones-campo">
            <label>Nombre de la ubicación *</label>
            <input
              type="text"
              name="nombre_ubicacion"
              value={formulario.nombre_ubicacion}
              onChange={manejarCambio}
              placeholder="Ej. Oficina de TI"
              required
            />
          </div>

          <div className="ubicaciones-campo">
            <label>Edificio o sede</label>
            <input
              type="text"
              name="edificio"
              value={formulario.edificio}
              onChange={manejarCambio}
              placeholder="Nombre del edificio o sede"
            />
          </div>

          <div className="ubicaciones-campo">
            <label>Piso</label>
            <input
              type="text"
              name="piso"
              value={formulario.piso}
              onChange={manejarCambio}
              placeholder="Ej. Planta baja, piso 1"
            />
          </div>

          <div className="ubicaciones-campo">
            <label>Oficina o área</label>
            <input
              type="text"
              name="oficina_area"
              value={formulario.oficina_area}
              onChange={manejarCambio}
              placeholder="Ej. Soporte técnico"
            />
          </div>

          <div className="ubicaciones-campo ubicaciones-campo-completo">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Información adicional de la ubicación"
              rows="3"
            />
          </div>

          <div className="ubicaciones-campo">
            <label>Estado</label>
            <select
              name="estado"
              value={formulario.estado}
              onChange={manejarCambio}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="ubicaciones-acciones-formulario">
          <button type="submit" className="ubicaciones-btn-guardar">
            {ubicacionEditando !== null
              ? "Guardar cambios"
              : "Registrar ubicación"}
          </button>

          {ubicacionEditando !== null && (
            <button
              type="button"
              className="ubicaciones-btn-cancelar"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="ubicaciones-listado">
        <div className="ubicaciones-listado-encabezado">
          <div>
            <h3>Ubicaciones registradas</h3>
            <p>Consulta y administra las ubicaciones disponibles.</p>
          </div>

          <input
            type="search"
            className="ubicaciones-busqueda"
            placeholder="Buscar ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="ubicaciones-tabla-contenedor">
          <table className="ubicaciones-tabla">
            <thead>
              <tr>
                <th>Ubicación</th>
                <th>Edificio / sede</th>
                <th>Piso</th>
                <th>Oficina / área</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ubicacionesFiltradas.length > 0 ? (
                ubicacionesFiltradas.map((ubicacion) => (
                  <tr key={ubicacion.id_ubicacion}>
                    <td>{ubicacion.nombre_ubicacion}</td>
                    <td>{ubicacion.edificio || "—"}</td>
                    <td>{ubicacion.piso || "—"}</td>
                    <td>{ubicacion.oficina_area || "—"}</td>
                    <td>
                      <span
                        className={`ubicaciones-estado ${
                          ubicacion.estado === "Activo"
                            ? "estado-activo"
                            : "estado-inactivo"
                        }`}
                      >
                        {ubicacion.estado}
                      </span>
                    </td>
                    <td>
                      <div className="ubicaciones-acciones-tabla">
                        <button
                          type="button"
                          onClick={() => editarUbicacion(ubicacion)}
                          className="ubicaciones-btn-editar"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            eliminarUbicacion(ubicacion.id_ubicacion)
                          }
                          className="ubicaciones-btn-eliminar"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="ubicaciones-vacio">
                    No hay ubicaciones para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Ubicaciones;
