export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }
  try {
    const { nicho, audiencia, edad_audiencia, plataforma, objetivo, friccion, tema, presencia } = req.body

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Eres el motor de generación de contenido de NEXAFLOW AI. Analiza este perfil y genera el diagnóstico y las ideas.

PERFIL DEL CREADOR:
- Nicho: ${nicho}
- Audiencia: ${audiencia}
- Edad de la audiencia: ${edad_audiencia}
- Plataforma principal: ${plataforma}
- Objetivo con el contenido: ${objetivo}
- Mayor problema al crear contenido: ${friccion}
- Tema de esta semana: ${tema}
- Presencia en contenido: ${presencia}

INSTRUCCIONES:
1. Si la presencia es "Sin aparecer", genera SOLO ideas de carrusel, caption, hilo o email. Nunca guión de video con cara.
2. Cada idea debe tener un patrón viral aplicado de esta lista: curiosidad, error_comun, secreto, mito_vs_realidad, lista, historia_personal, advertencia, comparacion, hack_rapido, guia_paso_a_paso.
3. El contenido debe sonar como el creador, no como un robot.

RESPONDE EXACTAMENTE EN ESTE FORMATO:

📊 TU DIAGNÓSTICO:
[2-3 líneas sobre su situación, audiencia y oportunidad principal]

💡 IDEA 1 — [Patrón viral]
Título: [Hook exacto listo para publicar, máximo 12 palabras]
Formato: [Formato específico]
Estructura: [3 puntos clave del contenido]

💡 IDEA 2 — [Patrón viral]
Título: [Hook exacto listo para publicar, máximo 12 palabras]
Formato: [Formato específico]
Estructura: [3 puntos clave del contenido]

💡 IDEA 3 — [Patrón viral]
Título: [Hook exacto listo para publicar, máximo 12 palabras]
Formato: [Formato específico]
Estructura: [3 puntos clave del contenido]`
          }
        ]
      })
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(500).json({ error: data })
    }
    return res.status(200).json({
      resultado: data.content[0].text
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}
