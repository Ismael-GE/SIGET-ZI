
import { useState } from "react";
import "./Garantias.css";

function Garantias({ equipos = [], proveedores = [] }) {
  // Datos iniciales del formulario.
  const formularioInicial = {
    id_activo: "",
    id_proveedor: "",
    fecha_inicio: "",
    fecha_vencimiento: "",
    numero_garantia: "",
    numero_factura: "",
    cobertura: "",
    exclusiones: "",
    observaciones: "",
  };

  // Estados del módulo.
  const [formulario, setFormulario] = useState(formularioInicial);
  const [busqueda, setBusqueda] = useState("");
  const [garantias, setGarantias] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Actualiza los campos del formulario.
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // Registra una garantía.
  const guardarGarantia = (e) => {
    e.preventDefault();

    if (
      !formulario.id_activo ||
      !formulario.id_proveedor ||
      !formulario.fecha_inicio ||
      !formulario.fecha_vencimiento
    ) {
      alert("Completa los campos obligatorios.");
      return;
    }

    if (formulario.fecha_vencimiento < formulario.fecha_inicio) {
      alert(
        "La fecha de vencimiento no puede ser anterior a la fecha de inicio."
      );
      return;
    }

    const nuevaGarantia = {
      ...formulario,
      id_garantia: Date.now(),
    };

    setGarantias((anteriores) => [...anteriores, nuevaGarantia]);

    alert("Garantía registrada correctamente.");

    setFormulario(formularioInicial);
    setMostrarFormulario(false);
  };

  // Fecha actual sin considerar la hora.
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Busca garantías por activo, proveedor, número o factura.
  const garantiasFiltradas = garantias.filter((garantia) => {
    const activo = equipos.find(
      (equipo) => String(equipo.id) === String(garantia.id_activo)
    );

    const proveedor = proveedores.find(
      (elemento) =>
        String(elemento.id_proveedor) === String(garantia.id_proveedor)
    );

    const texto = [
      activo?.numero_inventario,
      activo?.marca,
      activo?.modelo,
      proveedor?.razon_social,
      garantia.numero_garantia,
      garantia.numero_factura,
    ]
      .join(" ")
      .toLowerCase();

    return texto.includes(busqueda.toLowerCase());
  });

  // Indicadores de garantías.
  const totalGarantias = garantias.length;

  const garantiasVencidas = garantias.filter((garantia) => {
    const vencimiento = new Date(
      `${garantia.fecha_vencimiento}T00:00:00`
    );

    return vencimiento < hoy;
  }).length;

  const garantiasProximas = garantias.filter((garantia) => {
    const vencimiento = new Date(
      `${garantia.fecha_vencimiento}T00:00:00`
    );

    const diasRestantes = Math.ceil(
      (vencimiento - hoy) / (1000 * 60 * 60 * 24)
    );

    return diasRestantes >= 0 && diasRestantes <= 30;
  }).length;

  const garantiasVigentes = garantias.filter((garantia) => {
    const vencimiento = new Date(
      `${garantia.fecha_vencimiento}T00:00:00`
    );

    return vencimiento >= hoy;
  }).length;

  return (
    <section className="garantias-container">

      {/* ENCABEZADO */}
      <div className="garantias-header">
        <div>
          <h2>Garantías</h2>
          <p>
            Administración de garantías de los activos tecnológicos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormulario(formularioInicial);
            setMostrarFormulario(true);
          }}
        >
          + Nueva garantía
        </button>
      </div>

      {/* INDICADORES */}
      <div className="garantias-indicadores">
        <article>
          <h3>{totalGarantias}</h3>
          <p>Total de garantías</p>
        </article>

        <article>
          <h3>{garantiasVigentes}</h3>
          <p>Vigentes</p>
        </article>

        <article>
          <h3>{garantiasProximas}</h3>
          <p>Próximas a vencer</p>
        </article>

        <article>
          <h3>{garantiasVencidas}</h3>
          <p>Vencidas</p>
        </article>
      </div>

      {/* FORMULARIO */}
      {mostrarFormulario && (
        <form
          className="garantias-formulario"
          onSubmit={guardarGarantia}
        >
          <h3>Registrar garantía</h3>

          <div className="garantias-formulario-grid">

            <div>
              <label>Activo tecnológico *</label>
              <select
                name="id_activo"
                value={formulario.id_activo}
                onChange={manejarCambio}
                required
              >
                <option value="">Selecciona un activo</option>

                {equipos.map((equipo) => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.numero_inventario} - {equipo.marca}{" "}
                    {equipo.modelo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Proveedor *</label>
              <select
                name="id_proveedor"
                value={formulario.id_proveedor}
                onChange={manejarCambio}
                required
              >
                <option value="">Selecciona un proveedor</option>

                {proveedores.map((proveedor) => (
                  <option
                    key={proveedor.id_proveedor}
                    value={proveedor.id_proveedor}
                  >
                    {proveedor.razon_social}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Fecha de inicio *</label>
              <input
                type="date"
                name="fecha_inicio"
                value={formulario.fecha_inicio}
                onChange={manejarCambio}
                required
              />
            </div>

            <div>
              <label>Fecha de vencimiento *</label>
              <input
                type="date"
                name="fecha_vencimiento"
                value={formulario.fecha_vencimiento}
                onChange={manejarCambio}
                required
              />
            </div>

            <div>
              <label>Número de garantía</label>
              <input
                type="text"
                name="numero_garantia"
                value={formulario.numero_garantia}
                onChange={manejarCambio}
              />
            </div>

            <div>
              <label>Número de factura</label>
              <input
                type="text"
                name="numero_factura"
                value={formulario.numero_factura}
                onChange={manejarCambio}
              />
            </div>

            <div>
              <label>Cobertura</label>
              <textarea
                name="cobertura"
                value={formulario.cobertura}
                onChange={manejarCambio}
                rows="3"
              />
            </div>

            <div>
              <label>Exclusiones</label>
              <textarea
                name="exclusiones"
                value={formulario.exclusiones}
                onChange={manejarCambio}
                rows="3"
              />
            </div>

            <div className="garantias-campo-completo">
              <label>Observaciones</label>
              <textarea
                name="observaciones"
                value={formulario.observaciones}
                onChange={manejarCambio}
                rows="3"
              />
            </div>

          </div>

          <div className="garantias-acciones">
            <button type="submit">
              Registrar garantía
            </button>

            <button
              type="button"
              onClick={() => {
                setFormulario(formularioInicial);
                setMostrarFormulario(false);
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* BÚSQUEDA */}
      <div className="garantias-busqueda">
        <input
          type="text"
          placeholder="Buscar por activo, proveedor, garantía o factura..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* TABLA DE GARANTÍAS */}
      <div className="garantias-tabla-contenedor">
        <h3>Garantías registradas</h3>

        <table className="garantias-tabla">
          <thead>
            <tr>
              <th>Activo</th>
              <th>Proveedor</th>
              <th>Número de garantía</th>
              <th>Fecha de inicio</th>
              <th>Vencimiento</th>
            </tr>
          </thead>

          <tbody>
            {garantiasFiltradas.length > 0 ? (
              garantiasFiltradas.map((garantia) => {
                const activo = equipos.find(
                  (equipo) =>
                    String(equipo.id) === String(garantia.id_activo)
                );

                const proveedor = proveedores.find(
                  (elemento) =>
                    String(elemento.id_proveedor) ===
                    String(garantia.id_proveedor)
                );

                return (
                  <tr key={garantia.id_garantia}>
                    <td>
                      {activo
                        ? `${activo.numero_inventario} - ${activo.marca} ${activo.modelo}`
                        : "Activo no encontrado"}
                    </td>

                    <td>
                      {proveedor
                        ? proveedor.razon_social
                        : "Proveedor no encontrado"}
                    </td>

                    <td>{garantia.numero_garantia || "—"}</td>

                    <td>{garantia.fecha_inicio}</td>

                    <td>{garantia.fecha_vencimiento}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="garantias-vacio">
                  {garantias.length > 0
                    ? "No se encontraron garantías con esa búsqueda."
                    : "No hay garantías registradas."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="garantias-total">
        Total de registros: {totalGarantias}
      </p>

    </section>
  );
}
export default Garantias;
