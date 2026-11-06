
import { useState } from "react";
import "./Mantenimiento.css";

function Mantenimiento({
  equipos = [],
  setEquipos,
  mantenimientos = [],
  setMantenimientos,
  setMovimientosKardex,
}) {
  const fechaActual = new Date().toISOString().split("T")[0];

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] =
    useState(null);

  const [mantenimientoParaIniciar, setMantenimientoParaIniciar] =
    useState(null);

  // Formulario para registrar una solicitud.
  const formularioInicial = {
    equipoId: "",
    tipoMantenimiento: "Preventivo",
    fechaIngreso: fechaActual,
    descripcion: "",
  };

  const [formulario, setFormulario] = useState(formularioInicial);

  // Formulario para iniciar el mantenimiento.
  const formularioInicioInicial = {
    tecnicoResponsable: "",
    refacciones: "",
    costo: "",
    observaciones: "",
  };

  const [formularioInicio, setFormularioInicio] = useState(
    formularioInicioInicial
  );

  // Formulario para finalizar el mantenimiento.
  const formularioFinalInicial = {
    fechaFinalizacion: fechaActual,
    diagnosticoFinal: "",
    trabajoRealizado: "",
    refaccionesUtilizadas: "",
    condicionFinal: "",
    costoFinal: "",
    observacionesFinales: "",
  };

  const [formularioFinalizacion, setFormularioFinalizacion] = useState(
    formularioFinalInicial
  );

  // Actualizar campos de la solicitud.
  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setMensajeError("");
  };

  // Actualizar campos del inicio.
  const actualizarCampoInicio = (e) => {
    const { name, value } = e.target;

    setFormularioInicio((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // Actualizar campos de finalización.
  const actualizarCampoFinalizacion = (e) => {
    const { name, value } = e.target;

    setFormularioFinalizacion((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // Cancelar solicitud.
  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setFormulario(formularioInicial);
    setMensajeError("");
  };

  // Registrar una solicitud de mantenimiento.
  const guardarMantenimiento = (e) => {
    e.preventDefault();
    setMensajeError("");

    const equipoSeleccionado = equipos.find(
      (equipo) => String(equipo.id) === String(formulario.equipoId)
    );

    if (!equipoSeleccionado) {
      setMensajeError("Selecciona un equipo válido.");
      return;
    }

    if (equipoSeleccionado.estado_activo === "En mantenimiento") {
      setMensajeError("Este equipo ya se encuentra en mantenimiento.");
      return;
    }

    if (!formulario.fechaIngreso || !formulario.descripcion.trim()) {
      setMensajeError("Completa todos los campos obligatorios.");
      return;
    }

    const numeroInventario =
      equipoSeleccionado.numero_inventario ||
      equipoSeleccionado.numeroInventario ||
      "Sin número de inventario";

    const nuevoMantenimiento = {
      id: Date.now(),
      equipoId: equipoSeleccionado.id,
      numeroInventario,
      tipoMantenimiento: formulario.tipoMantenimiento,
      fechaIngreso: formulario.fechaIngreso,
      descripcion: formulario.descripcion.trim(),

      tecnicoResponsable: "",
      refacciones: "",
      costo: 0,
      observaciones: "",

      estadoMantenimiento: "Pendiente",

      fechaInicio: "",
      fechaFinalizacion: "",
      diagnosticoFinal: "",
      trabajoRealizado: "",
      refaccionesUtilizadas: "",
      condicionFinal: "",
      costoFinal: 0,
      observacionesFinales: "",
    };

    setMantenimientos((anteriores) => [
      ...anteriores,
      nuevoMantenimiento,
    ]);

    // La solicitud todavía no cambia el estado del equipo
    // ni genera una entrada a mantenimiento en Kardex.

    setFormulario(formularioInicial);
    setMostrarFormulario(false);
  };

  // Abrir formulario para iniciar el mantenimiento.
  const abrirInicioMantenimiento = (mantenimiento) => {
    setMantenimientoParaIniciar(mantenimiento);
    setFormularioInicio(formularioInicioInicial);
  };

  // Iniciar el mantenimiento.
  const iniciarMantenimiento = (e) => {
    e.preventDefault();

    if (!mantenimientoParaIniciar) return;

    if (!formularioInicio.tecnicoResponsable.trim()) {
      alert("Ingresa el nombre del técnico responsable.");
      return;
    }

    if (
      formularioInicio.costo !== "" &&
      Number(formularioInicio.costo) < 0
    ) {
      alert("El costo estimado no puede ser negativo.");
      return;
    }

    const equipo = equipos.find(
      (item) =>
        String(item.id) === String(mantenimientoParaIniciar.equipoId)
    );

    if (!equipo) {
      alert("No se encontró el equipo relacionado.");
      return;
    }

    if (equipo.estado_activo === "En mantenimiento") {
      alert("Este equipo ya se encuentra en mantenimiento.");
      return;
    }

    const tecnico = formularioInicio.tecnicoResponsable.trim();

    // Actualizar la solicitud.
    setMantenimientos((anteriores) =>
      anteriores.map((item) =>
        item.id === mantenimientoParaIniciar.id
          ? {
              ...item,
              estadoMantenimiento: "En proceso",
              fechaInicio: fechaActual,
              tecnicoResponsable: tecnico,
              refacciones: formularioInicio.refacciones.trim(),
              costo: Number(formularioInicio.costo) || 0,
              observaciones: formularioInicio.observaciones.trim(),
            }
          : item
      )
    );

    // Cambiar estado del equipo.
    setEquipos((anteriores) =>
      anteriores.map((item) =>
        String(item.id) === String(equipo.id)
          ? { ...item, estado_activo: "En mantenimiento" }
          : item
      )
    );

    // Registrar entrada en Kardex.
    const nuevoMovimiento = {
      id: Date.now() + 1,
      id_evento: Date.now() + 1,
      id_activo: equipo.id,
      equipoId: equipo.id,
      numeroInventario: mantenimientoParaIniciar.numeroInventario,
      equipoNumeroInventario: mantenimientoParaIniciar.numeroInventario,
      tipoMovimiento: "Entrada a mantenimiento",
      fechaMovimiento: fechaActual,
      fecha_evento: fechaActual,
      responsableAnterior: equipo.estado_activo || "Sin estado",
      responsableNuevo: `Técnico: ${tecnico}`,
      usuarioEntrega: "Área de TI",
      usuarioRecepcion: tecnico,
      motivo: mantenimientoParaIniciar.descripcion,
      descripcion: mantenimientoParaIniciar.descripcion,
      observaciones: formularioInicio.observaciones.trim(),
    };

    setMovimientosKardex((anteriores) => [
      ...anteriores,
      nuevoMovimiento,
    ]);

    setMantenimientoParaIniciar(null);
    setFormularioInicio(formularioInicioInicial);

    alert("Mantenimiento iniciado correctamente.");
  };

  // Finalizar mantenimiento.
  const finalizarMantenimiento = (e) => {
    e.preventDefault();

    if (!mantenimientoSeleccionado) return;

    const {
      fechaFinalizacion,
      diagnosticoFinal,
      trabajoRealizado,
      refaccionesUtilizadas,
      condicionFinal,
      costoFinal,
      observacionesFinales,
    } = formularioFinalizacion;

    if (
      !fechaFinalizacion ||
      !diagnosticoFinal.trim() ||
      !trabajoRealizado.trim() ||
      !condicionFinal
    ) {
      alert(
        "Completa la fecha, el diagnóstico, el trabajo realizado y la condición final."
      );
      return;
    }

    const fechaInicio =
      mantenimientoSeleccionado.fechaInicio ||
      mantenimientoSeleccionado.fechaIngreso;

    if (fechaFinalizacion < fechaInicio) {
      alert(
        "La fecha de finalización no puede ser anterior al inicio del mantenimiento."
      );
      return;
    }

    if (costoFinal !== "" && Number(costoFinal) < 0) {
      alert("El costo final no puede ser negativo.");
      return;
    }

    const equipo = equipos.find(
      (item) =>
        String(item.id) ===
        String(mantenimientoSeleccionado.equipoId)
    );

    if (!equipo) {
      alert("No se encontró el equipo relacionado.");
      return;
    }

    const estadoEquipo =
      condicionFinal === "Dañado"
        ? "En mantenimiento"
        : "Disponible";

    // Actualizar historial sin perder la solicitud ni los datos de inicio.
    setMantenimientos((anteriores) =>
      anteriores.map((item) =>
        item.id === mantenimientoSeleccionado.id
          ? {
              ...item,
              estadoMantenimiento: "Finalizado",
              fechaFinalizacion,
              diagnosticoFinal: diagnosticoFinal.trim(),
              trabajoRealizado: trabajoRealizado.trim(),
              refaccionesUtilizadas: refaccionesUtilizadas.trim(),
              condicionFinal,
              costoFinal: Number(costoFinal) || 0,
              observacionesFinales: observacionesFinales.trim(),
            }
          : item
      )
    );

    // Actualizar estado del equipo.
    setEquipos((anteriores) =>
      anteriores.map((item) =>
        String(item.id) === String(mantenimientoSeleccionado.equipoId)
          ? { ...item, estado_activo: estadoEquipo }
          : item
      )
    );

    // Registrar salida en Kardex.
    const movimientoKardex = {
      id: Date.now(),
      id_evento: Date.now(),
      id_activo: equipo.id,
      equipoId: equipo.id,
      numeroInventario: mantenimientoSeleccionado.numeroInventario,
      equipoNumeroInventario: mantenimientoSeleccionado.numeroInventario,
      tipoMovimiento: "Salida de mantenimiento",
      fechaMovimiento: fechaFinalizacion,
      fecha_evento: fechaFinalizacion,
      responsableAnterior: "En mantenimiento",
      responsableNuevo: estadoEquipo,
      usuarioEntrega: mantenimientoSeleccionado.tecnicoResponsable,
      usuarioRecepcion: "Área de TI",
      motivo: trabajoRealizado.trim(),
      descripcion: diagnosticoFinal.trim(),
      observaciones: [
        `Condición final: ${condicionFinal}.`,
        `Refacciones utilizadas: ${refaccionesUtilizadas.trim() || "Ninguna especificada"}.`,
        observacionesFinales.trim(),
      ]
        .filter(Boolean)
        .join(" "),
    };

    setMovimientosKardex((anteriores) => [
      ...anteriores,
      movimientoKardex,
    ]);

    setMantenimientoSeleccionado(null);
    setFormularioFinalizacion(formularioFinalInicial);

    alert("Mantenimiento finalizado correctamente.");
  };

  return (
    <section className="mantenimiento-container">
      {/* ENCABEZADO */}
      <div className="section-heading">
        <div>
          <h2>Control de mantenimiento</h2>
          <p>
            Administración de solicitudes y mantenimientos preventivos y correctivos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario(true)}
        >
          + Registrar solicitud
        </button>
      </div>

      {/* INDICADORES */}
      <div className="home-cards">
        <article className="summary-card">
          <h3>{mantenimientos.length}</h3>
          <p>Total de solicitudes</p>
        </article>

        <article className="summary-card">
          <h3>
            {mantenimientos.filter(
              (m) => m.estadoMantenimiento === "Pendiente"
            ).length}
          </h3>
          <p>Pendientes</p>
        </article>

        <article className="summary-card">
          <h3>
            {mantenimientos.filter(
              (m) => m.estadoMantenimiento === "En proceso"
            ).length}
          </h3>
          <p>En proceso</p>
        </article>

        <article className="summary-card">
          <h3>
            {mantenimientos.filter(
              (m) => m.estadoMantenimiento === "Finalizado"
            ).length}
          </h3>
          <p>Finalizados</p>
        </article>
      </div>

      {/* FORMULARIO DE SOLICITUD */}
      {mostrarFormulario && (
        <div className="mantenimiento-formulario">
          <h3>Nueva solicitud de mantenimiento</h3>

          <form onSubmit={guardarMantenimiento}>
            <div className="form-group">
              <label>Equipo *</label>
              <select
                name="equipoId"
                value={formulario.equipoId}
                onChange={actualizarCampo}
                required
              >
                <option value="">Selecciona un equipo</option>

                {equipos
                  .filter(
                    (equipo) =>
                      equipo.estado_activo !== "En mantenimiento"
                  )
                  .map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.numero_inventario ||
                        equipo.numeroInventario ||
                        equipo.id}{" "}
                      - {equipo.marca || "Equipo"}{" "}
                      {equipo.modelo || ""}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tipo de mantenimiento *</label>
              <select
                name="tipoMantenimiento"
                value={formulario.tipoMantenimiento}
                onChange={actualizarCampo}
              >
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fecha de solicitud *</label>
              <input
                type="date"
                name="fechaIngreso"
                value={formulario.fechaIngreso}
                onChange={actualizarCampo}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción o motivo *</label>
              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={actualizarCampo}
                placeholder="Describe el problema o motivo de la solicitud"
                required
              />
            </div>

            {mensajeError && (
              <p className="mensaje-error">{mensajeError}</p>
            )}

            <div className="form-actions">
              <button type="button" onClick={cancelarFormulario}>
                Cancelar
              </button>

              <button type="submit">
                Registrar solicitud
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FORMULARIO PARA INICIAR */}
      {mantenimientoParaIniciar && (
        <div className="mantenimiento-formulario">
          <h3>Iniciar mantenimiento</h3>

          <p>
            Equipo:{" "}
            <strong>
              {mantenimientoParaIniciar.numeroInventario}
            </strong>
          </p>

          <form onSubmit={iniciarMantenimiento}>
            <div className="form-group">
              <label>Técnico responsable *</label>
              <input
                type="text"
                name="tecnicoResponsable"
                value={formularioInicio.tecnicoResponsable}
                onChange={actualizarCampoInicio}
                placeholder="Nombre del técnico"
                required
              />
            </div>

            <div className="form-group">
              <label>Refacciones y consumibles requeridos</label>
              <textarea
                name="refacciones"
                value={formularioInicio.refacciones}
                onChange={actualizarCampoInicio}
                placeholder="Materiales que se requieren"
              />
            </div>

            <div className="form-group">
              <label>Costo estimado (MXN)</label>
              <input
                type="number"
                name="costo"
                min="0"
                step="0.01"
                value={formularioInicio.costo}
                onChange={actualizarCampoInicio}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Observaciones iniciales</label>
              <textarea
                name="observaciones"
                value={formularioInicio.observaciones}
                onChange={actualizarCampoInicio}
                placeholder="Información adicional"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setMantenimientoParaIniciar(null)}
              >
                Cancelar
              </button>

              <button type="submit">
                Confirmar inicio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FORMULARIO DE FINALIZACIÓN */}
      {mantenimientoSeleccionado && (
        <div className="mantenimiento-formulario">
          <h3>Finalizar mantenimiento</h3>

          <p>
            Equipo:{" "}
            <strong>
              {mantenimientoSeleccionado.numeroInventario}
            </strong>
          </p>

          <form onSubmit={finalizarMantenimiento}>
            <div className="form-group">
              <label>Fecha de finalización *</label>
              <input
                type="date"
                name="fechaFinalizacion"
                value={formularioFinalizacion.fechaFinalizacion}
                min={
                  mantenimientoSeleccionado.fechaInicio ||
                  mantenimientoSeleccionado.fechaIngreso
                }
                onChange={actualizarCampoFinalizacion}
                required
              />
            </div>

            <div className="form-group">
              <label>Diagnóstico final *</label>
              <textarea
                name="diagnosticoFinal"
                value={formularioFinalizacion.diagnosticoFinal}
                onChange={actualizarCampoFinalizacion}
                placeholder="Describe qué problema se encontró en el equipo"
                required
              />
            </div>

            <div className="form-group">
              <label>Trabajo realizado *</label>
              <textarea
                name="trabajoRealizado"
                value={formularioFinalizacion.trabajoRealizado}
                onChange={actualizarCampoFinalizacion}
                placeholder="Describe las reparaciones, ajustes o actividades realizadas"
                required
              />
            </div>

            <div className="form-group">
              <label>Refacciones y consumibles utilizados</label>
              <textarea
                name="refaccionesUtilizadas"
                value={formularioFinalizacion.refaccionesUtilizadas}
                onChange={actualizarCampoFinalizacion}
                placeholder="Indica las piezas o materiales utilizados"
              />
            </div>

            <div className="form-group">
              <label>Condición final del equipo *</label>
              <select
                name="condicionFinal"
                value={formularioFinalizacion.condicionFinal}
                onChange={actualizarCampoFinalizacion}
                required
              >
                <option value="">Selecciona una condición</option>
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Dañado">Dañado</option>
              </select>
            </div>

            <div className="form-group">
              <label>Costo final (MXN)</label>
              <input
                type="number"
                name="costoFinal"
                min="0"
                step="0.01"
                value={formularioFinalizacion.costoFinal}
                onChange={actualizarCampoFinalizacion}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Observaciones finales</label>
              <textarea
                name="observacionesFinales"
                value={formularioFinalizacion.observacionesFinales}
                onChange={actualizarCampoFinalizacion}
                placeholder="Información adicional sobre el servicio"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setMantenimientoSeleccionado(null)}
              >
                Cancelar
              </button>

              <button type="submit">
                Guardar finalización
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HISTORIAL */}
      <div className="dashboard-panel">
        <h2>Historial de mantenimiento</h2>

        {mantenimientos.length === 0 ? (
          <div className="empty-state">
            <span>⚙</span>
            <p>Aún no hay solicitudes registradas.</p>
          </div>
        ) : (
          <div className="mantenimiento-lista">
            {mantenimientos.map((mantenimiento) => (
              <article
                className="mantenimiento-registro"
                key={mantenimiento.id}
              >
                <div>
                  <strong>{mantenimiento.numeroInventario}</strong>

                  <p>{mantenimiento.descripcion}</p>

                  <small>
                    {mantenimiento.tipoMantenimiento} ·{" "}
                    {mantenimiento.fechaIngreso}
                  </small>

                  {mantenimiento.tecnicoResponsable && (
                    <small>
                      Técnico: {mantenimiento.tecnicoResponsable}
                    </small>
                  )}

                  {mantenimiento.estadoMantenimiento === "Finalizado" && (
                    <small>
                      Trabajo realizado: {mantenimiento.trabajoRealizado}
                    </small>
                  )}
                </div>

                <div className="mantenimiento-acciones">
                  <span>{mantenimiento.estadoMantenimiento}</span>

                  {mantenimiento.estadoMantenimiento === "Pendiente" && (
                    <button
                      type="button"
                      onClick={() =>
                        abrirInicioMantenimiento(mantenimiento)
                      }
                    >
                      Iniciar mantenimiento
                    </button>
                  )}

                  {mantenimiento.estadoMantenimiento === "En proceso" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMantenimientoSeleccionado(mantenimiento);
                        setFormularioFinalizacion(formularioFinalInicial);
                      }}
                    >
                      Finalizar
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Mantenimiento;
