
import { useState } from "react";
import "./InstalacionesSoftware.css";

function InstalacionesSoftware({
  equipos = [],
  instalaciones = [],
  setInstalaciones,
}) {
  const formularioInicial = {
    id_activo: "",
    nombre: "",
    fabricante: "",
    version: "",
    arquitectura: "",
    tipo_licencia: "",
    clave_protegida: "",
    fecha_instalacion: "",
    fecha_vencimiento: "",
    fecha_retiro: "",
    estado_instalacion: "",
  };

  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarClaves, setMostrarClaves] = useState({});

  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  const abrirFormulario = () => {
    setFormulario(formularioInicial);
    setIdEdicion(null);
    setMensaje("");
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setFormulario(formularioInicial);
    setIdEdicion(null);
    setMensaje("");
    setMostrarFormulario(false);
  };

  const guardarInstalacion = (e) => {
    e.preventDefault();

    if (
      !formulario.id_activo ||
      !formulario.nombre.trim() ||
      !formulario.fecha_instalacion ||
      !formulario.estado_instalacion
    ) {
      setMensaje("Completa los campos obligatorios.");
      return;
    }

    if (
      formulario.fecha_vencimiento &&
      formulario.fecha_vencimiento < formulario.fecha_instalacion
    ) {
      setMensaje(
        "La fecha de vencimiento no puede ser anterior a la instalación."
      );
      return;
    }

    if (
      formulario.fecha_retiro &&
      formulario.fecha_retiro < formulario.fecha_instalacion
    ) {
      setMensaje(
        "La fecha de retiro no puede ser anterior a la instalación."
      );
      return;
    }

    if (
      formulario.estado_instalacion === "Retirada" &&
      !formulario.fecha_retiro
    ) {
      setMensaje(
        "Registra la fecha de retiro cuando la instalación esté retirada."
      );
      return;
    }

    if (idEdicion !== null) {
      setInstalaciones((actuales) =>
        actuales.map((instalacion) =>
          instalacion.id === idEdicion
            ? { ...instalacion, ...formulario }
            : instalacion
        )
      );
    } else {
      setInstalaciones((actuales) => [
        ...actuales,
        {
          id: Date.now(),
          ...formulario,
        },
      ]);
    }

    cerrarFormulario();
  };

  const editarInstalacion = (instalacion) => {
    setFormulario({
      id_activo: instalacion.id_activo ?? "",
      nombre: instalacion.nombre ?? "",
      fabricante: instalacion.fabricante ?? "",
      version: instalacion.version ?? "",
      arquitectura: instalacion.arquitectura ?? "",
      tipo_licencia: instalacion.tipo_licencia ?? "",
      clave_protegida: instalacion.clave_protegida ?? "",
      fecha_instalacion: instalacion.fecha_instalacion ?? "",
      fecha_vencimiento: instalacion.fecha_vencimiento ?? "",
      fecha_retiro: instalacion.fecha_retiro ?? "",
      estado_instalacion: instalacion.estado_instalacion ?? "",
    });

    setIdEdicion(instalacion.id);
    setMensaje("");
    setMostrarFormulario(true);
  };

  const eliminarInstalacion = (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar esta instalación?"
    );

    if (!confirmar) return;

    setInstalaciones((actuales) =>
      actuales.filter((instalacion) => instalacion.id !== id)
    );
  };

  const alternarClave = (id) => {
    setMostrarClaves((actuales) => ({
      ...actuales,
      [id]: !actuales[id],
    }));
  };

  const obtenerEquipo = (idActivo) =>
    equipos.find(
      (equipo) =>
        String(equipo.id) === String(idActivo) ||
        String(equipo.id_activo) === String(idActivo)
    );

  const instalacionesFiltradas = instalaciones.filter((instalacion) => {
    const termino = busqueda.toLowerCase();

    const equipo = obtenerEquipo(instalacion.id_activo);

    return (
      (instalacion.nombre || "").toLowerCase().includes(termino) ||
      (instalacion.fabricante || "").toLowerCase().includes(termino) ||
      (instalacion.version || "").toLowerCase().includes(termino) ||
      (equipo?.numero_inventario || "").toLowerCase().includes(termino)
    );
  });

  const equipoSeleccionado = (idActivo) => obtenerEquipo(idActivo);

  return (
    <section className="instalaciones-page">
      <div className="instalaciones-encabezado">
        <div>
          <h2>Instalaciones de software</h2>
          <p>
            Administra los programas instalados en los activos tecnológicos.
          </p>
        </div>

        <button
          className="btn-nueva-instalacion"
          onClick={abrirFormulario}
        >
          + Nueva instalación
        </button>
      </div>

      <div className="instalaciones-resumen">
        <article className="instalacion-indicador">
          <span>Total de instalaciones</span>
          <strong>{instalaciones.length}</strong>
        </article>

        <article className="instalacion-indicador">
          <span>Instalaciones activas</span>
          <strong>
            {
              instalaciones.filter(
                (item) => item.estado_instalacion === "Activa"
              ).length
            }
          </strong>
        </article>

        <article className="instalacion-indicador">
          <span>Instalaciones retiradas</span>
          <strong>
            {
              instalaciones.filter(
                (item) => item.estado_instalacion === "Retirada"
              ).length
            }
          </strong>
        </article>
      </div>

      <div className="instalaciones-tabla-contenedor">
        <div className="instalaciones-busqueda">
          <input
            type="text"
            placeholder="Buscar por programa, fabricante, versión o inventario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="instalaciones-tabla">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>Software</th>
              <th>Fabricante</th>
              <th>Versión</th>
              <th>Fecha de instalación</th>
              <th>Estado</th>
              <th>Clave</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {instalacionesFiltradas.length > 0 ? (
              instalacionesFiltradas.map((instalacion) => {
                const equipo = equipoSeleccionado(instalacion.id_activo);

                return (
                  <tr key={instalacion.id}>
                    <td>
                      {equipo?.numero_inventario || "Equipo no encontrado"}
                    </td>
                    <td>{instalacion.nombre}</td>
                    <td>{instalacion.fabricante || "No especificado"}</td>
                    <td>{instalacion.version || "No especificada"}</td>
                    <td>{instalacion.fecha_instalacion}</td>
                    <td>
                      <span className="estado-instalacion">
                        {instalacion.estado_instalacion}
                      </span>
                    </td>
                    <td>
                      {instalacion.clave_protegida ? (
                        <button
                          type="button"
                          className="btn-ver-clave"
                          onClick={() => alternarClave(instalacion.id)}
                        >
                          {mostrarClaves[instalacion.id]
                            ? "Ocultar"
                            : "Mostrar"}
                        </button>
                      ) : (
                        "Sin clave"
                      )}

                      {mostrarClaves[instalacion.id] && (
                        <div className="clave-consulta">
                          {instalacion.clave_protegida}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="instalaciones-acciones">
                        <button
                          className="btn-editar-instalacion"
                          onClick={() => editarInstalacion(instalacion)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn-eliminar-instalacion"
                          onClick={() => eliminarInstalacion(instalacion.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="sin-instalaciones">
                  {busqueda
                    ? "No se encontraron instalaciones."
                    : "Aún no hay instalaciones registradas."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarFormulario && (
        <div className="instalaciones-modal-fondo">
          <div className="instalaciones-modal">
            <div className="instalaciones-modal-encabezado">
              <h2>
                {idEdicion !== null
                  ? "Editar instalación"
                  : "Nueva instalación"}
              </h2>

              <button type="button" onClick={cerrarFormulario}>
                ×
              </button>
            </div>

            <form onSubmit={guardarInstalacion}>
              <h3>Información del activo y software</h3>

              <div className="instalaciones-form-grid">
                <div>
                  <label>Activo *</label>
                  <select
                    name="id_activo"
                    value={formulario.id_activo}
                    onChange={actualizarCampo}
                    required
                  >
                    <option value="">Selecciona un equipo</option>

                    {equipos.map((equipo) => (
                      <option
                        key={equipo.id ?? equipo.id_activo}
                        value={equipo.id ?? equipo.id_activo}
                      >
                        {equipo.numero_inventario || "Sin inventario"} -{" "}
                        {equipo.marca || ""} {equipo.modelo || ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Nombre del software *</label>
                  <input
                    name="nombre"
                    value={formulario.nombre}
                    onChange={actualizarCampo}
                    placeholder="Nombre del programa"
                    required
                  />
                </div>

                <div>
                  <label>Fabricante</label>
                  <input
                    name="fabricante"
                    value={formulario.fabricante}
                    onChange={actualizarCampo}
                    placeholder="Fabricante"
                  />
                </div>

                <div>
                  <label>Versión</label>
                  <input
                    name="version"
                    value={formulario.version}
                    onChange={actualizarCampo}
                    placeholder="Versión del software"
                  />
                </div>

                <div>
                  <label>Arquitectura</label>
                  <input
                    name="arquitectura"
                    value={formulario.arquitectura}
                    onChange={actualizarCampo}
                    placeholder="Ej. 32 bits o 64 bits"
                  />
                </div>

                <div>
                  <label>Tipo de licencia</label>
                  <input
                    name="tipo_licencia"
                    value={formulario.tipo_licencia}
                    onChange={actualizarCampo}
                    placeholder="Tipo de licencia"
                  />
                </div>

                <div>
                  <label>Clave protegida</label>
                  <input
                    type="password"
                    name="clave_protegida"
                    value={formulario.clave_protegida}
                    onChange={actualizarCampo}
                    placeholder="Clave de licencia"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label>Estado de instalación *</label>
                  <select
                    name="estado_instalacion"
                    value={formulario.estado_instalacion}
                    onChange={actualizarCampo}
                    required
                  >
                    <option value="">Selecciona un estado</option>
                    <option value="Activa">Activa</option>
                    <option value="Retirada">Retirada</option>
                  </select>
                </div>
              </div>

              <h3>Fechas de instalación</h3>

              <div className="instalaciones-form-grid">
                <div>
                  <label>Fecha de instalación *</label>
                  <input
                    type="date"
                    name="fecha_instalacion"
                    value={formulario.fecha_instalacion}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div>
                  <label>Fecha de vencimiento</label>
                  <input
                    type="date"
                    name="fecha_vencimiento"
                    value={formulario.fecha_vencimiento}
                    onChange={actualizarCampo}
                  />
                </div>

                <div>
                  <label>Fecha de retiro</label>
                  <input
                    type="date"
                    name="fecha_retiro"
                    value={formulario.fecha_retiro}
                    onChange={actualizarCampo}
                  />
                </div>
              </div>

              {mensaje && (
                <p className="mensaje-instalacion">{mensaje}</p>
              )}

              <div className="instalaciones-modal-acciones">
                <button type="button" onClick={cerrarFormulario}>
                  Cancelar
                </button>

                <button type="submit">
                  {idEdicion !== null
                    ? "Guardar cambios"
                    : "Registrar instalación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default InstalacionesSoftware;
