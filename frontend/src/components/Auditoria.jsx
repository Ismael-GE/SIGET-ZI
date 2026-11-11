import React from "react";
import "./Auditoria.css";
function Auditoria({ registros }) {

  return (
    <div className="auditoria-container">
      <h2>Auditoría</h2>
      <p>Historial de actividades del sistema SIGET-ZI.</p>

      <div className="auditoria-tabla-contenedor">
        <table className="auditoria-tabla">
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Usuario</th>
              <th>Módulo</th>
              <th>Acción</th>
              <th>Tabla afectada</th>
              <th>Registro afectado</th>
              <th>Resultado</th>
            </tr>
          </thead>

          <tbody>
            {registros.length > 0 ? (
              registros.map((registro) => (
                <tr key={registro.id_registro_actividad}>
                  <td>{registro.fecha_hora}</td>
                  <td>{registro.id_usuario}</td>
                  <td>{registro.modulo}</td>
                  <td>{registro.accion}</td>
                  <td>{registro.tabla_afectada}</td>
                  <td>{registro.id_registro_afectado}</td>
                  <td>{registro.resultado}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  No hay registros de actividad disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

}

export default Auditoria;
