
import { useState } from "react";
import "./Reportes.css";

function Reportes() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [resultados, setResultados] = useState([]);
  const [consultaRealizada, setConsultaRealizada] = useState(false);

  const [filtrosEspecificos, setFiltrosEspecificos] = useState({
    categoria: "",
    marca: "",
    modelo: "",
    colaborador: "",
    departamento: "",
    tipoMantenimiento: "",
    prioridad: "",
    tipoGasto: "",
    software: "",
    tipoLicencia: "",
  });

  // Datos temporales para probar los reportes.
  const datosPrueba = {
    1: [
      { id: 1, categoria: "Computadoras", marca: "Dell", modelo: "Latitude 5420", estado: "Activo" },
      { id: 2, categoria: "Impresoras", marca: "Zebra", modelo: "ZD421", estado: "Activo" },
      { id: 3, categoria: "Monitores", marca: "HP", modelo: "P24h", estado: "Inactivo" },
    ],
    2: [
      { id: 1, colaborador: "Juan Pérez", departamento: "TI", equipo: "Dell Latitude 5420", estado: "Activo" },
      { id: 2, colaborador: "María López", departamento: "Administración", equipo: "HP ProBook", estado: "Activo" },
    ],
    3: [
      { id: 1, tipoMantenimiento: "Preventivo", equipo: "Dell Latitude 5420", fecha: "2026-10-15", estado: "Completado" },
      { id: 2, tipoMantenimiento: "Correctivo", equipo: "Zebra ZD421", fecha: "2026-10-20", estado: "Pendiente" },
    ],
    4: [
      { id: 1, prioridad: "Alta", descripcion: "Equipo sin conexión", estado: "Pendiente" },
      { id: 2, prioridad: "Media", descripcion: "Problema de impresión", estado: "Completado" },
    ],
    5: [
      { id: 1, tipoGasto: "Mantenimiento", descripcion: "Servicio de equipo", fecha: "2026-10-15", estado: "Completado" },
      { id: 2, tipoGasto: "Refacciones", descripcion: "Repuesto de impresora", fecha: "2026-10-20", estado: "Pendiente" },
    ],
    6: [
      { id: 1, software: "Microsoft Office", tipoLicencia: "Comercial", estado: "Activo" },
      { id: 2, software: "Adobe Acrobat", tipoLicencia: "Suscripcion", estado: "Activo" },
    ],
  };

  const tiposReportes = [
    {
      id: 1,
      titulo: "Inventario de activos",
      descripcion: "Consulta los equipos tecnológicos registrados.",
      etiqueta: "Inventario",
    },
    {
      id: 2,
      titulo: "Asignaciones",
      descripcion: "Consulta los equipos asignados a colaboradores.",
      etiqueta: "Asignaciones",
    },
    {
      id: 3,
      titulo: "Mantenimientos",
      descripcion: "Consulta el historial de mantenimientos realizados.",
      etiqueta: "Mantenimiento",
    },
    {
      id: 4,
      titulo: "Incidencias",
      descripcion: "Consulta las incidencias registradas y su estado.",
      etiqueta: "Incidencias",
    },
    {
      id: 5,
      titulo: "Gastos tecnológicos",
      descripcion: "Consulta los gastos relacionados con los equipos.",
      etiqueta: "Finanzas",
    },
    {
      id: 6,
      titulo: "Software y licencias",
      descripcion: "Consulta las asignaciones de software y licencias.",
      etiqueta: "Software",
    },
  ];

  const indicadores = [
    { id: 1, titulo: "Tipos de reportes", valor: tiposReportes.length },
    { id: 2, titulo: "Consultas realizadas", valor: 0 },
    { id: 3, titulo: "Reportes disponibles", valor: tiposReportes.length },
  ];

  // Actualiza un filtro sin modificar los demás.
  const actualizarFiltro = (campo, valor) => {
    setFiltrosEspecificos((filtrosActuales) => ({
      ...filtrosActuales,
      [campo]: valor,
    }));
  };

  // Limpia los filtros y los resultados.
  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    setFiltroEstado("");

    setFiltrosEspecificos({
      categoria: "",
      marca: "",
      modelo: "",
      colaborador: "",
      departamento: "",
      tipoMantenimiento: "",
      prioridad: "",
      tipoGasto: "",
      software: "",
      tipoLicencia: "",
    });

    setResultados([]);
    setConsultaRealizada(false);
  };

  // Obtiene los filtros correspondientes a cada reporte.
  const obtenerFiltrosEspecificos = () => {
    switch (reporteSeleccionado) {
      case 1:
        return (
          <>
            <div className="reporte-filtro">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                value={filtrosEspecificos.categoria}
                onChange={(e) => actualizarFiltro("categoria", e.target.value)}
              >
                <option value="">Todas las categorías</option>
                <option value="Computadoras">Computadoras</option>
                <option value="Impresoras">Impresoras</option>
                <option value="Monitores">Monitores</option>
                <option value="Redes">Equipos de red</option>
              </select>
            </div>

            <div className="reporte-filtro">
              <label htmlFor="marca">Marca</label>
              <input
                id="marca"
                type="text"
                placeholder="Escribe la marca"
                value={filtrosEspecificos.marca}
                onChange={(e) => actualizarFiltro("marca", e.target.value)}
              />
            </div>

            <div className="reporte-filtro">
              <label htmlFor="modelo">Modelo</label>
              <input
                id="modelo"
                type="text"
                placeholder="Escribe el modelo"
                value={filtrosEspecificos.modelo}
                onChange={(e) => actualizarFiltro("modelo", e.target.value)}
              />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="reporte-filtro">
              <label htmlFor="colaborador">Colaborador</label>
              <input
                id="colaborador"
                type="text"
                placeholder="Nombre del colaborador"
                value={filtrosEspecificos.colaborador}
                onChange={(e) => actualizarFiltro("colaborador", e.target.value)}
              />
            </div>

            <div className="reporte-filtro">
              <label htmlFor="departamento">Departamento</label>
              <input
                id="departamento"
                type="text"
                placeholder="Nombre del departamento"
                value={filtrosEspecificos.departamento}
                onChange={(e) => actualizarFiltro("departamento", e.target.value)}
              />
            </div>
          </>
        );

      case 3:
        return (
          <div className="reporte-filtro">
            <label htmlFor="tipoMantenimiento">Tipo de mantenimiento</label>
            <select
              id="tipoMantenimiento"
              value={filtrosEspecificos.tipoMantenimiento}
              onChange={(e) => actualizarFiltro("tipoMantenimiento", e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
            </select>
          </div>
        );

      case 4:
        return (
          <div className="reporte-filtro">
            <label htmlFor="prioridad">Prioridad</label>
            <select
              id="prioridad"
              value={filtrosEspecificos.prioridad}
              onChange={(e) => actualizarFiltro("prioridad", e.target.value)}
            >
              <option value="">Todas las prioridades</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Critica">Crítica</option>
            </select>
          </div>
        );

      case 5:
        return (
          <div className="reporte-filtro">
            <label htmlFor="tipoGasto">Tipo de gasto</label>
            <select
              id="tipoGasto"
              value={filtrosEspecificos.tipoGasto}
              onChange={(e) => actualizarFiltro("tipoGasto", e.target.value)}
            >
              <option value="">Todos los gastos</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Refacciones">Refacciones</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Licencias">Licencias</option>
            </select>
          </div>
        );

      case 6:
        return (
          <>
            <div className="reporte-filtro">
              <label htmlFor="software">Software</label>
              <input
                id="software"
                type="text"
                placeholder="Nombre del software"
                value={filtrosEspecificos.software}
                onChange={(e) => actualizarFiltro("software", e.target.value)}
              />
            </div>

            <div className="reporte-filtro">
              <label htmlFor="tipoLicencia">Tipo de licencia</label>
              <select
                id="tipoLicencia"
                value={filtrosEspecificos.tipoLicencia}
                onChange={(e) => actualizarFiltro("tipoLicencia", e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="Comercial">Comercial</option>
                <option value="Gratuita">Gratuita</option>
                <option value="Suscripcion">Suscripción</option>
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // Ejecuta la consulta del reporte seleccionado.
  const consultarReporte = () => {
    const datos = datosPrueba[reporteSeleccionado] || [];

    const resultadosFiltrados = datos.filter((registro) => {
      const coincideEstado =
        !filtroEstado || registro.estado === filtroEstado;

      const coincideFechaInicio =
        !fechaInicio || !registro.fecha || registro.fecha >= fechaInicio;

      const coincideFechaFin =
        !fechaFin || !registro.fecha || registro.fecha <= fechaFin;

      const coincideFiltrosEspecificos = Object.entries(
        filtrosEspecificos
      ).every(([campo, valor]) => {
        if (!valor) return true;

        const valorRegistro = registro[campo];

        if (!valorRegistro) return false;

        return String(valorRegistro)
          .toLowerCase()
          .includes(valor.toLowerCase());
      });

      return (
        coincideEstado &&
        coincideFechaInicio &&
        coincideFechaFin &&
        coincideFiltrosEspecificos
      );
    });

    setResultados(resultadosFiltrados);
    setConsultaRealizada(true);
  };

  return (
    <section className="reportes-container">
      <div className="section-heading">
        <div>
          <h2>Reportes del sistema</h2>
          <p>
            Consulta y genera reportes de la gestión de los equipos tecnológicos.
          </p>
        </div>
      </div>

      <div className="reportes-indicadores">
        {indicadores.map((indicador) => (
          <article className="reporte-indicador" key={indicador.id}>
            <p>{indicador.titulo}</p>
            <h3>{indicador.valor}</h3>
          </article>
        ))}
      </div>

      <div className="reportes-catalogo-heading">
        <h3>Catálogo de reportes</h3>
        <p>Selecciona el tipo de información que deseas consultar.</p>
      </div>

      <div className="reportes-grid">
        {tiposReportes.map((reporte) => (
          <article
            className={`reporte-card ${
              reporteSeleccionado === reporte.id
                ? "reporte-card-seleccionado"
                : ""
            }`}
            key={reporte.id}
            onClick={() => {
              setReporteSeleccionado(reporte.id);
              limpiarFiltros();
            }}
          >
            <span className="reporte-etiqueta">{reporte.etiqueta}</span>
            <h3>{reporte.titulo}</h3>
            <p>{reporte.descripcion}</p>
          </article>
        ))}
      </div>

      {reporteSeleccionado !== null && (
        <div className="reporte-seleccion">
          <h3>Reporte seleccionado</h3>
          <p>
            Has seleccionado:{" "}
            <strong>
              {
                tiposReportes.find(
                  (reporte) => reporte.id === reporteSeleccionado
                )?.titulo
              }
            </strong>
          </p>
        </div>
      )}

      <div className="reportes-consulta">
        <div className="reportes-consulta-heading">
          <h3>Área de consulta</h3>
          <p>Selecciona un reporte para configurar sus filtros.</p>
        </div>

        {reporteSeleccionado === null ? (
          <div className="reportes-consulta-vacia">
            <p>Aún no has seleccionado ningún reporte.</p>
          </div>
        ) : (
          <div className="reportes-consulta-contenido">
            <p>Configuración de consulta:</p>

            <div className="reportes-filtros">
              <div className="reporte-filtro">
                <label htmlFor="fechaInicio">Fecha inicial</label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="reporte-filtro">
                <label htmlFor="fechaFin">Fecha final</label>
                <input
                  type="date"
                  id="fechaFin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>

              <div className="reporte-filtro">
                <label htmlFor="filtroEstado">Estado</label>
                <select
                  id="filtroEstado"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>

              {obtenerFiltrosEspecificos()}
            </div>

            <div className="reportes-filtros-acciones">
              <button type="button" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            </div>

            <div className="reportes-acciones">
              <button
                type="button"
                className="reporte-btn-consultar"
                onClick={consultarReporte}
              >
                Consultar reporte
              </button>

              <button
                type="button"
                className="reporte-btn-secundario"
                disabled
              >
                Imprimir
              </button>

              <button
                type="button"
                className="reporte-btn-secundario"
                disabled
              >
                Exportar
              </button>
            </div>

            {consultaRealizada && (
              <div className="reportes-resultados">
                <h3>Resultados de la consulta</h3>

                {resultados.length === 0 ? (
                  <p>No se encontraron registros con los filtros seleccionados.</p>
                ) : (
                  <>
                    <p>
                      Registros encontrados: <strong>{resultados.length}</strong>
                    </p>

                    <div className="reportes-tabla-contenedor">
                      <table className="reportes-tabla">
                        <thead>
                          <tr>
                            {Object.keys(resultados[0]).map((campo) => (
                              <th key={campo}>
                                {campo.charAt(0).toUpperCase() + campo.slice(1)}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {resultados.map((registro) => (
                            <tr key={registro.id}>
                              {Object.keys(resultados[0]).map((campo) => (
                                <td key={campo}>{registro[campo]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Reportes;
