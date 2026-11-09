import { useState } from "react";
import "./Home.css";

import Activos from "../components/Activos";
import Categorias from "../components/Categorias";
import Asignaciones from "../components/Asignaciones";
import Kardex from "../components/Kardex";
import Mantenimiento from "../components/Mantenimiento";
import Incidencias from "../components/Incidencias";
import SoftwareLicencias from "../components/AsignacionesSoft";

function Home({ usuario, onLogout }) {
  // Controla qué pantalla se muestra.
  const [vista, setVista] = useState("inicio");

  // Estados generales del sistema.
  const [equipos, setEquipos] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  // Asignaciones de software a usuarios y equipos.
  const [asignacionesSoftware, setAsignacionesSoftware] = useState([]);
  const [movimientosKardex, setMovimientosKardex] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [gastosMantenimiento, setGastosMantenimiento] = useState([]);
  const [incidencias, setIncidencias] = useState([]);

  // Categorías iniciales del inventario.
  const categoriasIniciales = [
    { id_tipo_activo: 1, categoria: "Computadoras", habilitado: true },
    { id_tipo_activo: 2, categoria: "Laptops", habilitado: true },
    { id_tipo_activo: 3, categoria: "Impresoras", habilitado: true },
    { id_tipo_activo: 4, categoria: "Monitores", habilitado: true },
    { id_tipo_activo: 5, categoria: "Escáneres", habilitado: true },
    { id_tipo_activo: 6, categoria: "Dispositivos móviles", habilitado: true },
    { id_tipo_activo: 7, categoria: "Equipos de red", habilitado: true },
    { id_tipo_activo: 8, categoria: "Software y licenciamiento", habilitado: true },
    { id_tipo_activo: 9, categoria: "Refacciones y accesorios", habilitado: true },
    { id_tipo_activo: 10, categoria: "Tablets", habilitado: true },
  ];

  const [categorias, setCategorias] = useState(categoriasIniciales);

  // Indicadores del inventario.
  const totalEquipos = equipos.length;

  const equiposAsignados = equipos.filter(
    (equipo) => equipo.estado_activo === "Asignado"
  ).length;

  const equiposMantenimiento = equipos.filter(
    (equipo) => equipo.estado_activo === "En mantenimiento"
  ).length;
  const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  // Nombre de cada pantalla.
  const nombresVistas = {
    inicio: "Panel principal",
    inventario: "Inventario de activos",
    categorias: "Categorías",
    asignaciones: "Control de asignaciones",
    softwareLicencias: "Software y licencias",
    kardex: "Historial de movimientos",
    mantenimiento: "Control de mantenimiento",
    incidencias: "Control de incidencias",
    reportes: "Reportes",
    configuracion: "Configuración",
  };

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

          {/* INICIO */}
          <a
            href="#inicio"
            className={vista === "inicio" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("inicio");
            }}
          >
            <span>⌂</span> Inicio
          </a>

          {/* INVENTARIO */}
          <a
            href="#inventario"
            className={vista === "inventario" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("inventario");
            }}
          >
            <span>▣</span> Inventario
          </a>

          {/* CATEGORÍAS */}
          <a
            href="#categorias"
            className={vista === "categorias" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("categorias");
            }}
          >
            <span>▦</span> Categorías
          </a>

          {/* ASIGNACIONES DE ACTIVOS A COLABORADORES */}
          <a
            href="#asignaciones"
            className={vista === "asignaciones" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("asignaciones");
            }}
          >
            <span>♙</span> Asignaciones
          </a>

          {/* SOFTWARE Y LICENCIAS */}
          <a
            href="#softwareLicencias"
            className={vista === "softwareLicencias" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("softwareLicencias");
            }}
          >
            <span>▧</span> Software y licencias
          </a>

          {/* KARDEX */}
          <a
            href="#kardex"
            className={vista === "kardex" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("kardex");
            }}
          >
            <span>▤</span> Kardex
          </a>

          {/* MANTENIMIENTO */}
          <a
            href="#mantenimiento"
            className={vista === "mantenimiento" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("mantenimiento");
            }}
          >
            <span>⚙</span> Mantenimiento
          </a>

          {/* INCIDENCIAS */}
          <a
            href="#incidencias"
            className={vista === "incidencias" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("incidencias");
            }}
          >
            <span>⚠</span> Incidencias
          </a>

          {/* REPORTES */}
          <a
            href="#reportes"
            className={vista === "reportes" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("reportes");
            }}
          >
            <span>▤</span> Reportes
          </a>

          {/* CONFIGURACIÓN */}
          <a
            href="#configuracion"
            className={vista === "configuracion" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("configuracion");
            }}
          >
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
              SIGET-ZI / {nombresVistas[vista] || "Inicio"}
            </p>

            <h1>
              {nombresVistas[vista] || "Panel principal"}
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

          <Activos
            equipos={equipos}
            setEquipos={setEquipos}
            categorias={categorias}
            asignacionesSoftware={asignacionesSoftware}
            />

        /* PANTALLA DE CATEGORÍAS */
        ) : vista === "categorias" ? (

          <Categorias
            categorias={categorias}
            setCategorias={setCategorias}
          />

        /* ASIGNACIÓN DE ACTIVOS A COLABORADORES */
        ) : vista === "asignaciones" ? (

          <Asignaciones
            equipos={equipos}
            setEquipos={setEquipos}
            asignaciones={asignaciones}
            setAsignaciones={setAsignaciones}
            movimientosKardex={movimientosKardex}
            setMovimientosKardex={setMovimientosKardex}
          />
          /* SOFTWARE Y LICENCIAS */
          ) : vista === "softwareLicencias" ? (
          <SoftwareLicencias
          equipos={equipos}
          categorias={categorias}
          asignacionesSoftware={asignacionesSoftware}
          setAsignacionesSoftware={setAsignacionesSoftware}
          setMovimientosKardex={setMovimientosKardex}
          />

        /* PANTALLA DE KARDEX */
        ) : vista === "kardex" ? (

          <Kardex
            equipos={equipos}
            asignaciones={asignaciones}
            movimientosKardex={movimientosKardex}
            mantenimientos={mantenimientos}
            incidencias={incidencias}
          />

        /* PANTALLA DE MANTENIMIENTO */
        ) : vista === "mantenimiento" ? (

          <Mantenimiento
            equipos={equipos}
            setEquipos={setEquipos}
            mantenimientos={mantenimientos}
            setMantenimientos={setMantenimientos}
            setMovimientosKardex={setMovimientosKardex}
            gastosMantenimiento={gastosMantenimiento}
setGastosMantenimiento={setGastosMantenimiento}
          />

        /* PANTALLA DE INCIDENCIAS */
        ) : vista === "incidencias" ? (

          <Incidencias
            equipos={equipos}
            incidencias={incidencias}
            setIncidencias={setIncidencias}
          />

        /* PANTALLA DE REPORTES */
        ) : vista === "reportes" ? (

          <div className="welcome-card">
            <h2>Módulo de reportes</h2>
            <p>
              Aquí se podrán consultar los reportes generales del sistema.
            </p>
          </div>

        /* PANTALLA DE CONFIGURACIÓN */
        ) : vista === "configuracion" ? (

          <div className="welcome-card">
            <h2>Configuración</h2>
            <p>
              Aquí se administrarán las configuraciones del sistema.
            </p>
          </div>

        /* PANTALLA DE INICIO */
        ) : (

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
                <p>
                  Indicadores generales del inventario tecnológico
                </p>
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

                <h3>
                  {formatoMoneda.format(gastosMantenimiento)}
                </h3>

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
