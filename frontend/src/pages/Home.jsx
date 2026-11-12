
import { useState } from "react";
import "./Home.css";
import Activos from "../components/Activos";
import Categorias from "../components/Categorias";
import ComponentesActivos from "../components/ComponentesActivos";
import Asignaciones from "../components/Asignaciones";
import Kardex from "../components/Kardex";
import Mantenimiento from "../components/Mantenimiento";
import Incidencias from "../components/Incidencias";
import SoftwareLicencias from "../components/AsignacionesSoft";
import Gastos from "../components/Gastos";
import Proveedores from "../components/Proveedores";
import Colaboradores from "../components/Colaboradores";
import Ubicaciones from "../components/Ubicaciones";
import Usuarios from "../components/Usuarios";
import Roles from "../components/Roles";
import Garantias from "../components/Garantias";
import ConfiguracionRed from "../components/ConfiguracionRed";
import InstalacionesSoftware from "../components/InstalacionesSoftware";
import Auditoria from "../components/Auditoria";
import Reportes from "../components/Reportes";
import Configuracion from "../components/Configuracion";

// Módulos disponibles para configurar los permisos.
const modulosRoles = [
  "Inventario",
  "Componentes",
  "Categorías",
  "Asignaciones",
  "Software y licencias",
  "Instalaciones de software",
  "Kardex",
  "Mantenimiento",
  "Gastos",
  "Incidencias",
  "Proveedores",
  "Colaboradores",
  "Ubicaciones",
  "Reportes",
  "Configuración",
  "Garantías",
  "Configuración de red",
];

// Acciones disponibles para cada módulo.
const accionesRoles = ["Consultar", "Registrar", "Editar", "Eliminar"];

// Genera una estructura de permisos vacía.
const crearPermisosVacios = () =>
  Object.fromEntries(
    modulosRoles.map((modulo) => [modulo, []])
  );

// Roles iniciales del sistema.
const rolesIniciales = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso completo a los módulos del sistema.",
    permisos: Object.fromEntries(
      modulosRoles.map((modulo) => [
        modulo,
        [...accionesRoles],
      ])
    ),
    protegido: true,
  },
  {
    id: 2,
    nombre: "Supervisor de TI",
    descripcion: "Supervisión de las actividades del área de TI.",
    permisos: crearPermisosVacios(),
    protegido: false,
  },
  {
    id: 3,
    nombre: "Técnico de soporte",
    descripcion: "Atención de incidencias y mantenimiento.",
    permisos: crearPermisosVacios(),
    protegido: false,
  },
  {
    id: 4,
    nombre: "Empleado",
    descripcion: "Acceso básico a las funciones autorizadas.",
    permisos: crearPermisosVacios(),
    protegido: false,
  },
  {
    id: 5,
    nombre: "Auditor",
    descripcion: "Consulta de información para auditoría.",
    permisos: crearPermisosVacios(),
    protegido: false,
  },
];

function Home({ usuario, onLogout }) {
  // Controla qué pantalla se muestra.
  const [vista, setVista] = useState("inicio");

  // Estados generales del sistema.
  const [equipos, setEquipos] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [asignacionesSoftware, setAsignacionesSoftware] = useState([]);
  const [instalacionesSoftware, setInstalacionesSoftware] = useState([]);
  const [movimientosKardex, setMovimientosKardex] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [gastosMantenimiento, setGastosMantenimiento] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [componentes, setComponentes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Estado centralizado de los registros de auditoría.
  const [registrosAuditoria, setRegistrosAuditoria] = useState([]);

  // Estado centralizado de roles y permisos.
  const [roles, setRoles] = useState(rolesIniciales);

  // Los departamentos se conectarán posteriormente con su catálogo.
  const [departamentos] = useState([]);


// Categorías iniciales del inventario.
const categoriasIniciales = [
  { id_tipo_activo: 1, categoria: "Computadora", habilitado: true },
  { id_tipo_activo: 3, categoria: "Impresora", habilitado: true },
  { id_tipo_activo: 4, categoria: "Monitor", habilitado: true },
  { id_tipo_activo: 5, categoria: "Lector de código de barras", habilitado: true },
  { id_tipo_activo: 6, categoria: "Dispositivo móvil", habilitado: true },
  { id_tipo_activo: 7, categoria: "Equipo de red", habilitado: true },
  { id_tipo_activo: 8, categoria: "Software y licenciamiento", habilitado: true },
  { id_tipo_activo: 9, categoria: "Refacción y accesorio", habilitado: true },
  { id_tipo_activo: 10, categoria: "Tablet", habilitado: true },
  
];


  const [categorias, setCategorias] = useState(categoriasIniciales);

  // Indicadores del inventario.
  const totalEquipos = equipos.length;

  const totalGastos = gastosMantenimiento.reduce(
    (total, gasto) => total + (Number(gasto.importe_empresa) || 0),
    0
  );

  const equiposAsignados = equipos.filter(
    (equipo) => equipo.estado_activo === "Asignado"
  ).length;

  const equiposMantenimiento = equipos.filter(
    (equipo) => equipo.estado_activo === "En mantenimiento"
  ).length;

  const incidenciasAbiertas = incidencias.filter(
    (incidencia) =>
      incidencia.estado_incidencia === "Abierta" ||
      incidencia.estado_incidencia === "En proceso"
  ).length;

  const totalAlertas = incidenciasAbiertas + equiposMantenimiento;

  const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  // Nombre de cada pantalla.
  const nombresVistas = {
    inicio: "Panel principal",
    inventario: "Inventario de activos",
    componentes: "Componentes de activos",
    categorias: "Categorías",
    asignaciones: "Control de asignaciones",
    softwareLicencias: "Software y licencias",
    instalacionesSoftware: "Instalaciones de software",
    kardex: "Historial de movimientos",
    mantenimiento: "Control de mantenimiento",
    incidencias: "Control de incidencias",
    reportes: "Reportes",
    configuracion: "Configuración",
    gastos: "Gestión de gastos",
    proveedores: "Proveedores",
    garantias: "Administración de garantías",
    colaboradores: "Colaboradores",
    ubicaciones: "Ubicaciones",
    usuarios: "Administración de usuarios",
    roles: "Administración de roles",
    configuracionRed: "Configuración de red",
    auditoria: "Auditoría",
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
          <a
            href="#inicio"
            className={vista === "inicio" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("inicio");
            }}
          >
            <span></span> Inicio
          </a>

          <a
            href="#inventario"
            className={vista === "inventario" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("inventario");
            }}
          >
            <span></span> Inventario
          </a>

          <a
            href="#componentes"
            className={vista === "componentes" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("componentes");
            }}
          >
            <span></span> Componentes
          </a>

          <a
            href="#categorias"
            className={vista === "categorias" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("categorias");
            }}
          >
            <span></span> Categorías
          </a>

          <a
            href="#asignaciones"
            className={vista === "asignaciones" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("asignaciones");
            }}
          >
            <span></span> Asignaciones
          </a>

          <a
            href="#softwareLicencias"
            className={vista === "softwareLicencias" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("softwareLicencias");
            }}
          >
            <span></span> Software y licencias
          </a>

          <a
            href="#instalacionesSoftware"
            className={vista === "instalacionesSoftware" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("instalacionesSoftware");
            }}
          >
            <span></span> Instalaciones de software
          </a>

          <a
            href="#kardex"
            className={vista === "kardex" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("kardex");
            }}
          >
            <span></span> Kardex
          </a>

          <a
            href="#auditoria"
            className={vista === "auditoria" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("auditoria");
            }}
          >
            <span></span> Auditoría
          </a>

          <a
            href="#mantenimiento"
            className={vista === "mantenimiento" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("mantenimiento");
            }}
          >
            <span></span> Mantenimiento
          </a>

          <a
            href="#gastos"
            className={vista === "gastos" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("gastos");
            }}
          >
            <span></span> Gastos
          </a>

          <a
            href="#incidencias"
            className={vista === "incidencias" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("incidencias");
            }}
          >
            <span></span> Incidencias
          </a>

          <a
            href="#proveedores"
            className={vista === "proveedores" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("proveedores");
            }}
          >
            <span></span> Proveedores
          </a>

          <a
            href="#garantias"
            className={vista === "garantias" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("garantias");
            }}
          >
            <span></span> Garantías
          </a>

          <a
            href="#configuracionRed"
            className={vista === "configuracionRed" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("configuracionRed");
            }}
          >
            <span></span> Configuración de red
          </a>

          <a
            href="#colaboradores"
            className={vista === "colaboradores" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("colaboradores");
            }}
          >
            <span></span> Colaboradores
          </a>

          <a
            href="#ubicaciones"
            className={vista === "ubicaciones" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("ubicaciones");
            }}
          >
            <span></span> Ubicaciones
          </a>

          <a
            href="#reportes"
            className={vista === "reportes" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("reportes");
            }}
          >
            <span></span> Reportes
          </a>

          <a
            href="#configuracion"
            className={vista === "configuracion" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("configuracion");
            }}
          >
            <span></span> Configuración
          </a>

          <a
            href="#usuarios"
            className={vista === "usuarios" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("usuarios");
            }}
          >
            <span></span> Usuarios
          </a>

          <a
            href="#roles"
            className={vista === "roles" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setVista("roles");
            }}
          >
            <span></span> Administración de roles
          </a>
        </nav>

        <button className="logout-button" onClick={onLogout}>
          <span></span> Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <section className="home-content">
        <header className="home-header">
          <div>
            <p className="breadcrumb">
              SIGET-ZI / {nombresVistas[vista] || "Inicio"}
            </p>

            <h1>{nombresVistas[vista] || "Panel principal"}</h1>

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

        {vista === "inventario" ? (
          <Activos
            equipos={equipos}
            setEquipos={setEquipos}
            categorias={categorias}
            asignacionesSoftware={asignacionesSoftware}
          />
        ) : vista === "componentes" ? (
          <ComponentesActivos
            equipos={equipos}
            componentes={componentes}
            setComponentes={setComponentes}
          />
        ) : vista === "categorias" ? (
          <Categorias
            categorias={categorias}
            setCategorias={setCategorias}
          />
        ) : vista === "asignaciones" ? (
          <Asignaciones
            equipos={equipos}
            setEquipos={setEquipos}
            asignaciones={asignaciones}
            setAsignaciones={setAsignaciones}
            movimientosKardex={movimientosKardex}
            setMovimientosKardex={setMovimientosKardex}
          />
        ) : vista === "softwareLicencias" ? (
          <SoftwareLicencias
            equipos={equipos}
            categorias={categorias}
            asignacionesSoftware={asignacionesSoftware}
            setAsignacionesSoftware={setAsignacionesSoftware}
            setMovimientosKardex={setMovimientosKardex}
          />
        ) : vista === "instalacionesSoftware" ? (
          <InstalacionesSoftware
            equipos={equipos}
            instalaciones={instalacionesSoftware}
            setInstalaciones={setInstalacionesSoftware}
          />
        ) : vista === "kardex" ? (
          <Kardex
            equipos={equipos}
            asignaciones={asignaciones}
            movimientosKardex={movimientosKardex}
            mantenimientos={mantenimientos}
            incidencias={incidencias}
          />
        ) : vista === "auditoria" ? (
          <Auditoria registros={registrosAuditoria} />
        ) : vista === "mantenimiento" ? (
          <Mantenimiento
            equipos={equipos}
            incidencias={incidencias}
            setEquipos={setEquipos}
            mantenimientos={mantenimientos}
            setMantenimientos={setMantenimientos}
            setMovimientosKardex={setMovimientosKardex}
            gastosMantenimiento={gastosMantenimiento}
            setGastosMantenimiento={setGastosMantenimiento}
          />
        ) : vista === "gastos" ? (
          <Gastos
            equipos={equipos}
            gastosMantenimiento={gastosMantenimiento}
            setGastosMantenimiento={setGastosMantenimiento}
            setMovimientosKardex={setMovimientosKardex}
          />
        ) : vista === "incidencias" ? (
          <Incidencias
            equipos={equipos}
            incidencias={incidencias}
            setIncidencias={setIncidencias}
          />
        ) : vista === "proveedores" ? (
          <Proveedores
            proveedores={proveedores}
            setProveedores={setProveedores}
          />
        ) : vista === "garantias" ? (
          <Garantias
            equipos={equipos}
            proveedores={proveedores}
          />
        ) : vista === "configuracionRed" ? (
          <ConfiguracionRed equipos={equipos} />
        ) : vista === "colaboradores" ? (
          <Colaboradores
            colaboradores={colaboradores}
            setColaboradores={setColaboradores}
            departamentos={departamentos}
          />
        ) : vista === "ubicaciones" ? (
          <Ubicaciones
            ubicaciones={ubicaciones}
            setUbicaciones={setUbicaciones}
          />
        ) : vista === "usuarios" ? (
          <Usuarios
            usuarios={usuarios}
            setUsuarios={setUsuarios}
            roles={roles}
            setRoles={setRoles}
          />
        ) : vista === "roles" ? (
          <Roles
            roles={roles}
            setRoles={setRoles}
            usuarios={usuarios}
            setUsuarios={setUsuarios}
          />
        ) : vista === "reportes" ? (
          <Reportes />
        ) : vista === "configuracion" ? (
          <Configuracion />
        ) : (
          <>
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

                <h3>{formatoMoneda.format(totalGastos)}</h3>
                <p>Gastos tecnológicos registrados</p>
              </article>

              <article className="summary-card">
                <div className="card-top">
                  <span className="card-icon">⚠</span>
                  <span className="card-tag">Incidencias</span>
                </div>

                <h3>{incidenciasAbiertas}</h3>
                <p>Incidencias pendientes de atención</p>
              </article>
            </div>

            <div className="dashboard-bottom">
              <section className="dashboard-panel">
                <h2>Actividad reciente</h2>

                <p className="panel-description">
                  Últimos movimientos registrados en el inventario.
                </p>

                {movimientosKardex.length > 0 ? (
                  <div className="activity-list">
                    {movimientosKardex.slice(-5).reverse().map(
                      (movimiento, index) => (
                        <div
                          className="activity-item"
                          key={movimiento.id_movimiento || index}
                        >
                          <span className="activity-icon">▤</span>

                          <div className="activity-info">
                            <strong>
                              {movimiento.tipo_movimiento ||
                                movimiento.tipoMovimiento ||
                                "Movimiento registrado"}
                            </strong>

                            <p>
                              {movimiento.descripcion ||
                                movimiento.motivo ||
                                "Sin descripción disponible"}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="empty-state">
                    <span>▤</span>
                    <p>Aún no hay movimientos registrados.</p>
                  </div>
                )}
              </section>

              <section className="dashboard-panel">
                <h2>Requiere atención</h2>

                <p className="panel-description">
                  Avisos relacionados con los equipos tecnológicos.
                </p>

                {totalAlertas > 0 ? (
                  <div className="attention-list">
                    {incidenciasAbiertas > 0 && (
                      <div className="activity-item">
                        <span className="activity-icon">⚠</span>

                        <div className="activity-info">
                          <strong>Incidencias pendientes</strong>
                          <p>
                            {incidenciasAbiertas} incidencia(s) abierta(s) o
                            en proceso.
                          </p>
                        </div>
                      </div>
                    )}

                    {equiposMantenimiento > 0 && (
                      <div className="activity-item">
                        <span className="activity-icon">⚙</span>

                        <div className="activity-info">
                          <strong>Equipos en mantenimiento</strong>
                          <p>
                            {equiposMantenimiento} equipo(s) en mantenimiento.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-state">
                    <span>✓</span>
                    <p>No hay alertas registradas.</p>
                  </div>
                )}
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
