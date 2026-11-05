
import { useState } from "react";
import "./Activos.css";

const formularioInicial = {
  numero_inventario: "",
  id_tipo_activo: "",
  id_estado_activo: "",
  id_proveedor_adquisicion: "",
  numero_serie: "",
  marca: "",
  modelo: "",

  // Computadoras y dispositivos móviles
  sistema_operativo: "",
  procesador: "",
  memoria_ram: "",
  almacenamiento: "",
  direccion_ip: "",
  direccion_mac: "",

  // Monitores
  tamano_pantalla: "",
  resolucion: "",

  // Escáneres
  resolucion_escaneo: "",
  velocidad_escaneo: "",
  tipo_conexion: "",
  alimentador_automatico: "",
  escaneo_duplex: "",

  // Impresoras
  consumible: "",
  tipo_impresion: "",
  color: "",

  // Dispositivos móviles
  imei: "",
  numero_telefonico: "",
  conectividad_movil: "",

  // Equipos de red
  tipo_dispositivo_red: "",
  numero_puertos: "",
  velocidad_puertos: "",
  tipo_conexion_red: "",
  estandar_wifi: "",
  firmware: "",

  // Software y licenciamiento
  tipo_software: "",
  nombre_software: "",
  fabricante_software: "",
  version_software: "",
  tipo_licencia: "",
  clave_licencia: "",
  cantidad_licencias: "",
  licencias_asignadas: "",
  fecha_activacion: "",
  fecha_vencimiento: "",
  estado_licencia: "",

  // Adquisición
  fecha_adquisicion: "",
  costo_adquisicion: "",
  moneda: "MXN",
  numero_factura: "",
  numero_orden_compra: "",

  // Baja
  fecha_baja: "",
  motivo_baja: "",
  observaciones: "",

  // Ubicación
  id_sede: "",
  id_departamento: "",
  id_ubicacion: "",
};

function Activos({ equipos = [], setEquipos, categorias = [] }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("error");
  const [activoEditando, setActivoEditando] = useState(null);
  const [activoDetalle, setActivoDetalle] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [siguienteNumero, setSiguienteNumero] = useState(1);

  // Generar número de inventario automáticamente.
  const generarNumeroInventario = () => {
    const numerosExistentes = equipos.map((activo) => {
      const coincidencia = activo.numero_inventario?.match(/^ZI-(\d+)$/i);
      return coincidencia ? Number(coincidencia[1]) : 0;
    });

    const numeroMayor = Math.max(0, ...numerosExistentes);
    const numero = Math.max(siguienteNumero, numeroMayor + 1);

    return {
      numero: `ZI-${String(numero).padStart(4, "0")}`,
      siguiente: numero + 1,
    };
  };

  // Mostrar avisos.
  const mostrarMensaje = (texto, tipo = "error") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setMostrarAviso(true);
  };

  // Abrir formulario.
  const abrirFormulario = () => {
    const generado = generarNumeroInventario();

    setFormulario({
      ...formularioInicial,
      numero_inventario: generado.numero,
    });

    setActivoEditando(null);
    setMostrarModal(true);
  };

  // Cerrar formulario.
  const cerrarFormulario = () => {
    setMostrarModal(false);
    setFormulario({ ...formularioInicial });
    setActivoEditando(null);
  };

  // Capturar cambios del formulario.
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    // Si cambia el tipo de activo, limpiar características técnicas.
    if (name === "id_tipo_activo") {
      setFormulario((anterior) => ({
        ...anterior,
        id_tipo_activo: value,

        // Computadoras
        sistema_operativo: "",
        procesador: "",
        memoria_ram: "",
        almacenamiento: "",
        direccion_ip: "",
        direccion_mac: "",

        // Monitores
        tamano_pantalla: "",
        resolucion: "",

        // Escáneres
        resolucion_escaneo: "",
        velocidad_escaneo: "",
        tipo_conexion: "",
        alimentador_automatico: "",
        escaneo_duplex: "",

        // Impresoras
        consumible: "",
        tipo_impresion: "",
        color: "",

        // Dispositivos móviles
        imei: "",
        numero_telefonico: "",
        conectividad_movil: "",

        // Equipos de red
        tipo_dispositivo_red: "",
        numero_puertos: "",
        velocidad_puertos: "",
        tipo_conexion_red: "",
        estandar_wifi: "",
        firmware: "",

        // Software y licenciamiento
        tipo_software: "",
        nombre_software: "",
        fabricante_software: "",
        version_software: "",
        tipo_licencia: "",
        clave_licencia: "",
        cantidad_licencias: "",
        licencias_asignadas: "",
        fecha_activacion: "",
        fecha_vencimiento: "",
        estado_licencia: "",
      }));

      return;
    }

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // Obtener el nombre de una categoría.
  const obtenerNombreCategoria = (activo) => {
    const categoria = categorias.find(
      (item) =>
        String(item.id_tipo_activo) === String(activo.id_tipo_activo)
    );

    return categoria?.categoria || activo.tipo_activo || "Sin categoría";
  };

  // Identificar la categoría seleccionada.
  const categoriaSeleccionada = categorias.find(
    (categoria) =>
      String(categoria.id_tipo_activo) ===
      String(formulario.id_tipo_activo)
  );

  const nombreCategoriaSeleccionada =
    categoriaSeleccionada?.categoria?.toLowerCase() || "";

  const nombreCategoriaNormalizado =
    nombreCategoriaSeleccionada.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Identificar computadoras.
  const esComputadora =
    nombreCategoriaNormalizado.includes("computadora") ||
    nombreCategoriaNormalizado.includes("computo") ||
    nombreCategoriaNormalizado.includes("laptop");

  // Identificar impresoras.
  const esImpresora =
    nombreCategoriaNormalizado.includes("impresora");

  // Identificar monitores.
  const esMonitor =
    nombreCategoriaNormalizado.includes("monitor");

  // Identificar escáneres.
  const esEscaner =
    nombreCategoriaNormalizado.includes("escaner");

  // Identificar dispositivos móviles.
  const esDispositivoMovil =
    nombreCategoriaNormalizado.includes("movil") ||
    nombreCategoriaNormalizado.includes("celular") ||
    nombreCategoriaNormalizado.includes("smartphone") ||
    nombreCategoriaNormalizado.includes("tablet");

  // Identificar equipos de red.
  const esEquipoRed =
    nombreCategoriaNormalizado.includes("red") ||
    nombreCategoriaNormalizado.includes("network");

  // Identificar software y licenciamiento.
  const esSoftware =
    nombreCategoriaNormalizado.includes("software") ||
    nombreCategoriaNormalizado.includes("licencia");

  // Registrar o actualizar activo.
  const guardarActivo = (e) => {
    e.preventDefault();

    if (
      !formulario.id_tipo_activo ||
      !formulario.id_estado_activo ||
      !formulario.marca.trim() ||
      !formulario.modelo.trim()
    ) {
      mostrarMensaje(
        "Completa los campos obligatorios: tipo, estado, marca y modelo."
      );
      return;
    }

    // Validar número de inventario duplicado.
    const inventarioDuplicado = equipos.some(
      (activo) =>
        activo.numero_inventario?.toLowerCase() ===
          formulario.numero_inventario.trim().toLowerCase() &&
        activo.id !== activoEditando
    );

    if (inventarioDuplicado) {
      mostrarMensaje("Ese número de inventario ya está registrado.");
      return;
    }

    // Validar número de serie duplicado.
    if (formulario.numero_serie.trim()) {
      const serieDuplicada = equipos.some(
        (activo) =>
          activo.numero_serie &&
          activo.numero_serie.trim().toLowerCase() ===
            formulario.numero_serie.trim().toLowerCase() &&
          activo.id !== activoEditando
      );

      if (serieDuplicada) {
        mostrarMensaje("Ese número de serie ya está registrado.");
        return;
      }
    }

    // Validar costo.
    if (
      formulario.costo_adquisicion !== "" &&
      (!Number.isFinite(Number(formulario.costo_adquisicion)) ||
        Number(formulario.costo_adquisicion) < 0)
    ) {
      mostrarMensaje("El costo debe ser válido y no puede ser negativo.");
      return;
    }

    // Validar cantidades de licencias.
    const cantidadLicencias = Number(formulario.cantidad_licencias);
    const licenciasAsignadas = Number(formulario.licencias_asignadas);

    if (
      formulario.cantidad_licencias !== "" &&
      (!Number.isInteger(cantidadLicencias) || cantidadLicencias < 0)
    ) {
      mostrarMensaje("La cantidad de licencias debe ser un número entero válido.");
      return;
    }

    if (
      formulario.licencias_asignadas !== "" &&
      (!Number.isInteger(licenciasAsignadas) || licenciasAsignadas < 0)
    ) {
      mostrarMensaje("Las licencias asignadas deben ser un número entero válido.");
      return;
    }

    if (
      formulario.cantidad_licencias !== "" &&
      formulario.licencias_asignadas !== "" &&
      licenciasAsignadas > cantidadLicencias
    ) {
      mostrarMensaje(
        "Las licencias asignadas no pueden superar la cantidad disponible."
      );
      return;
    }

    // Buscar categoría seleccionada.
    const categoriaActual = categorias.find(
      (categoria) =>
        String(categoria.id_tipo_activo) ===
        String(formulario.id_tipo_activo)
    );

    if (!categoriaActual || !categoriaActual.habilitado) {
      mostrarMensaje("Selecciona una categoría habilitada.");
      return;
    }

    // Preparar información del activo.
    const datosActivo = {
      ...formulario,
      id_tipo_activo: Number(formulario.id_tipo_activo),
      numero_inventario: formulario.numero_inventario.trim(),
      numero_serie: formulario.numero_serie.trim(),
      marca: formulario.marca.trim(),
      modelo: formulario.modelo.trim(),
      costo_adquisicion:
        formulario.costo_adquisicion === ""
          ? ""
          : Number(formulario.costo_adquisicion),
      tipo_activo: categoriaActual.categoria,
      estado_activo: formulario.id_estado_activo,
    };

    if (activoEditando !== null) {
      // Actualizar registro existente.
      setEquipos((anteriores) =>
        anteriores.map((activo) =>
          activo.id === activoEditando
            ? { ...activo, ...datosActivo }
            : activo
        )
      );

      setMostrarModal(false);
      setFormulario({ ...formularioInicial });
      setActivoEditando(null);

      mostrarMensaje("El activo se actualizó correctamente.", "exito");
    } else {
      // Registrar nuevo activo.
      const nuevoActivo = {
        ...datosActivo,
        id: Date.now(),
      };

      setEquipos((anteriores) => [...anteriores, nuevoActivo]);

      const numeroUsado = Number(
        datosActivo.numero_inventario.replace("ZI-", "")
      );

      setSiguienteNumero((anterior) =>
        Math.max(anterior, numeroUsado + 1)
      );

      setMostrarModal(false);
      setFormulario({ ...formularioInicial });

      mostrarMensaje("El activo se registró correctamente.", "exito");
    }
  };

  // Editar activo.
  const editarActivo = (activo) => {
    setFormulario({
      ...formularioInicial,
      ...activo,
      id_tipo_activo: String(activo.id_tipo_activo ?? ""),
      id_estado_activo: String(activo.id_estado_activo ?? ""),
      costo_adquisicion:
        activo.costo_adquisicion === ""
          ? ""
          : String(activo.costo_adquisicion),
    });

    setActivoEditando(activo.id);
    setMostrarModal(true);
  };

  // Eliminar activo.
  const eliminarActivo = (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este activo?"
    );

    if (!confirmar) return;

    setEquipos((anteriores) =>
      anteriores.filter((activo) => activo.id !== id)
    );

    setActivoDetalle(null);
    mostrarMensaje("El activo se eliminó correctamente.", "exito");
  };

  // Buscar activos.
  const activosFiltrados = equipos.filter((activo) => {
    const texto = busqueda.toLowerCase();

    return (
      (activo.numero_inventario || "").toLowerCase().includes(texto) ||
      (activo.numero_serie || "").toLowerCase().includes(texto) ||
      (activo.marca || "").toLowerCase().includes(texto) ||
      (activo.modelo || "").toLowerCase().includes(texto)
    );
  });

  return (
    <div className="activos-container">
      {/* ENCABEZADO */}
      <div className="activos-header">
        <div>
          <h1>Inventario de activos</h1>
          <p>Administra y consulta los activos tecnológicos.</p>
        </div>

        <button
          type="button"
          className="btn-registrar"
          onClick={abrirFormulario}
        >
          + Registrar activo
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="activos-filtros">
        <input
          type="text"
          placeholder="Buscar por inventario, serie, marca o modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <div className="activos-tabla-contenedor">
        <table className="activos-tabla">
          <thead>
            <tr>
              <th>Número de inventario</th>
              <th>Tipo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Número de serie</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {activosFiltrados.length > 0 ? (
              activosFiltrados.map((activo) => (
                <tr key={activo.id}>
                  <td>{activo.numero_inventario}</td>
                  <td>{obtenerNombreCategoria(activo)}</td>
                  <td>{activo.marca}</td>
                  <td>{activo.modelo}</td>
                  <td>{activo.numero_serie || "—"}</td>
                  <td>{activo.estado_activo}</td>

                  <td className="acciones-activo">
                    <button
                      type="button"
                      onClick={() => setActivoDetalle(activo)}
                    >
                      Ver
                    </button>

                    <button
                      type="button"
                      onClick={() => editarActivo(activo)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarActivo(activo.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="tabla-vacia">
                  {busqueda
                    ? "No se encontraron activos."
                    : "Todavía no hay activos registrados."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FORMULARIO */}
      {mostrarModal && (
        <div className="modal-fondo">
          <div className="modal-activo">
            <div className="modal-encabezado">
              <h2>
                {activoEditando !== null
                  ? "Editar activo"
                  : "Registrar nuevo activo"}
              </h2>

              <button
                type="button"
                className="btn-cerrar-modal"
                onClick={cerrarFormulario}
              >
                X
              </button>
            </div>

            <form onSubmit={guardarActivo}>
              {/* INFORMACIÓN GENERAL */}
              <div className="formulario-seccion">
                <h3>Información general</h3>

                <div className="formulario-grid">
                  <div className="campo-formulario">
                    <label>Número de inventario</label>
                    <input
                      type="text"
                      name="numero_inventario"
                      value={formulario.numero_inventario}
                      readOnly
                      className="numero-automatico"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Tipo de activo *</label>
                    <select
                      name="id_tipo_activo"
                      value={formulario.id_tipo_activo}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="">Selecciona un tipo</option>

                      {categorias
                        .filter((categoria) => categoria.habilitado)
                        .map((categoria) => (
                          <option
                            key={categoria.id_tipo_activo}
                            value={categoria.id_tipo_activo}
                          >
                            {categoria.categoria}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="campo-formulario">
                    <label>Estado del activo *</label>
                    <select
                      name="id_estado_activo"
                      value={formulario.id_estado_activo}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="">Selecciona un estado</option>
                      <option value="Activo">Activo</option>
                      <option value="Disponible">Disponible</option>
                      <option value="Asignado">Asignado</option>
                      <option value="En mantenimiento">En mantenimiento</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>

                  <div className="campo-formulario">
                    <label>Proveedor de adquisición</label>
                    <input
                      type="text"
                      name="id_proveedor_adquisicion"
                      value={formulario.id_proveedor_adquisicion}
                      onChange={manejarCambio}
                      placeholder="Nombre del proveedor"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Número de serie</label>
                    <input
                      type="text"
                      name="numero_serie"
                      value={formulario.numero_serie}
                      onChange={manejarCambio}
                      placeholder="Número de serie"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Marca *</label>
                    <input
                      type="text"
                      name="marca"
                      value={formulario.marca}
                      onChange={manejarCambio}
                      placeholder="Ej. Lenovo"
                      required
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Modelo *</label>
                    <input
                      type="text"
                      name="modelo"
                      value={formulario.modelo}
                      onChange={manejarCambio}
                      placeholder="Ej. ThinkPad E14"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* UBICACIÓN DEL ACTIVO */}
              <div className="formulario-seccion">
                <h3>Ubicación del activo</h3>

                <div className="formulario-grid">
                  <div className="campo-formulario">
                    <label>Sede</label>
                    <input
                      type="text"
                      name="id_sede"
                      value={formulario.id_sede}
                      onChange={manejarCambio}
                      placeholder="Ej. Corporativo"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Departamento</label>
                    <input
                      type="text"
                      name="id_departamento"
                      value={formulario.id_departamento}
                      onChange={manejarCambio}
                      placeholder="Ej. Tecnologías de la Información"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Ubicación específica</label>
                    <input
                      type="text"
                      name="id_ubicacion"
                      value={formulario.id_ubicacion}
                      onChange={manejarCambio}
                      placeholder="Ej. Oficina de soporte técnico"
                    />
                  </div>
                </div>
              </div>

              {/* COMPUTADORAS Y LAPTOPS */}
              {esComputadora && (
                <div className="formulario-seccion">
                  <h3>Características técnicas del equipo</h3>

                  <div className="formulario-grid">
                    <div className="campo-formulario">
                      <label>Sistema operativo</label>
                      <input
                        type="text"
                        name="sistema_operativo"
                        value={formulario.sistema_operativo}
                        onChange={manejarCambio}
                        placeholder="Ej. Windows 11 Pro"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Procesador</label>
                      <input
                        type="text"
                        name="procesador"
                        value={formulario.procesador}
                        onChange={manejarCambio}
                        placeholder="Ej. Intel Core i5"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Memoria RAM</label>
                      <input
                        type="text"
                        name="memoria_ram"
                        value={formulario.memoria_ram}
                        onChange={manejarCambio}
                        placeholder="Ej. 16 GB"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Almacenamiento</label>
                      <input
                        type="text"
                        name="almacenamiento"
                        value={formulario.almacenamiento}
                        onChange={manejarCambio}
                        placeholder="Ej. SSD 512 GB"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Dirección IP</label>
                      <input
                        type="text"
                        name="direccion_ip"
                        value={formulario.direccion_ip}
                        onChange={manejarCambio}
                        placeholder="Ej. 192.168.1.100"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Dirección MAC</label>
                      <input
                        type="text"
                        name="direccion_mac"
                        value={formulario.direccion_mac}
                        onChange={manejarCambio}
                        placeholder="Dirección MAC del equipo"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* IMPRESORAS */}
              {esImpresora && (
                <div className="formulario-seccion">
                  <h3>Características de la impresora</h3>

                  <div className="formulario-grid">
                    <div className="campo-formulario">
                      <label>Dirección IP</label>
                      <input
                        type="text"
                        name="direccion_ip"
                        value={formulario.direccion_ip}
                        onChange={manejarCambio}
                        placeholder="Ej. 192.168.1.100"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Consumible</label>
                      <input
                        type="text"
                        name="consumible"
                        value={formulario.consumible}
                        onChange={manejarCambio}
                        placeholder="Ej. Tóner HP 58A"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Tipo de impresión</label>
                      <select
                        name="tipo_impresion"
                        value={formulario.tipo_impresion}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Láser">Láser</option>
                        <option value="Inyección de tinta">Inyección de tinta</option>
                        <option value="Térmica">Térmica</option>
                        <option value="Matriz de puntos">Matriz de puntos</option>
                      </select>
                    </div>

                    <div className="campo-formulario">
                      <label>Color de impresión</label>
                      <select
                        name="color"
                        value={formulario.color}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Color">Color</option>
                        <option value="Blanco y negro">Blanco y negro</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* MONITORES */}
              {esMonitor && (
                <div className="formulario-seccion">
                  <h3>Características del monitor</h3>

                  <div className="formulario-grid">
                    <div className="campo-formulario">
                      <label>Tamaño de pantalla</label>
                      <input
                        type="text"
                        name="tamano_pantalla"
                        value={formulario.tamano_pantalla}
                        onChange={manejarCambio}
                        placeholder="Ej. 24 pulgadas"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Resolución</label>
                      <input
                        type="text"
                        name="resolucion"
                        value={formulario.resolucion}
                        onChange={manejarCambio}
                        placeholder="Ej. 1920 x 1080"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ESCÁNERES */}
              {esEscaner && (
                <div className="formulario-seccion">
                  <h3>Características del escáner</h3>

                  <div className="formulario-grid">
                    <div className="campo-formulario">
                      <label>Resolución de escaneo</label>
                      <input
                        type="text"
                        name="resolucion_escaneo"
                        value={formulario.resolucion_escaneo}
                        onChange={manejarCambio}
                        placeholder="Ej. 600 x 600 dpi"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Velocidad de escaneo</label>
                      <input
                        type="text"
                        name="velocidad_escaneo"
                        value={formulario.velocidad_escaneo}
                        onChange={manejarCambio}
                        placeholder="Ej. 30 páginas por minuto"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Tipo de conexión</label>
                      <select
                        name="tipo_conexion"
                        value={formulario.tipo_conexion}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="USB">USB</option>
                        <option value="Ethernet">Ethernet</option>
                        <option value="Wi-Fi">Wi-Fi</option>
                        <option value="USB y Wi-Fi">USB y Wi-Fi</option>
                      </select>
                    </div>

                    <div className="campo-formulario">
                      <label>Alimentador automático (ADF)</label>
                      <select
                        name="alimentador_automatico"
                        value={formulario.alimentador_automatico}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="campo-formulario">
                      <label>Escaneo dúplex (doble cara)</label>
                      <select
                        name="escaneo_duplex"
                        value={formulario.escaneo_duplex}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* DISPOSITIVOS MÓVILES */}
              {esDispositivoMovil && (
                <div className="formulario-seccion">
                  <h3>Características del dispositivo móvil</h3>

                  <div className="formulario-grid">
                    <div className="campo-formulario">
                      <label>Sistema operativo</label>
                      <input
                        type="text"
                        name="sistema_operativo"
                        value={formulario.sistema_operativo}
                        onChange={manejarCambio}
                        placeholder="Ej. Android 15 o iOS 18"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Memoria RAM</label>
                      <input
                        type="text"
                        name="memoria_ram"
                        value={formulario.memoria_ram}
                        onChange={manejarCambio}
                        placeholder="Ej. 8 GB"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Almacenamiento</label>
                      <input
                        type="text"
                        name="almacenamiento"
                        value={formulario.almacenamiento}
                        onChange={manejarCambio}
                        placeholder="Ej. 128 GB"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>IMEI</label>
                      <input
                        type="text"
                        name="imei"
                        value={formulario.imei}
                        onChange={manejarCambio}
                        placeholder="Número IMEI del dispositivo"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Número telefónico</label>
                      <input
                        type="tel"
                        name="numero_telefonico"
                        value={formulario.numero_telefonico}
                        onChange={manejarCambio}
                        placeholder="Número de la línea asignada"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Conectividad móvil</label>
                      <select
                        name="conectividad_movil"
                        value={formulario.conectividad_movil}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Wi-Fi">Wi-Fi</option>
                        <option value="4G">4G</option>
                        <option value="5G">5G</option>
                        <option value="Wi-Fi y 4G">Wi-Fi y 4G</option>
                        <option value="Wi-Fi y 5G">Wi-Fi y 5G</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* EQUIPOS DE RED */}
              {esEquipoRed && (
                <div className="formulario-seccion">
                  <h3>Características técnicas del equipo de red</h3>

                  <div className="formulario-grid">
                    <div className="campo-formulario">
                      <label>Tipo de dispositivo</label>
                      <select
                        name="tipo_dispositivo_red"
                        value={formulario.tipo_dispositivo_red}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Switch">Switch</option>
                        <option value="Router">Router</option>
                        <option value="Access Point">Access Point</option>
                        <option value="Firewall">Firewall</option>
                        <option value="Convertidor de medios">Convertidor de medios</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div className="campo-formulario">
                      <label>Dirección IP</label>
                      <input
                        type="text"
                        name="direccion_ip"
                        value={formulario.direccion_ip}
                        onChange={manejarCambio}
                        placeholder="Ej. 192.168.1.10"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Dirección MAC</label>
                      <input
                        type="text"
                        name="direccion_mac"
                        value={formulario.direccion_mac}
                        onChange={manejarCambio}
                        placeholder="Ej. 00:1A:2B:3C:4D:5E"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Número de puertos</label>
                      <input
                        type="number"
                        name="numero_puertos"
                        value={formulario.numero_puertos}
                        onChange={manejarCambio}
                        min="0"
                        placeholder="Ej. 24"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Velocidad de puertos</label>
                      <input
                        type="text"
                        name="velocidad_puertos"
                        value={formulario.velocidad_puertos}
                        onChange={manejarCambio}
                        placeholder="Ej. 1 Gbps"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Tipo de conexión</label>
                      <select
                        name="tipo_conexion_red"
                        value={formulario.tipo_conexion_red}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Ethernet">Ethernet</option>
                        <option value="Fibra óptica">Fibra óptica</option>
                        <option value="Inalámbrica">Inalámbrica</option>
                        <option value="Ethernet y fibra óptica">Ethernet y fibra óptica</option>
                      </select>
                    </div>

                    <div className="campo-formulario">
                      <label>Estándar Wi-Fi</label>
                      <select
                        name="estandar_wifi"
                        value={formulario.estandar_wifi}
                        onChange={manejarCambio}
                      >
                        <option value="">No aplica / Selecciona</option>
                        <option value="Wi-Fi 4">Wi-Fi 4</option>
                        <option value="Wi-Fi 5">Wi-Fi 5</option>
                        <option value="Wi-Fi 6">Wi-Fi 6</option>
                        <option value="Wi-Fi 6E">Wi-Fi 6E</option>
                        <option value="Wi-Fi 7">Wi-Fi 7</option>
                      </select>
                    </div>

                    <div className="campo-formulario">
                      <label>Firmware</label>
                      <input
                        type="text"
                        name="firmware"
                        value={formulario.firmware}
                        onChange={manejarCambio}
                        placeholder="Ej. Versión 2.1.0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SOFTWARE Y LICENCIAMIENTO */}
              {esSoftware && (
                <div className="formulario-seccion">
                  <h3>Información de software y licenciamiento</h3>

                  <div className="formulario-grid">
                    <div className="campo-formulario">
                      <label>Tipo de software</label>
                      <select
                        name="tipo_software"
                        value={formulario.tipo_software}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Sistema operativo">Sistema operativo</option>
                        <option value="Ofimática">Ofimática</option>
                        <option value="Antivirus">Antivirus</option>
                        <option value="Aplicación empresarial">Aplicación empresarial</option>
                        <option value="Diseño y edición">Diseño y edición</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div className="campo-formulario">
                      <label>Nombre del software</label>
                      <input
                        type="text"
                        name="nombre_software"
                        value={formulario.nombre_software}
                        onChange={manejarCambio}
                        placeholder="Ej. Microsoft Office 2021"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Fabricante</label>
                      <input
                        type="text"
                        name="fabricante_software"
                        value={formulario.fabricante_software}
                        onChange={manejarCambio}
                        placeholder="Ej. Microsoft"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Versión</label>
                      <input
                        type="text"
                        name="version_software"
                        value={formulario.version_software}
                        onChange={manejarCambio}
                        placeholder="Ej. Office 2021"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Tipo de licencia</label>
                      <select
                        name="tipo_licencia"
                        value={formulario.tipo_licencia}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Perpetua">Perpetua</option>
                        <option value="Suscripción">Suscripción</option>
                        <option value="OEM">OEM</option>
                        <option value="Por volumen">Por volumen</option>
                        <option value="Gratuita">Gratuita</option>
                        <option value="Prueba">Prueba</option>
                      </select>
                    </div>

                    <div className="campo-formulario">
                      <label>Clave de licencia</label>
                      <input
                        type="text"
                        name="clave_licencia"
                        value={formulario.clave_licencia}
                        onChange={manejarCambio}
                        placeholder="Clave o identificador de licencia"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Cantidad de licencias</label>
                      <input
                        type="number"
                        name="cantidad_licencias"
                        value={formulario.cantidad_licencias}
                        onChange={manejarCambio}
                        min="0"
                        step="1"
                        placeholder="Ej. 25"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Licencias asignadas</label>
                      <input
                        type="number"
                        name="licencias_asignadas"
                        value={formulario.licencias_asignadas}
                        onChange={manejarCambio}
                        min="0"
                        step="1"
                        placeholder="Ej. 18"
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Fecha de activación</label>
                      <input
                        type="date"
                        name="fecha_activacion"
                        value={formulario.fecha_activacion}
                        onChange={manejarCambio}
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Fecha de vencimiento</label>
                      <input
                        type="date"
                        name="fecha_vencimiento"
                        value={formulario.fecha_vencimiento}
                        onChange={manejarCambio}
                      />
                    </div>

                    <div className="campo-formulario">
                      <label>Estado de la licencia</label>
                      <select
                        name="estado_licencia"
                        value={formulario.estado_licencia}
                        onChange={manejarCambio}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Activa">Activa</option>
                        <option value="Por vencer">Por vencer</option>
                        <option value="Vencida">Vencida</option>
                        <option value="Suspendida">Suspendida</option>
                        <option value="Sin activar">Sin activar</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* INFORMACIÓN DE ADQUISICIÓN */}
              <div className="formulario-seccion">
                <h3>Información de adquisición</h3>

                <div className="formulario-grid">
                  <div className="campo-formulario">
                    <label>Fecha de adquisición</label>
                    <input
                      type="date"
                      name="fecha_adquisicion"
                      value={formulario.fecha_adquisicion}
                      onChange={manejarCambio}
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Costo de adquisición</label>
                    <input
                      type="number"
                      name="costo_adquisicion"
                      value={formulario.costo_adquisicion}
                      onChange={manejarCambio}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Moneda</label>
                    <select
                      name="moneda"
                      value={formulario.moneda}
                      onChange={manejarCambio}
                    >
                      <option value="MXN">MXN</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>

                  <div className="campo-formulario">
                    <label>Número de factura</label>
                    <input
                      type="text"
                      name="numero_factura"
                      value={formulario.numero_factura}
                      onChange={manejarCambio}
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Número de orden de compra</label>
                    <input
                      type="text"
                      name="numero_orden_compra"
                      value={formulario.numero_orden_compra}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>
              </div>

              {/* INFORMACIÓN DE BAJA */}
              <div className="formulario-seccion">
                <h3>Información de baja</h3>

                <div className="formulario-grid">
                  <div className="campo-formulario">
                    <label>Fecha de baja</label>
                    <input
                      type="date"
                      name="fecha_baja"
                      value={formulario.fecha_baja}
                      onChange={manejarCambio}
                    />
                  </div>

                  <div className="campo-formulario">
                    <label>Motivo de baja</label>
                    <input
                      type="text"
                      name="motivo_baja"
                      value={formulario.motivo_baja}
                      onChange={manejarCambio}
                    />
                  </div>

                  <div className="campo-formulario campo-completo">
                    <label>Observaciones</label>
                    <textarea
                      name="observaciones"
                      value={formulario.observaciones}
                      onChange={manejarCambio}
                      rows="3"
                      placeholder="Información adicional del activo..."
                    />
                  </div>
                </div>
              </div>

              {/* BOTONES */}
              <div className="modal-acciones">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarFormulario}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-guardar">
                  {activoEditando !== null
                    ? "Guardar cambios"
                    : "Guardar activo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETALLE DEL ACTIVO */}
      {activoDetalle && (
        <div
          className="modal-fondo"
          onClick={() => setActivoDetalle(null)}
        >
          <div
            className="modal-activo"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-encabezado">
              <h2>Detalle del activo</h2>

              <button
                type="button"
                className="btn-cerrar-modal"
                onClick={() => setActivoDetalle(null)}
              >
                ×
              </button>
            </div>

            {/* INFORMACIÓN GENERAL */}
            <div className="formulario-seccion">
              <h3>Información general</h3>

              <p><strong>Inventario:</strong> {activoDetalle.numero_inventario}</p>
              <p><strong>Tipo:</strong> {obtenerNombreCategoria(activoDetalle)}</p>
              <p><strong>Estado:</strong> {activoDetalle.estado_activo}</p>
              <p><strong>Marca:</strong> {activoDetalle.marca}</p>
              <p><strong>Modelo:</strong> {activoDetalle.modelo}</p>
              <p><strong>Serie:</strong> {activoDetalle.numero_serie || "—"}</p>
              <p><strong>Proveedor:</strong> {activoDetalle.id_proveedor_adquisicion || "—"}</p>
            </div>

            {/* UBICACIÓN */}
            <div className="formulario-seccion">
              <h3>Ubicación del activo</h3>

              <p><strong>Sede:</strong> {activoDetalle.id_sede || "—"}</p>
              <p><strong>Departamento:</strong> {activoDetalle.id_departamento || "—"}</p>
              <p><strong>Ubicación:</strong> {activoDetalle.id_ubicacion || "—"}</p>
            </div>

            {/* CARACTERÍSTICAS TÉCNICAS */}
            <div className="formulario-seccion">
              <h3>Características técnicas</h3>

              {[
                ["Sistema operativo", "sistema_operativo"],
                ["Procesador", "procesador"],
                ["Memoria RAM", "memoria_ram"],
                ["Almacenamiento", "almacenamiento"],
                ["Dirección IP", "direccion_ip"],
                ["Dirección MAC", "direccion_mac"],
                ["Tamaño de pantalla", "tamano_pantalla"],
                ["Resolución", "resolucion"],
                ["Resolución de escaneo", "resolucion_escaneo"],
                ["Velocidad de escaneo", "velocidad_escaneo"],
                ["Tipo de conexión", "tipo_conexion"],
                ["Alimentador automático (ADF)", "alimentador_automatico"],
                ["Escaneo dúplex", "escaneo_duplex"],
                ["Consumible", "consumible"],
                ["Tipo de impresión", "tipo_impresion"],
                ["Color", "color"],
                ["IMEI", "imei"],
                ["Número telefónico", "numero_telefonico"],
                ["Conectividad móvil", "conectividad_movil"],
                ["Tipo de dispositivo de red", "tipo_dispositivo_red"],
                ["Número de puertos", "numero_puertos"],
                ["Velocidad de puertos", "velocidad_puertos"],
                ["Tipo de conexión de red", "tipo_conexion_red"],
                ["Estándar Wi-Fi", "estandar_wifi"],
                ["Firmware", "firmware"],
              ].map(([etiqueta, campo]) =>
                activoDetalle[campo] !== "" &&
                activoDetalle[campo] != null ? (
                  <p key={campo}>
                    <strong>{etiqueta}:</strong>{" "}
                    {activoDetalle[campo]}
                  </p>
                ) : null
              )}
            </div>

            {/* SOFTWARE Y LICENCIAMIENTO */}
            <div className="formulario-seccion">
              <h3>Software y licenciamiento</h3>

              {[
                ["Tipo de software", "tipo_software"],
                ["Nombre del software", "nombre_software"],
                ["Fabricante", "fabricante_software"],
                ["Versión", "version_software"],
                ["Tipo de licencia", "tipo_licencia"],
                ["Clave de licencia", "clave_licencia"],
                ["Cantidad de licencias", "cantidad_licencias"],
                ["Licencias asignadas", "licencias_asignadas"],
                ["Fecha de activación", "fecha_activacion"],
                ["Fecha de vencimiento", "fecha_vencimiento"],
                ["Estado de la licencia", "estado_licencia"],
              ].map(([etiqueta, campo]) =>
                activoDetalle[campo] !== "" &&
                activoDetalle[campo] != null ? (
                  <p key={campo}>
                    <strong>{etiqueta}:</strong>{" "}
                    {activoDetalle[campo]}
                  </p>
                ) : null
              )}
            </div>

            {/* ADQUISICIÓN */}
            <div className="formulario-seccion">
              <h3>Información de adquisición</h3>

              <p><strong>Fecha de adquisición:</strong> {activoDetalle.fecha_adquisicion || "—"}</p>
              <p>
                <strong>Costo:</strong>{" "}
                {activoDetalle.costo_adquisicion !== ""
                  ? activoDetalle.costo_adquisicion
                  : "—"}{" "}
                {activoDetalle.moneda}
              </p>
              <p><strong>Factura:</strong> {activoDetalle.numero_factura || "—"}</p>
              <p><strong>Orden de compra:</strong> {activoDetalle.numero_orden_compra || "—"}</p>
            </div>

            {/* BAJA Y OBSERVACIONES */}
            <div className="formulario-seccion">
              <h3>Información de baja</h3>

              <p><strong>Fecha de baja:</strong> {activoDetalle.fecha_baja || "—"}</p>
              <p><strong>Motivo de baja:</strong> {activoDetalle.motivo_baja || "—"}</p>
              <p><strong>Observaciones:</strong> {activoDetalle.observaciones || "—"}</p>
            </div>

            <div className="modal-acciones">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setActivoDetalle(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AVISOS */}
      {mostrarAviso && (
        <div className="aviso-fondo">
          <div
            className={`aviso-ventana ${tipoMensaje}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-aviso"
          >
            <div className="aviso-icono">
              {tipoMensaje === "exito" ? "✓" : "!"}
            </div>

            <h2 id="titulo-aviso">
              {tipoMensaje === "exito"
                ? "Operación exitosa"
                : "No se pudo completar la operación"}
            </h2>

            <p>{mensaje}</p>

            <button
              type="button"
              onClick={() => setMostrarAviso(false)}
              autoFocus
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activos;
