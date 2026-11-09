import { useState } from "react";
import "./Proveedores.css";

function Proveedores({ proveedores = [], setProveedores }) {
  const formularioInicial = {
    razon_social: "",
    rfc: "",
    contacto: "",
    telefono: "",
    correo: "",
    direccion: "",
    estado_proveedor: "Activo",
  };

  const [formulario, setFormulario] = useState(formularioInicial);
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setModoEdicion(false);
    setProveedorEditando(null);
    setMostrarFormulario(false);
  };

  const guardarProveedor = (e) => {
    e.preventDefault();

    if (!formulario.razon_social.trim() || !formulario.rfc.trim()) {
      alert("La razón social y el RFC son obligatorios.");
      return;
    }

    if (modoEdicion) {
      setProveedores((anteriores) =>
        anteriores.map((proveedor) =>
          proveedor.id_proveedor === proveedorEditando
            ? { ...formulario, id_proveedor: proveedorEditando }
            : proveedor
        )
      );

      alert("Proveedor actualizado correctamente.");
    } else {
      const nuevoProveedor = {
        ...formulario,
        id_proveedor: Date.now(),
      };

      setProveedores((anteriores) => [...anteriores, nuevoProveedor]);

      alert("Proveedor registrado correctamente.");
    }

    limpiarFormulario();
  };

  const editarProveedor = (proveedor) => {
    setFormulario({
      razon_social: proveedor.razon_social || "",
      rfc: proveedor.rfc || "",
      contacto: proveedor.contacto || "",
      telefono: proveedor.telefono || "",
      correo: proveedor.correo || "",
      direccion: proveedor.direccion || "",
      estado_proveedor: proveedor.estado_proveedor || "Activo",
    });

    setProveedorEditando(proveedor.id_proveedor);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const eliminarProveedor = (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este proveedor?"
    );

    if (!confirmar) return;

    setProveedores((anteriores) =>
      anteriores.filter((proveedor) => proveedor.id_proveedor !== id)
    );
  };

  const proveedoresFiltrados = proveedores.filter((proveedor) =>
    [
      proveedor.razon_social,
      proveedor.rfc,
      proveedor.contacto,
      proveedor.correo,
    ]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <section className="proveedores-container">
      <div className="proveedores-header">
        <div>
          <h2>Proveedores</h2>
          <p>Administración de proveedores de tecnología y servicios.</p>
        </div>

        <button
          className="proveedores-btn-principal"
          onClick={() => {
            limpiarFormulario();
            setMostrarFormulario(true);
          }}
        >
          + Nuevo proveedor
        </button>
      </div>

      {mostrarFormulario && (
        <form className="proveedores-formulario" onSubmit={guardarProveedor}>
          <h3>{modoEdicion ? "Editar proveedor" : "Registrar proveedor"}</h3>

          <div className="proveedores-grid">
            <div className="proveedor-campo">
              <label>Razón social *</label>
              <input
                type="text"
                name="razon_social"
                value={formulario.razon_social}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="proveedor-campo">
              <label>RFC *</label>
              <input
                type="text"
                name="rfc"
                value={formulario.rfc}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="proveedor-campo">
              <label>Contacto</label>
              <input
                type="text"
                name="contacto"
                value={formulario.contacto}
                onChange={manejarCambio}
              />
            </div>

            <div className="proveedor-campo">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formulario.telefono}
                onChange={manejarCambio}
              />
            </div>

            <div className="proveedor-campo">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={manejarCambio}
              />
            </div>

            <div className="proveedor-campo">
              <label>Estado del proveedor</label>
              <select
                name="estado_proveedor"
                value={formulario.estado_proveedor}
                onChange={manejarCambio}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="proveedor-campo proveedor-campo-completo">
              <label>Dirección</label>
              <textarea
                name="direccion"
                value={formulario.direccion}
                onChange={manejarCambio}
                rows="3"
              />
            </div>
          </div>

          <div className="proveedores-acciones">
            <button type="submit" className="proveedores-btn-principal">
              {modoEdicion ? "Guardar cambios" : "Registrar proveedor"}
            </button>

            <button
              type="button"
              className="proveedores-btn-secundario"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="proveedores-busqueda">
        <input
          type="text"
          placeholder="Buscar por razón social, RFC, contacto o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="proveedores-tabla-contenedor">
        <table className="proveedores-tabla">
          <thead>
            <tr>
              <th>Razón social</th>
              <th>RFC</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {proveedoresFiltrados.length > 0 ? (
              proveedoresFiltrados.map((proveedor) => (
                <tr key={proveedor.id_proveedor}>
                  <td>{proveedor.razon_social}</td>
                  <td>{proveedor.rfc}</td>
                  <td>{proveedor.contacto || "—"}</td>
                  <td>{proveedor.telefono || "—"}</td>
                  <td>{proveedor.correo || "—"}</td>
                  <td>
                    <span
                      className={
                        proveedor.estado_proveedor === "Activo"
                          ? "proveedor-estado activo"
                          : "proveedor-estado inactivo"
                      }
                    >
                      {proveedor.estado_proveedor}
                    </span>
                  </td>
                  <td>
                    <div className="proveedor-acciones-tabla">
                      <button
                        type="button"
                        onClick={() => editarProveedor(proveedor)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarProveedor(proveedor.id_proveedor)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="proveedores-vacio">
                  No se encontraron proveedores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="proveedores-total">
        Total de proveedores: {proveedores.length}
      </p>
    </section>
  );
}

export default Proveedores;