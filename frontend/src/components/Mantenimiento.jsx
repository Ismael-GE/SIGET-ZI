import { useState } from "react";
import "./Mantenimiento.css";

function Mantenimiento({
  equipos = [],
  setEquipos,
  mantenimientos = [],
  setMantenimientos,
  gastosMantenimiento = [],
  setGastosMantenimiento,
  setMovimientosKardex,
}) {
  // ==========================================
  // FECHAS Y ESTADOS
  // ==========================================

  const fechaActual = new Date().toISOString().split("T")[0];

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [mantenimientoParaIniciar, setMantenimientoParaIniciar] =
    useState(null);

  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] =
    useState(null);

  const [mostrarFormularioGasto, setMostrarFormularioGasto] =
    useState(false);

  const [gastoMantenimientoSeleccionado, setGastoMantenimientoSeleccionado] =
    useState(null);

  // ==========================================
  // FORMULARIO DE SOLICITUD
  // ==========================================

  const formularioInicial = {
    equipoId: "",
    tipoMantenimiento: "Preventivo",
    fechaIngreso: fechaActual,
    descripcion: "",
  };

  const [formulario, setFormulario] = useState(formularioInicial);

  // ==========================================
  // FORMULARIO DE INICIO
  // ==========================================

  const formularioInicioInicial = {
    tecnicoResponsable: "",
    refacciones: "",
    costo: "",
    observaciones: "",
  };

  const [formularioInicio, setFormularioInicio] =
    useState(formularioInicioInicial);

  // ==========================================
  // FORMULARIO DE FINALIZACIÓN
  // ==========================================

  const formularioFinalInicial = {
    fechaFinalizacion: fechaActual,
    diagnosticoFinal: "",
    trabajoRealizado: "",
    refaccionesUtilizadas: "",
    condicionFinal: "",
    costoFinal: "",
    observacionesFinales: "",
  };

  const [formularioFinalizacion, setFormularioFinalizacion] =
    useState(formularioFinalInicial);

  // ==========================================
  // FORMULARIO DE GASTOS
  // ==========================================

  const gastoInicial = {
    tipo_gasto: "DIAGNOSTICO",
    concepto: "",
    descripcion: "",
    cantidad: "1",
    unidad_medida: "SERVICIO",
    costo_unitario: "",
    descuento: "0",
    importe_impuesto: "0",
    moneda: "MXN",
    fecha_gasto: fechaActual,
    numero_factura: "",
    cubierto_garantia: false,
    importe_cubierto_garantia: "0",
  };

  const [formularioGasto, setFormularioGasto] = useState(gastoInicial);

  // ==========================================
  // ACTUALIZAR FORMULARIOS
  // ==========================================

  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setMensajeError("");
  };

  const actualizarCampoInicio = (e) => {
    const { name, value } = e.target;

    setFormularioInicio((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setMensajeError("");
  };

  const actualizarCampoFinalizacion = (e) => {
    const { name, value } = e.target;

    setFormularioFinalizacion((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setMensajeError("");
  };

  const actualizarCampoGasto = (e) => {
    const { name, value, type, checked } = e.target;

    setFormularioGasto((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMensajeError("");
  };

  // ==========================================
  // MENSAJES
  // ==========================================

  const mostrarError = (mensaje) => {
    setMensajeExito("");
    setMensajeError(mensaje);
  };

  const mostrarExito = (mensaje) => {
    setMensajeError("");
    setMensajeExito(mensaje);
  };

  // ==========================================
  // CANCELAR SOLICITUD
  // ==========================================

  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setFormulario(formularioInicial);
    setMensajeError("");
    setMensajeExito("");
  };

  // ==========================================
  // REGISTRAR SOLICITUD
  // ==========================================

  const guardarMantenimiento = (e) => {
    e.preventDefault();

    setMensajeError("");
    setMensajeExito("");

    const equipoSeleccionado = equipos.find(
      (equipo) =>
        String(equipo.id) === String(formulario.equipoId)
    );

    if (!equipoSeleccionado) {
      mostrarError("Selecciona un equipo válido.");
      return;
    }

    if (equipoSeleccionado.estado_activo === "En mantenimiento") {
      mostrarError("Este equipo ya se encuentra en mantenimiento.");
      return;
    }

    if (
      !formulario.fechaIngreso ||
      !formulario.descripcion.trim()
    ) {
      mostrarError("Completa todos los campos obligatorios.");
      return;
    }

    const nuevoMantenimiento = {
      id: Date.now(),
      equipoId: equipoSeleccionado.id,

      numeroInventario:
        equipoSeleccionado.numero_inventario ||
        equipoSeleccionado.numeroInventario ||
        "Sin número de inventario",

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

    setFormulario(formularioInicial);
    setMostrarFormulario(false);

    mostrarExito("Solicitud de mantenimiento registrada correctamente.");
  };

  // ==========================================
  // ABRIR FORMULARIO DE INICIO
  // ==========================================

  const abrirInicioMantenimiento = (mantenimiento) => {
    setMantenimientoParaIniciar(mantenimiento);
    setFormularioInicio(formularioInicioInicial);
    setMensajeError("");
    setMensajeExito("");
  };

  // ==========================================
  // INICIAR MANTENIMIENTO
  // ==========================================

  const iniciarMantenimiento = (e) => {
    e.preventDefault();

    if (!mantenimientoParaIniciar) return;

    const {
      tecnicoResponsable,
      refacciones,
      costo,
      observaciones,
    } = formularioInicio;

    if (!tecnicoResponsable.trim()) {
      mostrarError("Ingresa el nombre del técnico responsable.");
      return;
    }

    if (
      costo !== "" &&
      (!Number.isFinite(Number(costo)) || Number(costo) < 0)
    ) {
      mostrarError("El costo estimado debe ser un número válido y no negativo.");
      return;
    }

    const equipo = equipos.find(
      (item) =>
        String(item.id) ===
        String(mantenimientoParaIniciar.equipoId)
    );

    if (!equipo) {
      mostrarError("No se encontró el equipo relacionado.");
      return;
    }

    if (equipo.estado_activo === "En mantenimiento") {
      mostrarError("Este equipo ya se encuentra en mantenimiento.");
      return;
    }

    const tecnico = tecnicoResponsable.trim();

    // Actualizar solicitud.

    setMantenimientos((anteriores) =>
      anteriores.map((item) =>
        item.id === mantenimientoParaIniciar.id
          ? {
              ...item,
              estadoMantenimiento: "En proceso",
              fechaInicio: fechaActual,
              tecnicoResponsable: tecnico,
              refacciones: refacciones.trim(),
              costo: Number(costo) || 0,
              observaciones: observaciones.trim(),
            }
          : item
      )
    );

    // Cambiar estado del equipo.

    setEquipos((anteriores) =>
      anteriores.map((item) =>
        String(item.id) === String(equipo.id)
          ? {
              ...item,
              estado_activo: "En mantenimiento",
            }
          : item
      )
    );

    // Registrar entrada en Kardex.

    const nuevoMovimiento = {
      id: Date.now() + 1,
      id_evento: Date.now() + 1,
      id_activo: equipo.id,
      equipoId: equipo.id,

      numeroInventario:
        mantenimientoParaIniciar.numeroInventario,

      equipoNumeroInventario:
        mantenimientoParaIniciar.numeroInventario,

      tipoMovimiento: "Entrada a mantenimiento",
      fechaMovimiento: fechaActual,
      fecha_evento: fechaActual,

      responsableAnterior: equipo.estado_activo || "Sin estado",
      responsableNuevo: `Técnico: ${tecnico}`,

      usuarioEntrega: "Área de TI",
      usuarioRecepcion: tecnico,

      motivo: mantenimientoParaIniciar.descripcion,
      descripcion: mantenimientoParaIniciar.descripcion,
      observaciones: observaciones.trim(),
    };

    setMovimientosKardex((anteriores) => [
      ...anteriores,
      nuevoMovimiento,
    ]);

    setMantenimientoParaIniciar(null);
    setFormularioInicio(formularioInicioInicial);

    mostrarExito("Mantenimiento iniciado correctamente.");
  };

  // ==========================================
  // ABRIR FORMULARIO DE GASTOS
  // ==========================================

  const abrirFormularioGasto = (mantenimiento = null) => {
    setGastoMantenimientoSeleccionado(mantenimiento);
    setFormularioGasto(gastoInicial);
    setMostrarFormularioGasto(true);
    setMensajeError("");
    setMensajeExito("");
  };

  // ==========================================
  // LIMPIAR FORMULARIO DE GASTOS
  // ==========================================

  const limpiarFormularioGasto = () => {
    setFormularioGasto({
      ...gastoInicial,
      fecha_gasto: new Date().toISOString().split("T")[0],
    });
  };

  // ==========================================
  // REGISTRAR GASTO
  // ==========================================

  const agregarGasto = (e) => {
    e.preventDefault();

    const {
      tipo_gasto,
      concepto,
      descripcion,
      cantidad,
      unidad_medida,
      costo_unitario,
      descuento,
      importe_impuesto,
      moneda,
      fecha_gasto,
      numero_factura,
      cubierto_garantia,
      importe_cubierto_garantia,
    } = formularioGasto;

    if (!concepto.trim() || costo_unitario === "") {
      mostrarError("Ingresa el concepto y el costo unitario.");
      return;
    }

    const cantidadN = Number(cantidad);
    const costoN = Number(costo_unitario);
    const descuentoN = Number(descuento);
    const impuestoN = Number(importe_impuesto);
    const garantiaN = Number(importe_cubierto_garantia);

    if (
      !Number.isFinite(cantidadN) ||
      !Number.isFinite(costoN) ||
      !Number.isFinite(descuentoN) ||
      !Number.isFinite(impuestoN) ||
      !Number.isFinite(garantiaN) ||
      cantidadN <= 0 ||
      costoN < 0 ||
      descuentoN < 0 ||
      impuestoN < 0 ||
      garantiaN < 0
    ) {
      mostrarError("Verifica las cantidades e importes del gasto.");
      return;
    }

    const subtotal = cantidadN * costoN;

    if (descuentoN > subtotal) {
      mostrarError("El descuento no puede superar el subtotal.");
      return;
    }

    const importeTotal = subtotal - descuentoN + impuestoN;

    if (garantiaN > importeTotal) {
      mostrarError(
        "El importe cubierto por garantía no puede superar el total."
      );
      return;
    }

    if (!fecha_gasto) {
      mostrarError("Ingresa la fecha del gasto.");
      return;
    }

    const nuevoGasto = {
      id: Date.now(),

      id_mantenimiento: gastoMantenimientoSeleccionado
        ? gastoMantenimientoSeleccionado.id
        : null,

      id_proveedor: null,

      tipo_gasto,
      concepto: concepto.trim(),
      descripcion: descripcion.trim(),

      cantidad: cantidadN,
      unidad_medida,

      costo_unitario: costoN,
      descuento: descuentoN,
      importe_impuesto: impuestoN,

      importe_total: importeTotal,
      importe_empresa: importeTotal - garantiaN,

      moneda,
      fecha_gasto,
      numero_factura: numero_factura.trim(),

      cubierto_garantia,
      importe_cubierto_garantia: garantiaN,

      estado_gasto: "REGISTRADO",
    };

    setGastosMantenimiento((anteriores) => [
      ...anteriores,
      nuevoGasto,
    ]);

    limpiarFormularioGasto();
    setMostrarFormularioGasto(false);
    setGastoMantenimientoSeleccionado(null);

    mostrarExito("Gasto registrado correctamente.");
  };

  // ==========================================
  // FINALIZAR MANTENIMIENTO
  // ==========================================

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
      mostrarError(
        "Completa la fecha, el diagnóstico, el trabajo realizado y la condición final."
      );
      return;
    }

    const fechaInicio =
      mantenimientoSeleccionado.fechaInicio ||
      mantenimientoSeleccionado.fechaIngreso;

    if (fechaFinalizacion < fechaInicio) {
      mostrarError(
        "La fecha de finalización no puede ser anterior al inicio del mantenimiento."
      );
      return;
    }

    if (
      costoFinal !== "" &&
      (!Number.isFinite(Number(costoFinal)) ||
        Number(costoFinal) < 0)
    ) {
      mostrarError("El costo final debe ser un número válido y no negativo.");
      return;
    }

    const equipo = equipos.find(
      (item) =>
        String(item.id) ===
        String(mantenimientoSeleccionado.equipoId)
    );

    if (!equipo) {
      mostrarError("No se encontró el equipo relacionado.");
      return;
    }

    const estadoEquipo =
      condicionFinal === "Dañado"
        ? "En mantenimiento"
        : "Disponible";

    // Actualizar historial.

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

    // Actualizar equipo.

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

    // Registrar salida en Kardex.

    const movimientoKardex = {
      id: Date.now() + 2,
      id_evento: Date.now() + 2,
      id_activo: equipo.id,
      equipoId: equipo.id,

      numeroInventario:
        mantenimientoSeleccionado.numeroInventario,

      equipoNumeroInventario:
        mantenimientoSeleccionado.numeroInventario,

      tipoMovimiento: "Salida de mantenimiento",
      fechaMovimiento: fechaFinalizacion,
      fecha_evento: fechaFinalizacion,

      responsableAnterior: "En mantenimiento",
      responsableNuevo: estadoEquipo,

      usuarioEntrega:
        mantenimientoSeleccionado.tecnicoResponsable,

      usuarioRecepcion: "Área de TI",

      motivo: trabajoRealizado.trim(),
      descripcion: diagnosticoFinal.trim(),

      observaciones: [
        `Condición final: ${condicionFinal}.`,
        `Refacciones utilizadas: ${
          refaccionesUtilizadas.trim() || "Ninguna especificada"
        }.`,
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

    mostrarExito("Mantenimiento finalizado correctamente.");
  };

  // ==========================================
  // CANCELAR FINALIZACIÓN
  // ==========================================

  const cancelarFinalizacion = () => {
    setMantenimientoSeleccionado(null);
    setFormularioFinalizacion(formularioFinalInicial);
    setMensajeError("");
  };

  // ==========================================
  // CALCULAR GASTOS
  // ==========================================

  const obtenerGastos = (idMantenimiento) =>
    gastosMantenimiento.filter(
      (gasto) =>
        gasto.id_mantenimiento === idMantenimiento &&
        gasto.estado_gasto !== "CANCELADO"
    );

  const calcularTotalGastos = (idMantenimiento) =>
    obtenerGastos(idMantenimiento).reduce(
      (total, gasto) =>
        total +
        (Number(gasto.importe_total) ||
          Number(gasto.cantidad) * Number(gasto.costo_unitario) -
            Number(gasto.descuento) +
            Number(gasto.importe_impuesto)),
      0
    );

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <section className="mantenimiento-container">

      <div className="section-heading">
        <div>
          <h2>Control de mantenimiento</h2>
          <p>
            Administración de solicitudes y mantenimientos preventivos y correctivos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMostrarFormulario(true);
            setMensajeError("");
            setMensajeExito("");
          }}
        >
          + Registrar solicitud
        </button>
      </div>

      {/* MENSAJES */}

      {mensajeError && (
        <p className="mensaje-error">{mensajeError}</p>
      )}

      {mensajeExito && (
        <p className="mensaje-exito">{mensajeExito}</p>
      )}

      {/* INDICADORES */}

      <div className="home-cards">
        <article className="summary-card">
          <h3>{mantenimientos.length}</h3>
          <p>Total de solicitudes</p>
        </article>

        <article className="summary-card">
          <h3>
            {
              mantenimientos.filter(
                (m) => m.estadoMantenimiento === "Pendiente"
              ).length
            }
          </h3>
          <p>Pendientes</p>
        </article>

        <article className="summary-card">
          <h3>
            {
              mantenimientos.filter(
                (m) => m.estadoMantenimiento === "En proceso"
              ).length
            }
          </h3>
          <p>En proceso</p>
        </article>

        <article className="summary-card">
          <h3>
            {
              mantenimientos.filter(
                (m) => m.estadoMantenimiento === "Finalizado"
              ).length
            }
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
                        equipo.id}
                      {" - "}
                      {equipo.marca || "Equipo"}
                      {" "}
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
                onClick={() => {
                  setMantenimientoParaIniciar(null);
                  setFormularioInicio(formularioInicioInicial);
                }}
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
              <button type="button" onClick={cancelarFinalizacion}>
                Cancelar
              </button>

              <button type="submit">
                Guardar finalización
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FORMULARIO DE GASTOS */}

      {mostrarFormularioGasto && (
        <div className="mantenimiento-formulario">
          <h3>
            {gastoMantenimientoSeleccionado
              ? "Registrar gasto del mantenimiento"
              : "Registrar gasto independiente"}
          </h3>

          <form onSubmit={agregarGasto}>
            <div className="form-group">
              <label>Tipo de gasto *</label>

              <select
                name="tipo_gasto"
                value={formularioGasto.tipo_gasto}
                onChange={actualizarCampoGasto}
                required
              >
                <option value="PIEZA">Pieza</option>
                <option value="REPUESTO">Repuesto</option>
                <option value="MANO_OBRA">Mano de obra</option>
                <option value="DIAGNOSTICO">Diagnóstico</option>
                <option value="TRASLADO">Traslado</option>
                <option value="SERVICIO_EXTERNO">Servicio externo</option>
                <option value="CONSUMIBLE">Consumible</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Concepto *</label>

              <input
                type="text"
                name="concepto"
                value={formularioGasto.concepto}
                onChange={actualizarCampoGasto}
                placeholder="Ej. Cambio de disco duro"
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>

              <textarea
                name="descripcion"
                value={formularioGasto.descripcion}
                onChange={actualizarCampoGasto}
                placeholder="Descripción del gasto"
              />
            </div>

            <div className="form-group">
              <label>Cantidad *</label>

              <input
                type="number"
                name="cantidad"
                min="0.01"
                step="0.01"
                value={formularioGasto.cantidad}
                onChange={actualizarCampoGasto}
                required
              />
            </div>

            <div className="form-group">
              <label>Unidad de medida *</label>

              <select
                name="unidad_medida"
                value={formularioGasto.unidad_medida}
                onChange={actualizarCampoGasto}
              >
                <option value="PIEZA">Pieza</option>
                <option value="UNIDAD">Unidad</option>
                <option value="HORA">Hora</option>
                <option value="SERVICIO">Servicio</option>
                <option value="PAQUETE">Paquete</option>
                <option value="METRO">Metro</option>
                <option value="LITRO">Litro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Costo unitario *</label>

              <input
                type="number"
                name="costo_unitario"
                min="0"
                step="0.01"
                value={formularioGasto.costo_unitario}
                onChange={actualizarCampoGasto}
                required
              />
            </div>

            <div className="form-group">
              <label>Descuento</label>

              <input
                type="number"
                name="descuento"
                min="0"
                step="0.01"
                value={formularioGasto.descuento}
                onChange={actualizarCampoGasto}
              />
            </div>

            <div className="form-group">
              <label>Impuesto</label>

              <input
                type="number"
                name="importe_impuesto"
                min="0"
                step="0.01"
                value={formularioGasto.importe_impuesto}
                onChange={actualizarCampoGasto}
              />
            </div>

            <div className="form-group">
              <label>Moneda</label>

              <select
                name="moneda"
                value={formularioGasto.moneda}
                onChange={actualizarCampoGasto}
              >
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fecha del gasto *</label>

              <input
                type="date"
                name="fecha_gasto"
                value={formularioGasto.fecha_gasto}
                onChange={actualizarCampoGasto}
                required
              />
            </div>

            <div className="form-group">
              <label>Número de factura</label>

              <input
                type="text"
                name="numero_factura"
                value={formularioGasto.numero_factura}
                onChange={actualizarCampoGasto}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="cubierto_garantia"
                  checked={formularioGasto.cubierto_garantia}
                  onChange={actualizarCampoGasto}
                />
                Cubierto por garantía
              </label>
            </div>

            {formularioGasto.cubierto_garantia && (
              <div className="form-group">
                <label>Importe cubierto por garantía</label>

                <input
                  type="number"
                  name="importe_cubierto_garantia"
                  min="0"
                  step="0.01"
                  value={formularioGasto.importe_cubierto_garantia}
                  onChange={actualizarCampoGasto}
                />
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setMostrarFormularioGasto(false);
                  setGastoMantenimientoSeleccionado(null);
                  limpiarFormularioGasto();
                }}
              >
                Cancelar
              </button>

              <button type="submit">
                Guardar gasto
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
            {mantenimientos.map((mantenimiento) => {
              const gastos = obtenerGastos(mantenimiento.id);

              return (
                <article
                  className="mantenimiento-registro"
                  key={mantenimiento.id}
                >
                  <div>
                    <strong>
                      {mantenimiento.numeroInventario}
                    </strong>

                    <p>{mantenimiento.descripcion}</p>

                    <small>
                      {mantenimiento.tipoMantenimiento}
                      {" · "}
                      {mantenimiento.fechaIngreso}
                    </small>

                    {mantenimiento.tecnicoResponsable && (
                      <small>
                        Técnico: {mantenimiento.tecnicoResponsable}
                      </small>
                    )}

                    {mantenimiento.estadoMantenimiento === "Finalizado" && (
                      <>
                        <small>
                          Diagnóstico: {mantenimiento.diagnosticoFinal}
                        </small>

                        <small>
                          Trabajo realizado: {mantenimiento.trabajoRealizado}
                        </small>

                        <small>
                          Condición final: {mantenimiento.condicionFinal}
                        </small>
                      </>
                    )}

                    <small>
                      Gastos registrados: {gastos.length}
                    </small>

                    <small>
                      Total de gastos: $
                      {calcularTotalGastos(mantenimiento.id).toFixed(2)} MXN
                    </small>
                  </div>

                  <div className="mantenimiento-acciones">
                    <span>
                      {mantenimiento.estadoMantenimiento}
                    </span>

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
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            abrirFormularioGasto(mantenimiento)
                          }
                        >
                          Registrar gasto
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setMantenimientoSeleccionado(mantenimiento);
                            setFormularioFinalizacion({
                              ...formularioFinalInicial,
                              fechaFinalizacion: fechaActual,
                            });
                            setMensajeError("");
                          }}
                        >
                          Finalizar
                        </button>
                      </>
                    )}

                    {mantenimiento.estadoMantenimiento === "Finalizado" && (
                      <button
                        type="button"
                        onClick={() =>
                          abrirFormularioGasto(mantenimiento)
                        }
                      >
                        Registrar gasto
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* GASTOS INDEPENDIENTES */}

      <div className="dashboard-panel">
        <h2>Gastos independientes</h2>

        <button
          type="button"
          onClick={() => abrirFormularioGasto(null)}
        >
          + Registrar gasto independiente
        </button>

        {gastosMantenimiento.filter(
          (gasto) => gasto.id_mantenimiento === null
        ).length === 0 ? (
          <p>No hay gastos independientes registrados.</p>
        ) : (
          <div className="mantenimiento-lista">
            {gastosMantenimiento
              .filter((gasto) => gasto.id_mantenimiento === null)
              .map((gasto) => (
                <article
                  className="mantenimiento-registro"
                  key={gasto.id}
                >
                  <div>
                    <strong>{gasto.concepto}</strong>

                    <p>{gasto.descripcion}</p>

                    <small>
                      {gasto.tipo_gasto} · {gasto.fecha_gasto}
                    </small>

                    <small>
                      Cantidad: {gasto.cantidad}
                    </small>

                    <small>
                      Total: $
                      {Number(gasto.importe_total || 0).toFixed(2)}
                      {" "}
                      {gasto.moneda}
                    </small>
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