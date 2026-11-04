
import { useState } from "react";
import "./Categorias.css";
function Categorias({ categorias, setCategorias }) {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [mensaje, setMensaje] = useState("");

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormulario = (categoria = null) => {
    setCategoriaActual(categoria);
    setNombreCategoria(categoria ? categoria.categoria : "");
    setMensaje("");
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setCategoriaActual(null);
    setNombreCategoria("");
    setMensaje("");
  };

  const guardarCategoria = (e) => {
    e.preventDefault();

    const nombreLimpio = nombreCategoria.trim();

    if (!nombreLimpio) {
      setMensaje("Escribe el nombre de la categoría.");
      return;
    }

    const duplicada = categorias.some(
      (categoria) =>
        categoria.categoria.toLowerCase() === nombreLimpio.toLowerCase() &&
        categoria.id_tipo_activo !== categoriaActual?.id_tipo_activo
    );

    if (duplicada) {
      setMensaje("Ya existe una categoría con ese nombre.");
      return;
    }

    if (categoriaActual) {
      setCategorias((actuales) =>
        actuales.map((categoria) =>
          categoria.id_tipo_activo === categoriaActual.id_tipo_activo
            ? { ...categoria, categoria: nombreLimpio }
            : categoria
        )
      );
    } else {
      const nuevoId =
        categorias.length > 0
          ? Math.max(...categorias.map((categoria) => categoria.id_tipo_activo)) + 1
          : 1;

      setCategorias((actuales) => [
        ...actuales,
        {
          id_tipo_activo: nuevoId,
          categoria: nombreLimpio,
          habilitado: true,
        },
      ]);
    }

    cerrarFormulario();
  };

  const cambiarEstado = (id) => {
    setCategorias((actuales) =>
      actuales.map((categoria) =>
        categoria.id_tipo_activo === id
          ? { ...categoria, habilitado: !categoria.habilitado }
          : categoria
      )
    );
  };

  return (
    <section className="categorias-page">
      <div className="categorias-encabezado">
        <div>
          <h2>Catálogo de categorías</h2>
          <p>Administra los tipos de activos tecnológicos del sistema.</p>
        </div>

        <button
          className="btn-nueva-categoria"
          onClick={() => abrirFormulario()}
        >
          + Nueva categoría
        </button>
      </div>

      <div className="categorias-resumen">
        <div className="categoria-indicador">
          <span>Total de categorías</span>
          <strong>{categorias.length}</strong>
        </div>

        <div className="categoria-indicador">
          <span>Habilitadas</span>
          <strong>
            {categorias.filter((categoria) => categoria.habilitado).length}
          </strong>
        </div>

        <div className="categoria-indicador">
          <span>Deshabilitadas</span>
          <strong>
            {categorias.filter((categoria) => !categoria.habilitado).length}
          </strong>
        </div>
      </div>

      <div className="categorias-tabla-contenedor">
        <div className="categorias-busqueda">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="categorias-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de la categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((categoria) => (
                <tr key={categoria.id_tipo_activo}>
                  <td>{categoria.id_tipo_activo}</td>
                  <td>{categoria.categoria}</td>
                  <td>
                    <span
                      className={
                        categoria.habilitado
                          ? "estado-categoria habilitada"
                          : "estado-categoria deshabilitada"
                      }
                    >
                      {categoria.habilitado ? "Habilitada" : "Deshabilitada"}
                    </span>
                  </td>
                  <td className="acciones-categoria">
                    <button
                      onClick={() => abrirFormulario(categoria)}
                      className="btn-editar-categoria"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => cambiarEstado(categoria.id_tipo_activo)}
                      className="btn-estado-categoria"
                    >
                      {categoria.habilitado ? "Deshabilitar" : "Habilitar"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="sin-categorias">
                  No se encontraron categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarFormulario && (
        <div className="categorias-modal-fondo">
          <div className="categorias-modal">
            <h2>
              {categoriaActual ? "Editar categoría" : "Nueva categoría"}
            </h2>

            <form onSubmit={guardarCategoria}>
              <label htmlFor="nombreCategoria">
                Nombre de la categoría
              </label>

              <input
                id="nombreCategoria"
                type="text"
                value={nombreCategoria}
                onChange={(e) => {
                  setNombreCategoria(e.target.value);
                  setMensaje("");
                }}
                placeholder="Ej. Tablets"
                autoFocus
              />

              {mensaje && <p className="mensaje-categoria">{mensaje}</p>}

              <div className="categorias-modal-acciones">
                <button type="button" onClick={cerrarFormulario}>
                  Cancelar
                </button>

                <button type="submit">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Categorias;
