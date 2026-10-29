
import "./Home.css";

function Home({ usuario, onLogout }) {
  return (
    <main className="home-page">
      <aside className="home-sidebar">
        <div className="home-logo">Z</div>
        <h2>SIGET-ZI</h2>

        

        <button className="logout-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </aside>

      <section className="home-content" id="inicio">
        <header className="home-header">
          <div>
            <h1>Panel principal</h1>
            <p>Sistema de Gestión de Equipos Tecnológicos</p>
          </div>

          <div className="home-user">
            <span className="user-avatar">
              {usuario.charAt(0).toUpperCase()}
            </span>
            <span>{usuario}</span>
          </div>
        </header>

        <div className="welcome-card">
          <span className="welcome-label">SIGET-ZI · ZERMAT INTERNACIONAL</span>
          <h2>¡Bienvenido {usuario}!</h2>
        </div>

        <h2 className="section-title">Resumen del sistema</h2>

        <div className="home-cards">
          <article className="summary-card">
            <span className="card-icon"></span>
            <h3>Equipos</h3>
            <p>Consulta y administra los equipos tecnológicos.</p>
            <span className="card-status">Módulo de prueba</span>
          </article>

          <article className="summary-card">
            <span className="card-icon"></span>
            <h3>Usuarios</h3>
            <p>Organiza la información de los usuarios.</p>
            <span className="card-status">Módulo de prueba</span>
          </article>

          <article className="summary-card">
            <span className="card-icon"></span>
            <h3>Reportes</h3>
            <p>Consulta información general del sistema.</p>
            <span className="card-status">Módulo de prueba</span>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;
