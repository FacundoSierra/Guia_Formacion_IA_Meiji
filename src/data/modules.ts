/**
 * DATOS DE FORMACIÓN — Contenido de los módulos y retos
 *
 * Este archivo contiene todo el contenido educativo de la plataforma:
 *
 * MÓDULOS (6 en total):
 * 1. intro-tools    → Gemini y el Ecosistema de Google Workspace (multimodalidad, seguridad, I-C-D-S)
 * 2. what-is-ai     → Qué es la IA (qué hace bien y qué no)
 * 3. real-uses      → Usos reales por departamento (Admín, Comercial, Marketing, RRHH, Ops, Dirección)
 * 4. prompts        → Cómo escribir prompts efectivos (fórmula Contexto+Tarea+Formato+Tono)
 * 5. best-practices → Buenas prácticas y seguridad (nunca compartir datos confidenciales)
 * 6. case-study     → Caso práctico: cliente enfadado (escenario paso a paso)
 *
 * RETOS SEMANALES (6 en total):
 * Semana 1: Resumen Express (ChatGPT), Email Perfecto (Gemini)
 * Semana 2: Informe Relámpago (Ambos), Prompt Master (Ambos)
 * Semana 3: Automatización (Gemini), Presentación IA (Ambos)
 *
 * PARA EDITAR CONTENIDO: Modifica los arrays de 'content' (slides) y 'questions' (quiz) de cada módulo.
 */
import type { Module, WeeklyChallenge } from "@/types/challenge";

export const modules: Module[] = [
  // ── MÓDULO 1: Gemini y el Ecosistema de Google Workspace ──
  {
    id: "intro-tools",
    title: "Gemini y el Ecosistema de Google Workspace",
    description: "Cómo la IA se integra en tus herramientas diarias",
    icon: "1",
    completionPoints: 25,
    content: [
      {
        type: "text",
        title: "Bienvenido a la Guía de Formación de IA en Meiji",
        body: "La Inteligencia Artificial ya no es una herramienta externa que necesitas aprender desde cero. En Meiji, la adopción de la IA es un pilar estratégico, y la herramienta elegida es Gemini Enterprise de Google Cloud, integrada directamente en Gmail, Google Docs, Sheets y Slides.\n\nEsto significa que puedes mejorar tu trabajo diario sin cambiar de herramientas ni aprender plataformas nuevas. La IA viene a ti, dentro de las aplicaciones que ya usas cada día.\n\nSegún Forrester Research, la IA integrada en el puesto de trabajo puede ahorrar hasta 7 horas semanales en tareas de redacción y análisis.\n\nEsta guía te acompañará paso a paso para que descubras cómo aprovechar esta tecnología de forma segura, práctica y alineada con tu trabajo real.",
      },
      {
        type: "text",
        title: "¿Qué es Gemini?",
        body: "Gemini es el modelo de Inteligencia Artificial más capaz y flexible desarrollado por Google. Pero lo que lo hace realmente diferente es que es nativamente multimodal.\n\n¿Qué significa \"multimodal\"? Tradicionalmente, las IA se entrenaban por separado para cada tipo de dato: un modelo para texto, otro para imágenes, otro para audio. Gemini, en cambio, fue entrenado desde el inicio para comprender y trabajar con diferentes modalidades simultáneamente.\n\nEsto no es un detalle menor: significa que cuando le muestras un gráfico de producción con texto y números, Gemini entiende ambos a la vez, no los procesa por separado.\n\nReferencia: Google DeepMind — Gemini Technical Report, 2024.",
      },
      {
        type: "comparison",
        title: "Multimodalidad en detalle: ¿qué puede procesar Gemini?",
        body: "Gemini trabaja con 4 tipos de contenido de forma nativa e integrada:",
        items: [
          { label: "Texto", value: "Entiende matices técnicos, legales y farmacéuticos en documentos complejos" },
          { label: "Imágenes", value: "Analiza un gráfico de producción, una captura de SAP o una foto de laboratorio" },
          { label: "Audio", value: "Transcribe y resume reuniones grabadas, identifica decisiones clave" },
          { label: "Vídeo", value: "Extrae puntos de acción de una reunión en Google Meet o presentación grabada" },
        ],
      },
      {
        type: "tip",
        title: "Seguridad y Privacidad: El Escudo de Privacidad",
        body: "En un entorno farmacéutico como Meiji, la seguridad de los datos no es opcional: es un requisito innegociable. Por eso es importante entender las 3 garantías de Gemini en Google Workspace:\n\n1. Tus datos son tuyos: Los datos de Meiji NO se utilizan para entrenar los modelos globales de IA de Google. Lo que escribes, analizas o generas se queda dentro del entorno corporativo.\n\n2. Cifrado de grado bancario: Toda la información está protegida con cifrado en tránsito y en reposo, cumpliendo con los estándares ISO/IEC 27001 y SOC 2/3.\n\n3. Validación humana obligatoria: La IA puede generar \"alucinaciones\" — respuestas que suenan correctas pero son inexactas. En un contexto regulado, nunca uses un resultado de IA sin verificarlo. Tu criterio profesional es la última línea de defensa.\n\nREGLA DE ORO: La IA sugiere, tú decides. Siempre revisa antes de enviar o publicar.",
      },
      {
        type: "text",
        title: "Tutorial Paso a Paso",
        body: "PASO 1 — Acceso al Chat Directo de Gemini\n\nTu primer punto de contacto con la IA:\n\n1. Abre gemini.google.com en tu navegador\n2. Inicia sesión con tu cuenta corporativa de Meiji (@meiji.es o la que corresponda)\n3. Verifica que ves el logo de Meiji o el nombre de tu organización en la esquina superior\n\nImportante: Si ves la versión gratuita de Gemini (sin logo corporativo), cierra sesión y vuelve a entrar con tu cuenta de trabajo. La versión corporativa tiene funciones adicionales y las protecciones de privacidad descritas.\n\nConsejo: Escribe tu primera consulta en lenguaje natural. No necesitas comandos especiales. Habla con Gemini como hablarías con un compañero de trabajo.\n\nEjemplo: \"Resume los puntos clave de la última reunión de equipo\".\n\n\nPASO 2 — El Panel Lateral (Side Panel)\n\nEl Side Panel es donde Gemini se vuelve realmente útil dentro de tus documentos:\n\n1. Abre cualquier documento en Google Docs\n2. Busca el icono de estrella brillante en la esquina superior derecha\n3. Se abrirá un panel lateral donde puedes interactuar con Gemini\n\nEl truco clave: Gemini \"lee\" automáticamente el documento que tienes abierto. No necesitas copiar y pegar nada.\n\nEjemplo directo:\n- \"Haz un resumen de 3 puntos de este informe\"\n- \"Identifica los riesgos mencionados en este documento\"\n- \"Reescribe la sección 3 en un tono más formal\"\n\nGemini tiene el contexto completo del documento, así que sus respuestas son relevantes y específicas.\n\n\nPASO 3 — Extensiones de Workspace (@Gmail, @Drive)\n\nLas extensiones son el superpoder de Gemini: conectan la IA con todas tus herramientas de trabajo.\n\nEn el chat de Gemini, usa el símbolo @ para mencionar aplicaciones:\n\n- @Gmail: Busca y analiza correos\n- @Drive: Encuentra y resume documentos\n- @Docs: Trabaja con documentos específicos\n\nCaso real completo:\n\"@Gmail busca los últimos correos sobre el proyecto de logística y dime si hay algún retraso mencionado\"\n\nGemini buscará en tu bandeja de entrada, leerá los correos relevantes y te dará un resumen con los retrasos identificados. Todo sin salir del chat.\n\nConsejo: Puedes combinar extensiones:\n\"@Drive busca el informe de calidad Q3 y @Gmail los correos relacionados con las incidencias de ese trimestre\".",
      },
      {
        type: "text",
        title: "Aplicación por Departamento",
        body: "DEPARTAMENTOS OPERATIVOS\nAlmacén, Logística, Mantenimiento\n\nReto habitual: Traducir manuales técnicos de maquinaria, resumir incidencias de producción, analizar datos de inventario.\n\nPrompt Maestro para Operaciones:\n\"Actúa como un ingeniero de producción farmacéutica. Analiza este registro de incidencias del último mes [pegar o adjuntar datos]. Identifica los 3 problemas más frecuentes, sugiere causas raíz probables y propón acciones correctivas. Presenta el resultado en una tabla con columnas: Incidencia | Frecuencia | Causa probable | Acción correctiva.\"\n\nEste prompt funciona porque aplica la fórmula I-C-D-S: da una instrucción clara, establece contexto (industria farmacéutica), aporta datos y define el formato de salida.\n\n\nDEPARTAMENTOS CIENTÍFICOS Y DE CALIDAD\nCientífico, Farmacovigilancia, Control de Calidad\n\nReto habitual: Analizar literatura médica, revisar reportes de seguridad, preparar documentación regulatoria.\n\nDato relevante: Según IQVIA, las empresas farmacéuticas que usan IA en farmacovigilancia han reducido el tiempo de triaje de casos en un 50%.\n\nPrompt Maestro para Calidad/Científico:\n\"Eres un especialista en asuntos regulatorios farmacéuticos. Revisa este borrador de informe de estabilidad [adjuntar documento]. Verifica que incluye todas las secciones requeridas por la guía ICH Q1A. Lista las secciones presentes, las que faltan, y sugiere el contenido necesario para completarlas. Formato: tabla con columnas Sección | Estado | Observaciones.\"\n\nRecuerda: Gemini te ayuda a preparar borradores y análisis, pero toda documentación regulatoria debe ser revisada y aprobada por personal cualificado.\n\n\nDEPARTAMENTOS DE GESTIÓN\nRRHH, Finanzas, Legal, IT\n\nPrompts específicos por área:\n\nRRHH:\n\"Redacta una oferta de empleo para un técnico de Registros Farmacéuticos con 3 años de experiencia. Incluye requisitos, responsabilidades y competencias valoradas. Tono profesional pero cercano.\"\n\nFinanzas:\n\"Tengo una hoja de cálculo en Google Sheets con una fórmula que da error de referencia circular. La fórmula es [pegar fórmula]. Explica por qué ocurre el error y propón una solución alternativa que consiga el mismo resultado.\"\n\nLegal:\n\"Resume este contrato de confidencialidad en 10 puntos clave. Destaca las cláusulas de duración, penalizaciones y excepciones.\"\n\nIT:\n\"Analiza este log de errores del servidor [pegar datos]. Identifica patrones recurrentes y sugiere soluciones ordenadas por prioridad.\"",
      },
      {
        type: "text",
        title: "La Fórmula I-C-D-S para Prompts Efectivos",
        body: "Investigadores de la Universidad de Stanford han demostrado que los prompts estructurados generan respuestas hasta un 40% más precisas. La fórmula I-C-D-S te da esa estructura:\n\nI — Instrucción: El verbo que define la acción.\nEjemplos: \"Redacta\", \"Resume\", \"Extrae\", \"Analiza\", \"Compara\"\n\nC — Contexto: Quién eres, para quién es, en qué situación.\nEjemplo: \"Soy responsable de calidad en una farmacéutica. Esto es para una auditoría interna.\"\n\nD — Datos: La información que Gemini necesita para trabajar.\nEjemplo: \"Adjunto el PDF del informe trimestral\" o \"Aquí está el hilo de correos sobre el proyecto\"\n\nS — Salida/Estilo: Cómo quieres el resultado.\nEjemplos: \"En formato tabla\", \"Con tono formal\", \"Máximo 200 palabras\", \"En 5 puntos clave\"\n\nSin la S, Gemini elige el formato por ti (y no siempre acierta).",
      },
      {
        type: "example",
        title: "Ejemplo práctico: Fórmula I-C-D-S aplicada",
        body: "Imagina que necesitas preparar un informe para dirección:\n\nI — Instrucción: \"Resume este informe trimestral\"\nC — Contexto: \"para presentar al comité de dirección de Meiji\"\nD — Datos: \"basándote en los datos de ventas del Q3 adjuntos\"\nS — Salida: \"en 5 puntos clave con formato ejecutivo y datos numéricos destacados\"\n\nPrompt completo:\n\"Resume este informe trimestral de ventas del Q3 para presentar al comité de dirección de Meiji. Extrae los 5 puntos clave en formato ejecutivo con datos numéricos destacados y tendencias respecto al trimestre anterior.\"\n\nEste prompt funciona porque cada componente guía a Gemini hacia una respuesta precisa, relevante y en el formato exacto que necesitas.",
      },
      {
        type: "text",
        title: "Referencias Bibliográficas",
        body: "Este módulo está basado en las siguientes fuentes verificadas:\n\nGoogle Cloud Whitepaper:\n\"Privacy and Security in the AI Era\" — Documentación oficial sobre el tratamiento de datos en Gemini Enterprise.\n\nStanford University:\n\"Generative AI: A Guide for Professionals\" — Investigación sobre prompts estructurados y mejora de productividad con IA generativa.\n\nEuropean Medicines Agency (EMA):\n\"Reflection paper on the use of AI in the medicinal product lifecycle\" — Marco regulatorio para el uso de IA en la industria farmacéutica.\n\nForrester Research:\nEstudios de impacto de la IA integrada en el puesto de trabajo (dato: ahorro de hasta 7h/semana).\n\nIQVIA:\nInforme sobre adopción de IA en farmacovigilancia (reducción del 50% en tiempo de triaje).",
      },
      {
        type: "text",
        title: "Cierre del Módulo 1",
        body: "Has completado el primer módulo de formación. Ahora conoces:\n\n- Qué es Gemini y por qué es diferente (multimodalidad nativa)\n- Las garantías de seguridad y privacidad en Meiji\n- Cómo acceder: chat directo, panel lateral y extensiones\n- Aplicaciones prácticas para tu departamento\n- La fórmula I-C-D-S para escribir prompts efectivos\n\nRecuerda: La IA potencia tu trabajo, pero tu experiencia y criterio profesional siguen siendo imprescindibles. Gemini es tu copiloto, no tu sustituto.\n\nA continuación, pon a prueba lo aprendido con el quiz final del módulo.",
      },
    ],
    questions: [
      {
        id: "it-1",
        question: "¿Dónde está integrada Gemini directamente?",
        options: [
          "En Microsoft Office (Word, Excel, PowerPoint)",
          "En Google Workspace (Gmail, Docs, Sheets, Slides)",
          "Solo en el navegador Chrome",
          "En aplicaciones de escritorio independientes",
        ],
        correctIndex: 1,
        explanation: "Gemini está integrada directamente en las herramientas de Google Workspace: Gmail, Google Docs, Sheets y Slides.",
      },
      {
        id: "it-2",
        question: "¿Qué significa que Gemini sea 'multimodal'?",
        options: [
          "Que tiene varios modos de suscripción",
          "Que solo funciona con texto en varios idiomas",
          "Que procesa texto, imágenes, audio y vídeo simultáneamente",
          "Que puede instalarse en múltiples dispositivos",
        ],
        correctIndex: 2,
        explanation: "Multimodal significa que Gemini puede procesar y generar contenido en texto, imágenes, audio y vídeo de forma nativa e integrada.",
      },
      {
        id: "it-3",
        question: "¿Se usan tus datos corporativos para entrenar modelos públicos de IA?",
        options: [
          "Sí, todos los datos se usan para mejorar la IA",
          "Solo los datos no confidenciales",
          "No, los datos se quedan dentro del entorno corporativo",
          "Depende de la configuración del administrador",
        ],
        correctIndex: 2,
        explanation: "Con Gemini en Google Workspace, los datos corporativos NO se usan para entrenar modelos públicos. Se mantienen dentro del entorno corporativo cifrados.",
      },
      {
        id: "it-4",
        question: "¿Qué debes hacer siempre al usar contenido generado por IA?",
        options: [
          "Compartirlo directamente sin cambios",
          "Revisarlo y validarlo antes de usarlo",
          "Borrarlo y escribirlo tú mismo",
          "Pedir una segunda opinión a otra IA",
        ],
        correctIndex: 1,
        explanation: "La IA puede cometer errores. Siempre debes revisar y validar el contenido generado antes de usarlo o compartirlo.",
      },
      {
        id: "it-5",
        question: "¿Para qué sirve el símbolo @ en el chat de Gemini?",
        options: [
          "Para mencionar a otros usuarios",
          "Para insertar emojis",
          "Para conectar con Gmail, Drive y otras apps de Workspace",
          "Para cambiar el idioma de la respuesta",
        ],
        correctIndex: 2,
        explanation: "El símbolo @ en Gemini permite conectar con extensiones como @Gmail o @Drive para buscar información en tus aplicaciones de Workspace.",
      },
      {
        id: "it-6",
        question: "¿Qué representa la 'S' en la fórmula I-C-D-S?",
        options: [
          "Seguridad",
          "Sistema",
          "Salida/Estilo",
          "Síntesis",
        ],
        correctIndex: 2,
        explanation: "En la fórmula I-C-D-S, la S significa Salida/Estilo: el formato y tono deseado para la respuesta de la IA.",
      },
      {
        id: "it-7",
        question: "¿Qué ventaja tiene Gemini sobre herramientas de IA externas en tu empresa?",
        options: [
          "Es más barata",
          "Tiene más idiomas disponibles",
          "Accede directamente a tus archivos de Google Workspace",
          "Genera imágenes de mayor calidad",
        ],
        correctIndex: 2,
        explanation: "La principal ventaja de Gemini es su integración nativa con Google Workspace, lo que permite acceder directamente a tus documentos, emails y archivos sin salir de las herramientas habituales.",
      },
      {
        id: "it-8",
        question: "¿Cuánto tiempo puede ahorrar la IA integrada según Forrester Research?",
        options: [
          "Hasta 2 horas semanales",
          "Hasta 7 horas semanales",
          "Hasta 15 horas semanales",
          "No hay estudios al respecto",
        ],
        correctIndex: 1,
        explanation: "Según Forrester Research, la IA integrada en las herramientas de trabajo puede ahorrar hasta 7 horas semanales en tareas de redacción y análisis.",
      },
    ],
  },

  // ── MÓDULO 2: Entender qué es la IA ──
  {
    id: "what-is-ai",
    title: "Qué es la IA (rápido y práctico)",
    description: "Entiende qué puede y qué no puede hacer la IA",
    icon: "2",
    completionPoints: 20,
    content: [
      {
        type: "text",
        title: "La IA en 30 segundos",
        body: "La IA generativa (como ChatGPT y Gemini) puede entender texto, generar respuestas, resumir, traducir, crear borradores y ayudarte a pensar. NO es un buscador, NO siempre tiene razón, y NO reemplaza tu criterio profesional.",
      },
      {
        type: "example",
        title: "Lo que SÍ hace bien",
        body: "- Resumir documentos largos\n- Redactar borradores de emails\n- Generar ideas y opciones\n- Explicar conceptos complejos\n- Traducir textos\n- Estructurar información",
      },
      {
        type: "example",
        title: "Lo que NO hace bien",
        body: "- Datos en tiempo real (sin conexión a internet)\n- Cálculos matemáticos complejos\n- Información 100% fiable siempre\n- Decisiones que requieren juicio humano\n- Acceder a sistemas internos de la empresa",
      },
    ],
    questions: [
      {
        id: "ai-1",
        question: "¿Puede ChatGPT acceder a datos en tiempo real de internet?",
        options: ["Sí, siempre", "No, nunca", "Depende de la versión", "Solo con Gemini"],
        correctIndex: 2,
        explanation: "ChatGPT Plus con navegación web sí puede, pero la versión gratuita tiene fecha de corte.",
      },
      {
        id: "ai-2",
        question: "¿La IA reemplaza tu criterio profesional?",
        options: ["Sí", "No, es una herramienta de apoyo", "Solo en tareas simples", "Depende del departamento"],
        correctIndex: 1,
        explanation: "La IA es un asistente. Siempre debes revisar y aplicar tu juicio profesional.",
      },
    ],
  },

  // ── MÓDULO 3: Casos de uso por departamento ──
  {
    id: "real-uses",
    title: "Usos reales en tu trabajo",
    description: "Casos prácticos adaptados a tu departamento",
    icon: "3",
    completionPoints: 20,
    content: [
      {
        type: "text",
        title: "La IA en cada departamento",
        body: "Cada departamento puede beneficiarse de la IA de forma diferente. Aquí tienes ejemplos reales que puedes aplicar hoy mismo.",
      },
      {
        type: "example",
        title: "Administración",
        body: "- Resumir actas de reuniones\n- Redactar emails formales\n- Organizar datos de hojas de cálculo\n- Crear plantillas de documentos",
      },
      {
        type: "example",
        title: "Comercial",
        body: "- Preparar propuestas comerciales\n- Emails de seguimiento a clientes\n- Analizar datos de ventas\n- Ideas para presentaciones",
      },
      {
        type: "example",
        title: "Marketing",
        body: "- Copywriting para campañas\n- Ideas de contenido para RRSS\n- Análisis de competencia\n- Brainstorming de estrategias",
      },
      {
        type: "example",
        title: "RRHH",
        body: "- Redactar ofertas de empleo\n- Preparar guiones de entrevista\n- Comunicaciones internas\n- Encuestas de satisfacción",
      },
      {
        type: "example",
        title: "Operaciones",
        body: "- Documentar procesos\n- Analizar incidencias\n- Comunicación con proveedores\n- Crear guías y manuales",
      },
      {
        type: "example",
        title: "Dirección",
        body: "- Resúmenes ejecutivos\n- Preparar reuniones de equipo\n- Análisis estratégico\n- Comunicaciones clave",
      },
    ],
    questions: [
      {
        id: "ru-1",
        question: "¿Para qué usaría Marketing la IA?",
        options: [
          "Solo para emails",
          "Copywriting, ideas de contenido y análisis",
          "No le sirve",
          "Solo para traducir",
        ],
        correctIndex: 1,
        explanation: "Marketing puede usar IA para copywriting, ideación, análisis de competencia y mucho más.",
      },
      {
        id: "ru-2",
        question: "¿Qué departamento podría usar IA para documentar procesos?",
        options: ["Solo Dirección", "Operaciones", "Solo RRHH", "Ninguno"],
        correctIndex: 1,
        explanation: "Operaciones puede usar IA para documentar procesos, crear guías y analizar incidencias.",
      },
      {
        id: "ru-3",
        question: "¿La IA puede ayudar a preparar entrevistas de trabajo?",
        options: ["No", "Sí, generando guiones y preguntas", "Solo si es ChatGPT", "Solo en inglés"],
        correctIndex: 1,
        explanation: "RRHH puede usar IA para preparar guiones de entrevista, generar preguntas relevantes, etc.",
      },
    ],
  },

  // ── MÓDULO 4: Escribir buenos prompts ──
  {
    id: "prompts",
    title: "Cómo escribir prompts efectivos",
    description: "La fórmula: Contexto + Tarea + Formato + Tono",
    icon: "4",
    completionPoints: 20,
    content: [
      {
        type: "text",
        title: "La fórmula del prompt perfecto",
        body: "Un buen prompt tiene 4 elementos:\n\nCONTEXTO: Quién eres y la situación\nTAREA: Qué quieres que haga\nFORMATO: Cómo quieres el resultado\nTONO: Qué estilo debe tener",
      },
      {
        type: "comparison",
        title: "Prompt malo vs bueno",
        body: "Compara estos dos prompts:",
        items: [
          { label: "Malo", value: '"Escríbeme un email"' },
          {
            label: "✓ Bueno",
            value:
              '"Soy responsable comercial. Escribe un email de seguimiento a un cliente que pidió presupuesto hace 1 semana. Tono profesional pero cercano. Máximo 150 palabras."',
          },
        ],
      },
      {
        type: "tip",
        title: "Trucos pro",
        body: "Pide que actúe como un rol: \"Actúa como experto en marketing digital\"\nSé específico con el formato: \"Haz una lista de 5 puntos\"\nItera: Si no te gusta, pide cambios\nDa ejemplos de lo que quieres",
      },
    ],
    questions: [
      {
        id: "p-1",
        question: "¿Cuáles son los 4 elementos de un buen prompt?",
        options: [
          "Quién, Qué, Cuándo, Dónde",
          "Contexto, Tarea, Formato, Tono",
          "Pregunta, Respuesta, Revisión, Envío",
          "Inicio, Desarrollo, Clímax, Final",
        ],
        correctIndex: 1,
        explanation: "La fórmula es: Contexto + Tarea + Formato + Tono",
      },
      {
        id: "p-2",
        question: "¿Qué prompt es mejor?",
        options: [
          '"Haz un resumen"',
          '"Resume este informe de ventas Q3 en 5 bullets, tono ejecutivo"',
          '"Necesito un resumen por favor"',
          '"Resumen corto"',
        ],
        correctIndex: 1,
        explanation: "Es específico en contexto (informe Q3), formato (5 bullets) y tono (ejecutivo).",
      },
      {
        id: "p-3",
        question: "¿Qué haces si la respuesta de la IA no te convence?",
        options: ["Te rindes", "Iteras pidiendo cambios específicos", "Cambias de herramienta", "Empiezas de cero"],
        correctIndex: 1,
        explanation: "La iteración es clave. Pide cambios específicos sobre lo que ya generó.",
      },
    ],
  },

  // ── MÓDULO 5: Seguridad y buenas prácticas ──
  {
    id: "best-practices",
    title: "Buenas prácticas y seguridad",
    description: "Cómo usar la IA de forma segura y eficiente",
    icon: "5",
    completionPoints: 20,
    content: [
      {
        type: "text",
        title: "Seguridad ante todo",
        body: "NUNCA compartas datos confidenciales de clientes en ChatGPT o Gemini\nNo subas documentos con información sensible\nNo compartas contraseñas o datos bancarios\nRevisa siempre las respuestas antes de usarlas",
      },
      {
        type: "tip",
        title: "Errores comunes a evitar",
        body: "- Confiar ciegamente en la respuesta\n- No revisar antes de enviar\n- Compartir datos confidenciales\n- Usar prompts genéricos\n- No iterar cuando el resultado no es bueno",
      },
      {
        type: "example",
        title: "Buenas prácticas",
        body: "- Siempre revisa y edita las respuestas\n- Usa la IA como punto de partida, no como producto final\n- Anonimiza datos antes de compartirlos\n- Itera y refina los prompts\n- Aprende de cada interacción",
      },
    ],
    questions: [
      {
        id: "bp-1",
        question: "¿Puedes compartir datos de clientes en ChatGPT?",
        options: ["Sí, es seguro", "No, nunca datos confidenciales", "Solo si es urgente", "Solo en Gemini"],
        correctIndex: 1,
        explanation: "Nunca compartas datos confidenciales de clientes en herramientas de IA externas.",
      },
      {
        id: "bp-2",
        question: "¿Debes enviar directamente lo que genera la IA sin revisar?",
        options: [
          "Sí, para ahorrar tiempo",
          "No, siempre revisa y edita",
          "Solo si es un email corto",
          "Depende del departamento",
        ],
        correctIndex: 1,
        explanation: "Siempre debes revisar y editar las respuestas de la IA antes de usarlas.",
      },
    ],
  },

  // ── MÓDULO 6: Caso práctico completo ──
  {
    id: "case-study",
    title: "Caso práctico: Cliente enfadado",
    description: "Resuelve un escenario real paso a paso",
    icon: "6",
    completionPoints: 50, // Más puntos porque es el módulo final
    content: [
      {
        type: "text",
        title: "El escenario",
        body: "Un cliente importante ha escrito un email muy enfadado porque su pedido llegó con retraso y además incompleto. Tu jefe te pide que respondas de forma profesional, empática y que ofrezcas una solución. Tienes 30 minutos.",
      },
      {
        type: "tip",
        title: "Paso 1: Elige tu herramienta",
        body: "Para redactar una respuesta empática y profesional, tanto ChatGPT como Gemini funcionan bien. Si el historial del cliente está en Gmail, Gemini puede tener ventaja.",
      },
      {
        type: "example",
        title: "Paso 2: Escribe el prompt",
        body: '"Soy responsable de atención al cliente. Un cliente importante está enfadado porque su pedido llegó tarde e incompleto. Necesito redactar un email de respuesta que sea:\n- Empático y comprensivo\n- Profesional\n- Que ofrezca una solución concreta\n- Máximo 200 palabras\n- Tono: cercano pero formal"',
      },
      {
        type: "tip",
        title: "Paso 3: Revisa y personaliza",
        body: "- Lee la respuesta completa\n- Añade detalles específicos del cliente\n- Ajusta el tono a tu estilo\n- Verifica que la solución es viable\n- Envía con confianza",
      },
    ],
    questions: [
      {
        id: "cs-1",
        question: "El cliente está furioso. ¿Cuál es el mejor prompt?",
        options: [
          '"Escribe un email al cliente"',
          '"Responde al cliente enfadado de forma empática, profesional, con solución concreta, max 200 palabras, tono cercano pero formal"',
          '"Dile al cliente que se calme"',
          '"Traduce este email al inglés"',
        ],
        correctIndex: 1,
        explanation: "Un prompt específico con contexto, tarea, formato y tono genera la mejor respuesta.",
      },
      {
        id: "cs-2",
        question: "Después de que la IA genere la respuesta, ¿qué haces?",
        options: [
          "La envías directamente",
          "La revisas, personalizas y verificas la solución",
          "La borras y escribes tú",
          "Pides otra versión sin leerla",
        ],
        correctIndex: 1,
        explanation: "Siempre debes revisar, personalizar con datos reales y verificar antes de enviar.",
      },
      {
        id: "cs-3",
        question: "Si el historial del cliente está en Gmail, ¿qué herramienta tiene ventaja?",
        options: ["ChatGPT", "Gemini", "Ninguna", "Word"],
        correctIndex: 1,
        explanation: "Gemini se integra con Gmail y puede acceder al contexto del historial de emails.",
      },
    ],
  },
];

/** Retos semanales — actividades prácticas con puntos extra */
export const weeklyChallenges: WeeklyChallenge[] = [
  // Semana 1
  {
    id: "wc-1",
    title: "Resumen Express",
    description: "Resume una reunión o documento largo usando ChatGPT. Comparte el resultado con tu equipo.",
    points: 30,
    week: 1,
    tool: "ChatGPT",
  },
  {
    id: "wc-2",
    title: "Email Perfecto",
    description: "Redacta un email profesional con Gemini y envíalo. Bonus si usas la integración con Gmail.",
    points: 30,
    week: 1,
    tool: "Gemini",
  },
  // Semana 2
  {
    id: "wc-3",
    title: "Informe Relámpago",
    description: "Crea un informe de 1 página sobre un tema de tu departamento usando IA.",
    points: 40,
    week: 2,
    tool: "Ambos",
  },
  {
    id: "wc-4",
    title: "Prompt Master",
    description: "Escribe 3 prompts usando la fórmula Contexto+Tarea+Formato+Tono. Compártelos en el canal del equipo.",
    points: 30,
    week: 2,
    tool: "Ambos",
  },
  // Semana 3
  {
    id: "wc-5",
    title: "Automatización",
    description: "Usa Gemini para automatizar una tarea repetitiva en Google Workspace.",
    points: 50,
    week: 3,
    tool: "Gemini",
  },
  {
    id: "wc-6",
    title: "Presentación IA",
    description: "Prepara una presentación de 5 slides sobre un tema de tu área usando IA como asistente.",
    points: 40,
    week: 3,
    tool: "Ambos",
  },
];
