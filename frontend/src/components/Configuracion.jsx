function Configuracion() {
  return (
    <section className="configuracion-container">
      <div className="configuracion-intro">
        <h2>Administración del sistema</h2>

        <p>
          Gestiona los parámetros y elementos de configuración
          de SIGET-ZI desde un solo lugar.
        </p>
      </div>

      <div className="configuracion-grid">
        <article className="configuracion-card">
          <div className="configuracion-icon">⚙</div>
          <h3>Parámetros generales</h3>
          <p>
            Consulta y administra los parámetros generales
            del sistema.
          </p>
          <span>Próximamente</span>
        </article>

        <article className="configuracion-card">
          <div className="configuracion-icon">▤</div>
          <h3>Catálogos del sistema</h3>
          <p>
            Administración de los catálogos definidos
            en el modelo de datos.
          </p>
          <span>Próximamente</span>
        </article>

        <article className="configuracion-card">
          <div className="configuracion-icon">⌖</div>
          <h3>Estructura organizacional</h3>
          <p>
            Consulta de los elementos que representan
            la estructura organizacional.
          </p>
          <span>Próximamente</span>
        </article>
      </div>
    </section>
  );
}

export default Configuracion;