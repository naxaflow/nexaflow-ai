import { ejecutarMotorNexaflow } from '../NEXAFLOW_PROMPT_MAESTRO_v1.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    nombre,
    email,
    nicho,
    audiencia,
    edad_audiencia,
    plataforma,
    objetivo,
    friccion,
    tema,
    presencia,
  } = req.body;

  // Validación de campos requeridos
  const camposFaltantes = [];
  if (!nicho) camposFaltantes.push('nicho');
  if (!audiencia) camposFaltantes.push('audiencia');
  if (!plataforma) camposFaltantes.push('plataforma');
  if (!objetivo) camposFaltantes.push('objetivo');
  if (!tema) camposFaltantes.push('tema');

  if (camposFaltantes.length > 0) {
    return res.status(400).json({
      error: 'CAMPOS_FALTANTES',
      message: `Faltan los siguientes campos requeridos: ${camposFaltantes.join(', ')}`,
    });
  }

  // Validar que la API key esté configurada
  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({
      error: 'CONFIG_ERROR',
      message: 'CLAUDE_API_KEY no está configurada en las variables de entorno.',
    });
  }

  // Construir el objeto contexto_usuario
  const contexto_usuario = {
    user_id: email ? `usr_${email.replace(/[^a-z0-9]/gi, '_')}` : `usr_anon_${Date.now()}`,
    nombre: nombre || 'Usuario',
    email: email || null,

    // Datos del nicho
    nicho: nicho,
    subnicho: nicho, // El usuario puede refinar esto en M2; por ahora se usa el mismo valor

    // Plataforma y formato
    plataforma_principal: plataforma,
    presencia_en_contenido: presencia || 'Con mi rostro',
    objetivo_principal: objetivo,

    // Problema central derivado de fricción y tema
    problema_central: friccion
      ? `${friccion}. Tema actual que quiere comunicar: ${tema}.`
      : `Quiere crear contenido sobre: ${tema}.`,

    // Audiencia estructurada desde los campos del formulario
    audiencia: {
      rango_edad: edad_audiencia || '25-44',
      genero_predominante: 'mixto',
      nivel_consciencia: 'consciente del problema, no sabe la solución',
      motivacion_principal: objetivo,
      dolor_especifico: friccion || 'No especificado',
      descripcion_libre: audiencia,
    },

    // Ángulos detectados automáticamente desde los datos disponibles
    angulos_detectados: [
      `El problema principal de su audiencia es: ${friccion || audiencia}`,
      `El tema que quiere comunicar esta semana es: ${tema}`,
      `Su audiencia tiene entre ${edad_audiencia || '25-44'} años y busca: ${objetivo}`,
      `Su formato de presencia en cámara es: ${presencia || 'Con mi rostro'}`,
      `La plataforma principal donde publica es: ${plataforma}`,
    ],

    // Idioma de salida (español por defecto, extensible)
    idioma_salida: 'es',

    // Sin historial en esta primera llamada
    historial_temas: [],

    // API key inyectada desde el entorno
    api_key: process.env.CLAUDE_API_KEY,
  };

  try {
    const resultado = await ejecutarMotorNexaflow(contexto_usuario);

    if (!resultado.success) {
      return res.status(500).json({
        error: resultado.error,
        message: resultado.message,
        partial: resultado.partial || null,
      });
    }

    return res.status(200).json({
      success: true,
      usuario: {
        nombre: contexto_usuario.nombre,
        email: contexto_usuario.email,
        nicho: contexto_usuario.nicho,
        plataforma: contexto_usuario.plataforma_principal,
      },
      resultado: resultado.data,
      meta: {
        ideas_generadas: resultado.ideas_count,
        idea_ganadora_id: resultado.idea_ganadora_id,
        fue_reintento: resultado.fue_reintento || false,
        tema_para_historial: resultado.tema_para_historial || null,
      },
    });
  } catch (err) {
    console.error('[NEXAFLOW] Error en handler:', err);
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: err.message || 'Error interno del servidor.',
    });
  }
}
