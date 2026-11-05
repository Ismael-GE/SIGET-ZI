
import { useState } from "react";
import "./Incidencias.css";

function Incidencias({
  equipos = [],
  incidencias = [],
  setIncidencias,
}) {
  // Estado del formulario
  const [formulario, setFormulario] = useState({
    id_activo: "",
    titulo: "",
    descripcion: "",
    prioridad: "Media",
    observaciones: "",
  });

  // Iniciar la atención de una incidencia
  const iniciarAtencion = (idIncidencia) => {
    const incidenciaActual = incidencias.find(
      (incidencia) => incidencia.id_incidencia === idIncidencia
    );

    if (
      !incidenciaActual ||
      incidenciaActual.estado_incidencia !== "Abierta"
    ) {
      alert("Esta incidencia no está disponible para iniciar atención.");
      return;
    }

    setIncidencias((anteriores) =>
      anteriores.map((incidencia) =>
        incidencia.id_incidencia === idIncidencia
          ? {
              ...incidencia,
              estado_incidencia: "En proceso",
            }
          : incidencia
      )
    );

    alert("La atención de la incidencia ha comenzado.");
  };

  // Actualizar la solución
  const actualizarSolucion = (idIncidencia, nuevaSolucion) => {
    setIncidencias((anteriores) =>
      anteriores.map((incidencia) => {
        if (incidencia.id_incidencia !== idIncidencia) {
          return incidencia;
        }

        if (
          incidencia.estado_incidencia === "Cerrada" ||
          incidencia.estado_incidencia === "Cancelada"
        ) {
          return incidencia;
        }

        return {
          ...incidencia,
          solucion: nuevaSolucion,
        };
      })
    );
  };

  // Cerrar una incidencia
  const cerrarIncidencia = (idIncidencia) => {
    const incidenciaActual = incidencias.find(
      (incidencia) => incidencia.id_incidencia === idIncidencia
    );

    if (
      !incidenciaActual ||
      incidenciaActual.estado_incidencia !== "En proceso"
    ) {
      alert("Solo puedes cerrar incidencias que estén en proceso.");
      return;
    }

    if (!incidenciaActual.solucion?.trim()) {
      alert("Debes registrar la solución antes de cerrar la incidencia.");
      return;
    }

    const confirmar = window.confirm(
      "¿Estás seguro de que deseas cerrar esta incidencia?"
    );

    if (!confirmar) return;

    setIncidencias((anteriores) =>
      anteriores.map((incidencia) =>
        incidencia.id_incidencia === idIncidencia
          ? {
              ...incidencia,
              estado_incidencia: "Cerrada",
              fecha_cierre:
                incidencia.fecha_cierre || new Date().toISOString(),
            }
          : incidencia
      )
    );

    alert("La incidencia se cerró correctamente.");
  };

  // Registrar una nueva incidencia
  const registrarIncidencia = (e) => {
    e.preventDefault();

    if (
      !formulario.id_activo ||
      !formulario.titulo.trim() ||
      !formulario.descripcion.trim()
    ) {
      alert("Completa el equipo, título y descripción de la incidencia.");
      return;
    }

    const equipoSeleccionado = equipos.find(
      (equipo) => equipo.id === Number(formulario.id_activo)
    );

    if (!equipoSeleccionado) {
      alert("No se encontró el equipo seleccionado.");
      return;
    }

    const nuevaIncidencia = {
      id_incidencia: Date.now(),
      id_activo: equipoSeleccionado.id,
      id_colaborador_reporta: null,
      id_usuario_registro: null,
      titulo: formulario.titulo.trim(),
      descripcion: formulario.descripcion.trim(),
      prioridad: formulario.prioridad,
      estado_incidencia: "Abierta",
      fecha_reporte: new Date().toISOString(),
      fecha_cierre: null,
      solucion: "",
      observaciones: formulario.observaciones.trim(),
    };

    setIncidencias((anteriores) => [
      ...anteriores,
      nuevaIncidencia,
    ]);

    setFormulario({
      id_activo: "",
      titulo: "",
      descripcion: "",
      prioridad: "Media",
      observaciones: "",
    });

    alert("Incidencia registrada correctamente.");
  };

  return (
    <section className="incidencias-container">
      <h2>Control de incidencias</h2>

      <p>
        Registro y seguimiento de fallas de los equipos tecnológicos.
      </p>

      {/* Resumen de incidencias */}
      <div className="incidencias-resumen">
        <article>
          <h3>{incidencias.length}</h3>
          <p>Total de incidencias</p>
        </article>

        <article>
          <h3>
            {
              incidencias.filter(
                (incidencia) =>
                  incidencia.estado_incidencia === "Abierta"
              ).length
            }
          </h3>
          <p>Incidencias abiertas</p>
        </article>

        <article>
          <h3>
            {
              incidencias.filter(
                (incidencia) =>
                  incidencia.estado_incidencia === "En proceso"
              ).length
            }
          </h3>
          <p>En proceso</p>
        </article>

        <article>
          <h3>
            {
              incidencias.filter(
                (incidencia) =>
                  incidencia.estado_incidencia === "Cerrada"
              ).length
            }
          </h3>
          <p>Incidencias cerradas</p>
        </article>
      </div>

      {/* Formulario de registro */}
      <form
        className="incidencias-formulario"
        onSubmit={registrarIncidencia}
      >
        <h3>Registrar nueva incidencia</h3>

        <div className="form-group">
          <label>Equipo relacionado</label>

          <select
            value={formulario.id_activo}
            onChange={(e) =>
              setFormulario({
                ...formulario,
                id_activo: e.target.value,
              })
            }
          >
            <option value="">Selecciona un equipo</option>

            {equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.numero_inventario} - {equipo.marca}{" "}
                {equipo.modelo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Título de la incidencia</label>

          <input
            type="text"
            value={formulario.titulo}
            placeholder="Ej. Equipo no enciende"
            onChange={(e) =>
              setFormulario({
                ...formulario,
                titulo: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Descripción de la falla</label>

          <textarea
            value={formulario.descripcion}
            placeholder="Describe detalladamente el problema..."
            onChange={(e) =>
              setFormulario({
                ...formulario,
                descripcion: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Prioridad</label>

          <select
            value={formulario.prioridad}
            onChange={(e) =>
              setFormulario({
                ...formulario,
                prioridad: e.target.value,
              })
            }
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
            <option value="Crítica">Crítica</option>
          </select>
        </div>

        <div className="form-group">
          <label>Observaciones</label>

          <textarea
            value={formulario.observaciones}
            placeholder="Información adicional..."
            onChange={(e) =>
              setFormulario({
                ...formulario,
                observaciones: e.target.value,
              })
            }
          />
        </div>

        <button type="submit">
          Registrar incidencia
        </button>
      </form>

      {/* Tabla de incidencias */}
      <div className="incidencias-tabla-contenedor">
        <h3>Incidencias registradas</h3>

        {incidencias.length === 0 ? (
          <p className="incidencias-vacio">
            No hay incidencias registradas.
          </p>
        ) : (
          <div className="tabla-scroll">
            <table className="incidencias-tabla">
              <thead>
                <tr>
                  <th>Equipo</th>
                  <th>Título</th>
                  <th>Prioridad</th>
                  <th>Fecha de reporte</th>
                  <th>Estado</th>
                  <th>Solución</th>
                  <th>Fecha de cierre</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {incidencias.map((incidencia) => {
                  const equipo = equipos.find(
                    (elemento) =>
                      elemento.id === incidencia.id_activo
                  );

                  return (
                    <tr key={incidencia.id_incidencia}>
                      <td>
                        {equipo
                          ? equipo.numero_inventario
                          : "Equipo no encontrado"}
                      </td>

                      <td>{incidencia.titulo}</td>

                      <td>{incidencia.prioridad}</td>

                      <td>
                        {new Date(
                          incidencia.fecha_reporte
                        ).toLocaleDateString("es-MX")}
                      </td>

                      <td>
                        <span
                          className={`estado-incidencia ${incidencia.estado_incidencia
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {incidencia.estado_incidencia}
                        </span>
                      </td>

                      <td>
                        <textarea
                          value={incidencia.solucion || ""}
                          placeholder="Describe la solución..."
                          disabled={
                            incidencia.estado_incidencia === "Cerrada" ||
                            incidencia.estado_incidencia === "Cancelada"
                          }
                          onChange={(e) =>
                            actualizarSolucion(
                              incidencia.id_incidencia,
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        {incidencia.fecha_cierre
                          ? new Date(
                              incidencia.fecha_cierre
                            ).toLocaleDateString("es-MX")
                          : "Pendiente"}
                      </td>

                      <td>
                        {incidencia.estado_incidencia === "Abierta" && (
                          <button
                            type="button"
                            onClick={() =>
                              iniciarAtencion(incidencia.id_incidencia)
                            }
                          >
                            Iniciar atención
                          </button>
                        )}

                        {incidencia.estado_incidencia === "En proceso" && (
                          <button
                            type="button"
                            onClick={() =>
                              cerrarIncidencia(incidencia.id_incidencia)
                            }
                          >
                            Cerrar incidencia
                          </button>
                        )}

                        {(incidencia.estado_incidencia === "Cerrada" ||
                          incidencia.estado_incidencia === "Cancelada") && (
                          <span>Sin acciones disponibles</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Incidencias;
