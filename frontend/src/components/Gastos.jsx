import { useState } from "react";
import "./Gastos.css";

function Gastos({
  equipos = [],
  gastosMantenimiento = [],
  setGastosMantenimiento,
  setMovimientosKardex = () => {},
}) {
  const fechaActual = new Date().toISOString().split("T")[0];

  const gastoInicial = {
    id_activo: "",
    tipo_gasto: "REFACCION",
    concepto: "",
    descripcion: "",
    cantidad: "1",
    unidad_medida: "PIEZA",
    costo_unitario: "",
    descuento: "0",
    importe_impuesto: "0",
    moneda: "MXN",
    fecha_gasto: fechaActual,
    numero_factura: "",
    cubierto_garantia: false,
    importe_cubierto_garantia: "0",
  };

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioGasto, setFormularioGasto] = useState(gastoInicial);

  const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  // Actualiza los campos del formulario.
  const actualizarCampoGasto = (e) => {
    const { name, value, type, checked } = e.target;

    setFormularioGasto((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Calcula los importes del gasto.
  const cantidad = Number(formularioGasto.cantidad) || 0;
  const costoUnitario = Number(formularioGasto.costo_unitario) || 0;
  const descuento = Number(formularioGasto.descuento) || 0;
  const impuestos = Number(formularioGasto.importe_impuesto) || 0;

  const subtotal = cantidad * costoUnitario;
  const importeTotal = Math.max(0, subtotal - descuento + impuestos);

  const garantia = formularioGasto.cubierto_garantia
    ? Number(formularioGasto.importe_cubierto_garantia) || 0
    : 0;

  const importeEmpresa = Math.max(0, importeTotal - garantia);

  // Registra el gasto.
  const agregarGasto = (e) => {
    e.preventDefault();

    if (!formularioGasto.concepto.trim()) {
      alert("Ingresa el concepto del gasto.");
      return;
    }

    if (
        !Number.isFinite(cantidad) ||
        !Number.isFinite(costoUnitario) ||
        !Number.isFinite(descuento) ||
        !Number.isFinite(impuestos) ||
        cantidad <= 0 ||
        costoUnitario < 0 ||
        descuento < 0 ||
        impuestos < 0
        ) {
        alert("Verifica la cantidad y los importes. No se permiten valores negativos ni datos inválidos.");
  return;
}

    if (
        !Number.isFinite(garantia) ||
        garantia < 0 ||
     garantia > importeTotal
     ) {
    alert("El importe cubierto por garantía debe ser válido y no puede superar el importe total.");
    return;
    }

    const idGasto = Date.now();

    const nuevoGasto = {
      id: idGasto,
      id_mantenimiento: null,
      id_activo: formularioGasto.id_activo || null,
      tipo_gasto: formularioGasto.tipo_gasto,
      concepto: formularioGasto.concepto.trim(),
      descripcion: formularioGasto.descripcion.trim(),
      cantidad,
      unidad_medida: formularioGasto.unidad_medida,
      costo_unitario: costoUnitario,
      subtotal,
      descuento,
      importe_impuesto: impuestos,
      importe_total: importeTotal,
      importe_empresa: importeEmpresa,
      moneda: formularioGasto.moneda,
      fecha_gasto: formularioGasto.fecha_gasto,
      numero_factura: formularioGasto.numero_factura.trim(),
      cubierto_garantia: formularioGasto.cubierto_garantia,
      importe_cubierto_garantia: garantia,
      estado: "REGISTRADO",
    };

    setGastosMantenimiento((anteriores) => [
      ...anteriores,
      nuevoGasto,
    ]);

    // Si el gasto está relacionado con un activo, genera un evento en su Kardex.
    if (nuevoGasto.id_activo) {
      const equipoRelacionado = equipos.find(
        (equipo) =>
          String(equipo.id) === String(nuevoGasto.id_activo)
      );

      if (equipoRelacionado) {
        const numeroInventario =
          equipoRelacionado.numero_inventario ||
          equipoRelacionado.numeroInventario ||
          "Sin número de inventario";

        setMovimientosKardex((anteriores) => [
          ...anteriores,
          {
            id: idGasto + 1,
            id_evento: idGasto + 1,
            id_activo: equipoRelacionado.id,
            equipoId: equipoRelacionado.id,
            numeroInventario,
            equipoNumeroInventario: numeroInventario,
            tipoMovimiento: "Gasto asociado a activo",
            fechaMovimiento: nuevoGasto.fecha_gasto,
            fecha_evento: nuevoGasto.fecha_gasto,
            responsableAnterior: "Sin movimiento",
            responsableNuevo: "Gasto registrado",
            usuarioEntrega: "Área de TI",
            usuarioRecepcion: "Área de TI",
            motivo: nuevoGasto.concepto,
            descripcion: `Gasto asociado al activo: ${nuevoGasto.concepto}`,
            observaciones: `Importe total: ${nuevoGasto.moneda} ${nuevoGasto.importe_total.toFixed(2)}. ${nuevoGasto.descripcion}`,
          },
        ]);
      }
    }

    alert("El gasto se registró correctamente.");

    setFormularioGasto({
      ...gastoInicial,
      fecha_gasto: fechaActual,
    });

    setMostrarFormulario(false);
  };

  // Suma los importes que corresponden a la empresa.
  const totalGastos = gastosMantenimiento.reduce(
    (total, gasto) =>
      total + (Number(gasto.importe_empresa ?? gasto.importe_total) || 0),
    0
  );

  return (
    <section className="gastos-page">
      <div className="gastos-header">
        <div>
          <h2>Gestión de gastos</h2>
          <p>Control y seguimiento de los gastos tecnológicos.</p>
        </div>

        <button onClick={() => setMostrarFormulario(true)}>
          + Registrar gasto
        </button>
      </div>

      <div className="gastos-resumen">
        <article className="gastos-card">
          <span>Total de gastos</span>
          <h3>{formatoMoneda.format(totalGastos)}</h3>
        </article>

        <article className="gastos-card">
          <span>Compras registradas</span>
          <h3>{gastosMantenimiento.length}</h3>
        </article>
      </div>

      {/* Ventana modal */}
      {mostrarFormulario && (
        <div
          className="gastos-modal-overlay"
          onClick={() => setMostrarFormulario(false)}
        >
          <div
            className="gastos-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gastos-modal-header">
              <div>
                <h3>Registrar nuevo gasto</h3>
                <p>
                  Ingresa la información de la compra o gasto tecnológico.
                </p>
              </div>

              <button
                type="button"
                className="gastos-modal-cerrar"
                onClick={() => setMostrarFormulario(false)}
                aria-label="Cerrar ventana"
              >
                ×
              </button>
            </div>

            <form onSubmit={agregarGasto}>
              <div className="gastos-form-grid">
                <div className="gastos-form-group">
                  <label>Concepto del gasto *</label>
                  <input
                    type="text"
                    name="concepto"
                    value={formularioGasto.concepto}
                    onChange={actualizarCampoGasto}
                    placeholder="Ej. Compra de batería CMOS"
                    required
                  />
                </div>

                <div className="gastos-form-group">
                  <label>Tipo de gasto</label>
                  <select
                    name="tipo_gasto"
                    value={formularioGasto.tipo_gasto}
                    onChange={actualizarCampoGasto}
                  >
                    <option value="REFACCION">Refacción</option>
                    <option value="ACCESORIO">Accesorio</option>
                    <option value="CONSUMIBLE">Consumible</option>
                    <option value="SOFTWARE">Software</option>
                    <option value="SERVICIO">Servicio</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div className="gastos-form-group">
                  <label>Equipo relacionado</label>
                  <select
                    name="id_activo"
                    value={formularioGasto.id_activo}
                    onChange={actualizarCampoGasto}
                  >
                    <option value="">Compra general de TI</option>

                    {equipos.map((equipo) => (
                      <option key={equipo.id} value={equipo.id}>
                        {equipo.numero_inventario ||
                          equipo.numeroInventario ||
                          equipo.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="gastos-form-group">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formularioGasto.descripcion}
                    onChange={actualizarCampoGasto}
                    placeholder="Describe los detalles de la compra..."
                  />
                </div>

                <div className="gastos-form-group">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    name="cantidad"
                    min="1"
                    step="1"
                    value={formularioGasto.cantidad}
                    onChange={actualizarCampoGasto}
                    required
                  />
                </div>

                <div className="gastos-form-group">
                  <label>Unidad de medida</label>
                  <select
                    name="unidad_medida"
                    value={formularioGasto.unidad_medida}
                    onChange={actualizarCampoGasto}
                  >
                    <option value="PIEZA">Pieza</option>
                    <option value="SERVICIO">Servicio</option>
                    <option value="CAJA">Caja</option>
                    <option value="PAQUETE">Paquete</option>
                    <option value="LICENCIA">Licencia</option>
                  </select>
                </div>

                <div className="gastos-form-group">
                  <label>Costo unitario</label>
                  <input
                    type="number"
                    name="costo_unitario"
                    min="0"
                    step="0.01"
                    value={formularioGasto.costo_unitario}
                    onChange={actualizarCampoGasto}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="gastos-form-group">
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

                <div className="gastos-form-group">
                  <label>Impuestos</label>
                  <input
                    type="number"
                    name="importe_impuesto"
                    min="0"
                    step="0.01"
                    value={formularioGasto.importe_impuesto}
                    onChange={actualizarCampoGasto}
                  />
                </div>

                <div className="gastos-form-group">
                  <label>Fecha del gasto</label>
                  <input
                    type="date"
                    name="fecha_gasto"
                    value={formularioGasto.fecha_gasto}
                    onChange={actualizarCampoGasto}
                    required
                  />
                </div>

                <div className="gastos-form-group">
                  <label>Número de factura</label>
                  <input
                    type="text"
                    name="numero_factura"
                    value={formularioGasto.numero_factura}
                    onChange={actualizarCampoGasto}
                    placeholder="Ej. FAC-00125"
                  />
                </div>

                <div className="gastos-form-group">
                  <label className="gastos-checkbox">
                    <input
                      type="checkbox"
                      name="cubierto_garantia"
                      checked={formularioGasto.cubierto_garantia}
                      onChange={actualizarCampoGasto}
                    />
                    ¿El gasto está cubierto por garantía?
                  </label>
                </div>

                {formularioGasto.cubierto_garantia && (
                  <div className="gastos-form-group">
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
              </div>

              <div className="gastos-calculo">
                <div>
                  <span>Subtotal:</span>
                  <strong>{formatoMoneda.format(subtotal)}</strong>
                </div>

                <div>
                  <span>Descuento:</span>
                  <strong>{formatoMoneda.format(descuento)}</strong>
                </div>

                <div>
                  <span>Impuestos:</span>
                  <strong>{formatoMoneda.format(impuestos)}</strong>
                </div>

                <div>
                  <span>Importe total:</span>
                  <strong>{formatoMoneda.format(importeTotal)}</strong>
                </div>

                <div>
                  <span>Cubierto por garantía:</span>
                  <strong>{formatoMoneda.format(garantia)}</strong>
                </div>

                <div>
                  <span>Importe a cargo de la empresa:</span>
                  <strong>{formatoMoneda.format(importeEmpresa)}</strong>
                </div>
              </div>

              <div className="gastos-form-actions">
                <button type="submit">Guardar gasto</button>

                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setFormularioGasto({
                      ...gastoInicial,
                      fecha_gasto: fechaActual,
                    });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="gastos-listado">
        <h3>Desglose de gastos</h3>

        {gastosMantenimiento.length === 0 ? (
          <p>Aún no hay gastos registrados.</p>
        ) : (
          <div className="gastos-tabla-contenedor">
            <table className="gastos-tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th>Tipo de gasto</th>
                  <th>Equipo relacionado</th>
                  <th>Cantidad</th>
                  <th>Costo unitario</th>
                  <th>Importe total</th>
                </tr>
              </thead>

              <tbody>
                {gastosMantenimiento.map((gasto) => {
                  const equipoRelacionado = equipos.find(
                    (equipo) =>
                      String(equipo.id) === String(gasto.id_activo)
                  );

                  return (
                    <tr key={gasto.id}>
                      <td>{gasto.fecha_gasto}</td>
                      <td>{gasto.concepto}</td>
                      <td>{gasto.tipo_gasto}</td>
                      <td>
                        {equipoRelacionado
                          ? equipoRelacionado.numero_inventario ||
                            equipoRelacionado.numeroInventario ||
                            equipoRelacionado.id
                          : "Compra general de TI"}
                      </td>
                      <td>
                        {gasto.cantidad} {gasto.unidad_medida || ""}
                      </td>
                      <td>
                        {formatoMoneda.format(
                          Number(gasto.costo_unitario) || 0
                        )}
                      </td>
                      <td>
                        {formatoMoneda.format(
                          Number(gasto.importe_total) || 0
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Gastos;