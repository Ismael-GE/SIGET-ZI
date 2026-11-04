
import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./Kardex.css";

function Kardex({
  equipos = [],
  asignaciones = [],
  movimientosKardex = [],
  mantenimientos = [],
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroActivo, setFiltroActivo] = useState("Todos");

  // --------------------------------------------------
  // 1. FUNCIONES PARA OBTENER Y NORMALIZAR INFORMACIÓN
  // --------------------------------------------------

  const obtenerNumeroInventario = (dato) =>
    dato?.numero_inventario ||
    dato?.numeroInventario ||
    "";

  const obtenerIdActivo = (dato) =>
    dato?.id_activo ??
    dato?.equipoId ??
    dato?.idEquipo ??
    dato?.id ??
    null;

  const obtenerFechaMovimiento = (movimiento) =>
    movimiento?.fechaMovimiento ||
    movimiento?.fecha_evento ||
    movimiento?.fecha_evento ||
    "";

  const obtenerTipoMovimiento = (movimiento) =>
    movimiento?.tipoMovimiento ||
    movimiento?.tipo_evento ||
    "Movimiento";

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";

    const valor = new Date(`${fecha}`.length === 10
      ? `${fecha}T12:00:00`
      : fecha
    );

    if (Number.isNaN(valor.getTime())) return fecha;

    return valor.toLocaleDateString("es-MX");
  };

  const formatearFechaHora = (fecha) => {
    if (!fecha) return "—";

    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) return fecha;

    return valor.toLocaleString("es-MX");
  };

  const formatearMoneda = (cantidad, moneda = "MXN") => {
    if (cantidad === "" || cantidad === null || cantidad === undefined) {
      return "—";
    }

    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: moneda || "MXN",
    }).format(Number(cantidad) || 0);
  };

  const obtenerNombreActivo = (activo) =>
    `${activo?.numero_inventario || "Sin inventario"} - ${
      activo?.marca || "Sin marca"
    } ${activo?.modelo || ""}`.trim();

  // Relaciona registros por ID o por número de inventario.
  const perteneceAlActivo = (registro, activo) => {
    if (!registro || !activo) return false;

    const idRegistro = obtenerIdActivo(registro);
    const idActivo = obtenerIdActivo(activo);

    if (
      idRegistro !== null &&
      idRegistro !== undefined &&
      idActivo !== null &&
      idActivo !== undefined &&
      String(idRegistro) === String(idActivo)
    ) {
      return true;
    }

    const numeroRegistro = obtenerNumeroInventario(registro);
    const numeroActivo = obtenerNumeroInventario(activo);

    return Boolean(
      numeroRegistro &&
      numeroActivo &&
      String(numeroRegistro).toLowerCase() ===
        String(numeroActivo).toLowerCase()
    );
  };

  const obtenerAsignaciones = (activo) =>
    asignaciones
      .filter((registro) => perteneceAlActivo(registro, activo))
      .sort(
        (a, b) =>
          new Date(b.fechaAsignacion || 0) -
          new Date(a.fechaAsignacion || 0)
      );

  const obtenerMantenimientos = (activo) =>
    mantenimientos
      .filter((registro) => perteneceAlActivo(registro, activo))
      .sort(
        (a, b) =>
          new Date(b.fechaIngreso || b.fecha_solicitud || 0) -
          new Date(a.fechaIngreso || a.fecha_solicitud || 0)
      );

  const obtenerMovimientos = (activo) =>
    movimientosKardex
      .filter((registro) => perteneceAlActivo(registro, activo))
      .sort(
        (a, b) =>
          new Date(
            obtenerFechaMovimiento(b) || 0
          ) -
          new Date(
            obtenerFechaMovimiento(a) || 0
          )
      );

  // --------------------------------------------------
  // 2. FILTROS Y CONSULTA DEL EXPEDIENTE
  // --------------------------------------------------

  const activosDisponibles = useMemo(
    () =>
      equipos.filter((activo) => obtenerNumeroInventario(activo)),
    [equipos]
  );

  const activoSeleccionado = useMemo(
    () =>
      filtroActivo === "Todos"
        ? null
        : equipos.find(
            (activo) =>
              String(activo.id) === String(filtroActivo)
          ) || null,
    [equipos, filtroActivo]
  );

  const movimientosDelActivo = useMemo(
    () =>
      activoSeleccionado
        ? obtenerMovimientos(activoSeleccionado)
        : movimientosKardex,
    [activoSeleccionado, movimientosKardex]
  );

  const tiposMovimiento = useMemo(() => {
    const tipos = movimientosDelActivo
      .map(obtenerTipoMovimiento)
      .filter(Boolean);

    return ["Todos", ...new Set(tipos)];
  }, [movimientosDelActivo]);

  const movimientosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return movimientosDelActivo
      .filter((movimiento) => {
        const tipo = obtenerTipoMovimiento(movimiento);

        const coincideTipo =
          filtroTipo === "Todos" || tipo === filtroTipo;

        const datos = [
          obtenerNumeroInventario(movimiento),
          tipo,
          movimiento.responsableAnterior,
          movimiento.responsableNuevo,
          movimiento.usuarioEntrega,
          movimiento.usuarioRecepcion,
          movimiento.usuarioRegistro,
          movimiento.usuario,
          movimiento.descripcion,
          movimiento.motivo,
          movimiento.observaciones,
          movimiento.estado_anterior,
          movimiento.estado_nuevo,
          movimiento.valor_anterior,
          movimiento.valor_nuevo,
        ];

        const coincideBusqueda = datos.some((dato) =>
          String(dato ?? "").toLowerCase().includes(texto)
        );

        return coincideTipo && coincideBusqueda;
      })
      .sort(
        (a, b) =>
          new Date(obtenerFechaMovimiento(b) || 0) -
          new Date(obtenerFechaMovimiento(a) || 0)
      );
  }, [
    movimientosDelActivo,
    busqueda,
    filtroTipo,
  ]);

  const asignacionesConsultadas = activoSeleccionado
    ? obtenerAsignaciones(activoSeleccionado)
    : [];

  const mantenimientosConsultados = activoSeleccionado
    ? obtenerMantenimientos(activoSeleccionado)
    : [];

  const totalMantenimientos = mantenimientosConsultados.reduce(
    (total, mantenimiento) =>
      total +
      (Number(mantenimiento.costo) || 0) +
      (Number(mantenimiento.costoFinal) || 0),
    0
  );

  // --------------------------------------------------
  // 3. GENERACIÓN DEL PDF
  // --------------------------------------------------

  const descargarPDF = () => {
    if (equipos.length === 0) {
      alert("No hay activos registrados para generar el expediente.");
      return;
    }

    const activosParaPDF = activoSeleccionado
      ? [activoSeleccionado]
      : activosDisponibles;

    if (activosParaPDF.length === 0) {
      alert("No se encontraron activos para generar el PDF.");
      return;
    }

    try {
      const documento = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const ancho = documento.internal.pageSize.getWidth();
      const alto = documento.internal.pageSize.getHeight();

      const margen = 14;
      let primeraPagina = true;

      const agregarEncabezado = (activo) => {
        documento.setFont("helvetica", "bold");
        documento.setFontSize(19);
        documento.text("SIGET-ZI", margen, 15);

        documento.setFontSize(12);
        documento.text(
          "EXPEDIENTE HISTÓRICO DEL ACTIVO",
          margen,
          23
        );

        documento.setFont("helvetica", "normal");
        documento.setFontSize(8);

        documento.text(
          `Número de inventario: ${activo.numero_inventario || "Sin registro"}`,
          margen,
          30
        );

        documento.text(
          `Fecha de generación: ${new Date().toLocaleString("es-MX")}`,
          ancho - margen,
          30,
          { align: "right" }
        );

        documento.setDrawColor(120);
        documento.line(margen, 34, ancho - margen, 34);
      };

      const agregarSeccion = (titulo, datos, columnas) => {
        let posicionY =
          documento.lastAutoTable?.finalY
            ? documento.lastAutoTable.finalY + 10
            : 42;

        if (posicionY > alto - 35) {
          documento.addPage();
          posicionY = 18;
        }

        documento.setFont("helvetica", "bold");
        documento.setFontSize(10);
        documento.text(titulo, margen, posicionY);

        autoTable(documento, {
          startY: posicionY + 3,
          head: [columnas],
          body: datos.length > 0
            ? datos
            : [["Sin información registrada"]],
          theme: "grid",
          margin: {
            left: margen,
            right: margen,
            bottom: 18,
          },
          styles: {
            font: "helvetica",
            fontSize: 7,
            cellPadding: 2.5,
            overflow: "linebreak",
          },
          headStyles: {
            fillColor: [35, 61, 89],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [245, 247, 250],
          },
          columnStyles: {
            0: { cellWidth: "auto" },
          },
        });
      };

      activosParaPDF.forEach((activo, indice) => {
        if (!primeraPagina) {
          documento.addPage();
        }

        primeraPagina = false;

        agregarEncabezado(activo);

        // FICHA GENERAL
        const ficha = [
          ["Número de inventario", activo.numero_inventario],
          ["Tipo de activo", activo.tipo_activo || activo.id_tipo_activo],
          ["Estado", activo.estado_activo || activo.id_estado_activo],
          ["Marca", activo.marca],
          ["Modelo", activo.modelo],
          ["Número de serie", activo.numero_serie],
          ["Proveedor de adquisición", activo.id_proveedor_adquisicion],
          ["Fecha de adquisición", formatearFecha(activo.fecha_adquisicion)],
          [
            "Costo de adquisición",
            formatearMoneda(
              activo.costo_adquisicion,
              activo.moneda
            ),
          ],
          ["Moneda", activo.moneda],
          ["Número de factura", activo.numero_factura],
          ["Orden de compra", activo.numero_orden_compra],
          ["Fecha de baja", formatearFecha(activo.fecha_baja)],
          ["Motivo de baja", activo.motivo_baja],
          ["Observaciones", activo.observaciones],
        ].map(([campo, valor]) => [
          campo,
          valor === "" || valor === null || valor === undefined
            ? "Sin información"
            : String(valor),
        ]);

        agregarSeccion(
          "1. FICHA GENERAL DEL ACTIVO",
          ficha,
          ["Dato", "Información"]
        );

        // ASIGNACIONES
        const asignacionesActivo = obtenerAsignaciones(activo);

        const filasAsignaciones = asignacionesActivo.map((registro) => [
          formatearFecha(registro.fechaAsignacion),
          registro.colaborador || "—",
          registro.departamento || "—",
          registro.ubicacion || "—",
          registro.estadoAsignacion || "—",
          registro.usuarioEntrega || "—",
          registro.usuarioRecepcion || "—",
          registro.condicionEntrega || "—",
          formatearFecha(registro.fechaFinalizacion),
          registro.tipoFinalizacion || "—",
          registro.observaciones || "—",
        ]);

        agregarSeccion(
          "2. HISTORIAL DE ASIGNACIONES",
          filasAsignaciones,
          [
            "Fecha",
            "Colaborador",
            "Departamento",
            "Ubicación",
            "Estado",
            "Entrega",
            "Recepción",
            "Condición de entrega",
            "Finalización",
            "Tipo de finalización",
            "Observaciones",
          ]
        );

        // MANTENIMIENTOS
        const mantenimientosActivo = obtenerMantenimientos(activo);

        const filasMantenimientos = mantenimientosActivo.map(
          (registro) => [
            registro.tipoMantenimiento || "—",
            formatearFecha(registro.fechaIngreso),
            registro.tecnicoResponsable || "—",
            registro.descripcion || "—",
            registro.refacciones || "—",
            formatearMoneda(registro.costo),
            registro.estadoMantenimiento || "—",
            formatearFecha(registro.fechaFinalizacion),
            registro.trabajoRealizado || "—",
            registro.condicionFinal || "—",
            formatearMoneda(registro.costoFinal),
            registro.observacionesFinales || registro.observaciones || "—",
          ]
        );

        agregarSeccion(
          "3. HISTORIAL DE MANTENIMIENTOS",
          filasMantenimientos,
          [
            "Tipo",
            "Ingreso",
            "Técnico",
            "Descripción",
            "Refacciones",
            "Costo estimado",
            "Estado",
            "Finalización",
            "Trabajo realizado",
            "Condición final",
            "Costo final",
            "Observaciones",
          ]
        );

        // MOVIMIENTOS DEL KARDEX
        const movimientosActivo = obtenerMovimientos(activo);

        const filasMovimientos = movimientosActivo.map((movimiento) => [
          formatearFechaHora(obtenerFechaMovimiento(movimiento)),
          obtenerTipoMovimiento(movimiento),
          movimiento.responsableAnterior || "—",
          movimiento.responsableNuevo || "—",
          movimiento.usuarioRegistro ||
            movimiento.usuario ||
            movimiento.id_usuario ||
            "—",
          movimiento.estado_anterior ||
            movimiento.estadoAnterior ||
            "—",
          movimiento.estado_nuevo ||
            movimiento.estadoNuevo ||
            "—",
          movimiento.descripcion || movimiento.motivo || "—",
          movimiento.observaciones || "—",
        ]);

        agregarSeccion(
          "4. CRONOLOGÍA DE EVENTOS Y MOVIMIENTOS",
          filasMovimientos,
          [
            "Fecha",
            "Evento",
            "Responsable anterior",
            "Responsable nuevo",
            "Usuario que registra",
            "Estado anterior",
            "Estado nuevo",
            "Descripción",
            "Observaciones",
          ]
        );

        // SECCIONES PENDIENTES DE CONECTAR
        agregarSeccion(
          "5. INFORMACIÓN PENDIENTE DE INTEGRACIÓN",
          [
            ["Incidencias", "Pendiente de integrar SIS_INCIDENCIA"],
            ["Garantías", "Pendiente de integrar SIS_GARANTIA_ACTIVO"],
            ["Componentes", "Pendiente de integrar SIS_COMPONENTE_ACTIVO"],
            ["Configuración de red", "Pendiente de integrar SIS_CONFIGURACION_RED"],
            ["Software instalado", "Pendiente de integrar SIS_INSTALACION_SOFTWARE"],
            ["Gastos desglosados", "Pendiente de integrar DET_GASTO_MANTENIMIENTO"],
          ],
          ["Sección", "Origen de los datos"]
        );

        // FIRMAS
        let firmaY =
          documento.lastAutoTable.finalY + 22;

        if (firmaY > alto - 25) {
          documento.addPage();
          firmaY = 35;
        }

        const espacioFirma = (ancho - margen * 2) / 3;

        documento.setFontSize(8);
        documento.setFont("helvetica", "normal");

        ["Elaboró", "Revisó", "Autorizó"].forEach(
          (titulo, posicion) => {
            const centro =
              margen +
              espacioFirma * posicion +
              espacioFirma / 2;

            documento.line(
              centro - 25,
              firmaY,
              centro + 25,
              firmaY
            );

            documento.text(
              titulo,
              centro,
              firmaY + 5,
              { align: "center" }
            );
          }
        );
      });

      // NUMERACIÓN DE PÁGINAS
      const totalPaginas =
        documento.internal.getNumberOfPages();

      for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        documento.setPage(pagina);
        documento.setFontSize(8);
        documento.setFont("helvetica", "normal");

        documento.text(
          `SIGET-ZI | Página ${pagina} de ${totalPaginas}`,
          ancho / 2,
          alto - 8,
          { align: "center" }
        );
      }

      const nombreArchivo = activoSeleccionado
        ? `Kardex_${activoSeleccionado.numero_inventario || "Activo"}.pdf`
        : "Kardex_SIGET-ZI_Activos.pdf";

      documento.save(nombreArchivo);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert(
        "No fue posible generar el PDF. Revisa la consola para conocer el error."
      );
    }
  };

  // --------------------------------------------------
  // 4. INTERFAZ DEL KARDEX
  // --------------------------------------------------

  return (
    <section className="kardex-container">
      <div className="section-heading kardex-controles">
        <div>
          <h2>Kardex de activos</h2>
          <p>
            Consulta el expediente histórico y los movimientos
            de los activos tecnológicos.
          </p>
        </div>

        <button
          type="button"
          className="kardex-boton-imprimir"
          onClick={descargarPDF}
        >
          Descargar expediente PDF
        </button>
      </div>

      {/* INDICADORES */}
      <div className="kardex-resumen">
        <article className="summary-card">
          <h3>{equipos.length}</h3>
          <p>Activos registrados</p>
        </article>

        <article className="summary-card">
          <h3>{movimientosKardex.length}</h3>
          <p>Movimientos registrados</p>
        </article>

        <article className="summary-card">
          <h3>{asignaciones.length}</h3>
          <p>Asignaciones registradas</p>
        </article>

        <article className="summary-card">
          <h3>{mantenimientos.length}</h3>
          <p>Mantenimientos registrados</p>
        </article>
      </div>

      {/* SELECTOR DE ACTIVO */}
      <div className="kardex-filtros">
        <select
          value={filtroActivo}
          onChange={(e) => {
            setFiltroActivo(e.target.value);
            setFiltroTipo("Todos");
            setBusqueda("");
          }}
        >
          <option value="Todos">Consultar todos los activos</option>

          {activosDisponibles.map((activo) => (
            <option key={activo.id} value={activo.id}>
              {obtenerNombreActivo(activo)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar movimiento, responsable o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          {tiposMovimiento.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo === "Todos" ? "Todos los movimientos" : tipo}
            </option>
          ))}
        </select>
      </div>

      {/* EXPEDIENTE INDIVIDUAL */}
      {activoSeleccionado && (
        <div className="dashboard-panel">
          <h2>Expediente del activo</h2>

          <div className="formulario-seccion">
            <h3>Identificación y adquisición</h3>

            <div className="kardex-detalle-grid">
              <p>
                <strong>Inventario:</strong>{" "}
                {activoSeleccionado.numero_inventario || "—"}
              </p>

              <p>
                <strong>Categoría:</strong>{" "}
                {activoSeleccionado.tipo_activo ||
                  activoSeleccionado.id_tipo_activo ||
                  "—"}
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                {activoSeleccionado.estado_activo ||
                  activoSeleccionado.id_estado_activo ||
                  "—"}
              </p>

              <p>
                <strong>Marca:</strong>{" "}
                {activoSeleccionado.marca || "—"}
              </p>

              <p>
                <strong>Modelo:</strong>{" "}
                {activoSeleccionado.modelo || "—"}
              </p>

              <p>
                <strong>Serie:</strong>{" "}
                {activoSeleccionado.numero_serie || "—"}
              </p>

              <p>
                <strong>Proveedor:</strong>{" "}
                {activoSeleccionado.id_proveedor_adquisicion || "—"}
              </p>

              <p>
                <strong>Adquisición:</strong>{" "}
                {formatearFecha(activoSeleccionado.fecha_adquisicion)}
              </p>

              <p>
                <strong>Costo:</strong>{" "}
                {formatearMoneda(
                  activoSeleccionado.costo_adquisicion,
                  activoSeleccionado.moneda
                )}
              </p>

              <p>
                <strong>Factura:</strong>{" "}
                {activoSeleccionado.numero_factura || "—"}
              </p>

              <p>
                <strong>Orden de compra:</strong>{" "}
                {activoSeleccionado.numero_orden_compra || "—"}
              </p>

              <p>
                <strong>Fecha de baja:</strong>{" "}
                {formatearFecha(activoSeleccionado.fecha_baja)}
              </p>

              <p className="kardex-detalle-completo">
                <strong>Motivo de baja:</strong>{" "}
                {activoSeleccionado.motivo_baja || "—"}
              </p>

              <p className="kardex-detalle-completo">
                <strong>Observaciones:</strong>{" "}
                {activoSeleccionado.observaciones || "—"}
              </p>
            </div>
          </div>

          {/* RESUMEN DE RELACIONES */}
          <div className="kardex-resumen">
            <article className="summary-card">
              <h3>{asignacionesConsultadas.length}</h3>
              <p>Asignaciones históricas</p>
            </article>

            <article className="summary-card">
              <h3>{mantenimientosConsultados.length}</h3>
              <p>Mantenimientos</p>
            </article>

            <article className="summary-card">
              <h3>{obtenerMovimientos(activoSeleccionado).length}</h3>
              <p>Eventos en Kardex</p>
            </article>

            <article className="summary-card">
              <h3>{formatearMoneda(totalMantenimientos)}</h3>
              <p>Costos registrados de mantenimiento</p>
            </article>
          </div>

          {/* ASIGNACIONES */}
          <div className="dashboard-panel">
            <h3>Historial de asignaciones</h3>

            {asignacionesConsultadas.length === 0 ? (
              <p>No hay asignaciones registradas para este activo.</p>
            ) : (
              <div className="kardex-tabla-contenedor">
                <table className="kardex-tabla">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Colaborador</th>
                      <th>Departamento</th>
                      <th>Ubicación</th>
                      <th>Estado</th>
                      <th>Entrega</th>
                      <th>Recepción</th>
                      <th>Condición</th>
                      <th>Finalización</th>
                    </tr>
                  </thead>

                  <tbody>
                    {asignacionesConsultadas.map((registro) => (
                      <tr key={registro.id}>
                        <td>{formatearFecha(registro.fechaAsignacion)}</td>
                        <td>{registro.colaborador || "—"}</td>
                        <td>{registro.departamento || "—"}</td>
                        <td>{registro.ubicacion || "—"}</td>
                        <td>{registro.estadoAsignacion || "—"}</td>
                        <td>{registro.usuarioEntrega || "—"}</td>
                        <td>{registro.usuarioRecepcion || "—"}</td>
                        <td>{registro.condicionEntrega || "—"}</td>
                        <td>
                          {formatearFecha(registro.fechaFinalizacion)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* MANTENIMIENTOS */}
          <div className="dashboard-panel">
            <h3>Historial de mantenimiento</h3>

            {mantenimientosConsultados.length === 0 ? (
              <p>No hay mantenimientos registrados para este activo.</p>
            ) : (
              <div className="kardex-tabla-contenedor">
                <table className="kardex-tabla">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Ingreso</th>
                      <th>Técnico</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Finalización</th>
                      <th>Costo estimado</th>
                      <th>Costo final</th>
                    </tr>
                  </thead>

                  <tbody>
                    {mantenimientosConsultados.map((registro) => (
                      <tr key={registro.id}>
                        <td>{registro.tipoMantenimiento || "—"}</td>
                        <td>{formatearFecha(registro.fechaIngreso)}</td>
                        <td>{registro.tecnicoResponsable || "—"}</td>
                        <td>{registro.descripcion || "—"}</td>
                        <td>{registro.estadoMantenimiento || "—"}</td>
                        <td>
                          {formatearFecha(registro.fechaFinalizacion)}
                        </td>
                        <td>{formatearMoneda(registro.costo)}</td>
                        <td>{formatearMoneda(registro.costoFinal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CRONOLOGÍA GENERAL */}
      <div className="dashboard-panel">
        <h2>
          {activoSeleccionado
            ? "Cronología del activo"
            : "Movimientos de todos los activos"}
        </h2>

        <p>
          Los eventos se muestran del más reciente al más antiguo.
        </p>

        {movimientosFiltrados.length === 0 ? (
          <div className="empty-state">
            <p>No hay movimientos que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="kardex-tabla-contenedor">
            <table className="kardex-tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Inventario</th>
                  <th>Movimiento</th>
                  <th>Responsable anterior</th>
                  <th>Responsable nuevo</th>
                  <th>Usuario que registra</th>
                  <th>Estado anterior</th>
                  <th>Estado nuevo</th>
                  <th>Descripción</th>
                  <th>Observaciones</th>
                </tr>
              </thead>

              <tbody>
                {movimientosFiltrados.map((movimiento, indice) => (
                  <tr
                    key={
                      movimiento.id_evento ??
                      movimiento.id ??
                      indice
                    }
                  >
                    <td>
                      {formatearFechaHora(
                        obtenerFechaMovimiento(movimiento)
                      )}
                    </td>

                    <td>
                      {obtenerNumeroInventario(movimiento) || "—"}
                    </td>

                    <td>{obtenerTipoMovimiento(movimiento)}</td>

                    <td>{movimiento.responsableAnterior || "—"}</td>

                    <td>{movimiento.responsableNuevo || "—"}</td>

                    <td>
                      {movimiento.usuarioRegistro ||
                        movimiento.usuario ||
                        movimiento.id_usuario ||
                        "—"}
                    </td>

                    <td>
                      {movimiento.estado_anterior ||
                        movimiento.estadoAnterior ||
                        "—"}
                    </td>

                    <td>
                      {movimiento.estado_nuevo ||
                        movimiento.estadoNuevo ||
                        "—"}
                    </td>

                    <td>
                      {movimiento.descripcion ||
                        movimiento.motivo ||
                        "—"}
                    </td>

                    <td>{movimiento.observaciones || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Kardex;
