
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

const formularioInicial = {
  nombre: "",
  usuario: "",
  correo: "",
  departamento: "",
  rolId: "",
};

function Usuarios({ usuarios = [], setUsuarios, roles = [] }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [busqueda, setBusqueda] = useState("");
  const [permisos, setPermisos] = useState(permisosVacios());

  // Busca el rol usando su identificador.
  const rolSeleccionado = roles.find(
    (rol) => String(rol.id) === String(formulario.rolId)
  );

  // Obtiene los permisos del rol seleccionado.
  const obtenerPermisosRol = (rolId) => {
    const rol = roles.find(
      (item) => String(item.id) === String(rolId)
    );

    return rol?.permisos
      ? Object.fromEntries(
          modulos.map((modulo) => [
            modulo,
            [...(rol.permisos[modulo] || [])],
          ])
        )
      : permisosVacios();
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    if (name === "rolId") {
      setPermisos(obtenerPermisosRol(value));
    }
  };

  const abrirModal = () => {
    const rolPredeterminado =
      roles.find((rol) => rol.nombre === "Empleado") || roles[0];

    setModoEdicion(false);
    setUsuarioEditando(null);

    setFormulario({
      ...formularioInicial,
      rolId: rolPredeterminado ? String(rolPredeterminado.id) : "",
    });

    setPermisos(
      rolPredeterminado
        ? obtenerPermisosRol(rolPredeterminado.id)
        : permisosVacios()
    );

    setModalAbierto(true);
  };

  const abrirEdicion = (usuario) => {
    // Compatibilidad con usuarios anteriores que solo guardaban el nombre.
    const rolActual =
      roles.find(
        (rol) => String(rol.id) === String(usuario.rolId)
      ) ||
      roles.find((rol) => rol.nombre === usuario.rol);

    setModoEdicion(true);
    setUsuarioEditando(usuario.id);

    setFormulario({
      nombre: usuario.nombre || "",
      usuario: usuario.usuario || "",
      correo: usuario.correo || "",
      departamento: usuario.departamento || "",
      rolId: rolActual ? String(rolActual.id) : "",
    });

    setPermisos(
      rolActual
        ? obtenerPermisosRol(rolActual.id)
        : permisosVacios()
    );

    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setUsuarioEditando(null);
    setFormulario(formularioInicial);
    setPermisos(permisosVacios());
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

    if (!rolSeleccionado) {
      alert("Selecciona un rol válido.");
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
      rolId: rolSeleccionado.id,
      // Se conserva el nombre para mostrarlo fácilmente en la tabla.
      rol: rolSeleccionado.nombre,
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

    // Obtiene el nombre actualizado del rol mediante su ID.
    const rolUsuario = roles.find(
      (rol) => String(rol.id) === String(item.rolId)
    );

    const nombreRol = rolUsuario?.nombre || item.rol || "";

    return (
      item.nombre?.toLowerCase().includes(texto) ||
      item.usuario?.toLowerCase().includes(texto) ||
      item.correo?.toLowerCase().includes(texto) ||
      item.departamento?.toLowerCase().includes(texto) ||
      nombreRol.toLowerCase().includes(texto)
    );
  });

  return (
    <section className="usuarios-container">
      <header className="usuarios-encabezado">
        <div>
          <h2>Administración de usuarios</h2>
          <p>Gestiona las cuentas y asigna los roles de SIGET-ZI.</p>
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
                usuariosFiltrados.map((item) => {
                  const rolUsuario = roles.find(
                    (rol) => String(rol.id) === String(item.rolId)
                  );

                  return (
                    <tr key={item.id}>
                      <td>{item.nombre}</td>
                      <td>{item.usuario}</td>
                      <td>{item.correo}</td>
                      <td>{item.departamento || "Sin asignar"}</td>
                      <td>{rolUsuario?.nombre || item.rol || "Sin rol"}</td>
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
                        </button>{" "}
                        <button
                          type="button"
                          className="usuarios-btn-estado"
                          onClick={() => cambiarEstado(item.id)}
                        >
                          {item.estado === "Activo" ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  );
                })
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
                    ? "Modifica los datos de la cuenta."
                    : "Registra una cuenta y asigna un rol."}
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
                    <label htmlFor="usuario-correo">
                      Correo electrónico *
                    </label>
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
                    <label htmlFor="usuario-departamento">
                      Departamento
                    </label>
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
                    name="rolId"
                    value={formulario.rolId}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Selecciona un rol</option>

                    {roles.map((rol) => (
                      <option key={rol.id} value={String(rol.id)}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="usuarios-separador" />

                <h3>Permisos del rol</h3>
                <p className="usuarios-ayuda">
                  Estos permisos son una vista previa. Para modificarlos,
                  ingresa a Administración de roles.
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
                              disabled
                              readOnly
                            />
                            {accion}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {rolSeleccionado?.protegido && (
                  <p className="usuarios-ayuda">
                    El rol Administrador está protegido y no puede modificarse
                    desde esta pantalla.
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
