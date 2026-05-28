export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.NOTIFICATION_FROM_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: `Nueva solicitud — ${body.serviceName}`,
        html: `
        <div style="margin:0;padding:0;background:#F7F5F2;font-family:Arial,sans-serif;color:#333333;">
            <div style="max-width:620px;margin:0 auto;padding:34px 18px;">
            <div style="border-radius:32px;overflow:hidden;background:#ffffff;border:1px solid #eadfda;box-shadow:0 18px 50px rgba(51,51,51,0.08);">
                
                <div style="padding:34px 30px;background:linear-gradient(135deg,#DCCEC4 0%,#F2D9DC 52%,#DFF4F6 100%);">
                <div style="display:inline-block;padding:8px 13px;border-radius:999px;background:rgba(255,255,255,0.72);font-size:11px;letter-spacing:0.22em;color:#2f8f9a;font-weight:700;">
                    SON DE CERÁMICA
                </div>

                <h1 style="margin:22px 0 10px;font-size:34px;line-height:1.04;letter-spacing:-1px;color:#333333;">
                    Nueva solicitud de reservación
                </h1>

                <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(51,51,51,0.72);">
                    Alguien completó el formulario desde la página del estudio.
                </p>
                </div>

                <div style="padding:28px 30px 30px;">
                <div style="background:#F7F5F2;border-radius:24px;padding:22px;margin-bottom:18px;">
                    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.18em;color:#59B9C6;font-weight:700;">
                    EXPERIENCIA SOLICITADA
                    </p>

                    <h2 style="margin:0 0 18px;font-size:26px;line-height:1.15;color:#333333;">
                    ${body.serviceName}
                    </h2>

                    <table style="width:100%;border-collapse:collapse;font-size:15px;color:#333333;">
                    <tr>
                        <td style="padding:8px 0;color:#777;">Personas</td>
                        <td style="padding:8px 0;text-align:right;font-weight:700;">${body.peopleCount}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0;color:#777;">Fecha</td>
                        <td style="padding:8px 0;text-align:right;font-weight:700;">${body.date}</td>
                    </tr>
                    ${
                        body.secondDate
                        ? `<tr>
                            <td style="padding:8px 0;color:#777;">Segunda fecha</td>
                            <td style="padding:8px 0;text-align:right;font-weight:700;">${body.secondDate}</td>
                            </tr>`
                        : ""
                    }
                    </table>
                </div>

                <div style="border:1px solid #eee4df;border-radius:24px;padding:22px;margin-bottom:18px;">
                    <p style="margin:0 0 14px;font-size:11px;letter-spacing:0.18em;color:#999;font-weight:700;">
                    DATOS DEL CLIENTE
                    </p>

                    <p style="margin:0 0 10px;font-size:20px;font-weight:700;color:#333333;">
                    ${body.name} ${body.lastName}
                    </p>

                    <p style="margin:8px 0;font-size:15px;color:#555;">
                    <strong>Tel:</strong> ${body.phone}
                    </p>

                    <p style="margin:8px 0;font-size:15px;color:#555;">
                    <strong>Correo:</strong> ${body.email || "No proporcionado"}
                    </p>
                </div>

                <div style="border-radius:22px;background:#EDF8FA;padding:18px 20px;color:#2F8F9A;font-size:15px;line-height:1.6;font-weight:700;">
                    Revisa el panel de administración para dar seguimiento y confirmar anticipo.
                </div>

                <p style="margin:22px 0 0;text-align:center;font-size:12px;color:#999;">
                    Este aviso fue generado automáticamente por la página de Son de Cerámica.
                </p>
                </div>
            </div>
            </div>
        </div>
        `,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resend error:", errorText)

      return Response.json({ ok: false, error: errorText }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Notify admin error:", error)

    return Response.json({ ok: false, error: String(error) }, { status: 500 })
  }
}

