
import { useState } from "react";
import "./Mantenimiento.css";

function Mantenimiento({
  equipos = [],
  setEquipos,
  mantenimientos = [],
  setMantenimientos,
  setMovimientosKardex,
}) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] =
    useState(null);

  const [formularioFinalizacion, setFormularioFinalizacion] = useState({
    fechaFinalizacion: new Date().toISOString().split("T")[0],
    trabajoRealizado: "",
    condicionFinal: "",
    costoFinal: "",
    observacionesFinales: "",
  });

  const formularioInicial = {
    equipoId: "",
    tipoMantenimiento: "Preventivo",
    fechaIngreso: new Date().toISOString().split("T")[0],
    tecnicoResponsable: "",
    descripcion: "",
    refacciones: "",
    costo: "",
    observaciones: "",
  };

  const [formulario, setFormulario] = useState(formularioInicial);

  // Actualiza los campos del formulario de mantenimiento.
  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setMensajeError("");
  };

  // Cancela el registro y limpia el formulario.
  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setFormulario(formularioInicial);
    setMensajeError("");
  };

  // Guarda un nuevo mantenimiento.
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

    if (
      !formulario.fechaIngreso ||
      !formulario.tecnicoResponsable.trim() ||
      !formulario.descripcion.trim()
    ) {
      setMensajeError("Completa todos los campos obligatorios.");
      return;
    }

    if (formulario.costo !== "" && Number(formulario.costo) < 0) {
      setMensajeError("El costo no puede ser negativo.");
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
      tecnicoResponsable: formulario.tecnicoResponsable.trim(),
      descripcion: formulario.descripcion.trim(),
      refacciones: formulario.refacciones.trim(),
      costo: Number(formulario.costo) || 0,
      observaciones: formulario.observaciones.trim(),
      estadoMantenimiento: "En proceso",
      fechaFinalizacion: "",
      condicionFinal: "",
    };

    // Registrar el mantenimiento.
    setMantenimientos((anteriores) => [
      ...anteriores,
      nuevoMantenimiento,
    ]);

    // Cambiar el estado del equipo.
    setEquipos((anteriores) =>
      anteriores.map((equipo) =>
        String(equipo.id) === String(equipoSeleccionado.id)
          ? {
              ...equipo,
              estado_activo: "En mantenimiento",
            }
          : equipo
      )
    );

    // Registrar la entrada en Kardex.
    const nuevoMovimiento = {
      id: Date.now() + 1,
      numeroInventario,
      tipoMovimiento: "Entrada a mantenimiento",
      fechaMovimiento: formulario.fechaIngreso,
      responsableAnterior: equipoSeleccionado.estado_activo || "Sin estado",
      responsableNuevo: `Técnico: ${formulario.tecnicoResponsable.trim()}`,
      usuarioEntrega: "No especificado",
      usuarioRecepcion: formulario.tecnicoResponsable.trim(),
      motivo: formulario.descripcion.trim(),
      observaciones: formulario.observaciones.trim(),
    };

    setMovimientosKardex((anteriores) => [
      ...anteriores,
      nuevoMovimiento,
    ]);

    // Limpiar y cerrar el formulario.
    setFormulario(formularioInicial);
    setMostrarFormulario(false);
    setMensajeError("");
  };

  // Actualiza los campos del formulario de finalización.
  const actualizarCampoFinalizacion = (e) => {
    const { name, value } = e.target;

    setFormularioFinalizacion((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // Finaliza un mantenimiento y registra la salida en Kardex.
  const finalizarMantenimiento = (e) => {
    e.preventDefault();

    if (!mantenimientoSeleccionado) {
      return;
    }

    const {
      fechaFinalizacion,
      trabajoRealizado,
      condicionFinal,
      costoFinal,
      observacionesFinales,
    } = formularioFinalizacion;

    if (
      !fechaFinalizacion ||
      !trabajoRealizado.trim() ||
      !condicionFinal
    ) {
      alert(
        "Completa la fecha, el trabajo realizado y la condición final."
      );
      return;
    }

    if (
      fechaFinalizacion < mantenimientoSeleccionado.fechaIngreso
    ) {
      alert(
        "La fecha de finalización no puede ser anterior a la fecha de ingreso."
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
      alert(
        "No se encontró el equipo relacionado con este mantenimiento."
      );
      return;
    }

    const estadoEquipo =
      condicionFinal === "Dañado"
        ? "En mantenimiento"
        : "Disponible";

    // Actualizar el registro del mantenimiento.
    setMantenimientos((anteriores) =>
      anteriores.map((item) =>
        item.id === mantenimientoSeleccionado.id
          ? {
              ...item,
              estadoMantenimiento: "Finalizado",
              fechaFinalizacion,
              trabajoRealizado: trabajoRealizado.trim(),
              condicionFinal,
              costoFinal: Number(costoFinal) || 0,
              observacionesFinales: observacionesFinales.trim(),
            }
          : item
      )
    );

    // Actualizar el estado del equipo.
    setEquipos((anteriores) =>
      anteriores.map((item) =>
        String(item.id) ===
        String(mantenimientoSeleccionado.equipoId)
          ? {
              ...item,
              estado_activo: estadoEquipo,
            }
          : item
      )
    );

    // Registrar la salida del mantenimiento en Kardex.
    const movimientoKardex = {
      id: Date.now(),
      numeroInventario: mantenimientoSeleccionado.numeroInventario,
      tipoMovimiento: "Salida de mantenimiento",
      fechaMovimiento: fechaFinalizacion,
      responsableAnterior: "En mantenimiento",
      responsableNuevo: estadoEquipo,
      usuarioEntrega: mantenimientoSeleccionado.tecnicoResponsable,
      usuarioRecepcion: "Área de TI",
      motivo: trabajoRealizado.trim(),
      observaciones: `Condición final: ${condicionFinal}. ${observacionesFinales.trim()}`,
    };

    setMovimientosKardex((anteriores) => [
      ...anteriores,
      movimientoKardex,
    ]);

    // Limpiar el formulario de finalización.
    setMantenimientoSeleccionado(null);

    setFormularioFinalizacion({
      fechaFinalizacion: new Date().toISOString().split("T")[0],
      trabajoRealizado: "",
      condicionFinal: "",
      costoFinal: "",
      observacionesFinales: "",
    });

    alert("Mantenimiento finalizado correctamente.");
  };

  return (
    <section className="mantenimiento-container">

      {/* ENCABEZADO */}
      <div className="section-heading">
        <div>
          <h2>Control de mantenimiento</h2>
          <p>
            Administración de mantenimientos preventivos y correctivos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario(true)}
        >
          + Registrar mantenimiento
        </button>
      </div>

      {/* INDICADORES */}
      <div className="home-cards">
        <article className="summary-card">
          <h3>{mantenimientos.length}</h3>
          <p>Total de mantenimientos</p>
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

      {/* FORMULARIO DE REGISTRO */}
      {mostrarFormulario && (
        <div className="mantenimiento-formulario">
          <h3>Nuevo mantenimiento</h3>

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
                        equipo.id}
                      {" - "}
                      {equipo.marca || "Equipo"}{" "}
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
              <label>Fecha de ingreso *</label>

              <input
                type="date"
                name="fechaIngreso"
                value={formulario.fechaIngreso}
                onChange={actualizarCampo}
                required
              />
            </div>

            <div className="form-group">
              <label>Técnico responsable *</label>

              <input
                type="text"
                name="tecnicoResponsable"
                value={formulario.tecnicoResponsable}
                onChange={actualizarCampo}
                placeholder="Nombre del técnico"
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción del mantenimiento *</label>

              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={actualizarCampo}
                placeholder="Describe el problema o trabajo que se realizará"
                required
              />
            </div>

            <div className="form-group">
              <label>Refacciones y consumibles</label>

              <textarea
                name="refacciones"
                value={formulario.refacciones}
                onChange={actualizarCampo}
                placeholder="Materiales utilizados o requeridos"
              />
            </div>

            <div className="form-group">
              <label>Costo estimado (MXN)</label>

              <input
                type="number"
                name="costo"
                min="0"
                step="0.01"
                value={formulario.costo}
                onChange={actualizarCampo}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Observaciones</label>

              <textarea
                name="observaciones"
                value={formulario.observaciones}
                onChange={actualizarCampo}
                placeholder="Información adicional"
              />
            </div>

            {mensajeError && (
              <p className="mensaje-error">{mensajeError}</p>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={cancelarFormulario}
              >
                Cancelar
              </button>

              <button type="submit">
                Guardar mantenimiento
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
      Equipo: <strong>{mantenimientoSeleccionado.numeroInventario}</strong>
    </p>

    <form onSubmit={finalizarMantenimiento}>
      <div className="form-group">
        <label>Fecha de finalización *</label>
        <input
          type="date"
          name="fechaFinalizacion"
          value={formularioFinalizacion.fechaFinalizacion}
          min={mantenimientoSeleccionado.fechaIngreso}
          onChange={actualizarCampoFinalizacion}
          required
        />
      </div>

      <div className="form-group">
        <label>Trabajo realizado *</label>
        <textarea
          name="trabajoRealizado"
          value={formularioFinalizacion.trabajoRealizado}
          onChange={actualizarCampoFinalizacion}
          placeholder="Describe las actividades realizadas"
          required
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
          placeholder="Información adicional sobre el mantenimiento"
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
            <p>Aún no hay mantenimientos registrados.</p>
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
                </div>

                
                <div className="mantenimiento-acciones">
                    <span>
                     {mantenimiento.estadoMantenimiento}
                    </span>
                    {mantenimiento.estadoMantenimiento === "En proceso" && (
                    <button
                        type="button"
                        onClick={() => {
                        setMantenimientoSeleccionado(mantenimiento);
                        setFormularioFinalizacion({
                        fechaFinalizacion: new Date().toISOString().split("T")[0],
                        trabajoRealizado: "",
                        condicionFinal: "",
                        costoFinal: "",
                        observacionesFinales: "",
                        });
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
