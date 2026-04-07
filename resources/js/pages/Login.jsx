import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showPass, setShowPass] = useState(false);
    const [tema, setTema]         = useState(() => localStorage.getItem('tema') || 'dark');
    const [logoErr, setLogoErr]   = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', tema);
    }, [tema]);

    useEffect(() => {
        return () => reset('password');
    }, []);

    const toggleTema = () => {
        const nuevo = tema === 'dark' ? 'light' : 'dark';
        setTema(nuevo);
        localStorage.setItem('tema', nuevo);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Ingresar — Club Bolívar" />

            <div className="lb-root">
                <div className="lb-orb lb-orb-1" />
                <div className="lb-orb lb-orb-2" />

                <button type="button" className="btn-tema lb-tema-btn" onClick={toggleTema}>
                    {tema === 'dark' ? '☀️' : '🌙'}
                </button>

                <div className="lb-card">
                    <div className="lb-header">
                        {logoErr ? (
                            <div className="lb-logo-fallback">B</div>
                        ) : (
                            <img
                                className="lb-logo"
                                src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Club_Bol%C3%ADvar_logo.svg"
                                alt="Club Bolívar"
                                onError={() => setLogoErr(true)}
                            />
                        )}
                        <h2>Club Bolívar</h2>
                        <p>Sistema de Control de Acceso</p>
                    </div>

                    {status && <div className="lb-status">{status}</div>}

                    <form onSubmit={submit}>
                        <div className="lb-group">
                            <div className="lb-input-wrap">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder=" "
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    autoComplete="username"
                                    required
                                />
                                <label htmlFor="email">Correo electrónico</label>
                                <span className="lb-line" />
                            </div>
                            {errors.email && <div className="lb-error show">{errors.email}</div>}
                        </div>

                        <div className="lb-group">
                            <div className="lb-input-wrap">
                                <input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder=" "
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                                <label htmlFor="password">Contraseña</label>
                                <button type="button" className="lb-pw-toggle" onClick={() => setShowPass(!showPass)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {showPass ? (
                                            <>
                                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </>
                                        ) : (
                                            <>
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                                <span className="lb-line" />
                            </div>
                            {errors.password && <div className="lb-error show">{errors.password}</div>}
                        </div>

                        <div className="lb-opts">
                            <label className="lb-remember">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                />
                                <span className="lb-checkbox-label">
                                    <span className="lb-checkbox" />
                                    Mantener sesión
                                </span>
                            </label>
                            {canResetPassword && (
                                <a href={route('password.request')} className="lb-forgot">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            )}
                        </div>

                        <button type="submit" className="lb-submit" disabled={processing}>
                            <span>{processing ? 'Ingresando...' : 'Ingresar al sistema'}</span>
                            <span className="lb-submit-glow" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}