
import { useState } from "react";
import "./Activos.css";

const formularioInicial = {
  numero_inventario: "",
  id_tipo_activo: "",
  id_estado_activo: "",
  id_proveedor_adquisicion: "",
  numero_serie: "",
  marca: "",
  modelo: "",
  fecha_adquisicion: "",
  costo_adquisicion: "",
  moneda: "MXN",
  numero_factura: "",
  numero_orden_compra: "",
  fecha_baja: "",
  motivo_baja: "",
  observaciones: "",
};

function Activos({ equipos = [], setEquipos, categorias = [] }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("error");
  const [activoEditando, setActivoEditando] = useState(null);
  const [activoDetalle, setActivoDetalle] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [siguienteNumero, setSiguienteNumero] = useState(1);

  // Generar número de inventario automáticamente.
  const generarNumeroInventario = () => {
    const numerosExistentes = equipos.map((activo) => {
      const coincidencia = activo.numero_inventario?.match(/^ZI-(\d+)$/i);
      return coincidencia ? Number(coincidencia[1]) : 0;
    });

    const numeroMayor = Math.max(0, ...numerosExistentes);
    const numero = Math.max(siguienteNumero, numeroMayor + 1);

    return {
      numero: `ZI-${String(numero).padStart(4, "0")}`,
      siguiente: numero + 1,
    };
  };

  // Mostrar avisos.
  const mostrarMensaje = (texto, tipo = "error") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setMostrarAviso(true);
  };

  // Abrir formulario.
  const abrirFormulario = () => {
    const generado = generarNumeroInventario();

    setFormulario({
      ...formularioInicial,
      numero_inventario: generado.numero,
    });

    setActivoEditando(null);
    setMostrarModal(true);
  };

  // Cerrar formulario.
  const cerrarFormulario = () => {
    setMostrarModal(false);
    setFormulario({ ...formularioInicial });
    setActivoEditando(null);
  };

  // Capturar cambios.
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // Obtener el nombre de una categoría.
  const obtenerNombreCategoria = (activo) => {
    const categoria = categorias.find(
      (item) =>
        String(item.id_tipo_activo) ===
        String(activo.id_tipo_activo)
    );

    return categoria?.categoria || activo.tipo_activo || "Sin categoría";
  };

  // Registrar o actualizar activo.
  const guardarActivo = (e) => {
    e.preventDefault();

    if (
      !formulario.id_tipo_activo ||
      !formulario.id_estado_activo ||
      !formulario.marca.trim() ||
      !formulario.modelo.trim()
    ) {
      mostrarMensaje(
        "Completa los campos obligatorios: tipo, estado, marca y modelo."
      );
      return;
    }

    // Validar número de inventario duplicado.
    const inventarioDuplicado = equipos.some(
      (activo) =>
        activo.numero_inventario?.toLowerCase() ===
          formulario.numero_inventario.trim().toLowerCase() &&
        activo.id !== activoEditando
    );

    if (inventarioDuplicado) {
      mostrarMensaje("Ese número de inventario ya está registrado.");
      return;
    }

    // Validar número de serie duplicado.
    if (formulario.numero_serie.trim()) {
      const serieDuplicada = equipos.some(
        (activo) =>
          activo.numero_serie &&
          activo.numero_serie.trim().toLowerCase() ===
            formulario.numero_serie.trim().toLowerCase() &&
          activo.id !== activoEditando
      );

      if (serieDuplicada) {
        mostrarMensaje("Ese número de serie ya está registrado.");
        return;
      }
    }

    // Validar costo.
    if (
      formulario.costo_adquisicion !== "" &&
      (!Number.isFinite(Number(formulario.costo_adquisicion)) ||
        Number(formulario.costo_adquisicion) < 0)
    ) {
      mostrarMensaje("El costo debe ser válido y no puede ser negativo.");
      return;
    }

    // Buscar categoría seleccionada.
    const categoriaSeleccionada = categorias.find(
      (categoria) =>
        String(categoria.id_tipo_activo) ===
        String(formulario.id_tipo_activo)
    );

    if (!categoriaSeleccionada || !categoriaSeleccionada.habilitado) {
      mostrarMensaje("Selecciona una categoría habilitada.");
      return;
    }

    // Preparar información del activo.
    const datosActivo = {
      ...formulario,
      id_tipo_activo: Number(formulario.id_tipo_activo),
      numero_inventario: formulario.numero_inventario.trim(),
      numero_serie: formulario.numero_serie.trim(),
      marca: formulario.marca.trim(),
      modelo: formulario.modelo.trim(),
      costo_adquisicion:
        formulario.costo_adquisicion === ""
          ? ""
          : Number(formulario.costo_adquisicion),
      tipo_activo: categoriaSeleccionada.categoria,
      estado_activo: formulario.id_estado_activo,
    };

    if (activoEditando !== null) {
      // Actualizar registro existente.
      setEquipos((anteriores) =>
        anteriores.map((activo) =>
          activo.id === activoEditando
            ? { ...activo, ...datosActivo }
            : activo
        )
      );

      setMostrarModal(false);
      setFormulario({ ...formularioInicial });
      setActivoEditando(null);

      mostrarMensaje("El activo se actualizó correctamente.", "exito");
    } else {
      // Registrar nuevo activo.
      const nuevoActivo = {
        ...datosActivo,
        id: Date.now(),
      };

      setEquipos((anteriores) => [...anteriores, nuevoActivo]);

      const numeroUsado = Number(
        datosActivo.numero_inventario.replace("ZI-", "")
      );

      setSiguienteNumero((anterior) =>
        Math.max(anterior, numeroUsado + 1)
      );

      setMostrarModal(false);
      setFormulario({ ...formularioInicial });

      mostrarMensaje("El activo se registró correctamente.", "exito");
    }
  };

  // Editar activo.
  const editarActivo = (activo) => {
    setFormulario({
      ...formularioInicial,
      ...activo,
      id_tipo_activo: String(activo.id_tipo_activo ?? ""),
      id_estado_activo: String(activo.id_estado_activo ?? ""),
      costo_adquisicion:
        activo.costo_adquisicion === ""
          ? ""
          : String(activo.costo_adquisicion),
    });

    setActivoEditando(activo.id);
    setMostrarModal(true);
  };

  // Eliminar activo.
  const eliminarActivo = (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este activo?"
    );

    if (!confirmar) return;

    setEquipos((anteriores) =>
      anteriores.filter((activo) => activo.id !== id)
    );

    setActivoDetalle(null);
    mostrarMensaje("El activo se eliminó correctamente.", "exito");
  };

  // Buscar activos.
  const activosFiltrados = equipos.filter((activo) => {
    const texto = busqueda.toLowerCase();

    return (
      (activo.numero_inventario || "").toLowerCase().includes(texto) ||
      (activo.numero_serie || "").toLowerCase().includes(texto) ||
      (activo.marca || "").toLowerCase().includes(texto) ||
      (activo.modelo || "").toLowerCase().includes(texto)
    );
  });

  return (
    <div className="activos-container">
      {/* ENCABEZADO */}
      <div className="activos-header">
        <div>
          <h1>Inventario de activos</h1>
          <p>Administra y consulta los activos tecnológicos.</p>
        </div>

        <button
          type="button"
          className="btn-registrar"
          onClick={abrirFormulario}
        >
          + Registrar activo
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="activos-filtros">
        <input
          type="text"
          placeholder="Buscar por inventario, serie, marca o modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <div className="activos-tabla-contenedor">
        <table className="activos-tabla">
          <thead>
            <tr>
              <th>Número de inventario</th>
              <th>Tipo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Número de serie</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {activosFiltrados.length > 0 ? (
              activosFiltrados.map((activo) => (
                <tr key={activo.id}>
                  <td>{activo.numero_inventario}</td>
                  <td>{obtenerNombreCategoria(activo)}</td>
                  <td>{activo.marca}</td>
                  <td>{activo.modelo}</td>
                  <td>{activo.numero_serie || "—"}</td>
                  <td>{activo.estado_activo}</td>

                  <td className="acciones-activo">
                    <button
                      type="button"
                      onClick={() => setActivoDetalle(activo)}
                    >
                      Ver
                    </button>

                    <button
                      type="button"
                      onClick={() => editarActivo(activo)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarActivo(activo.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="tabla-vacia">
                  {busqueda
                    ? "No se encontraron activos."
                    : "Todavía no hay activos registrados."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FORMULARIO */}
      {mostrarModal && (
        <div className="modal-fondo">
          <div className="modal-activo">
            <div className="modal-encabezado">
              <h2>
                {activoEditando !== null
                  ? "Editar activo"
                  : "Registrar nuevo activo"}
              </h2>

              <button
                type="button"
                className="btn-cerrar-modal"
                onClick={cerrarFormulario}
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarActivo}>
              <div className="formulario-seccion">
                <h3>Información general</h3>

                <div className="formulario-grid">
                  <div className="campo-formulario">
                    <label>Número de inventario</label>
                    <input
                      type="text"
                      name="numero_inventario"
                      value={formulario.numero_inventario}
                      readOnly
                      className="numero-automatico"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Tipo de activo *</label>
                    <select
                      name="id_tipo_activo"
                      value={formulario.id_tipo_activo}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="">Selecciona un tipo</option>

                      {categorias
                        .filter((categoria) => categoria.habilitado)
                        .map((categoria) => (
                          <option
                            key={categoria.id_tipo_activo}
                            value={categoria.id_tipo_activo}
                          >
                            {categoria.categoria}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="campo-formulario">
                    <label>Estado del activo *</label>
                    <select
                      name="id_estado_activo"
                      value={formulario.id_estado_activo}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="">Selecciona un estado</option>
                      <option value="Activo">Activo</option>
                      <option value="Disponible">Disponible</option>
                      <option value="Asignado">Asignado</option>
                      <option value="En mantenimiento">En mantenimiento</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>

                  <div className="campo-formulario">
                    <label>Proveedor de adquisición</label>
                    <input
                      type="text"
                      name="id_proveedor_adquisicion"
                      value={formulario.id_proveedor_adquisicion}
                      onChange={manejarCambio}
                      placeholder="Nombre del proveedor"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Número de serie</label>
                    <input
                      type="text"
                      name="numero_serie"
                      value={formulario.numero_serie}
                      onChange={manejarCambio}
                      placeholder="Número de serie"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Marca *</label>
                    <input
                      type="text"
                      name="marca"
                      value={formulario.marca}
                      onChange={manejarCambio}
                      placeholder="Ej. Lenovo"
                      required
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Modelo *</label>
                    <input
                      type="text"
                      name="modelo"
                      value={formulario.modelo}
                      onChange={manejarCambio}
                      placeholder="Ej. ThinkPad E14"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="formulario-seccion">
                <h3>Información de adquisición</h3>

                <div className="formulario-grid">
                  <div className="campo-formulario">
                    <label>Fecha de adquisición</label>
                    <input
                      type="date"
                      name="fecha_adquisicion"
                      value={formulario.fecha_adquisicion}
                      onChange={manejarCambio}
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Costo de adquisición</label>
                    <input
                      type="number"
                      name="costo_adquisicion"
                      value={formulario.costo_adquisicion}
                      onChange={manejarCambio}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Moneda</label>
                    <select
                      name="moneda"
                      value={formulario.moneda}
                      onChange={manejarCambio}
                    >
                      <option value="MXN">MXN</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>

                  <div className="campo-formulario">
                    <label>Número de factura</label>
                    <input
                      type="text"
                      name="numero_factura"
                      value={formulario.numero_factura}
                      onChange={manejarCambio}
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Número de orden de compra</label>
                    <input
                      type="text"
                      name="numero_orden_compra"
                      value={formulario.numero_orden_compra}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>
              </div>

              <div className="formulario-seccion">
                <h3>Información de baja</h3>

                <div className="formulario-grid">
                  <div className="campo-formulario">
                    <label>Fecha de baja</label>
                    <input
                      type="date"
                      name="fecha_baja"
                      value={formulario.fecha_baja}
                      onChange={manejarCambio}
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Motivo de baja</label>
                    <input
                      type="text"
                      name="motivo_baja"
                      value={formulario.motivo_baja}
                      onChange={manejarCambio}
                    />
                  </div>

                  <div className="campo-formulario campo-completo">
                    <label>Observaciones</label>
                    <textarea
                      name="observaciones"
                      value={formulario.observaciones}
                      onChange={manejarCambio}
                      rows="3"
                      placeholder="Información adicional del activo..."
                    />
                  </div>
                </div>
              </div>

              <div className="modal-acciones">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarFormulario}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-guardar">
                  {activoEditando !== null
                    ? "Guardar cambios"
                    : "Guardar activo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETALLE DEL ACTIVO */}
      {activoDetalle && (
        <div
          className="modal-fondo"
          onClick={() => setActivoDetalle(null)}
        >
          <div
            className="modal-activo"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-encabezado">
              <h2>Detalle del activo</h2>

              <button
                type="button"
                className="btn-cerrar-modal"
                onClick={() => setActivoDetalle(null)}
              >
                ×
              </button>
            </div>

            <div className="formulario-seccion">
              <p>
                <strong>Inventario:</strong>{" "}
                {activoDetalle.numero_inventario}
              </p>
              <p>
                <strong>Tipo:</strong>{" "}
                {obtenerNombreCategoria(activoDetalle)}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                {activoDetalle.estado_activo}
              </p>
              <p><strong>Marca:</strong> {activoDetalle.marca}</p>
              <p><strong>Modelo:</strong> {activoDetalle.modelo}</p>
              <p><strong>Serie:</strong> {activoDetalle.numero_serie || "—"}</p>
              <p>
                <strong>Proveedor:</strong>{" "}
                {activoDetalle.id_proveedor_adquisicion || "—"}
              </p>
              <p>
                <strong>Fecha de adquisición:</strong>{" "}
                {activoDetalle.fecha_adquisicion || "—"}
              </p>
              <p>
                <strong>Costo:</strong>{" "}
                {activoDetalle.costo_adquisicion || "—"}{" "}
                {activoDetalle.moneda}
              </p>
              <p>
                <strong>Factura:</strong>{" "}
                {activoDetalle.numero_factura || "—"}
              </p>
              <p>
                <strong>Orden de compra:</strong>{" "}
                {activoDetalle.numero_orden_compra || "—"}
              </p>
              <p>
                <strong>Fecha de baja:</strong>{" "}
                {activoDetalle.fecha_baja || "—"}
              </p>
              <p>
                <strong>Motivo de baja:</strong>{" "}
                {activoDetalle.motivo_baja || "—"}
              </p>
              <p>
                <strong>Observaciones:</strong>{" "}
                {activoDetalle.observaciones || "—"}
              </p>
            </div>

            <div className="modal-acciones">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setActivoDetalle(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AVISOS CENTRADOS */}
      {mostrarAviso && (
        <div className="aviso-fondo">
          <div
            className={`aviso-ventana ${tipoMensaje}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-aviso"
          >
            <div className="aviso-icono">
              {tipoMensaje === "exito" ? "✓" : "!"}
            </div>

            <h2 id="titulo-aviso">
              {tipoMensaje === "exito"
                ? "Operación exitosa"
                : "No se pudo completar la operación"}
            </h2>

            <p>{mensaje}</p>

            <button
              type="button"
              onClick={() => setMostrarAviso(false)}
              autoFocus
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activos;
