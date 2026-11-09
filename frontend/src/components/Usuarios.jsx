import { useState } from "react";
import "./Usuarios.css";

function Usuarios({ usuarios = [], setUsuarios }) {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [departamento, setDepartamento] = useState("");

  const registrarUsuario = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !usuario.trim() || !correo.trim()) {
      alert("Completa los campos obligatorios.");
      return;
    }

    const usuarioExiste = usuarios.some(
      (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase()
    );

    if (usuarioExiste) {
      alert("Ese nombre de usuario ya está registrado.");
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: nombre.trim(),
      usuario: usuario.trim(),
      correo: correo.trim(),
      departamento: departamento.trim(),
      rol: "Empleado",
      estado: "Activo",
      permisos: [],
    };

    setUsuarios([...usuarios, nuevoUsuario]);

    setNombre("");
    setUsuario("");
    setCorreo("");
    setDepartamento("");

    alert("Usuario registrado correctamente.");
  };

  return (
    <section className="usuarios-container">
      <h2>Administración de usuarios</h2>
      <p>Registra y consulta las cuentas de los empleados.</p>

      <form onSubmit={registrarUsuario}>
        <h3>Registrar nuevo usuario</h3>

        <label>Nombre completo *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del empleado"
        />

        <label>Nombre de usuario *</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Usuario para iniciar sesión"
        />

        <label>Correo electrónico *</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="correo@empresa.com"
        />

        <label>Departamento</label>
        <input
          type="text"
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
          placeholder="Departamento del empleado"
        />

        <button type="submit">Registrar usuario</button>
      </form>

      <div className="usuarios-lista">
        <h3>Usuarios registrados</h3>

        {usuarios.length === 0 ? (
          <p>Aún no hay usuarios registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Departamento</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.usuario}</td>
                  <td>{u.correo}</td>
                  <td>{u.departamento || "Sin asignar"}</td>
                  <td>{u.rol}</td>
                  <td>{u.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Usuarios;
