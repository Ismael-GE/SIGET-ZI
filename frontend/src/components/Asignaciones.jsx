
import { useState } from "react";
import "./Asignaciones.css";

function Asignaciones({
  equipos = [],
  setEquipos,
  asignaciones = [],
  setAsignaciones,
  movimientosKardex = [],
  setMovimientosKardex,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Control del formulario de finalización.
  const [mostrarFinalizacion, setMostrarFinalizacion] = useState(false);
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);

  // Datos del formulario de finalización.
  const [formularioFinalizacion, setFormularioFinalizacion] = useState({
    fechaFinalizacion: new Date().toISOString().split("T")[0],
    tipoFinalizacion: "",
    motivoFinalizacion: "",
    observacionesFinalizacion: "",
    nuevoColaborador: "",
    usuarioRecepcionFinalizacion: "",
    condicionRecepcion: "",
  });

  // Datos iniciales de una nueva asignación.
  const formularioInicial = {
    numeroInventario: "",
    colaborador: "",
    departamento: "",
    ubicacion: "",
    usuarioEntrega: "",
    usuarioRecepcion: "",
    fechaAsignacion: "",
    condicionEntrega: "",
    observaciones: "",
  };

  const [formulario, setFormulario] = useState(formularioInicial);

  // Crear eventos compatibles con la estructura de MOV_EVENTO_ACTIVO.
  const crearEventoKardex = ({
    equipo,
    tipoEvento,
    fecha,
    descripcion,
    estadoAnterior,
    estadoNuevo,
    valorAnterior = "",
    valorNuevo = "",
    observaciones = "",
    responsableAnterior = "",
    responsableNuevo = "",
    usuarioEntrega = "",
    usuarioRecepcion = "",
    motivo = "",
    condicionRecepcion = "",
  }) => {
    const idEvento = Date.now();

    return {
      // Identificador temporal del evento.
      id: idEvento,
      id_evento: idEvento,

      // Campos del modelo oficial MOV_EVENTO_ACTIVO.
      id_activo: equipo.id,
      id_tipo_evento: null,
      id_usuario: null,
      fecha_evento: fecha,
      descripcion,
      estado_anterior: estadoAnterior,
      estado_nuevo: estadoNuevo,
      valor_anterior: valorAnterior,
      valor_nuevo: valorNuevo,
      observaciones,

      // Campos que utiliza actualmente el Kardex.
      numeroInventario: equipo.numero_inventario,
      tipoMovimiento: tipoEvento,
      fechaMovimiento: fecha,
      responsableAnterior,
      responsableNuevo,
      usuarioEntrega,
      usuarioRecepcion,
      motivo,
      condicionRecepcion,
    };
  };

  // Mostrar únicamente los equipos disponibles.
  const equiposDisponibles = equipos.filter(
    (equipo) => equipo.estado_activo === "Disponible"
  );

  // Actualizar los campos de nueva asignación.
  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  // Abrir el formulario de nueva asignación.
  const abrirFormulario = () => {
    setFormulario({
      ...formularioInicial,
      fechaAsignacion: new Date().toISOString().split("T")[0],
    });

    setMensaje("");
    setMostrarFormulario(true);
  };

  // Cerrar el formulario de nueva asignación.
  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setFormulario(formularioInicial);
    setMensaje("");
  };

  // Abrir el formulario de finalización.
  const abrirFinalizacion = (asignacion) => {
    setAsignacionSeleccionada(asignacion);

    setFormularioFinalizacion({
      fechaFinalizacion: new Date().toISOString().split("T")[0],
      tipoFinalizacion: "",
      motivoFinalizacion: "",
      observacionesFinalizacion: "",
      nuevoColaborador: "",
      usuarioRecepcionFinalizacion: "",
      condicionRecepcion: "",
    });

    setMensaje("");
    setMostrarFinalizacion(true);
  };

  // Actualizar los campos de finalización.
  const actualizarCampoFinalizacion = (e) => {
    const { name, value } = e.target;

    setFormularioFinalizacion((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  // Cerrar el formulario de finalización.
  const cerrarFinalizacion = () => {
    setMostrarFinalizacion(false);
    setAsignacionSeleccionada(null);
    setMensaje("");
  };

  // Registrar una nueva asignación.
  const guardarAsignacion = (e) => {
    e.preventDefault();

    if (
      !formulario.numeroInventario ||
      !formulario.colaborador.trim() ||
      !formulario.fechaAsignacion
    ) {
      setMensaje("Completa los campos obligatorios.");
      return;
    }

    // Comprobar que el equipo siga disponible.
    const equipoSeleccionado = equipos.find(
      (equipo) =>
        equipo.numero_inventario === formulario.numeroInventario &&
        equipo.estado_activo === "Disponible"
    );

    if (!equipoSeleccionado) {
      setMensaje("El equipo seleccionado ya no está disponible.");
      return;
    }

    // Crear el registro de asignación.
    const nuevaAsignacion = {
      id: Date.now(),
      ...formulario,
      colaborador: formulario.colaborador.trim(),
      estadoAsignacion: "Activa",
      marca: equipoSeleccionado.marca,
      modelo: equipoSeleccionado.modelo,
      fechaFinalizacion: "",
      tipoFinalizacion: "",
    };

    setAsignaciones((actuales) => [
      ...actuales,
      nuevaAsignacion,
    ]);

    // Crear evento de asignación inicial para el Kardex.
    const nuevoMovimiento = crearEventoKardex({
      equipo: equipoSeleccionado,
      tipoEvento: "Asignación",
      fecha: formulario.fechaAsignacion,
      descripcion: `Asignación del activo ${equipoSeleccionado.numero_inventario} al colaborador ${formulario.colaborador.trim()}.`,
      estadoAnterior: "Disponible",
      estadoNuevo: "Asignado",
      valorAnterior: "Sin asignar",
      valorNuevo: formulario.colaborador.trim(),
      responsableAnterior: "",
      responsableNuevo: formulario.colaborador.trim(),
      usuarioEntrega: formulario.usuarioEntrega,
      usuarioRecepcion: formulario.usuarioRecepcion,
      motivo: "Asignación inicial",
      observaciones: formulario.observaciones,
    });

    setMovimientosKardex((actuales) => [
      ...actuales,
      nuevoMovimiento,
    ]);

    // Cambiar el estado del equipo.
    setEquipos((actuales) =>
      actuales.map((equipo) =>
        equipo.numero_inventario === formulario.numeroInventario
          ? {
              ...equipo,
              estado_activo: "Asignado",
            }
          : equipo
      )
    );

    cerrarFormulario();
  };

  // Guardar la finalización de una asignación.
  const guardarFinalizacion = () => {
    if (!asignacionSeleccionada) {
      setMensaje("No se encontró la asignación que deseas finalizar.");
      return;
    }

    const {
      fechaFinalizacion,
      tipoFinalizacion,
      motivoFinalizacion,
      observacionesFinalizacion,
      nuevoColaborador,
      usuarioRecepcionFinalizacion,
      condicionRecepcion,
    } = formularioFinalizacion;

    // Validaciones generales.
    if (
      !fechaFinalizacion ||
      !tipoFinalizacion ||
      !motivoFinalizacion.trim()
    ) {
      setMensaje("Completa todos los campos obligatorios.");
      return;
    }

    // Validar los datos de reasignación directa.
    if (
      tipoFinalizacion === "Reasignación directa" &&
      !nuevoColaborador.trim()
    ) {
      setMensaje("Escribe el nombre del nuevo colaborador.");
      return;
    }

    // Validar los datos de recepción física por TI.
    if (
      tipoFinalizacion === "Recepción física por TI" &&
      (!usuarioRecepcionFinalizacion.trim() || !condicionRecepcion)
    ) {
      setMensaje("Completa los datos de recepción física por TI.");
      return;
    }

    // Validar que la fecha no sea anterior a la asignación.
    if (fechaFinalizacion < asignacionSeleccionada.fechaAsignacion) {
      setMensaje(
        "La fecha de finalización no puede ser anterior a la asignación."
      );
      return;
    }

    // Comprobar que la asignación siga activa.
    const asignacionActual = asignaciones.find(
      (elemento) =>
        elemento.id === asignacionSeleccionada.id &&
        elemento.estadoAsignacion === "Activa"
    );

    if (!asignacionActual) {
      setMensaje("Esta asignación ya fue finalizada o no existe.");
      return;
    }

    // Buscar el equipo relacionado con la asignación.
    const equipo = equipos.find(
      (elemento) =>
        elemento.numero_inventario ===
        asignacionSeleccionada.numeroInventario
    );

    if (!equipo) {
      setMensaje("No se encontró el equipo en el inventario.");
      return;
    }

    const momento = Date.now();

    // Preparar el registro de finalización.
    const asignacionFinalizada = {
      ...asignacionActual,
      estadoAsignacion: "Finalizada",
      fechaFinalizacion,
      tipoFinalizacion,
      motivoFinalizacion: motivoFinalizacion.trim(),
      observacionesFinalizacion: observacionesFinalizacion.trim(),
    };

    // Caso 1: reasignación directa a otro colaborador.
    if (tipoFinalizacion === "Reasignación directa") {
      const nuevaAsignacion = {
        id: momento + 1,
        numeroInventario: asignacionActual.numeroInventario,
        colaborador: nuevoColaborador.trim(),
        departamento: asignacionActual.departamento,
        ubicacion: asignacionActual.ubicacion,
        usuarioEntrega: "",
        usuarioRecepcion: "",
        fechaAsignacion: fechaFinalizacion,
        condicionEntrega: "",
        observaciones: observacionesFinalizacion.trim(),
        estadoAsignacion: "Activa",
        marca: equipo.marca,
        modelo: equipo.modelo,
        fechaFinalizacion: "",
        tipoFinalizacion: "",
      };

      // Conservar la asignación anterior y agregar la nueva.
      setAsignaciones((actuales) => [
        ...actuales.map((elemento) =>
          elemento.id === asignacionActual.id
            ? asignacionFinalizada
            : elemento
        ),
        nuevaAsignacion,
      ]);

      // Registrar evento de reasignación en el Kardex.
      const nuevoMovimiento = crearEventoKardex({
        equipo,
        tipoEvento: "Reasignación",
        fecha: fechaFinalizacion,
        descripcion: `Reasignación del activo ${equipo.numero_inventario} de ${asignacionActual.colaborador} a ${nuevoColaborador.trim()}.`,
        estadoAnterior: "Asignado",
        estadoNuevo: "Asignado",
        valorAnterior: asignacionActual.colaborador,
        valorNuevo: nuevoColaborador.trim(),
        responsableAnterior: asignacionActual.colaborador,
        responsableNuevo: nuevoColaborador.trim(),
        motivo: motivoFinalizacion.trim(),
        observaciones: observacionesFinalizacion.trim(),
      });

      setMovimientosKardex((actuales) => [
        ...actuales,
        nuevoMovimiento,
      ]);

      // El equipo permanece asignado.
    }

    // Caso 2: recepción física por el área de TI.
    if (tipoFinalizacion === "Recepción física por TI") {
      // Determinar el nuevo estado del equipo.
      const nuevoEstado =
        condicionRecepcion === "Dañado"
          ? "En mantenimiento"
          : "Disponible";

      // Finalizar la asignación anterior.
      setAsignaciones((actuales) =>
        actuales.map((elemento) =>
          elemento.id === asignacionActual.id
            ? asignacionFinalizada
            : elemento
        )
      );

      // Actualizar el estado del equipo en el inventario.
      setEquipos((actuales) =>
        actuales.map((elemento) =>
          elemento.numero_inventario ===
          asignacionActual.numeroInventario
            ? {
                ...elemento,
                estado_activo: nuevoEstado,
              }
            : elemento
        )
      );

      // Registrar evento de recepción física por TI.
      const nuevoMovimiento = crearEventoKardex({
        equipo,
        tipoEvento: "Recepción física por TI",
        fecha: fechaFinalizacion,
        descripcion: `Recepción física del activo ${equipo.numero_inventario} por el área de TI. Condición: ${condicionRecepcion}.`,
        estadoAnterior: "Asignado",
        estadoNuevo: nuevoEstado,
        valorAnterior: asignacionActual.colaborador,
        valorNuevo: "Área de TI",
        responsableAnterior: asignacionActual.colaborador,
        responsableNuevo: "Área de TI",
        usuarioRecepcion: usuarioRecepcionFinalizacion.trim(),
        motivo: motivoFinalizacion.trim(),
        condicionRecepcion,
        observaciones: observacionesFinalizacion.trim(),
      });

      setMovimientosKardex((actuales) => [
        ...actuales,
        nuevoMovimiento,
      ]);
    }

    // Cerrar el formulario después de guardar.
    cerrarFinalizacion();
  };

  // Filtrar las asignaciones.
  const asignacionesFiltradas = asignaciones.filter((asignacion) => {
    const termino = busqueda.toLowerCase();

    return (
      (asignacion.numeroInventario || "").toLowerCase().includes(termino) ||
      (asignacion.colaborador || "").toLowerCase().includes(termino) ||
      (asignacion.departamento || "").toLowerCase().includes(termino)
    );
  });

  // Indicadores.
  const activas = asignaciones.filter(
    (asignacion) => asignacion.estadoAsignacion === "Activa"
  ).length;

  const finalizadas = asignaciones.filter(
    (asignacion) => asignacion.estadoAsignacion === "Finalizada"
  ).length;

  return (
    <section className="asignaciones-page">
      <div className="asignaciones-encabezado">
        <div>
          <h2>Control de asignaciones</h2>
          <p>Administra las asignaciones de activos tecnológicos.</p>
        </div>

        <button
          className="btn-nueva-asignacion"
          onClick={abrirFormulario}
        >
          + Nueva asignación
        </button>
      </div>

      {/* Indicadores */}
      <div className="asignaciones-resumen">
        <article className="asignacion-indicador">
          <span>Total de asignaciones</span>
          <strong>{asignaciones.length}</strong>
        </article>

        <article className="asignacion-indicador">
          <span>Asignaciones activas</span>
          <strong>{activas}</strong>
        </article>

        <article className="asignacion-indicador">
          <span>Asignaciones finalizadas</span>
          <strong>{finalizadas}</strong>
        </article>

        <article className="asignacion-indicador">
          <span>Equipos disponibles</span>
          <strong>{equiposDisponibles.length}</strong>
        </article>
      </div>

      {/* Tabla de asignaciones */}
      <div className="asignaciones-tabla-contenedor">
        <div className="asignaciones-busqueda">
          <input
            type="text"
            placeholder="Buscar por inventario, colaborador o departamento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="asignaciones-tabla">
          <thead>
            <tr>
              <th>Inventario</th>
              <th>Colaborador</th>
              <th>Departamento</th>
              <th>Fecha de asignación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {asignacionesFiltradas.length > 0 ? (
              asignacionesFiltradas.map((asignacion) => (
                <tr key={asignacion.id}>
                  <td>{asignacion.numeroInventario}</td>
                  <td>{asignacion.colaborador}</td>
                  <td>{asignacion.departamento || "No especificado"}</td>
                  <td>{asignacion.fechaAsignacion}</td>

                  <td>
                    <span
                      className={
                        asignacion.estadoAsignacion === "Activa"
                          ? "estado-asignacion activa"
                          : "estado-asignacion devuelta"
                      }
                    >
                      {asignacion.estadoAsignacion}
                    </span>
                  </td>

                  <td>
                    {asignacion.estadoAsignacion === "Activa" ? (
                      <button
                        className="btn-devolucion"
                        onClick={() => abrirFinalizacion(asignacion)}
                      >
                        Finalizar asignación
                      </button>
                    ) : (
                      <span className="devolucion-completada">
                        Finalizada: {asignacion.fechaFinalizacion}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="sin-asignaciones">
                  {busqueda
                    ? "No se encontraron asignaciones."
                    : "Aún no hay asignaciones registradas."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario de nueva asignación */}
      {mostrarFormulario && (
        <div className="asignaciones-modal-fondo">
          <div className="asignaciones-modal">
            <div className="asignaciones-modal-encabezado">
              <h2>Nueva asignación</h2>

              <button type="button" onClick={cerrarFormulario}>
                ×
              </button>
            </div>

            <form onSubmit={guardarAsignacion}>
              <h3>Información del activo y colaborador</h3>

              <div className="asignaciones-form-grid">
                <div>
                  <label>Número de inventario *</label>

                  <select
                    name="numeroInventario"
                    value={formulario.numeroInventario}
                    onChange={actualizarCampo}
                    required
                  >
                    <option value="">
                      Selecciona un equipo disponible
                    </option>

                    {equiposDisponibles.map((equipo) => (
                      <option
                        key={equipo.numero_inventario}
                        value={equipo.numero_inventario}
                      >
                        {equipo.numero_inventario} - {equipo.marca}{" "}
                        {equipo.modelo}
                      </option>
                    ))}
                  </select>

                  {equiposDisponibles.length === 0 && (
                    <small>
                      No hay equipos disponibles en el inventario.
                    </small>
                  )}
                </div>

                <div>
                  <label>Colaborador *</label>
                  <input
                    name="colaborador"
                    value={formulario.colaborador}
                    onChange={actualizarCampo}
                    placeholder="Nombre del colaborador"
                    required
                  />
                </div>

                <div>
                  <label>Departamento</label>
                  <input
                    name="departamento"
                    value={formulario.departamento}
                    onChange={actualizarCampo}
                    placeholder="Departamento"
                  />
                </div>

                <div>
                  <label>Ubicación</label>
                  <input
                    name="ubicacion"
                    value={formulario.ubicacion}
                    onChange={actualizarCampo}
                    placeholder="Ubicación del equipo"
                  />
                </div>
              </div>

              <h3>Datos de la entrega</h3>

              <div className="asignaciones-form-grid">
                <div>
                  <label>Usuario que entrega</label>
                  <input
                    name="usuarioEntrega"
                    value={formulario.usuarioEntrega}
                    onChange={actualizarCampo}
                    placeholder="Responsable de la entrega"
                  />
                </div>

                <div>
                  <label>Usuario que recibe</label>
                  <input
                    name="usuarioRecepcion"
                    value={formulario.usuarioRecepcion}
                    onChange={actualizarCampo}
                    placeholder="Responsable de la recepción"
                  />
                </div>

                <div>
                  <label>Fecha de asignación *</label>
                  <input
                    type="date"
                    name="fechaAsignacion"
                    value={formulario.fechaAsignacion}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div>
                  <label>Condición de entrega</label>
                  <select
                    name="condicionEntrega"
                    value={formulario.condicionEntrega}
                    onChange={actualizarCampo}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Dañado">Dañado</option>
                  </select>
                </div>
              </div>

              <div className="asignaciones-campo-completo">
                <label>Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={actualizarCampo}
                  placeholder="Información adicional sobre la asignación..."
                  rows="3"
                />
              </div>

              {mensaje && (
                <p className="mensaje-asignacion">{mensaje}</p>
              )}

              <div className="asignaciones-modal-acciones">
                <button type="button" onClick={cerrarFormulario}>
                  Cancelar
                </button>

                <button type="submit">
                  Registrar asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulario de finalización de asignación */}
      {mostrarFinalizacion && asignacionSeleccionada && (
        <div className="asignaciones-modal-fondo">
          <div className="asignaciones-modal">
            <div className="asignaciones-modal-encabezado">
              <h2>Finalizar asignación</h2>

              <button
                type="button"
                onClick={cerrarFinalizacion}
              >
                ×
              </button>
            </div>

            <div>
              <h3>Información de la asignación</h3>

              <p>
                <strong>Inventario:</strong>{" "}
                {asignacionSeleccionada.numeroInventario}
              </p>

              <p>
                <strong>Colaborador:</strong>{" "}
                {asignacionSeleccionada.colaborador}
              </p>

              <h3>Datos de finalización</h3>

              <div className="asignaciones-form-grid">
                <div>
                  <label>Fecha de finalización *</label>
                  <input
                    type="date"
                    name="fechaFinalizacion"
                    value={formularioFinalizacion.fechaFinalizacion}
                    onChange={actualizarCampoFinalizacion}
                    required
                  />
                </div>

                <div>
                  <label>Tipo de finalización *</label>
                  <select
                    name="tipoFinalizacion"
                    value={formularioFinalizacion.tipoFinalizacion}
                    onChange={actualizarCampoFinalizacion}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Reasignación directa">
                      Reasignación directa a otro colaborador
                    </option>
                    <option value="Recepción física por TI">
                      Recepción física por el área de TI
                    </option>
                  </select>
                </div>
              </div>

              {/* Campos para reasignación directa */}
              {formularioFinalizacion.tipoFinalizacion ===
                "Reasignación directa" && (
                <div className="asignaciones-campo-completo">
                  <label>Nombre del nuevo colaborador *</label>

                  <input
                    type="text"
                    name="nuevoColaborador"
                    value={formularioFinalizacion.nuevoColaborador}
                    onChange={actualizarCampoFinalizacion}
                    placeholder="Nombre del nuevo colaborador"
                    required
                  />
                </div>
              )}

              {/* Campos para recepción física por TI */}
              {formularioFinalizacion.tipoFinalizacion ===
                "Recepción física por TI" && (
                <div className="asignaciones-form-grid">
                  <div>
                    <label>Usuario de TI que recibe *</label>

                    <input
                      type="text"
                      name="usuarioRecepcionFinalizacion"
                      value={
                        formularioFinalizacion.usuarioRecepcionFinalizacion
                      }
                      onChange={actualizarCampoFinalizacion}
                      placeholder="Nombre de quien recibe"
                      required
                    />
                  </div>

                  <div>
                    <label>Condición del equipo al recibirlo *</label>

                    <select
                      name="condicionRecepcion"
                      value={formularioFinalizacion.condicionRecepcion}
                      onChange={actualizarCampoFinalizacion}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Bueno">Bueno</option>
                      <option value="Regular">Regular</option>
                      <option value="Dañado">Dañado</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="asignaciones-campo-completo">
                <label>Motivo de finalización *</label>

                <textarea
                  name="motivoFinalizacion"
                  value={formularioFinalizacion.motivoFinalizacion}
                  onChange={actualizarCampoFinalizacion}
                  placeholder="Describe el motivo por el que finaliza la asignación..."
                  rows="3"
                  required
                />
              </div>

              <div className="asignaciones-campo-completo">
                <label>Observaciones</label>

                <textarea
                  name="observacionesFinalizacion"
                  value={formularioFinalizacion.observacionesFinalizacion}
                  onChange={actualizarCampoFinalizacion}
                  placeholder="Información adicional..."
                  rows="3"
                />
              </div>

              {/* Mostrar mensajes de validación */}
              {mensaje && (
                <p className="mensaje-asignacion">{mensaje}</p>
              )}

              <div className="asignaciones-modal-acciones">
                <button
                  type="button"
                  onClick={cerrarFinalizacion}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={guardarFinalizacion}
                >
                  Confirmar finalización
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Asignaciones;