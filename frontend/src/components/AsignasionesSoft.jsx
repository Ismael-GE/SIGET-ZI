
import { useState } from "react";
import "./AsignacionesSoft.css";

function AsignacionesSoft({
  equipos = [],
  categorias = [],
  asignacionesSoftware = [],
  setAsignacionesSoftware,
  setMovimientosKardex,
}) {
  // Obtener el catálogo de software desde el inventario.
  const software = equipos
    .filter((equipo) => {
      const categoria = categorias.find(
        (item) =>
          String(item.id_tipo_activo) ===
          String(equipo.id_tipo_activo)
      );

      const nombreCategoria = (
        categoria?.categoria || equipo.tipo_activo || ""
      ).toLowerCase();

      return (
        nombreCategoria.includes("software") ||
        nombreCategoria.includes("licencia")
      );
    })
    .map((equipo) => ({
      id: equipo.id,
      nombre:
        equipo.nombre_software ||
        equipo.nombre ||
        "Software sin nombre",
      version: equipo.version_software || "Sin versión",
      total: Number(equipo.cantidad_licencias) || 0,
      numeroInventario: equipo.numero_inventario,
    }));

  // Datos del formulario.
  const [formulario, setFormulario] = useState({
    softwareId: "",
    destino: "Usuario",
    responsable: "",
    equipoId: "",
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

    setMensaje("");
  };

  // Calcular cuántas licencias están asignadas.
  const obtenerAsignadas = (softwareId) => {
    return asignacionesSoftware.filter(
      (item) =>
        Number(item.softwareId) === Number(softwareId) &&
        item.estado === "Asignada"
    ).length;
  };

  // Registrar una asignación.
  const registrarAsignacion = (e) => {
    e.preventDefault();

    if (!formulario.softwareId || !formulario.fecha) {
      setMensaje("Completa todos los campos obligatorios.");
      return;
    }

    if (
      formulario.destino === "Usuario" &&
      !formulario.responsable.trim()
    ) {
      setMensaje("Ingresa el nombre del usuario.");
      return;
    }

    if (
      formulario.destino === "Equipo" &&
      !formulario.equipoId
    ) {
      setMensaje("Selecciona un equipo del inventario.");
      return;
    }

    // Buscar el software seleccionado.
    const seleccionado = software.find(
      (item) => String(item.id) === String(formulario.softwareId)
    );

    if (!seleccionado) {
      setMensaje("Selecciona un software válido.");
      return;
    }

    // Comprobar disponibilidad de licencias.
    const asignadas = obtenerAsignadas(seleccionado.id);
    const disponibles = seleccionado.total - asignadas;

    if (disponibles <= 0) {
      setMensaje("No hay licencias disponibles para este software.");
      return;
    }

    // Buscar el equipo seleccionado.
    const equipoSeleccionado =
      formulario.destino === "Equipo"
        ? equipos.find(
            (equipo) =>
              String(equipo.id) === String(formulario.equipoId)
          )
        : null;

    if (
      formulario.destino === "Equipo" &&
      !equipoSeleccionado
    ) {
      setMensaje(
        "El equipo seleccionado ya no está disponible en el inventario."
      );
      return;
    }

    const idAsignacion = Date.now();

    const responsable =
      formulario.destino === "Usuario"
        ? formulario.responsable.trim()
        : equipoSeleccionado.numero_inventario;

    // Crear el registro de asignación.
    const nuevaAsignacion = {
      id: idAsignacion,
      softwareId: seleccionado.id,
      software: seleccionado.nombre,
      version: seleccionado.version,
      destino: formulario.destino,
      responsable,
      equipoId: equipoSeleccionado?.id ?? null,
      equipoNumeroInventario:
        equipoSeleccionado?.numero_inventario ?? null,
      fecha: formulario.fecha,
      observaciones: formulario.observaciones.trim(),
      estado: "Asignada",
    };

    setAsignacionesSoftware((anteriores) => [
      ...anteriores,
      nuevaAsignacion,
    ]);

    // Registrar movimiento en Kardex.
    const idMovimiento = Date.now() + 1;

    const nuevoMovimiento = {
      id: idMovimiento,
      id_evento: idMovimiento,
      id_activo: seleccionado.id,
      softwareId: seleccionado.id,
      software: seleccionado.nombre,
      version: seleccionado.version,
      numeroInventario: seleccionado.numeroInventario,
      fecha_evento: formulario.fecha,
      fechaMovimiento: formulario.fecha,
      tipoMovimiento: "Asignación de software",
      descripcion: `Asignación de ${seleccionado.nombre} a ${responsable}.`,
      estado_anterior: "Disponible",
      estado_nuevo: "Asignada",
      responsableAnterior: "",
      responsableNuevo: responsable,
      destino: formulario.destino,
      equipoId: equipoSeleccionado?.id ?? null,
      equipoNumeroInventario:
        equipoSeleccionado?.numero_inventario ?? null,
      observaciones: formulario.observaciones.trim(),
    };

    setMovimientosKardex((anteriores) => [
      ...anteriores,
      nuevoMovimiento,
    ]);

    // Limpiar formulario.
    setFormulario({
      softwareId: "",
      destino: "Usuario",
      responsable: "",
      equipoId: "",
      fecha: new Date().toISOString().split("T")[0],
      observaciones: "",
    });

    setMensaje("Asignación registrada correctamente.");
  };

  // Devolver una licencia.
  const devolverLicencia = (id) => {
    const asignacion = asignacionesSoftware.find(
      (item) => item.id === id
    );

    if (!asignacion || asignacion.estado !== "Asignada") {
      return;
    }

    const softwareRelacionado = software.find(
      (item) =>
        Number(item.id) === Number(asignacion.softwareId)
    );

    setAsignacionesSoftware((anteriores) =>
      anteriores.map((item) =>
        item.id === id
          ? { ...item, estado: "Devuelta" }
          : item
      )
    );

    const fechaDevolucion = new Date()
      .toISOString()
      .split("T")[0];

    const idMovimiento = Date.now();

    const movimientoDevolucion = {
      id: idMovimiento,
      id_evento: idMovimiento,
      id_activo: asignacion.softwareId,
      softwareId: asignacion.softwareId,
      software: asignacion.software,
      version: asignacion.version,
      numeroInventario:
        softwareRelacionado?.numeroInventario || "",
      fecha_evento: fechaDevolucion,
      fechaMovimiento: fechaDevolucion,
      tipoMovimiento: "Devolución de software",
      descripcion: `Devolución de ${asignacion.software} por ${asignacion.responsable}.`,
      estado_anterior: "Asignada",
      estado_nuevo: "Devuelta",
      responsableAnterior: asignacion.responsable,
      responsableNuevo: "Disponible",
      destino: asignacion.destino,
      equipoId: asignacion.equipoId ?? null,
      equipoNumeroInventario:
        asignacion.equipoNumeroInventario ?? null,
      observaciones: asignacion.observaciones || "",
    };

    setMovimientosKardex((anteriores) => [
      ...anteriores,
      movimientoDevolucion,
    ]);

    setMensaje("Licencia devuelta correctamente.");
  };

  // Obtener equipos físicos del inventario.
  const equiposFisicos = equipos.filter((equipo) => {
    const categoria = categorias.find(
      (item) =>
        String(item.id_tipo_activo) ===
        String(equipo.id_tipo_activo)
    );

    const nombreCategoria = (
      categoria?.categoria || equipo.tipo_activo || ""
    ).toLowerCase();

    return (
      !nombreCategoria.includes("software") &&
      !nombreCategoria.includes("licencia")
    );
  });

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
                onChange={(e) => {
                  manejarCambio(e);

                  setFormulario((anterior) => ({
                    ...anterior,
                    destino: e.target.value,
                    responsable: "",
                    equipoId: "",
                  }));
                }}
              >
                <option value="Usuario">Usuario</option>
                <option value="Equipo">Equipo</option>
              </select>
            </div>

            {formulario.destino === "Usuario" ? (
              <div className="asignaciones-campo">
                <label>Nombre del usuario *</label>

                <input
                  type="text"
                  name="responsable"
                  value={formulario.responsable}
                  onChange={manejarCambio}
                  placeholder="Nombre del usuario"
                />
              </div>
            ) : (
              <div className="asignaciones-campo">
                <label>Seleccionar equipo *</label>

                <select
                  name="equipoId"
                  value={formulario.equipoId}
                  onChange={manejarCambio}
                >
                  <option value="">Selecciona un equipo</option>

                  {equiposFisicos.map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.numero_inventario} -{" "}
                      {equipo.tipo_activo} -{" "}
                      {equipo.marca} {equipo.modelo}
                    </option>
                  ))}
                </select>

                {equiposFisicos.length === 0 && (
                  <small>
                    No hay equipos físicos registrados en el inventario.
                  </small>
                )}
              </div>
            )}

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

          <button
            type="submit"
            className="asignaciones-boton"
          >
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
              {asignacionesSoftware.length === 0 ? (
                <tr>
                  <td colSpan="6" className="asignaciones-vacio">
                    Todavía no hay asignaciones registradas.
                  </td>
                </tr>
              ) : (
                asignacionesSoftware.map((item) => (
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

export default AsignacionesSoft;
