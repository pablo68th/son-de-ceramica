export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] px-4 py-8 text-[#333333]">
      <section className="animate-soft-enter mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[#59B9C6]">
          Son de Cerámica
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
          Aviso de privacidad
        </h1>

        <div className="mt-8 space-y-6 text-sm leading-7 text-[#333333]/72">
          <p>
            En Son de Cerámica utilizamos la información proporcionada por
            nuestros usuarios únicamente para gestionar solicitudes de
            reservación, contacto y seguimiento relacionado con nuestras
            experiencias y actividades del estudio.
          </p>

          <p>
            Los datos que podemos solicitar incluyen nombre, teléfono y correo
            electrónico. Esta información no se comparte con terceros ajenos al
            funcionamiento del estudio.
          </p>

          <p>
            En caso de aceptar recibir promociones o novedades, podremos
            utilizar tus datos de contacto para compartir información sobre
            nuevas experiencias, talleres o eventos especiales.
          </p>

          <p>
            Puedes solicitar la modificación o eliminación de tus datos de
            contacto escribiéndonos directamente a través de nuestros canales de
            atención.
          </p>

          <div className="rounded-[1.5rem] bg-[#F7F5F2] p-5">
            <p className="font-medium">
              Última actualización
            </p>

            <p className="mt-1 text-[#333333]/65">
              Mayo 2026
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}