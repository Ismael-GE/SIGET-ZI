
import { useState } from "react";
import "./Usuarios.css";

const modulos = [
  "Inventario",
  "Componentes",
  "Categorías",
  "Asignaciones",
  "Software y licencias",
  "Kardex",
  "Mantenimiento",
  "Gastos",
  "Incidencias",
  "Proveedores",
  "Colaboradores",
  "Ubicaciones",
  "Reportes",
  "Configuración",
];

const acciones = ["Consultar", "Registrar", "Editar", "Eliminar"];

const permisosVacios = () =>
  Object.fromEntries(modulos.map((modulo) => [modulo, []]));

const rolesIniciales = [
  {
    nombre: "Administrador",
    permisos: Object.fromEntries(
      modulos.map((modulo) => [modulo, [...acciones]])
    ),
  },
  { nombre: "Supervisor de TI", permisos: permisosVacios() },
  { nombre: "Técnico de soporte", permisos: permisosVacios() },
  { nombre: "Empleado", permisos: permisosVacios() },
  { nombre: "Auditor", permisos: permisosVacios() },
];

const formularioInicial = {
  nombre: "",
  usuario: "",
  correo: "",
  departamento: "",
  rol: "Empleado",
};

function convertirPermisosAObjeto(permisosUsuario = []) {
  const resultado = permisosVacios();

  permisosUsuario.forEach((item) => {
    if (resultado[item.modulo]) {
      resultado[item.modulo] = [...item.acciones];
    }
  });

  return resultado;
}

function convertirPermisosALista(permisos) {
  return Object.entries(permisos)
    .filter(([, lista]) => lista.length > 0)
    .map(([modulo, lista]) => ({
      modulo,
      acciones: [...lista],
    }));
}

function Usuarios({ usuarios = [], setUsuarios }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [formulario, setFormulario] = useState(formularioInicial);
  const [roles, setRoles] = useState(rolesIniciales);
  const [nuevoRol, setNuevoRol] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [permisos, setPermisos] = useState(permisosVacios());

  const rolSeleccionado = roles.find(
    (rol) => rol.nombre === formulario.rol
  );

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    if (name === "rol") {
      const rol = roles.find((item) => item.nombre === value);
      setPermisos(
        rol ? { ...rol.permisos } : permisosVacios()
      );
    }
  };

  const abrirModal = () => {
    setModoEdicion(false);
    setUsuarioEditando(null);
    setFormulario(formularioInicial);

    const rolEmpleado = roles.find(
      (rol) => rol.nombre === "Empleado"
    );

    setPermisos(
      rolEmpleado ? { ...rolEmpleado.permisos } : permisosVacios()
    );

    setNuevoRol("");
    setModalAbierto(true);
  };

  const abrirEdicion = (usuario) => {
    setModoEdicion(true);
    setUsuarioEditando(usuario.id);

    setFormulario({
      nombre: usuario.nombre || "",
      usuario: usuario.usuario || "",
      correo: usuario.correo || "",
      departamento: usuario.departamento || "",
      rol: usuario.rol || "Empleado",
    });

    const rol = roles.find(
      (item) => item.nombre === usuario.rol
    );

    setPermisos(
      rol
        ? { ...rol.permisos }
        : convertirPermisosAObjeto(usuario.permisos)
    );

    setNuevoRol("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setUsuarioEditando(null);
    setFormulario(formularioInicial);
    setPermisos(permisosVacios());
    setNuevoRol("");
  };

  const manejarPermiso = (modulo, accion) => {
    setPermisos((anteriores) => {
      const accionesActuales = anteriores[modulo] || [];

      const nuevasAcciones = accionesActuales.includes(accion)
        ? accionesActuales.filter((item) => item !== accion)
        : [...accionesActuales, accion];

      return {
        ...anteriores,
        [modulo]: nuevasAcciones,
      };
    });
  };

  const crearRol = () => {
    const nombreRol = nuevoRol.trim();

    if (!nombreRol) {
      alert("Escribe el nombre del nuevo rol.");
      return;
    }

    const existe = roles.some(
      (rol) =>
        rol.nombre.toLowerCase() === nombreRol.toLowerCase()
    );

    if (existe) {
      alert("Ese rol ya existe.");
      return;
    }

    setRoles((anteriores) => [
      ...anteriores,
      {
        nombre: nombreRol,
        permisos: permisosVacios(),
      },
    ]);

    setFormulario((anterior) => ({
      ...anterior,
      rol: nombreRol,
    }));

    setPermisos(permisosVacios());
    setNuevoRol("");

    alert("Rol creado. Configura sus permisos.");
  };

  const guardarPermisosRol = () => {
    setRoles((anteriores) =>
      anteriores.map((rol) =>
        rol.nombre === formulario.rol
          ? {
              ...rol,
              permisos: convertirPermisosAObjeto(permisos),
            }
          : rol
      )
    );

    alert(`Permisos del rol "${formulario.rol}" actualizados.`);
  };

  const registrarUsuario = (e) => {
    e.preventDefault();

    if (
      !formulario.nombre.trim() ||
      !formulario.usuario.trim() ||
      !formulario.correo.trim()
    ) {
      alert("Completa los campos obligatorios.");
      return;
    }

    const existe = usuarios.some(
      (item) =>
        item.usuario?.toLowerCase() ===
          formulario.usuario.trim().toLowerCase() &&
        item.id !== usuarioEditando
    );

    if (existe) {
      alert("Ese nombre de usuario ya está registrado.");
      return;
    }

    const datosActualizados = {
      nombre: formulario.nombre.trim(),
      usuario: formulario.usuario.trim(),
      correo: formulario.correo.trim(),
      departamento: formulario.departamento.trim(),
      rol: formulario.rol,
      permisos: convertirPermisosALista(permisos),
    };

    if (modoEdicion) {
      setUsuarios((anteriores) =>
        anteriores.map((item) =>
          item.id === usuarioEditando
            ? { ...item, ...datosActualizados }
            : item
        )
      );

      alert("Usuario actualizado correctamente.");
    } else {
      setUsuarios((anteriores) => [
        ...anteriores,
        {
          id: Date.now(),
          ...datosActualizados,
          estado: "Activo",
        },
      ]);

      alert("Usuario agregado a la sesión actual.");
    }

    cerrarModal();
  };

  const cambiarEstado = (id) => {
    setUsuarios((anteriores) =>
      anteriores.map((item) =>
        item.id === id
          ? {
              ...item,
              estado: item.estado === "Activo" ? "Inactivo" : "Activo",
            }
          : item
      )
    );
  };

  const usuariosFiltrados = usuarios.filter((item) => {
    const texto = busqueda.toLowerCase();

    return (
      item.nombre?.toLowerCase().includes(texto) ||
      item.usuario?.toLowerCase().includes(texto) ||
      item.correo?.toLowerCase().includes(texto) ||
      item.departamento?.toLowerCase().includes(texto)
    );
  });

  return (
    <section className="usuarios-container">
      <header className="usuarios-encabezado">
        <div>
          <h2>Administración de usuarios</h2>
          <p>Gestiona las cuentas, roles y permisos de SIGET-ZI.</p>
        </div>

        <div className="usuarios-total">
          <span>Usuarios registrados</span>
          <strong>{usuarios.length}</strong>
        </div>
      </header>

      <div className="usuarios-barra">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar usuario..."
          aria-label="Buscar usuario"
        />

        <button
          type="button"
          className="usuarios-btn-crear"
          onClick={abrirModal}
        >
          + Crear usuario
        </button>
      </div>

      <div className="usuarios-lista">
        <div className="usuarios-tabla-contenedor">
          <table className="usuarios-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Departamento</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>{item.usuario}</td>
                    <td>{item.correo}</td>
                    <td>{item.departamento || "Sin asignar"}</td>
                    <td>{item.rol}</td>
                    <td>
                      <span
                        className={`usuarios-estado ${
                          item.estado === "Activo" ? "activo" : "inactivo"
                        }`}
                      >
                        {item.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="usuarios-btn-estado"
                        onClick={() => abrirEdicion(item)}
                      >
                        Editar
                      </button>

                      {" "}

                      <button
                        type="button"
                        className="usuarios-btn-estado"
                        onClick={() => cambiarEstado(item.id)}
                      >
                        {item.estado === "Activo" ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="usuarios-vacio">
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAbierto && (
        <div
          className="usuarios-modal-fondo"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) cerrarModal();
          }}
        >
          <section
            className="usuarios-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="usuarios-modal-titulo"
          >
            <header className="usuarios-modal-encabezado">
              <div>
                <h2 id="usuarios-modal-titulo">
                  {modoEdicion ? "Editar usuario" : "Crear usuario"}
                </h2>
                <p>
                  {modoEdicion
                    ? "Modifica los datos y permisos de la cuenta."
                    : "Registra una cuenta y configura sus permisos."}
                </p>
              </div>

              <button
                type="button"
                className="usuarios-modal-cerrar"
                onClick={cerrarModal}
                aria-label="Cerrar ventana"
              >
                ×
              </button>
            </header>

            <form onSubmit={registrarUsuario}>
              <div className="usuarios-modal-contenido">
                <h3>Datos del empleado</h3>

                <div className="usuarios-grid">
                  <div className="usuarios-campo">
                    <label htmlFor="usuario-nombre">Nombre completo *</label>
                    <input
                      id="usuario-nombre"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={manejarCambio}
                      placeholder="Nombre del empleado"
                      required
                    />
                  </div>

                  <div className="usuarios-campo">
                    <label htmlFor="usuario-nombre-cuenta">
                      Nombre de usuario *
                    </label>
                    <input
                      id="usuario-nombre-cuenta"
                      name="usuario"
                      value={formulario.usuario}
                      onChange={manejarCambio}
                      placeholder="Usuario para iniciar sesión"
                      required
                    />
                  </div>

                  <div className="usuarios-campo">
                    <label htmlFor="usuario-correo">Correo electrónico *</label>
                    <input
                      id="usuario-correo"
                      name="correo"
                      type="email"
                      value={formulario.correo}
                      onChange={manejarCambio}
                      placeholder="correo@empresa.com"
                      required
                    />
                  </div>

                  <div className="usuarios-campo">
                    <label htmlFor="usuario-departamento">Departamento</label>
                    <input
                      id="usuario-departamento"
                      name="departamento"
                      value={formulario.departamento}
                      onChange={manejarCambio}
                      placeholder="Departamento"
                    />
                  </div>
                </div>

                <div className="usuarios-separador" />

                <h3>Rol del usuario</h3>

                <div className="usuarios-campo">
                  <label htmlFor="usuario-rol">Seleccionar rol</label>
                  <select
                    id="usuario-rol"
                    name="rol"
                    value={formulario.rol}
                    onChange={manejarCambio}
                  >
                    {roles.map((rol) => (
                      <option key={rol.nombre} value={rol.nombre}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="usuarios-crear-rol">
                  <label htmlFor="usuario-nuevo-rol">
                    Crear un rol personalizado
                  </label>

                  <div className="usuarios-crear-rol-campos">
                    <input
                      id="usuario-nuevo-rol"
                      value={nuevoRol}
                      onChange={(e) => setNuevoRol(e.target.value)}
                      placeholder="Ej. Responsable de inventario"
                    />

                    <button type="button" onClick={crearRol}>
                      Agregar rol
                    </button>
                  </div>
                </div>

                <div className="usuarios-separador" />

                <h3>Permisos por módulo</h3>
                <p className="usuarios-ayuda">
                  Configura los permisos que tendrá el rol seleccionado.
                </p>

                <div className="usuarios-permisos">
                  {modulos.map((modulo) => (
                    <div className="usuarios-permiso-fila" key={modulo}>
                      <strong>{modulo}</strong>

                      <div className="usuarios-permiso-acciones">
                        {acciones.map((accion) => (
                          <label key={accion}>
                            <input
                              type="checkbox"
                              checked={
                                permisos[modulo]?.includes(accion) || false
                              }
                              onChange={() => manejarPermiso(modulo, accion)}
                            />
                            {accion}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="usuarios-btn-guardar"
                  onClick={guardarPermisosRol}
                >
                  Guardar permisos del rol
                </button>

                {rolSeleccionado && (
                  <p className="usuarios-ayuda">
                    Rol seleccionado: <strong>{rolSeleccionado.nombre}</strong>
                  </p>
                )}
              </div>

              <footer className="usuarios-modal-pie">
                <button
                  type="button"
                  className="usuarios-btn-cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button type="submit" className="usuarios-btn-guardar">
                  {modoEdicion ? "Guardar cambios" : "Crear usuario"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

export default Usuarios;
