
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

function Roles({ roles, setRoles }) {
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
    setDescripcion(rol.descripcion);

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
      id: Date.now(),
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

    const existe = roles.some(
      (rol) =>
        rol.id !== rolSeleccionado &&
        rol.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (existe) {
      alert("Ya existe otro rol con ese nombre.");
      return;
    }

    setRoles((anteriores) =>
      anteriores.map((rol) =>
        rol.id === rolSeleccionado
          ? {
              ...rol,
              nombre: rol.protegido ? rol.nombre : nombre.trim(),
              descripcion: descripcion.trim(),
              permisos: rol.protegido
                ? rol.permisos
                : Object.fromEntries(
                    modulos.map((modulo) => [
                      modulo,
                      [...(permisos[modulo] || [])],
                    ])
                  ),
            }
          : rol
      )
    );

    limpiarFormulario();
    alert("Cambios del rol guardados.");
  };

  const rolesFiltrados = roles.filter((rol) =>
    rol.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section className="roles-container">
      <header className="roles-encabezado">
        <div>
          <h2>Administración de roles</h2>
          <p>Define los roles y los permisos disponibles en SIGET-ZI.</p>
        </div>

        <div className="roles-total">
          <span>Roles registrados</span>
          <strong>{roles.length}</strong>
        </div>
      </header>

      <div className="roles-contenido">
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
          />

          <div className="roles-lista">
            {rolesFiltrados.map((rol) => (
              <button
                type="button"
                key={rol.id}
                className={`roles-elemento ${
                  rolSeleccionado === rol.id ? "seleccionado" : ""
                }`}
                onClick={() => seleccionarRol(rol)}
              >
                <strong>{rol.nombre}</strong>
                <span>
                  {rol.protegido ? "Rol protegido" : "Rol configurable"}
                </span>
              </button>
            ))}

            {rolesFiltrados.length === 0 && (
              <p className="roles-vacio">No se encontraron roles.</p>
            )}
          </div>
        </aside>

        <div className="roles-editor">
          <form onSubmit={rolSeleccionado ? guardarCambios : crearRol}>
            <div className="roles-editor-encabezado">
              <div>
                <h3>
                  {rolSeleccionado ? "Configurar rol" : "Crear nuevo rol"}
                </h3>
                <p>Selecciona los permisos que tendrá este rol.</p>
              </div>
            </div>

            <div className="roles-campos">
              <div className="roles-campo">
                <label htmlFor="rol-nombre">Nombre del rol *</label>
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
                <label htmlFor="rol-descripcion">Descripción</label>
                <textarea
                  id="rol-descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe las responsabilidades de este rol."
                  rows="2"
                />
              </div>
            </div>

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

              <button type="submit" className="roles-btn-guardar">
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