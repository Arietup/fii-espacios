import { Suspense } from "react";
import Icon from "@/components/Icon";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Iniciar sesion | Espacios FII",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#F7F9FC]">
      {/* Panel izquierdo - identidad institucional (acento, no protagonista) */}
      <div className="login-gradient relative hidden w-[38%] flex-col justify-center overflow-hidden px-12 py-12 text-white lg:flex xl:px-16">
        <div aria-hidden="true" className="login-pattern pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/[0.03] blur-3xl"
        />

        <div className="relative z-10 flex flex-col gap-10">
          <div className="flex items-center gap-4">
            <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-white/95 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/LogoUGcolor.svg?v=5"
                alt="Universidad de Guayaquil"
                className="h-full w-full object-contain"
              />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                Universidad de Guayaquil
              </p>
              <p className="text-sm font-medium text-white/90">Facultad de Ingenieria Industrial</p>
            </div>
          </div>

          <div className="h-px w-16 bg-white/20" />

          <div className="max-w-sm">
            <h1 className="text-2xl font-semibold leading-snug tracking-tight text-white">
              Sistema Inteligente de Gestion de Espacios
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Administre aulas, laboratorios, talleres, oficinas y espacios
              institucionales de manera centralizada.
            </p>
          </div>
        </div>
      </div>

      {/* Panel derecho - formulario (elemento principal) */}
      <div className="flex w-full flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:w-[62%]">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/LogoUGcolor.svg?v=5"
              alt="Universidad de Guayaquil"
              className="h-12 w-12 object-contain drop-shadow-[0_4px_12px_rgba(10,74,130,0.22)]"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                Universidad de Guayaquil
              </p>
              <p className="text-sm font-semibold text-[#243447]">Espacios FII - Facultad de Ingenieria Industrial</p>
            </div>
          </div>

          <section className="scroll-reveal rounded-[20px] border border-[#DCE5EF] bg-white p-8 shadow-[0_24px_64px_rgba(10,74,130,0.10)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0A4A82]">
              Acceso institucional
            </p>
            <h2 className="mt-2 text-[26px] font-semibold tracking-tight text-[#243447]">
              Inicia sesion en tu cuenta
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Ingresa tus credenciales institucionales para consultar bloques, aulas,
              laboratorios y demas espacios de la facultad.
            </p>

            <div className="mt-8">
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>
          </section>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs leading-5 text-[#94A3B8]">
            <Icon name="shield" className="h-4 w-4 shrink-0 text-[#0A4A82]" />
            Acceso seguro y cifrado para la comunidad de la Facultad de Ingenieria Industrial.
          </p>
        </div>
      </div>
    </div>
  );
}
