import { useState } from "react";
import "./Asignacionessoft.css";
function Asignaciones() {
  // Catálogo temporal de software.
  // Después lo conectaremos con los registros de Activos y SQL Server.
  const [software] = useState([
    {
      id: 1,
      nombre: "Microsoft Office",
      version: "2021",
      total: 20,
    },
    {
      id: 2,
      nombre: "Antivirus",
      version: "2025",
      total: 15,
    },
  ]);

  // Registros de asignaciones.
  const [asignaciones, setAsignaciones] = useState([]);

  // Datos del formulario.
  const [formulario, setFormulario] = useState({
    softwareId: "",
    destino: "Usuario",
    responsable: "",
    fecha: new Date().toISOString().split("T")[0],
    observaciones: "",
  });

  const [mensaje, setMensaje] = useState("");

  // Actualizar los campos del formulario.
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // Calcular cuántas licencias están asignadas.
  const obtenerAsignadas = (softwareId) => {
    return asignaciones.filter(
      (item) =>
        item.softwareId === Number(softwareId) &&
        item.estado === "Asignada"
    ).length;
  };

  // Registrar una asignación.
  const registrarAsignacion = (e) => {
    e.preventDefault();

    if (
      !formulario.softwareId ||
      !formulario.responsable.trim() ||
      !formulario.fecha
    ) {
      setMensaje("Completa todos los campos obligatorios.");
      return;
    }

    const seleccionado = software.find(
      (item) => item.id === Number(formulario.softwareId)
    );

    const asignadas = obtenerAsignadas(seleccionado.id);
    const disponibles = seleccionado.total - asignadas;

    if (disponibles <= 0) {
      setMensaje("No hay licencias disponibles para este software.");
      return;
    }

    const nuevaAsignacion = {
      id: Date.now(),
      softwareId: seleccionado.id,
      software: seleccionado.nombre,
      version: seleccionado.version,
      destino: formulario.destino,
      responsable: formulario.responsable.trim(),
      fecha: formulario.fecha,
      observaciones: formulario.observaciones.trim(),
      estado: "Asignada",
    };

    setAsignaciones((anteriores) => [
      ...anteriores,
      nuevaAsignacion,
    ]);

    setFormulario({
      softwareId: "",
      destino: "Usuario",
      responsable: "",
      fecha: new Date().toISOString().split("T")[0],
      observaciones: "",
    });

    setMensaje("Asignación registrada correctamente.");
  };

  // Devolver una licencia al inventario.
  const devolverLicencia = (id) => {
    setAsignaciones((anteriores) =>
      anteriores.map((item) =>
        item.id === id
          ? { ...item, estado: "Devuelta" }
          : item
      )
    );

    setMensaje("Licencia devuelta correctamente.");
  };

  return (
    <div className="asignaciones-page">
      <div className="asignaciones-encabezado">
        <div>
          <h1>Asignación de software y licencias</h1>
          <p>
            Administra las licencias asignadas a usuarios y equipos.
          </p>
        </div>
      </div>

      {/* Resumen de licencias */}
      <div className="asignaciones-resumen">
        {software.map((item) => {
          const asignadas = obtenerAsignadas(item.id);
          const disponibles = item.total - asignadas;

          return (
            <div className="asignacion-tarjeta" key={item.id}>
              <h3>{item.nombre}</h3>
              <p>Versión: {item.version}</p>

              <div className="asignacion-estadisticas">
                <div>
                  <strong>{item.total}</strong>
                  <span>Total</span>
                </div>

                <div>
                  <strong>{asignadas}</strong>
                  <span>Asignadas</span>
                </div>

                <div>
                  <strong>{disponibles}</strong>
                  <span>Disponibles</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulario */}
      <section className="asignaciones-panel">
        <h2>Registrar nueva asignación</h2>

        <form onSubmit={registrarAsignacion}>
          <div className="asignaciones-formulario-grid">
            <div className="asignaciones-campo">
              <label>Software *</label>

              <select
                name="softwareId"
                value={formulario.softwareId}
                onChange={manejarCambio}
              >
                <option value="">Selecciona un software</option>

                {software.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre} - {item.version}
                  </option>
                ))}
              </select>
            </div>

            <div className="asignaciones-campo">
              <label>Tipo de asignación *</label>

              <select
                name="destino"
                value={formulario.destino}
                onChange={manejarCambio}
              >
                <option value="Usuario">Usuario</option>
                <option value="Equipo">Equipo</option>
              </select>
            </div>

            <div className="asignaciones-campo">
              <label>
                {formulario.destino === "Usuario"
                  ? "Nombre del usuario *"
                  : "Número de inventario o equipo *"}
              </label>

              <input
                type="text"
                name="responsable"
                value={formulario.responsable}
                onChange={manejarCambio}
                placeholder={
                  formulario.destino === "Usuario"
                    ? "Nombre del usuario"
                    : "Ej. ZI-0001"
                }
              />
            </div>

            <div className="asignaciones-campo">
              <label>Fecha de asignación *</label>

              <input
                type="date"
                name="fecha"
                value={formulario.fecha}
                onChange={manejarCambio}
              />
            </div>

            <div className="asignaciones-campo asignaciones-campo-completo">
              <label>Observaciones</label>

              <textarea
                name="observaciones"
                value={formulario.observaciones}
                onChange={manejarCambio}
                placeholder="Información adicional..."
                rows="3"
              />
            </div>
          </div>

          <button type="submit" className="asignaciones-boton">
            Registrar asignación
          </button>
        </form>

        {mensaje && (
          <p className="asignaciones-mensaje" role="status">
            {mensaje}
          </p>
        )}
      </section>

      {/* Tabla de asignaciones */}
      <section className="asignaciones-panel">
        <h2>Asignaciones registradas</h2>

        <div className="asignaciones-tabla-contenedor">
          <table className="asignaciones-tabla">
            <thead>
              <tr>
                <th>Software</th>
                <th>Destino</th>
                <th>Usuario / Equipo</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {asignaciones.length === 0 ? (
                <tr>
                  <td colSpan="6" className="asignaciones-vacio">
                    Todavía no hay asignaciones registradas.
                  </td>
                </tr>
              ) : (
                asignaciones.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.software}
                      <small>{item.version}</small>
                    </td>

                    <td>{item.destino}</td>
                    <td>{item.responsable}</td>
                    <td>{item.fecha}</td>

                    <td>
                      <span
                        className={
                          item.estado === "Asignada"
                            ? "estado-asignada"
                            : "estado-devuelta"
                        }
                      >
                        {item.estado}
                      </span>
                    </td>

                    <td>
                      {item.estado === "Asignada" && (
                        <button
                          type="button"
                          className="asignaciones-boton-devolver"
                          onClick={() => devolverLicencia(item.id)}
                        >
                          Devolver
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Asignaciones;
