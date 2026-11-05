
import { useState } from "react";
import "./AsignacionesSoft.css";

function AsignacionesSoft() {
  const [licencias, setLicencias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const formularioInicial = {
    nombre: "",
    fabricante: "",
    version: "",
    tipoLicencia: "",
    cantidad: "",
    fechaAdquisicion: "",
    fechaVencimiento: "",
    observaciones: "",
  };

  const [formulario, setFormulario] = useState(formularioInicial);

  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  const abrirFormulario = () => {
    setFormulario(formularioInicial);
    setMensaje("");
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setFormulario(formularioInicial);
    setMensaje("");
  };

  const guardarLicencia = (e) => {
    e.preventDefault();

    const cantidad = Number(formulario.cantidad);

    if (
      !formulario.nombre.trim() ||
      !formulario.fabricante.trim() ||
      !formulario.version.trim() ||
      !formulario.tipoLicencia ||
      !Number.isInteger(cantidad) ||
      cantidad <= 0 ||
      !formulario.fechaAdquisicion
    ) {
      setMensaje("Verifica los campos obligatorios y la cantidad adquirida.");
      return;
    }

    if (
      formulario.fechaVencimiento &&
      formulario.fechaVencimiento < formulario.fechaAdquisicion
    ) {
      setMensaje("El vencimiento no puede ser anterior a la adquisición.");
      return;
    }

    const nuevaLicencia = {
      id: Date.now(),
      ...formulario,
      nombre: formulario.nombre.trim(),
      fabricante: formulario.fabricante.trim(),
      version: formulario.version.trim(),
      cantidad,
      asignadas: 0,
      disponibles: cantidad,
      estado: "Vigente",
    };

    setLicencias((actuales) => [...actuales, nuevaLicencia]);
    cerrarFormulario();
  };

  const licenciasFiltradas = licencias.filter((licencia) => {
    const termino = busqueda.toLowerCase();

    return (
      licencia.nombre.toLowerCase().includes(termino) ||
      licencia.fabricante.toLowerCase().includes(termino) ||
      licencia.version.toLowerCase().includes(termino)
    );
  });

  const totalLicencias = licencias.reduce(
    (total, licencia) => total + licencia.cantidad,
    0
  );

  const totalDisponibles = licencias.reduce(
    (total, licencia) => total + licencia.disponibles,
    0
  );

  const totalAsignadas = licencias.reduce(
    (total, licencia) => total + licencia.asignadas,
    0
  );

  return (
    <section className="software-page">
      <div className="software-encabezado">
        <div>
          <h2>Software y licencias</h2>
          <p>Administra el inventario de licencias de software.</p>
        </div>

        <button
          className="software-btn-nuevo"
          onClick={abrirFormulario}
        >
          + Registrar software
        </button>
      </div>

      <div className="software-resumen">
        <article className="software-indicador">
          <span>Software registrado</span>
          <strong>{licencias.length}</strong>
        </article>

        <article className="software-indicador">
          <span>Total de licencias</span>
          <strong>{totalLicencias}</strong>
        </article>

        <article className="software-indicador">
          <span>Licencias asignadas</span>
          <strong>{totalAsignadas}</strong>
        </article>

        <article className="software-indicador">
          <span>Licencias disponibles</span>
          <strong>{totalDisponibles}</strong>
        </article>
      </div>

      <div className="software-tabla-contenedor">
        <div className="software-busqueda">
          <input
            type="text"
            placeholder="Buscar por software, fabricante o versión..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="software-tabla-scroll">
          <table className="software-tabla">
            <thead>
              <tr>
                <th>Software</th>
                <th>Fabricante</th>
                <th>Versión</th>
                <th>Tipo de licencia</th>
                <th>Adquiridas</th>
                <th>Asignadas</th>
                <th>Disponibles</th>
                <th>Vencimiento</th>
              </tr>
            </thead>

            <tbody>
              {licenciasFiltradas.length > 0 ? (
                licenciasFiltradas.map((licencia) => (
                  <tr key={licencia.id}>
                    <td>{licencia.nombre}</td>
                    <td>{licencia.fabricante}</td>
                    <td>{licencia.version}</td>
                    <td>{licencia.tipoLicencia}</td>
                    <td>{licencia.cantidad}</td>
                    <td>{licencia.asignadas}</td>
                    <td>{licencia.disponibles}</td>
                    <td>{licencia.fechaVencimiento || "No especificado"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="software-sin-registros">
                    {busqueda
                      ? "No se encontraron licencias."
                      : "Aún no hay licencias registradas."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="software-modal-fondo">
          <div className="software-modal">
            <div className="software-modal-encabezado">
              <h2>Registrar software</h2>

              <button type="button" onClick={cerrarFormulario}>
                ×
              </button>
            </div>

            <form onSubmit={guardarLicencia}>
              <h3>Información del software</h3>

              <div className="software-form-grid">
                <div>
                  <label>Nombre del software *</label>
                  <input
                    name="nombre"
                    value={formulario.nombre}
                    onChange={actualizarCampo}
                    placeholder="Ej. Microsoft Office"
                    required
                  />
                </div>

                <div>
                  <label>Fabricante *</label>
                  <input
                    name="fabricante"
                    value={formulario.fabricante}
                    onChange={actualizarCampo}
                    placeholder="Ej. Microsoft"
                    required
                  />
                </div>

                <div>
                  <label>Versión *</label>
                  <input
                    name="version"
                    value={formulario.version}
                    onChange={actualizarCampo}
                    placeholder="Ej. 2021"
                    required
                  />
                </div>

                <div>
                  <label>Tipo de licencia *</label>
                  <select
                    name="tipoLicencia"
                    value={formulario.tipoLicencia}
                    onChange={actualizarCampo}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Perpetua">Perpetua</option>
                    <option value="Suscripción">Suscripción</option>
                    <option value="Por usuario">Por usuario</option>
                    <option value="Por dispositivo">Por dispositivo</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>

                <div>
                  <label>Cantidad adquirida *</label>
                  <input
                    type="number"
                    name="cantidad"
                    min="1"
                    step="1"
                    value={formulario.cantidad}
                    onChange={actualizarCampo}
                    placeholder="Cantidad de licencias"
                    required
                  />
                </div>

                <div>
                  <label>Fecha de adquisición *</label>
                  <input
                    type="date"
                    name="fechaAdquisicion"
                    value={formulario.fechaAdquisicion}
                    onChange={actualizarCampo}
                    required
                  />
                </div>

                <div>
                  <label>Fecha de vencimiento</label>
                  <input
                    type="date"
                    name="fechaVencimiento"
                    value={formulario.fechaVencimiento}
                    onChange={actualizarCampo}
                  />
                </div>
              </div>

              <div className="software-campo-completo">
                <label>Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={actualizarCampo}
                  placeholder="Información adicional..."
                  rows="3"
                />
              </div>

              {mensaje && (
                <p className="software-mensaje">{mensaje}</p>
              )}

              <div className="software-modal-acciones">
                <button type="button" onClick={cerrarFormulario}>
                  Cancelar
                </button>

                <button type="submit">
                  Guardar registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AsignacionesSoft;
