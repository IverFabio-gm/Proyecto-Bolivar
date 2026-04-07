import { useEffect, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showPass, setShowPass] = useState(false);
    const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'dark');

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
            <Head title="Login — Club Bolívar" />

            <div className="login-root">

                {/* BOTÓN TEMA */}
                <button className="theme-btn" onClick={toggleTema}>
                    <svg viewBox="0 0 24 24">
                        <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/>
                    </svg>
                </button>

                <div className="login-card">

                    <div className="login-header">
                        <h1>Club Bolívar</h1>
                        <p>Sistema de acceso</p>
                    </div>

                    {status && <div className="login-status">{status}</div>}

                    <form onSubmit={submit}>

                        {/* EMAIL */}
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>

                        {/* PASSWORD */}
                        <div className="input-group password-group">
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="Contraseña"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required
                            />

                            <button type="button" onClick={() => setShowPass(!showPass)}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                                </svg>
                            </button>

                            {errors.password && <span className="error">{errors.password}</span>}
                        </div>

                        {/* OPCIONES */}
                        <div className="login-options">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                />
                                Recordarme
                            </label>

                            {canResetPassword && (
                                <Link href={route('password.request')}>
                                    Olvidé contraseña
                                </Link>
                            )}
                        </div>

                        {/* BOTÓN */}
                        <button className="login-btn" disabled={processing}>
                            {processing ? 'Ingresando...' : 'Ingresar'}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}