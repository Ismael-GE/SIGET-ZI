
import { useState } from "react";
import "./App.css";

function App() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [recordarSesion, setRecordarSesion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const manejarInicioSesion = (e) => {
    e.preventDefault();
    setMensaje("");

    if (!usuario.trim() || !contrasena) {
      setMensaje("Ingresa tu usuario y contraseña.");
      return;
    }

    setMensaje("Formulario listo para conectar con el servidor.");
  };

  const recuperarContrasena = () => {
    setMensaje(
      "Contacta al admnistrador"
    );
  };

  return (
    <main className="login-page">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>
      <div className="background-glow glow-three"></div>

      <section className="login-card">
        {/* PANEL IZQUIERDO: INICIO DE SESIÓN */}
        <div className="login-form-panel">
          <div className="login-content">
            <div className="brand-icon">
              <span>Z</span>
            </div>

            <div className="mobile-brand">
              <h1>Zermat Internacional</h1>
              <p>Tecnologías de la Información</p>
            </div>

            <header className="form-header">
              <span className="form-eyebrow">
                SISTEMA DE ACCESO
              </span>

              <h2>Iniciar sesión</h2>

            </header>

            <form
              className="login-form"
              onSubmit={manejarInicioSesion}
            >
              <div className="form-group">
                <label htmlFor="usuario">Usuario</label>

                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  placeholder="Usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contrasena">Contraseña</label>

                <div className="password-wrapper">
                  <input
                    id="contrasena"
                    name="contrasena"
                    type={mostrarContrasena ? "text" : "password"}
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    className="toggle-password"
                    type="button"
                    onClick={() =>
                      setMostrarContrasena(!mostrarContrasena)
                    }
                    aria-label={
                      mostrarContrasena
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {mostrarContrasena ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 9 5 9 7a10.8 10.8 0 01-3.1 4.3" />
                        <path d="M6.2 6.2C3.8 7.8 2 10.4 2 12c0 2 4 7 10 7 1 0 2-.2 2.9-.5" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-option">
                  <input
                    type="checkbox"
                    checked={recordarSesion}
                    onChange={(e) =>
                      setRecordarSesion(e.target.checked)
                    }
                  />

                  <span>Recordar sesión</span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={recuperarContrasena}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {mensaje && (
                <div className="form-message" role="status">
                  {mensaje}
                </div>
              )}

              <button type="submit" className="login-button">
                <span>Ingresar</span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </form>

            <footer className="form-footer">
              <span className="status-dot"></span>
              © Zermat Internacional. Todos los derechos reservados.
            </footer>
          </div>
        </div>

        {/* PANEL DERECHO: IDENTIDAD CORPORATIVA */}
        <aside className="brand-panel">
          <div className="brand-top">
            <div className="brand-symbol-small">Z</div>

            <span className="brand-top-label">
              TECNOLOGÍA · INNOVACIÓN · CONTROL
            </span>
          </div>

          <div className="brand-message">
            <span className="brand-tag">
              ZERMAT INTERNACIONAL
            </span>

            <h2>
              SIGET -ZI
            </h2>

            <p>
              Sistema de Gestión de Equipos Tecnológicos de 
              Zermat Internacional
            </p>

            <div className="brand-divider"></div>

            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="13" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </span>

                <div>
                  <strong>Control tecnológico</strong>
                  <span>Equipos y activos centralizados</span>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>

                <div>
                  <strong>Acceso seguro</strong>
                  <span>Información para usuarios autorizados</span>
                </div>
              </div>
            </div>
          </div>

          <footer className="brand-footer">
            <div>
              <span className="footer-line"></span>
              <span>SIGET-ZI</span>
            </div>

            <span className="copyright">
              Zermat Internacional · TI
            </span>
          </footer>

          <div className="decorative-circle circle-one"></div>
          <div className="decorative-circle circle-two"></div>
          <div className="decorative-grid"></div>
        </aside>
      </section>
    </main>
  );
}

export default App;
