type Props = {
  message?: string
}

export function PageTransitionOverlay({
  message = "Cargando...",
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7F5F2]/65 px-6 backdrop-blur-md">
      <div className="w-full max-w-xs rounded-[2rem] bg-white/90 p-7 text-center shadow-sm ring-1 ring-black/5">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#DCCEC4] via-[#F2D9DC] to-[#59B9C6]/40">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#59B9C6]/20 border-t-[#59B9C6]" />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-[#59B9C6]">
          Son de Cerámica
        </p>

        <p className="mt-3 text-sm leading-6 text-[#333333]/65">
          {message}
        </p>
      </div>
    </div>
  )
}

