
import { useState } from "react";
import "./Home.css";
import Activos from "../components/Activos";

// Datos del inventario.
const equipos = [];

function Home({ usuario, onLogout }) {
  // Controla qué pantalla se muestra.
  const [vista, setVista] = useState("inicio");

  // Indicadores del inventario.
  const totalEquipos = equipos.length;

  const equiposAsignados = equipos.filter(
    (equipo) => equipo.usuarioAsignado
  ).length;

  const equiposMantenimiento = equipos.filter(
    (equipo) => equipo.estado === "Mantenimiento"
  ).length;

  const gastosMantenimiento = 0;

  const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  return (
    <main className="home-page">

      {/* MENÚ LATERAL */}
      <aside className="home-sidebar">
        <div className="sidebar-brand">
          <div className="home-logo">Z</div>
          <h2>SIGET-ZI</h2>
        </div>

        <p className="menu-label">MENÚ PRINCIPAL</p>

        <nav className="sidebar-menu">
          <a
            href="#inicio"
            className={vista === "inicio" ? "active" : ""}
            onClick={() => setVista("inicio")}
          >
            <span>⌂</span> Inicio
          </a>

          <a
            href="#inventario"
            className={vista === "inventario" ? "active" : ""}
            onClick={() => setVista("inventario")}
          >
            <span>▣</span> Inventario
          </a>

          <a href="#categorias">
            <span>▦</span> Categorías
          </a>

          <a href="#asignaciones">
            <span>♙</span> Asignaciones
          </a>

          <a href="#mantenimiento">
            <span>⚙</span> Mantenimiento
          </a>

          <a href="#reportes">
            <span>▤</span> Reportes
          </a>

          <a href="#configuracion">
            <span>⚙</span> Configuración
          </a>
        </nav>

        <button className="logout-button" onClick={onLogout}>
          <span>↪</span> Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <section className="home-content">

        {/* ENCABEZADO */}
        <header className="home-header">
          <div>
            <p className="breadcrumb">
              SIGET-ZI / {vista === "inicio" ? "Inicio" : "Inventario"}
            </p>

            <h1>
              {vista === "inicio"
                ? "Panel principal"
                : "Inventario de activos"}
            </h1>

            <p className="header-description">
              Sistema Integral de Gestión de Equipamiento Tecnológico
            </p>
          </div>

          <div className="home-user">
            <span className="user-avatar">
              {usuario.charAt(0).toUpperCase()}
            </span>

            <div>
              <strong>{usuario}</strong>
              <small>Usuario del sistema</small>
            </div>
          </div>
        </header>

        {/* PANTALLA DE INVENTARIO */}
        {vista === "inventario" ? (
          <Activos />
        ) : (

          /* PANTALLA DE INICIO */
          <>
            {/* BIENVENIDA */}
            <div className="welcome-card">
              <span className="welcome-label">
                ZERMAT INTERNACIONAL · TECNOLOGÍAS DE LA INFORMACIÓN
              </span>

              <h2>¡Bienvenido, {usuario}!</h2>

              <p>
                Administra y consulta la información de los equipos
                tecnológicos desde un solo lugar.
              </p>
            </div>

            {/* INDICADORES */}
            <div className="section-heading">
              <div>
                <h2>Resumen del sistema</h2>
                <p>Indicadores generales del inventario tecnológico</p>
              </div>
            </div>

            <div className="home-cards">

              <article className="summary-card">
                <div className="card-top">
                  <span className="card-icon">▣</span>
                  <span className="card-tag">Inventario</span>
                </div>

                <h3>{totalEquipos}</h3>
                <p>Total de equipos registrados</p>
              </article>

              <article className="summary-card">
                <div className="card-top">
                  <span className="card-icon">♙</span>
                  <span className="card-tag">Asignaciones</span>
                </div>

                <h3>{equiposAsignados}</h3>
                <p>Equipos asignados a usuarios</p>
              </article>

              <article className="summary-card">
                <div className="card-top">
                  <span className="card-icon">⚙</span>
                  <span className="card-tag">Mantenimiento</span>
                </div>

                <h3>{equiposMantenimiento}</h3>
                <p>Equipos en mantenimiento</p>
              </article>

              <article className="summary-card">
                <div className="card-top">
                  <span className="card-icon">$</span>
                  <span className="card-tag">Gastos</span>
                </div>

                <h3>{formatoMoneda.format(gastosMantenimiento)}</h3>
                <p>Gastos de mantenimiento registrados</p>
              </article>

            </div>

            {/* ACTIVIDAD Y ALERTAS */}
            <div className="dashboard-bottom">

              <section className="dashboard-panel">
                <h2>Actividad reciente</h2>

                <p className="panel-description">
                  Aquí se mostrarán los últimos movimientos del inventario.
                </p>

                <div className="empty-state">
                  <span>▤</span>
                  <p>Aún no hay movimientos registrados.</p>
                </div>
              </section>

              <section className="dashboard-panel">
                <h2>Requiere atención</h2>

                <p className="panel-description">
                  Avisos relacionados con los equipos tecnológicos.
                </p>

                <div className="empty-state">
                  <span>✓</span>
                  <p>No hay alertas registradas.</p>
                </div>
              </section>

            </div>

            <footer className="home-footer">
              SIGET-ZI · Sistema de Gestión de Equipamiento Tecnológico
            </footer>
          </>
        )}

      </section>
    </main>
  );
}

export default Home;
