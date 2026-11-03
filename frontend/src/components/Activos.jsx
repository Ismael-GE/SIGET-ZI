
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

function Activos() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [activos, setActivos] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [busqueda, setBusqueda] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const guardarActivo = (e) => {
    e.preventDefault();

    const nuevoActivo = {
      ...formulario,
      id: Date.now(),
    };

    setActivos([...activos, nuevoActivo]);
    setFormulario(formularioInicial);
    setMostrarModal(false);
  };

  const activosFiltrados = activos.filter((activo) =>
    `${activo.numero_inventario} ${activo.numero_serie} ${activo.marca} ${activo.modelo}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const cerrarModal = () => {
    setMostrarModal(false);
    setFormulario(formularioInicial);
  };

  return (
    <div className="activos-container">

      {/* ENCABEZADO */}
      <div className="activos-header">
        <div>
          <h2>Inventario de activos</h2>
          <p>Administración y control del equipamiento tecnológico.</p>
        </div>

        <button
          className="btn-registrar"
          onClick={() => setMostrarModal(true)}
        >
          + Registrar activo
        </button>
      </div>

      {/* BÚSQUEDA */}
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
              <th>Tipo de activo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Número de serie</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {activosFiltrados.length > 0 ? (
              activosFiltrados.map((activo) => (
                <tr key={activo.id}>
                  <td>{activo.numero_inventario}</td>
                  <td>{activo.id_tipo_activo}</td>
                  <td>{activo.marca || "—"}</td>
                  <td>{activo.modelo || "—"}</td>
                  <td>{activo.numero_serie || "—"}</td>
                  <td>{activo.id_estado_activo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="tabla-vacia">
                  {busqueda
                    ? "No se encontraron activos."
                    : "Aún no hay activos registrados."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE REGISTRO */}
      {mostrarModal && (
        <div className="modal-fondo">
          <div className="modal-activo">

            <div className="modal-encabezado">
              <div>
                <h2>Registrar nuevo activo</h2>
                <p>Ingresa la información del equipo tecnológico.</p>
              </div>

              <button
                type="button"
                className="btn-cerrar-modal"
                onClick={cerrarModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarActivo}>

              {/* DATOS GENERALES */}
              <section className="formulario-seccion">
                <h3>01. Datos generales</h3>

                <div className="formulario-grid">

                  <div className="campo-formulario">
                    <label>Número de inventario *</label>
                    <input
                      type="text"
                      name="numero_inventario"
                      value={formulario.numero_inventario}
                      onChange={manejarCambio}
                      placeholder="Ej. ZI-0001"
                      required
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
                      <option value="">Seleccionar tipo</option>
                      <option value="Equipo de cómputo">Equipo de cómputo</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Impresora">Impresora</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Escáner">Escáner</option>
                      <option value="Dispositivo móvil">Dispositivo móvil</option>
                      <option value="Equipo de red">Equipo de red</option>
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
                      <option value="">Seleccionar estado</option>
                      <option value="Activo">Activo</option>
                      <option value="Disponible">Disponible</option>
                      <option value="En mantenimiento">En mantenimiento</option>
                      <option value="Baja">Baja</option>
                    </select>
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
                    <label>Marca</label>
                    <input
                      type="text"
                      name="marca"
                      value={formulario.marca}
                      onChange={manejarCambio}
                      placeholder="Marca del equipo"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Modelo</label>
                    <input
                      type="text"
                      name="modelo"
                      value={formulario.modelo}
                      onChange={manejarCambio}
                      placeholder="Modelo del equipo"
                    />
                  </div>

                </div>
              </section>

              {/* ADQUISICIÓN */}
              <section className="formulario-seccion">
                <h3>02. Información de adquisición</h3>

                <div className="formulario-grid">

                  <div className="campo-formulario">
                    <label>Proveedor de adquisición</label>
                    <input
                      type="text"
                      name="id_proveedor_adquisicion"
                      value={formulario.id_proveedor_adquisicion}
                      onChange={manejarCambio}
                      placeholder="Proveedor (provisional)"
                    />
                  </div>

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
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Moneda</label>
                    <select
                      name="moneda"
                      value={formulario.moneda}
                      onChange={manejarCambio}
                    >
                      <option value="MXN">MXN - Peso mexicano</option>
                      <option value="USD">USD - Dólar estadounidense</option>
                    </select>
                  </div>

                  <div className="campo-formulario">
                    <label>Número de factura</label>
                    <input
                      type="text"
                      name="numero_factura"
                      value={formulario.numero_factura}
                      onChange={manejarCambio}
                      placeholder="Número de factura"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Número de orden de compra</label>
                    <input
                      type="text"
                      name="numero_orden_compra"
                      value={formulario.numero_orden_compra}
                      onChange={manejarCambio}
                      placeholder="Número de orden"
                    />
                  </div>

                </div>
              </section>

              {/* INFORMACIÓN ADICIONAL */}
              <section className="formulario-seccion">
                <h3>03. Información adicional</h3>

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
                      placeholder="Motivo de baja"
                    />
                  </div>

                  <div className="campo-formulario campo-completo">
                    <label>Observaciones</label>
                    <textarea
                      name="observaciones"
                      value={formulario.observaciones}
                      onChange={manejarCambio}
                      placeholder="Información adicional del activo..."
                      rows="3"
                    />
                  </div>

                </div>
              </section>

              {/* BOTONES */}
              <div className="modal-acciones">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-guardar"
                >
                  Guardar activo
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Activos;
