
import { useState } from "react";
import "./ConfiguracionRed.css";

function ConfiguracionRed({ equipos = [] }) {
  // Lista temporal de configuraciones de red.
  const [configuraciones, setConfiguraciones] = useState([]);

  // Identifica el registro que se está editando.
  const [idEdicion, setIdEdicion] = useState(null);

  // Datos del formulario.
  const [datosFormulario, setDatosFormulario] = useState({
    id_activo: "",
    direccion_ip: "",
    direccion_mac: "",
    nombre_host: "",
    vlan: "",
    dominio: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado_configuracion: "",
  });

  // Actualiza el campo que el usuario modifica.
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setDatosFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // Limpia el formulario y cancela cualquier edición.
  const limpiarFormulario = () => {
    setDatosFormulario({
      id_activo: "",
      direccion_ip: "",
      direccion_mac: "",
      nombre_host: "",
      vlan: "",
      dominio: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado_configuracion: "",
    });

    setIdEdicion(null);
  };

  // Registra una configuración nueva o actualiza una existente.
  const guardarConfiguracion = (e) => {
    e.preventDefault();

    if (!datosFormulario.id_activo) {
        // Validar formato de dirección IPv4, si se proporcionó.
const ip = datosFormulario.direccion_ip.trim();

if (ip !== "") {
  const formatoIP =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  if (!formatoIP.test(ip)) {
    alert("La dirección IP no tiene un formato IPv4 válido.");
    return;
  }
}

// Validar formato de dirección MAC, si se proporcionó.
const mac = datosFormulario.direccion_mac.trim();

if (mac !== "") {
  const formatoMAC =
    /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/;

  if (!formatoMAC.test(mac)) {
    alert("La dirección MAC no tiene un formato válido.");
    return;
  }
}
      alert("Selecciona un activo tecnológico.");
      return;
    }

    if (
      datosFormulario.fecha_inicio &&
      datosFormulario.fecha_fin &&
      datosFormulario.fecha_fin < datosFormulario.fecha_inicio
    ) {
      alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    if (idEdicion !== null) {
      setConfiguraciones((anteriores) =>
        anteriores.map((configuracion) =>
          configuracion.id === idEdicion
            ? {
                ...datosFormulario,
                id: idEdicion,
                id_activo: Number(datosFormulario.id_activo),
              }
            : configuracion
        )
      );

      alert("Configuración actualizada correctamente.");
    } else {
      const nuevaConfiguracion = {
        ...datosFormulario,
        id: Date.now(),
        id_activo: Number(datosFormulario.id_activo),
      };

      setConfiguraciones((anteriores) => [
        ...anteriores,
        nuevaConfiguracion,
      ]);

      alert("Configuración registrada correctamente.");
    }

    limpiarFormulario();
  };

  // Carga los datos de una configuración en el formulario.
  const editarConfiguracion = (configuracion) => {
    setDatosFormulario({
      id_activo: String(configuracion.id_activo),
      direccion_ip: configuracion.direccion_ip || "",
      direccion_mac: configuracion.direccion_mac || "",
      nombre_host: configuracion.nombre_host || "",
      vlan: configuracion.vlan || "",
      dominio: configuracion.dominio || "",
      fecha_inicio: configuracion.fecha_inicio || "",
      fecha_fin: configuracion.fecha_fin || "",
      estado_configuracion: configuracion.estado_configuracion || "",
    });

    setIdEdicion(configuracion.id);
  };

  // Elimina una configuración después de solicitar confirmación.
  const eliminarConfiguracion = (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar esta configuración de red?"
    );

    if (!confirmar) {
      return;
    }

    setConfiguraciones((anteriores) =>
      anteriores.filter((configuracion) => configuracion.id !== id)
    );

    // Si se elimina el registro que estaba en edición,
    // también se limpia el formulario.
    if (idEdicion === id) {
      limpiarFormulario();
    }

    alert("Configuración eliminada correctamente.");
  };

  return (
    <div className="configuracion-red">
      {/* ENCABEZADO */}
      <div className="configuracion-red__encabezado">
        <div>
          <h1>Configuración de red</h1>
          <p>
            Administración de configuraciones de red de los activos tecnológicos.
          </p>
        </div>
      </div>

      {/* FORMULARIO */}
      <form
        className="configuracion-red__formulario"
        onSubmit={guardarConfiguracion}
      >
        <h2>
          {idEdicion !== null
            ? "Editar configuración"
            : "Registrar configuración"}
        </h2>

        <div className="configuracion-red__grid">
          <div className="configuracion-red__campo">
            <label htmlFor="id_activo">Activo tecnológico *</label>
            <select
              id="id_activo"
              name="id_activo"
              value={datosFormulario.id_activo}
              onChange={manejarCambio}
              required
            >
              <option value="">Selecciona un activo</option>

              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.numero_inventario} - {equipo.marca} {equipo.modelo}
                </option>
              ))}
            </select>
          </div>

          <div className="configuracion-red__campo">
            <label htmlFor="direccion_ip">Dirección IP</label>
            <input
              id="direccion_ip"
              type="text"
              name="direccion_ip"
              value={datosFormulario.direccion_ip}
              onChange={manejarCambio}
              placeholder="Ej. 192.168.1.10"
            />
          </div>

          <div className="configuracion-red__campo">
            <label htmlFor="direccion_mac">Dirección MAC</label>
            <input
              id="direccion_mac"
              type="text"
              name="direccion_mac"
              value={datosFormulario.direccion_mac}
              onChange={manejarCambio}
              placeholder="Ej. 00:1A:2B:3C:4D:5E"
            />
          </div>

          <div className="configuracion-red__campo">
            <label htmlFor="nombre_host">Nombre de host</label>
            <input
              id="nombre_host"
              type="text"
              name="nombre_host"
              value={datosFormulario.nombre_host}
              onChange={manejarCambio}
              placeholder="Nombre del equipo en la red"
            />
          </div>

          <div className="configuracion-red__campo">
            <label htmlFor="vlan">VLAN</label>
            <input
              id="vlan"
              type="text"
              name="vlan"
              value={datosFormulario.vlan}
              onChange={manejarCambio}
              placeholder="Identificador VLAN"
            />
          </div>

          <div className="configuracion-red__campo">
            <label htmlFor="dominio">Dominio</label>
            <input
              id="dominio"
              type="text"
              name="dominio"
              value={datosFormulario.dominio}
              onChange={manejarCambio}
              placeholder="Dominio de red"
            />
          </div>

          <div className="configuracion-red__campo">
            <label htmlFor="fecha_inicio">Fecha de inicio</label>
            <input
              id="fecha_inicio"
              type="date"
              name="fecha_inicio"
              value={datosFormulario.fecha_inicio}
              onChange={manejarCambio}
            />
          </div>

          <div className="configuracion-red__campo">
            <label htmlFor="fecha_fin">Fecha de fin</label>
            <input
              id="fecha_fin"
              type="date"
              name="fecha_fin"
              value={datosFormulario.fecha_fin}
              onChange={manejarCambio}
            />
          </div>

          <div className="configuracion-red__campo">
            <label htmlFor="estado_configuracion">
              Estado de configuración
            </label>
            <input
              id="estado_configuracion"
              type="text"
              name="estado_configuracion"
              value={datosFormulario.estado_configuracion}
              onChange={manejarCambio}
              placeholder="Estado de la configuración"
            />
          </div>
        </div>

        {/* BOTONES DEL FORMULARIO */}
        <div className="configuracion-red__acciones">
          <button type="button" onClick={limpiarFormulario}>
            {idEdicion !== null ? "Cancelar edición" : "Limpiar"}
          </button>

          <button type="submit">
            {idEdicion !== null
              ? "Actualizar configuración"
              : "Guardar configuración"}
          </button>
        </div>
      </form>

      {/* LISTADO DE CONFIGURACIONES */}
      <div className="configuracion-red__listado">
        <div className="configuracion-red__listado-encabezado">
          <h2>Configuraciones registradas</h2>
          <span>{configuraciones.length} registros</span>
        </div>

        {configuraciones.length === 0 ? (
          <p className="configuracion-red__vacio">
            No hay configuraciones de red registradas.
          </p>
        ) : (
          <div className="configuracion-red__tabla-contenedor">
            <table className="configuracion-red__tabla">
              <thead>
                <tr>
                  <th>Activo</th>
                  <th>Dirección IP</th>
                  <th>Dirección MAC</th>
                  <th>Host</th>
                  <th>VLAN</th>
                  <th>Dominio</th>
                  <th>Fecha inicio</th>
                  <th>Fecha fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {configuraciones.map((configuracion) => {
                  const activo = equipos.find(
                    (equipo) => equipo.id === configuracion.id_activo
                  );

                  return (
                    <tr key={configuracion.id}>
                      <td>
                        {activo
                          ? `${activo.numero_inventario} - ${activo.marca} ${activo.modelo}`
                          : "Activo no disponible"}
                      </td>

                      <td>{configuracion.direccion_ip || "—"}</td>
                      <td>{configuracion.direccion_mac || "—"}</td>
                      <td>{configuracion.nombre_host || "—"}</td>
                      <td>{configuracion.vlan || "—"}</td>
                      <td>{configuracion.dominio || "—"}</td>
                      <td>{configuracion.fecha_inicio || "—"}</td>
                      <td>{configuracion.fecha_fin || "—"}</td>
                      <td>{configuracion.estado_configuracion || "—"}</td>

                      <td>
                        <div className="configuracion-red__acciones-tabla">
                          <button
                            type="button"
                            onClick={() => editarConfiguracion(configuracion)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              eliminarConfiguracion(configuracion.id)
                            }
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfiguracionRed;

