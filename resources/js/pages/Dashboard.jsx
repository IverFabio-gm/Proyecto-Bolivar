import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';

export default function Dashboard() {
    const { auth } = usePage().props;
    const [logs, setLogs]         = useState([]);
    const [cargando, setCargando] = useState(true);
    const [tema, setTema]         = useState(() => localStorage.getItem('tema') || 'dark');
    const [logoErr, setLogoErr]   = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', tema);
    }, [tema]);

    useEffect(() => {
        axios.get('/api/audit-logs', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => setLogs(res.data))
        .catch(() => {})
        .finally(() => setCargando(false));
    }, []);

    const toggleTema = () => {
        const nuevo = tema === 'dark' ? 'light' : 'dark';
        setTema(nuevo);
        localStorage.setItem('tema', nuevo);
    };

    const cerrarSesion = () => {
        router.post(route('logout'));
    };

    const totalCreate = logs.filter(l => l.accion === 'create').length;
    const totalUpdate = logs.filter(l => l.accion === 'update').length;
    const totalDelete = logs.filter(l => l.accion === 'delete').length;

    return (
        <>
            <Head title="Dashboard — Club Bolívar" />

            <div className="dashboard-root">
                <nav className="navbar navbar-dashboard">
                    <div className="navbar-brand">
                        {logoErr ? (
                            <div className="navbar-logo-fallback">B</div>
                        ) : (
                            <img
                                className="navbar-logo"
                                src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Club_Bol%C3%ADvar_logo.svg"
                                alt="Club Bolívar"
                                onError={() => setLogoErr(true)}
                            />
                        )}
                        <div className="navbar-brand-texto">
                            <span className="navbar-brand-titulo">Club Bolívar</span>
                            <span className="navbar-brand-sub">Panel de Control</span>
                        </div>
                    </div>

                    <div className="navbar-acciones">
                        <span className="navbar-usuario">{auth.user.name}</span>
                        <button className="btn-tema" onClick={toggleTema}>
                            {tema === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <button className="btn btn-peligro btn-sm" onClick={cerrarSesion}>
                            Cerrar sesión
                        </button>
                    </div>
                </nav>

                <div className="dashboard-main">
                    <div className="dashboard-header">
                        <div>
                            <div className="dashboard-titulo">Registro de Auditoría</div>
                            <div className="dashboard-subtitulo">Últimas 50 acciones registradas en el sistema</div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icono stat-icono-verde">✅</div>
                            <div>
                                <div className="stat-valor">{totalCreate}</div>
                                <div className="stat-label">Creados</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icono stat-icono-cyan">✏️</div>
                            <div>
                                <div className="stat-valor">{totalUpdate}</div>
                                <div className="stat-label">Actualizados</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icono stat-icono-rojo">🗑️</div>
                            <div>
                                <div className="stat-valor">{totalDelete}</div>
                                <div className="stat-label">Eliminados</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icono stat-icono-gold">📋</div>
                            <div>
                                <div className="stat-valor">{logs.length}</div>
                                <div className="stat-label">Total eventos</div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div className="card-titulo">Eventos del sistema</div>
                            <div className="card-subtitulo">Auditoría automática de todas las operaciones</div>
                        </div>
                        {cargando ? (
                            <div className="dashboard-cargando">Cargando registros</div>
                        ) : logs.length === 0 ? (
                            <div className="tabla-vacia">No hay registros aún.</div>
                        ) : (
                            <div className="tabla-contenedor">
                                <table className="tabla">
                                    <thead>
                                        <tr>
                                            <th>Acción</th>
                                            <th>Tabla</th>
                                            <th>Fecha y hora</th>
                                            <th>IP</th>
                                            <th>Navegador</th>
                                            <th>Sistema operativo</th>
                                            <th>Usuario</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map(log => (
                                            <tr key={log.id}>
                                                <td>
                                                    <span className={`badge badge-${log.accion}`}>
                                                        {log.accion}
                                                    </span>
                                                </td>
                                                <td>{log.modelo_afectado}</td>
                                                <td className="td-muted">{log.fecha_hora ?? '—'}</td>
                                                <td className="td-muted">{log.ip_address}</td>
                                                <td>{log.navegador ?? '—'}</td>
                                                <td>{log.sistema_operativo ?? '—'}</td>
                                                <td className="td-muted">{log.user_id ?? '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}