// ============================================================
// NEXAFLOW AI — api/diagnostico.js v2.0 (AUTÓNOMO)
// Todo el motor integrado en un solo archivo serverless
// Sin imports externos — compatible con Vercel
// ============================================================

const PATRONES_VIRALES = {
  P01: { id:"P01", nombre:"Contraintuitivo", descripcion:"Afirma lo opuesto de lo que la audiencia cree. Genera fricción cognitiva inmediata.", hook_formula:"Lo que todos hacen para [X] es exactamente lo que impide [Y]." },
  P02: { id:"P02", nombre:"Antes y Después", descripcion:"Muestra transformación real. El espectador se proyecta en el después.", hook_formula:"Hace [tiempo], yo era [estado A]. Hoy [estado B]. Lo que cambió fue una sola cosa." },
  P03: { id:"P03", nombre:"Secreto Revelado", descripcion:"Implica información privilegiada que pocos conocen. Activa curiosidad máxima.", hook_formula:"Nadie te está diciendo esto sobre [tema] y es lo único que importa." },
  P04: { id:"P04", nombre:"Error Común", descripcion:"Señala un error que comete la mayoría. La audiencia siente urgencia de verificar si lo comete.", hook_formula:"El [X]% de personas que intentan [Y] cometen este error sin saberlo." },
  P05: { id:"P05", nombre:"Historia Personal", descripcion:"Narrativa en primera persona con conflicto real. Genera empatía y confianza.", hook_formula:"Hubo un momento en que [situación límite]. Lo que pasó después cambió todo." },
  P06: { id:"P06", nombre:"Paso a Paso Accionable", descripcion:"Instrucción ejecutable en menos de 60 segundos. Alta tasa de guardados.", hook_formula:"Haz esto en los próximos 5 minutos y [resultado concreto]." },
  P07: { id:"P07", nombre:"Provocación Directa", descripcion:"Interpela al espectador con una pregunta o afirmación que lo incomoda.", hook_formula:"Si todavía no tienes [X], es porque nadie te explicó esto." },
  P08: { id:"P08", nombre:"Comparación Inesperada", descripcion:"Conecta dos realidades que parecen no tener relación.", hook_formula:"[X] es exactamente igual que [Y completamente diferente]. Y eso lo cambia todo." },
  P09: { id:"P09", nombre:"Número Específico", descripcion:"Un número concreto en el título aumenta credibilidad y clics.", hook_formula:"[Número] razones por las que [afirmación sorprendente]." },
  P10: { id:"P10", nombre:"Urgencia Temporal", descripcion:"Implica que hay una ventana que se cierra. Activa el miedo a quedarse fuera.", hook_formula:"Esto va a cambiar en [tiempo]. Quien lo entienda ahora tiene ventaja." },
};

function buildPrompt(contexto) {
  const {
    nicho, subnicho, audiencia, problema_central,
    angulos_detectados, plataforma_principal,
    presencia_en_contenido, objetivo_principal,
    historial_temas = []
  } = contexto;

  const patronesTexto = Object.values(PATRONES_VIRALES)
    .map(p => `- ${p.id} | ${p.nombre}: ${p.descripcion} | Hook base: "${p.hook_formula}"`)
    .join("\n");

  const historialTexto = historial_temas.length > 0
    ? `TEMAS YA PUBLICADOS (no repetir ángulos idénticos):\n${historial_temas.map(t => `- ${t}`).join("\n")}`
    : "Sin historial previo. Primera sesión del usuario.";

  const audienciaTexto = `
- Rango de edad: ${contexto.audiencia_obj?.rango_edad || "25-44"}
- Nivel de consciencia: consciente del problema, no sabe la solución
- Motivación principal: ${objetivo_principal}
- Dolor específico: ${problema_central}
- Descripción libre: ${audiencia}`.trim();

  const estiloVisual = presencia_en_contenido && presencia_en_contenido.toLowerCase().includes("rostro")
    ? "hiperrealista cinematográfico, tonos cálidos, luz natural"
    : "ilustración 3D moderna, paleta crema y dorado, estudio minimalista";

  return `
Eres el motor de inteligencia de NEXAFLOW AI. Tu trabajo es generar una cadena completa de producción de contenido viral en 6 capas secuenciales. No eres un asistente genérico. Eres una arquitectura especializada en convertir el perfil de un creador en material publicable de alto impacto.

REGLAS ABSOLUTAS:
1. Cada capa depende de la anterior.
2. No uses frases genéricas, motivacionales vacías ni clichés de marketing.
3. Todo el output debe estar en ESPAÑOL.
4. El output completo debe estar en formato JSON estricto, sin texto fuera del JSON, sin markdown, sin explicaciones.
5. Si un campo no puede generarse con alta calidad, usa null. Nunca inventes datos.

═══════════════════════════════════════════════
PERFIL DEL USUARIO
═══════════════════════════════════════════════

NICHO: ${nicho}
SUBNICHO: ${subnicho || nicho}
PLATAFORMA PRINCIPAL: ${plataforma_principal}
PRESENCIA EN CONTENIDO: ${presencia_en_contenido}
OBJETIVO PRINCIPAL: ${objetivo_principal}
PROBLEMA CENTRAL: ${problema_central}

AUDIENCIA:
${audienciaTexto}

ÁNGULOS DETECTADOS:
${angulos_detectados.map((a, i) => `${i + 1}. ${a}`).join("\n")}

${historialTexto}

═══════════════════════════════════════════════
BIBLIOTECA DE PATRONES VIRALES
═══════════════════════════════════════════════

${patronesTexto}

REGLA DE DIVERSIDAD: Ningún patrón viral puede repetirse más de 2 veces en las 10 ideas.
REGLA DE CALIDAD: Descarta ideas con score de viralidad menor a 40/100.

═══════════════════════════════════════════════
CAPA 1 — DIAGNÓSTICO DEL PERFIL
═══════════════════════════════════════════════

Genera:
1. posicionamiento_unico: descripción del posicionamiento único en máximo 2 frases. Sin elogios, solo análisis.
2. madurez_del_nicho: "emergente" | "en_crecimiento" | "saturado" | "dominado"
3. ventana_de_oportunidad: qué ángulo tiene menos competencia y más demanda ahora mismo.
4. riesgos_de_contenido: array de 3 strings con los mayores errores que destruyen el crecimiento en este nicho.

═══════════════════════════════════════════════
CAPA 2 — 10 IDEAS DE CONTENIDO
═══════════════════════════════════════════════

Genera exactamente 10 ideas. Cada idea debe tener:
- id: número del 1 al 10
- tipo: "Inspiracional" | "Educacional" | "Entretenimiento" | "Storytelling" | "Tutorial" | "Paso a Paso"
- titulo: máximo 12 palabras, hook listo para publicar
- insight_mensaje_central: enseñanza poderosa detrás del contenido (1-2 frases)
- emocion_dominante: "curiosidad" | "inspiracion" | "humor" | "rabia" | "esperanza" | "sorpresa" | "empoderamiento" | "miedo" | "identificacion"
- hook_apertura: frase rompe-scroll de máximo 15 palabras
- cta_sugerido: llamada a la acción específica para esa pieza
- patron_viral_aplicado: ID del patrón (P01-P10)
- score_viralidad: número del 41 al 100
- justificacion_viralidad: 1 frase explicando el score
- duracion_recomendada: "15-30s" | "30-60s" | "60-90s"
- formato_recomendado: "Reel" | "TikTok" | "Short" | "Carrusel" | "Historia"

Ordena de mayor a menor score_viralidad.

═══════════════════════════════════════════════
CAPA 3 — SELECCIÓN DE LA IDEA GANADORA
═══════════════════════════════════════════════

De las 10 ideas, selecciona la de mayor potencial viral con 100% de convicción:
- id_idea_ganadora: id de la idea seleccionada
- razon_seleccion: 2-3 frases específicas para ESTE perfil. Sin frases genéricas.
- factor_decisivo: el único elemento que la hace ganadora

═══════════════════════════════════════════════
CAPA 4 — GUIÓN COMPLETO
═══════════════════════════════════════════════

Desarrolla el guión completo para la idea ganadora:

A) TRES OPCIONES DE GANCHO
Cada gancho máximo 10 palabras. Cada uno activa una emoción diferente.

B) CUERPO DEL CONTENIDO
- Conecta con el dolor específico de la audiencia
- Hace sentir que entiendes exactamente su problema
- Presenta la solución sin explicarla completamente (deja tensión)
- Lenguaje conversacional, como hablando a una persona real
- Al leer en voz alta: entre 20 y 45 segundos

C) CTA — SOLO UNO
- Solo: "Haz clic en el enlace de mi perfil"
- Con beneficio claro de por qué hacerlo AHORA
- Máximo 2 frases. Directo.

Entrega:
- gancho_opcion_1, gancho_opcion_2, gancho_opcion_3: textos
- gancho_recomendado: 1 | 2 | 3
- razon_gancho_recomendado: 1 frase
- cuerpo: texto completo del cuerpo
- cta: texto del CTA
- palabras_totales_guion: número aproximado
- duracion_estimada_segundos: basado en 130 palabras por minuto

═══════════════════════════════════════════════
CAPA 5 — PROMPTS PARA CLIPS DE VIDEO
═══════════════════════════════════════════════

Divide el guión completo en fragmentos de 5 segundos de video.
Para cada fragmento:
- fragmento_id: número secuencial
- segundos: rango (ej: "0-5s")
- frase_del_guion: texto exacto del segmento
- prompt_imagen: "Genérame un video en el que [sujeto + entorno + cámara + luz + color]. Sin voz, sin texto, sin logos."
- prompt_animacion: "[acción + mood + movimiento de cámara]"

Estilo visual para todos los clips: ${estiloVisual}
Mantén coherencia visual entre todos los clips.

Al final incluye:
- estilo_visual_global: descripción del estilo coherente
- paleta_de_color: array de 3 colores dominantes
- total_clips: número total

═══════════════════════════════════════════════
CAPA 6 — ESTRATEGIA DE PUBLICACIÓN
═══════════════════════════════════════════════

- dia_recomendado: día de la semana con mayor alcance para este nicho en ${plataforma_principal}
- hora_recomendada: rango de hora (ej: "7:00pm - 9:00pm hora local")
- razon_timing: 1 frase específica para ESTE nicho y ESTA audiencia
- frecuencia_ideal: cuántas veces por semana publicar
- metrica_principal: métrica más importante en las primeras 24h (específica, no likes genéricos)
- umbral_de_exito_24h: número mínimo que indica potencial viral
- accion_si_supera_umbral: qué hacer exactamente si supera ese número
- accion_si_no_supera_umbral: qué ajuste hacer si no llega
- hashtags_recomendados: array de 5-8 hashtags específicos para este subnicho y plataforma. Sin #viral ni #fyp.

═══════════════════════════════════════════════
FORMATO DE RESPUESTA FINAL
═══════════════════════════════════════════════

Devuelve ÚNICAMENTE el siguiente objeto JSON. Sin texto previo, sin explicaciones, sin markdown.

{
  "capa_1_diagnostico": {
    "posicionamiento_unico": "",
    "madurez_del_nicho": "",
    "ventana_de_oportunidad": "",
    "riesgos_de_contenido": ["", "", ""]
  },
  "capa_2_ideas": [
    {
      "id": 1,
      "tipo": "",
      "titulo": "",
      "insight_mensaje_central": "",
      "emocion_dominante": "",
      "hook_apertura": "",
      "cta_sugerido": "",
      "patron_viral_aplicado": "",
      "score_viralidad": 0,
      "justificacion_viralidad": "",
      "duracion_recomendada": "",
      "formato_recomendado": ""
    }
  ],
  "capa_3_seleccion": {
    "id_idea_ganadora": 0,
    "razon_seleccion": "",
    "factor_decisivo": ""
  },
  "capa_4_guion": {
    "gancho_opcion_1": "",
    "gancho_opcion_2": "",
    "gancho_opcion_3": "",
    "gancho_recomendado": 0,
    "razon_gancho_recomendado": "",
    "cuerpo": "",
    "cta": "",
    "palabras_totales_guion": 0,
    "duracion_estimada_segundos": 0
  },
  "capa_5_prompts_video": {
    "clips": [
      {
        "fragmento_id": 1,
        "segundos": "",
        "frase_del_guion": "",
        "prompt_imagen": "",
        "prompt_animacion": ""
      }
    ],
    "estilo_visual_global": "",
    "paleta_de_color": ["", "", ""],
    "total_clips": 0
  },
  "capa_6_publicacion": {
    "dia_recomendado": "",
    "hora_recomendada": "",
    "razon_timing": "",
    "frecuencia_ideal": "",
    "metrica_principal": "",
    "umbral_de_exito_24h": "",
    "accion_si_supera_umbral": "",
    "accion_si_no_supera_umbral": "",
    "hashtags_recomendados": []
  }
}
`.trim();
}

function parseResponse(raw) {
  const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    const parsed = JSON.parse(clean);
    const capasRequeridas = [
      "capa_1_diagnostico","capa_2_ideas","capa_3_seleccion",
      "capa_4_guion","capa_5_prompts_video","capa_6_publicacion"
    ];
    const faltantes = capasRequeridas.filter(c => !parsed[c]);
    if (faltantes.length > 0) {
      return { success: false, error: "CAPAS_FALTANTES", message: `Faltan: ${faltantes.join(", ")}`, partial: parsed };
    }
    if (Array.isArray(parsed.capa_2_ideas)) {
      parsed.capa_2_ideas = parsed.capa_2_ideas
        .filter(i => i.score_viralidad >= 40)
        .sort((a, b) => b.score_viralidad - a.score_viralidad);
    }
    return { success: true, data: parsed, ideas_count: parsed.capa_2_ideas?.length || 0, idea_ganadora_id: parsed.capa_3_seleccion?.id_idea_ganadora };
  } catch (err) {
    return { success: false, error: "JSON_PARSE_ERROR", message: "La IA no devolvió JSON válido.", raw };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    nombre, email, nicho, audiencia, edad_audiencia,
    plataforma, objetivo, friccion, tema, presencia,
  } = req.body;

  const camposFaltantes = [];
  if (!nicho) camposFaltantes.push("nicho");
  if (!audiencia) camposFaltantes.push("audiencia");
  if (!plataforma) camposFaltantes.push("plataforma");
  if (!objetivo) camposFaltantes.push("objetivo");
  if (!tema) camposFaltantes.push("tema");

  if (camposFaltantes.length > 0) {
    return res.status(400).json({
      error: "CAMPOS_FALTANTES",
      message: `Faltan campos: ${camposFaltantes.join(", ")}`,
    });
  }

  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ error: "CONFIG_ERROR", message: "CLAUDE_API_KEY no configurada." });
  }

  const contexto = {
    nicho: nicho,
    subnicho: nicho,
    audiencia: audiencia,
    audiencia_obj: { rango_edad: edad_audiencia || "25-44" },
    plataforma_principal: plataforma,
    presencia_en_contenido: presencia || "Con mi rostro y voz",
    objetivo_principal: objetivo,
    problema_central: friccion
      ? `${friccion}. Tema que quiere comunicar: ${tema}.`
      : `Quiere crear contenido sobre: ${tema}.`,
    angulos_detectados: [
      `El problema principal de su audiencia: ${friccion || audiencia}`,
      `El tema de esta semana: ${tema}`,
      `Su audiencia tiene entre ${edad_audiencia || "25-44"} años y busca: ${objetivo}`,
      `Presencia en cámara: ${presencia || "Con mi rostro y voz"}`,
      `Plataforma principal: ${plataforma}`,
    ],
    historial_temas: [],
  };

  const prompt = buildPrompt(contexto);

  try {
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 8000,
        system: "Eres el motor de NEXAFLOW AI. Respondes ÚNICAMENTE con JSON válido. Sin texto adicional, sin markdown, sin explicaciones fuera del JSON. Si no puedes completar un campo usa null. Nunca devuelvas JSON malformado.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.text();
      return res.status(500).json({ error: "API_ERROR", status: apiRes.status, message: errBody });
    }

    const apiData = await apiRes.json();
    const rawText = apiData.content?.find(b => b.type === "text")?.text || "";

    let result = parseResponse(rawText);

    if (!result.success && result.error === "JSON_PARSE_ERROR") {
      const retryRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 8000,
          system: "Eres el motor de NEXAFLOW AI. SOLO devuelves JSON válido. Sin texto adicional.",
          messages: [
            { role: "user", content: prompt },
            { role: "assistant", content: rawText },
            { role: "user", content: "El JSON tiene errores de formato. Devuelve exactamente el mismo contenido pero con JSON perfectamente formateado. Solo el JSON, nada más." },
          ],
        }),
      });
      const retryData = await retryRes.json();
      const retryText = retryData.content?.find(b => b.type === "text")?.text || "";
      result = parseResponse(retryText);
      result.fue_reintento = true;
    }

    if (!result.success) {
      return res.status(500).json({ error: result.error, message: result.message });
    }

    return res.status(200).json({
      success: true,
      usuario: { nombre: nombre || "Usuario", email: email || null, nicho, plataforma },
      resultado: result.data,
      meta: {
        ideas_generadas: result.ideas_count,
        idea_ganadora_id: result.idea_ganadora_id,
        fue_reintento: result.fue_reintento || false,
      },
    });

  } catch (err) {
    console.error("[NEXAFLOW] Error:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR", message: err.message || "Error interno." });
  }
}
