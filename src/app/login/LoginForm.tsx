"use client";

import { useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Icon from "@/components/Icon";

const fieldShellClass =
  "peer h-[58px] w-full rounded-xl border border-[#DCE5EF] bg-white pl-11 pr-4 pt-7 pb-1.5 text-sm text-[#243447] placeholder-transparent transition hover:border-[#94A3B8] focus:border-[#0A4A82] focus:outline-none focus:ring-4 focus:ring-[#0A4A82]/10";

const floatingLabelClass =
  "pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8] transition-all duration-150 " +
  "peer-focus:top-[8px] peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[#0A4A82] " +
  "peer-[&:not(:placeholder-shown)]:top-[8px] peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:text-[#64748B]";

export default function LoginForm() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const callbackUrl   = searchParams.get("callbackUrl") || "/";

  const [username,     setUsername]     = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember,     setRemember]     = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [loading,      setLoading]      = useState(false);

  const errorId      = useId();
  const statusId     = useId();
  const usernameId   = useId();
  const passwordId   = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Usuario o contraseña incorrectos. Verifica tus credenciales e intenta de nuevo.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <>
      {/* Anuncio de estado para lectores de pantalla */}
      <div
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {loading ? "Verificando credenciales, por favor espera." : ""}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
        noValidate
        aria-label="Formulario de inicio de sesión"
      >
        {/* Campo usuario */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          >
            <Icon name="mail" className="h-[18px] w-[18px]" />
          </span>
          <input
            id={usernameId}
            name="username"
            type="text"
            autoComplete="username"
            required
            placeholder=" "
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            aria-label="Usuario o correo institucional"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={fieldShellClass}
          />
          <label htmlFor={usernameId} className={floatingLabelClass}>
            Usuario o correo institucional
          </label>
        </div>

        {/* Campo contraseña */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          >
            <Icon name="lock" className="h-[18px] w-[18px]" />
          </span>
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder=" "
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            aria-label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${fieldShellClass} pr-11`}
          />
          <label htmlFor={passwordId} className={floatingLabelClass}>
            Contraseña
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#94A3B8] transition hover:text-[#0A4A82] focus:outline-none focus:ring-2 focus:ring-[#0A4A82] focus:ring-offset-2"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
          >
            <Icon
              name={showPassword ? "eyeOff" : "eye"}
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Mensaje de error — role="alert" para anuncio inmediato */}
        {error && (
          <div
            id={errorId}
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-2.5 rounded-xl border border-[#EF4444]/25 bg-[#FEE2E2] px-4 py-3 text-sm text-[#B91C1C]"
          >
            <Icon name="close" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Recordar / recuperar */}
        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-[#64748B]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-[#DCE5EF] text-[#0A4A82] accent-[#0A4A82] focus:outline-none focus:ring-2 focus:ring-[#0A4A82] focus:ring-offset-2"
            />
            Recordarme en este dispositivo
          </label>
          <a
            href="mailto:soporte@ug.edu.ec"
            className="rounded-md font-semibold text-[#0A4A82] no-underline transition hover:text-[#083B68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0A4A82] focus:ring-offset-2"
          >
            Recuperar contraseña
          </a>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          aria-describedby={statusId}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0A4A82] px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(10,74,130,0.26)] transition hover:bg-[#083B68] hover:shadow-[0_16px_36px_rgba(10,74,130,0.32)] active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#0A4A82] focus:ring-offset-2"
        >
          {loading && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {loading ? "Verificando acceso…" : "Ingresar"}
        </button>
      </form>
    </>
  );
}
