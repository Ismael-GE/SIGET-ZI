
import { useState } from "react";
import "./Roles.css";

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

const crearPermisosVacios = () =>
  Object.fromEntries(modulos.map((modulo) => [modulo, []]));

function Roles({ roles = [], setRoles, usuarios = [], setUsuarios }) {
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [permisos, setPermisos] = useState(crearPermisosVacios());
  const [busqueda, setBusqueda] = useState("");

  const rolActual = roles.find((rol) => rol.id === rolSeleccionado);
  const esProtegido = rolActual?.protegido === true;

  const limpiarFormulario = () => {
    setRolSeleccionado(null);
    setNombre("");
    setDescripcion("");
    setPermisos(crearPermisosVacios());
  };

  const seleccionarRol = (rol) => {
    setRolSeleccionado(rol.id);
    setNombre(rol.nombre);
    setDescripcion(rol.descripcion || "");

    setPermisos(
      Object.fromEntries(
        modulos.map((modulo) => [
          modulo,
          [...(rol.permisos?.[modulo] || [])],
        ])
      )
    );
  };

  const cambiarPermiso = (modulo, accion) => {
    if (esProtegido) return;

    setPermisos((anteriores) => {
      const actuales = anteriores[modulo] || [];

      const nuevasAcciones = actuales.includes(accion)
        ? actuales.filter((item) => item !== accion)
        : [...actuales, accion];

      return {
        ...anteriores,
        [modulo]: nuevasAcciones,
      };
    });
  };

  const crearRol = (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("Escribe el nombre del rol.");
      return;
    }

    const existe = roles.some(
      (rol) =>
        rol.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (existe) {
      alert("Ya existe un rol con ese nombre.");
      return;
    }

    const nuevo = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      permisos: Object.fromEntries(
        modulos.map((modulo) => [
          modulo,
          [...(permisos[modulo] || [])],
        ])
      ),
      protegido: false,
    };

    setRoles((anteriores) => [...anteriores, nuevo]);

    limpiarFormulario();
    alert("Rol creado correctamente.");
  };

const guardarCambios = (e) => {
  e.preventDefault();

  if (!nombre.trim()) {
    alert("El nombre del rol es obligatorio.");
    return;
  }

  const rolAEditar = roles.find(
    (rol) => String(rol.id) === String(rolSeleccionado)
  );

  if (!rolAEditar) {
    alert("No se encontró el rol seleccionado.");
    return;
  }

  const existe = roles.some(
    (rol) =>
      String(rol.id) !== String(rolSeleccionado) &&
      rol.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );

  if (existe) {
    alert("Ya existe otro rol con ese nombre.");
    return;
  }

  const nuevoNombre = rolAEditar.protegido
    ? rolAEditar.nombre
    : nombre.trim();

  const nuevosPermisos = rolAEditar.protegido
    ? rolAEditar.permisos
    : Object.fromEntries(
        modulos.map((modulo) => [
          modulo,
          [...(permisos[modulo] || [])],
        ])
      );

  setRoles((anteriores) =>
    anteriores.map((rol) =>
      String(rol.id) === String(rolSeleccionado)
        ? {
            ...rol,
            nombre: nuevoNombre,
            descripcion: descripcion.trim(),
            permisos: nuevosPermisos,
          }
        : rol
    )
  );

  setUsuarios((anteriores) =>
    anteriores.map((usuario) =>
      String(usuario.rolId) === String(rolSeleccionado)
        ? { ...usuario, rol: nuevoNombre }
        : usuario
    )
  );

  limpiarFormulario();
  alert("Cambios del rol guardados correctamente.");
};

const eliminarRol = (rol) => {
  if (rol.protegido) {
    alert("No se puede eliminar el rol Administrador.");
    return;
  }

  const usuariosAsignados = usuarios.filter(
    (usuario) => String(usuario.rolId) === String(rol.id)
  );

  if (usuariosAsignados.length > 0) {
    alert(
      `No se puede eliminar este rol porque tiene ${usuariosAsignados.length} usuario(s) asignado(s).`
    );
    return;
  }

  const confirmar = window.confirm(
    `¿Estás seguro de eliminar el rol "${rol.nombre}"?`
  );

  if (!confirmar) return;

  setRoles((anteriores) =>
    anteriores.filter((item) => String(item.id) !== String(rol.id))
  );

  if (String(rolSeleccionado) === String(rol.id)) {
    limpiarFormulario();
  }

  alert("Rol eliminado correctamente.");
};

  const rolesFiltrados = roles.filter((rol) =>
    rol.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section className="roles-container">
      <header className="roles-encabezado">
        <div>
          <h2>Administración de roles y permisos</h2>
          <p>
            Define los perfiles de acceso y las acciones permitidas
            en cada módulo de SIGET-ZI.
          </p>
        </div>

        <div className="roles-total">
          <span>Roles registrados</span>
          <strong>{roles.length}</strong>
        </div>
      </header>

      <div className="roles-contenido">
        {/* LISTADO DE ROLES */}
        <aside className="roles-listado">
          <div className="roles-listado-encabezado">
            <h3>Roles existentes</h3>

            <button type="button" onClick={limpiarFormulario}>
              + Nuevo
            </button>
          </div>

          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar rol..."
            aria-label="Buscar rol"
          />

          <div className="roles-lista">
           
{rolesFiltrados.map((rol) => (
  <div
    key={rol.id}
    className={`roles-elemento ${
      rolSeleccionado === rol.id ? "seleccionado" : ""
    }`}
  >
    <button
      type="button"
      className="roles-elemento-info"
      onClick={() => seleccionarRol(rol)}
    >
      <strong>{rol.nombre}</strong>

      <span>
        {rol.protegido ? "Rol protegido" : "Rol configurable"}
      </span>
    </button>

    {!rol.protegido && (
      <button
        type="button"
        className="roles-btn-eliminar"
        onClick={() => eliminarRol(rol)}
      >
        Eliminar
      </button>
    )}
  </div>
))}
 

            {rolesFiltrados.length === 0 && (
              <p className="roles-vacio">
                No se encontraron roles.
              </p>
            )}
          </div>
        </aside>

        {/* FORMULARIO DE ROLES */}
        <div className="roles-editor">
          <form onSubmit={rolSeleccionado ? guardarCambios : crearRol}>
            <div className="roles-editor-encabezado">
              <div>
                <h3>
                  {rolSeleccionado
                    ? "Editar configuración del rol"
                    : "Crear nuevo rol"}
                </h3>

                <p>
                  Configura la información y los permisos del perfil.
                </p>
              </div>
            </div>

            <div className="roles-campos">
              <div className="roles-campo">
                <label htmlFor="rol-nombre">
                  Nombre del rol *
                </label>

                <input
                  id="rol-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Responsable de inventario"
                  disabled={esProtegido}
                  required
                />
              </div>

              <div className="roles-campo">
                <label htmlFor="rol-descripcion">
                  Descripción
                </label>

                <textarea
                  id="rol-descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe las responsabilidades de este rol."
                  rows="2"
                />
              </div>
            </div>

            {esProtegido && (
              <p className="roles-vacio">
                El rol Administrador está protegido. Sus permisos no
                pueden modificarse desde esta pantalla.
              </p>
            )}

            <div className="roles-permisos-encabezado">
              <h3>Permisos por módulo</h3>
              <span>{modulos.length} módulos disponibles</span>
            </div>

            <div className="roles-permisos-lista">
              {modulos.map((modulo) => (
                <div className="roles-permiso-fila" key={modulo}>
                  <strong>{modulo}</strong>

                  <div className="roles-acciones">
                    {acciones.map((accion) => (
                      <label key={accion}>
                        <input
                          type="checkbox"
                          checked={
                            permisos[modulo]?.includes(accion) || false
                          }
                          onChange={() => cambiarPermiso(modulo, accion)}
                          disabled={esProtegido}
                        />

                        {accion}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="roles-botones">
              <button
                type="button"
                className="roles-btn-cancelar"
                onClick={limpiarFormulario}
              >
                Limpiar
              </button>

              <button
                type="submit"
                className="roles-btn-guardar"
                disabled={esProtegido}
              >
                {rolSeleccionado ? "Guardar cambios" : "Crear rol"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Roles;
