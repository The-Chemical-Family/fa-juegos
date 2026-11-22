# Juego de preguntas y bienestar

*   **Autor:** Juan Peist
*   **Estado:** Propuesto, revisado, implementado en las fases 1–6 y con las tres puertas cerradas (G1, G2 y G3). Listo para publicar.
*   **Fecha:** 2026-11-21
*   **Convención:** los títulos de nivel 2 y la etiqueta «CUJ n» van en inglés porque son los del estándar de especificación; los títulos de nivel 3 y todo el contenido van en castellano.

--------------------------------------------------------------------------------

## Overview

Es un juego de navegador, para móvil y ordenador, en el que la persona que juega se enfrenta a tres villanos respondiendo preguntas sobre políticas públicas. Cada respuesta quita energía al villano o a quien juega, según el efecto asignado a la opción. Al terminar cada batalla aparece un mensaje breve que relaciona las preguntas respondidas con una propuesta concreta.

El público son personas que viven de su trabajo: asalariadas, autónomas y pequeños comerciantes. No hace falta conocer el programa ni tener cuenta. Se entra por un enlace, se juega una partida de unos cinco minutos y no se envía ningún dato a ningún servidor.

El juego no pretende demostrar nada ni medir conocimientos. Su función es que alguien que no leería un programa de gobierno se enfrente a decisiones concretas de vivienda, salario, sanidad o alimentación, y salga con el enlace a la propuesta completa a mano.

## The Problem

Los programas de gobierno se escriben como listas de medidas generales: crear vivienda pública, reforzar la atención primaria, subir el salario mínimo. Para quien trabaja y llega justo a fin de mes, esas frases no se conectan con su situación. El diseño parte de que, sin ese puente, las decisiones sobre vivienda, salario o sanidad quedan fuera de la conversación de quien trabaja.

El juego convierte cada tema en una situación cotidiana con una decisión concreta: un joven que no puede emanciparse, una persona autónoma con ingresos irregulares, una lista de espera que crece. Se elige entre cinco respuestas y la energía cambia de inmediato; el mapa se actualiza al cerrar la batalla. El mensaje posterior es el que aporta el contenido: nombra la propuesta y plantea una pregunta abierta sobre ella.

Dos límites del material condicionan el diseño. El banco de 40 preguntas está sin revisar: hay enunciados incompletos, huecos con el nombre del villano y alguna pregunta que mezcla dos temas. Siete de ellas acaban fuera porque el programa no dice nada sobre su tema. Y el documento de propuestas describe medidas y objetivos, no resultados demostrados. El juego presenta propuestas, no resultados.

## Goals

*   Cualquier persona con un navegador de la matriz de compatibilidad completa una partida entera en un móvil, desde el enlace hasta la pantalla final, sin instalar nada ni crear una cuenta.
*   Cada batalla dura dos minutos como máximo, y esa duración es un valor de configuración que se puede cambiar tras las pruebas sin tocar la lógica del juego.
*   Cada batalla termina con un mensaje de reflexión construido a partir de las preguntas respondidas en ella. El único texto fijo es el del empate sin respuestas.
*   Cada símbolo del mapa lleva una etiqueta de texto con su estado, y cada barra de energía muestra su valor en texto.
*   El contenido editable de las preguntas vive en un archivo de datos separado del código. Los textos de villanos, la regla del juego, las frases de resultado y el texto del empate viven en un segundo archivo de datos.
*   El diseño fija estas reglas: la opción elegida mantiene su efecto aunque cambie de posición; solo la victoria desbloquea al villano siguiente; el empate no altera el mapa; un «perfect» exige exactamente tres respuestas, todas de efecto 2.

## Non-Goals

*   Sin cuentas, sin inicio de sesión ni datos personales.
*   Sin servidor y sin base de datos. La analítica del sitio contenedor no usa cookies. El progreso se guarda en el navegador.
*   Sin tablas de clasificación, sin multijugador y sin comparación entre jugadores.
*   Sin niveles de dificultad ni modos con otro límite de tiempo.
*   Sin puntuación numérica visible: no hay marcador, ni contador de aciertos, ni clasificación. Los valores de las barras de energía y el nivel 0–8 de cada símbolo no son puntuación.
*   Sin traducciones ni otros idiomas: el contenido está en castellano, con textos catalanes en el documento de propuestas que no se usan en pantalla.
*   Sin aplicación nativa ni tiendas de aplicaciones.

## Open Questions

*   **Sonidos:** el borrador pide un sonido por tipo de respuesta y no hay archivos. Falta decidir si se graban, se compran o se sustituyen por una vibración corta. El diseño deja los cuatro marcadores y funciona sin ellos.
*   **Autoría de las fuentes:** no está verificado quién escribió el documento de propuestas ni si sigue vigente. **Lo cierra quien publica, no el código:** G2 garantiza que cada reflexión cita una medida que está en el documento, no que ese documento siga siendo la posición vigente del partido.
*   **Repetición de propuestas — acotado.** Los 33 mensajes citan 32 medidas distintas: solo la 33 y la 38 comparten la misma, porque el programa tiene una única medida sobre el modelo territorial. El jugador puede ver ese argumento dos veces en una partida larga, y se acepta por la misma razón que el desequilibrio de los símbolos.
*   **Nombre del villano dentro de la pregunta — resuelto.** Las dos preguntas del piloto que nombraban al villano se reescribieron sin nombre propio; el criterio C lo comprueba ahora en las 33 del banco.

## Critical User Journeys (CUJs)

### CUJ 1: Primera partida completa

*   **Given**: alguien abre el enlace en un móvil y no hay progreso guardado.
*   **When**: lee la introducción, pulsa «Empezar», elige al primer villano, responde preguntas hasta ganar las tres batallas y llega al vídeo final.
*   **Then**: cada batalla terminó con un mensaje de reflexión propio; el segundo villano se desbloqueó solo después de ganar el primero; cambiaron los símbolos de los temas respondidos, según el reparto proporcional; al recargar en cualquier momento del recorrido, la partida siguió disponible.

### CUJ 2: Derrota y reintento

*   **Given**: una persona ha desbloqueado el segundo villano y pierde la batalla cuando su energía llega a cero.
*   **When**: vuelve al mapa y pulsa «Reintentar» en ese villano.
*   **Then**: el mensaje de derrota nombró una propuesta de las preguntas de esa batalla; el tercer villano siguió bloqueado; el reparto de −2 se aplicó a los símbolos de los temas respondidos, sin bajar de cero; la nueva batalla no repitió ninguna de las preguntas aún disponibles en la bolsa y empezó con 5/5 de energía por lado.

### CUJ 3: Empate sin respuestas

*   **Given**: alguien entra en una batalla y no responde nada durante dos minutos.
*   **When**: se agota el tiempo con las dos barras a 5.
*   **Then**: aparece el mensaje del empate sin respuestas; el mapa queda igual, sin símbolos cambiados y sin desbloquear al siguiente villano.

### CUJ 4: Corrección de una pregunta

*   **Given**: alguien detecta una errata o un enunciado incompleto en una pregunta publicada.
*   **When**: edita el archivo de contenido y ejecuta el guion de publicación solo de contenido.
*   **Then**: el validador acepta el archivo si la forma es correcta, o señala el identificador y el campo con el problema; la aplicación se reconstruye y se publica sin tocar la lógica.

## Technical Plan (Architecture)

### Forma general

Una aplicación de una sola página construida con Vite y Svelte, con TypeScript en la lógica. No hay servidor, ni base de datos, ni llamadas a servicios de terceros. La compilación produce archivos estáticos que se publican en el alojamiento elegido en la puerta G3. La compilación se hace con `base: './'`, de modo que el mismo `dist/` funciona igual en la raíz de un dominio y en una subcarpeta (por ejemplo, un sitio de proyecto de GitHub Pages), y cualquier hosting estático sirve para publicarlo.

Las reglas del juego viven en funciones puras, sin dependencia de Svelte ni del navegador. Los componentes de Svelte solo presentan el estado y envían acciones. Esa separación permite probar energía, reparto de símbolos, selección de preguntas, mensaje y detección de «perfect» sin abrir un navegador.

El contenido vive en dos archivos de datos, `src/lib/contenido/preguntas.json` y `src/lib/contenido/textos.json`, y se valida al arrancar. La compilación falla y la publicación se detiene si el validador encuentra errores; en ejecución, las preguntas inválidas se descartan y solo se bloquea el juego si no queda ninguna válida.

```text
  preguntas.json · textos.json
              │
              ▼
         validar.ts ──errores──► fallo de compilación (CI)
              │                  └► en ejecución: descartar inválidas
              ▼
   ┌──────────────────────────┐
   │  reglas.ts               │  energía · reparto · mensaje · reloj
   │  seleccion.ts            │  bolsa · comodines · historial
   └────────────┬─────────────┘
                ▼
           estado.ts (store) ──► persistencia.ts ──► localStorage
                │
                ▼
   componentes: App · Intro · Mapa · Batalla · Resultado · Final
                · BarraEnergia · SimboloMapa · PantallaError
```

Arranque: `main.ts` importa los dos archivos de contenido, valida ambos y descarta las preguntas inválidas. Si no queda ninguna, monta `PantallaError` con la lista `ErrorContenido[]`. Si queda alguna, monta `App` con el banco superviviente y la bandera de almacenamiento. `PantallaError` recibe solo esa lista y no forma parte del flujo de pantallas del juego: es un estado terminal, no una pantalla a la que se pueda volver.

### Pantallas y estados

```text
  Intro ──(empezar)──► Mapa ──(villano activo)──► Batalla
                        ▲                          │
                        │    victoria / derrota / empate
                        └────── Resultado ◄────────┘
                                   │
                                   └─(tercera victoria)─► Final
                                                           │
                                              ┌────────────┴────────────┐
                                         Compartir              Volver a jugar
                                                          (borra y reinicia)
```

*   **Intro**: cartel sobre fondo naranja con el retrato dibujado de cada villano junto a su nombre, la misión leída de `textos.json`, la regla del juego en su texto literal y la flecha «Empezar». El rótulo del villano alterna de lado en cada fila: retrato a la izquierda, retrato a la derecha, retrato a la izquierda.
*   **Mapa**: el mismo cartel naranja, con el estado del bienestar en una línea de texto, tres retratos dibujados y una flecha lima por villano. El villano activo es el único control de avance: su flecha es un botón cuya etiqueta es «Luchar» y pasa a «Reintentar» si la última batalla terminó sin desbloquear al siguiente. Las dos etiquetas despachan la misma acción. Los villanos ya derrotados y los todavía bloqueados muestran su estado dentro de la flecha, con el retrato apagado, y no son seleccionables. Si el progreso no se puede guardar, aparece un aviso. Si la partida está completa, el mapa no es alcanzable: se abre el final.
*   **Batalla**: retrato del villano junto a las dos barras de energía y el reloj; el globo de la situación y el enunciado en negro, las cinco opciones en lima y el fondo naranja del cartel. El reloj es el único texto que se actualiza sin anunciarse; la energía que se mueve se anuncia por una región activa.
*   **Resultado**: cuadro lima con el retrato del villano al que se acaba de pelear, el desenlace en titular y la propuesta y la pregunta del tema ganador; la vuelta al mapa —o «Ver el final» tras la tercera victoria— es una flecha, igual que en la intro. Tras una victoria el índice del villano activo ya ha avanzado, así que la pantalla deshace ese paso para enseñar al rival que se ha derrotado, no al siguiente.
*   **Final**: vídeo a pantalla completa sobre negro, que arranca con sonido si el navegador lo permite y, si lo bloquea, se reintenta en silencio dejando el botón para activarlo; controles de sonido y de pausa; botones «Compartir» y «Volver a jugar» superpuestos; la línea de crédito sobre el fotograma, tomada de `textos.json`, y los enlaces al documento de preguntas y al de propuestas, desde `fuentePreguntas` y `fuente` respectivamente. Si la reproducción automática falla, aparece un botón de reproducción y los demás controles siguen disponibles. «Compartir» usa `navigator.share` si existe, si no copia al portapapeles, y si tampoco hay portapapeles muestra la dirección en un campo seleccionable; la dirección es el origen más la ruta base, sin parámetros ni fragmento.

Botones por resultado en la pantalla de Resultado:

| Resultado | Botón |
| --- | --- |
| Victoria, derrota o empate antes de la tercera | «Volver al mapa» |
| Tercera victoria | «Ver el final» |

Regla de entrada al abrir o recargar: sin datos guardados se muestra la intro; con la partida completa se muestra el final; en cualquier otro caso, el mapa. La pantalla de batalla nunca se restaura.

### Esquema del contenido

Cada pregunta del archivo JSON tiene esta forma. El orden del arreglo `opciones` es el orden original A–E y no cambia nunca; el mezclado ocurre solo al mostrarlo.

```json
{
  "id": "vivienda-01",
  "temas": ["casa"],
  "comodin": false,
  "situacion": "Situación breve en una o dos líneas",
  "enunciado": "Pregunta que se muestra en el globo",
  "opciones": [
    { "texto": "...", "efecto": 2 },
    { "texto": "...", "efecto": 1 },
    { "texto": "...", "efecto": 0 },
    { "texto": "...", "efecto": -1 },
    { "texto": "...", "efecto": -2 }
  ],
  "reflexion": {
    "propuesta": "Medida concreta del documento de propuestas",
    "pregunta": "Pregunta abierta sobre esa medida"
  }
}
```

*   `efecto` es la consecuencia de elegir esa opción: `2` y `1` quitan energía al villano, `0` no cambia nada, `-1` y `-2` quitan energía a quien juega. Es un número, y no una letra, para que reordenar las opciones no altere la consecuencia.
*   `temas` tiene uno o dos valores de `casa`, `zanahoria`, `hospital` y `moneda`. La correspondencia con los temas de la vida diaria es: `casa` = vivienda, `zanahoria` = alimentación, `hospital` = sanidad, `moneda` = trabajo e ingresos. Una pregunta con dos temas cuenta para ambos.
*   `comodin: true` marca las preguntas sin tema directo; se validan como asociadas a `moneda`, y esa asociación es una convención de puntuación, no un juicio sobre el contenido de la pregunta.
*   `situacion` es opcional. Cuando aparece, se muestra encima del enunciado, dentro del mismo globo.
*   `reflexion` es obligatorio: sin él no hay mensaje que dar al terminar la batalla.

El validador comprueba, para cada entrada: `id` único y no vacío; entre uno y dos temas, todos conocidos; exactamente cinco opciones con textos no vacíos; efectos que, ordenados de mayor a menor, sean `2, 1, 0, -1, -2`; `enunciado` no vacío; las dos partes de `reflexion` no vacías; y, si `comodin` es `true`, que `moneda` esté entre los temas. La implicación va en un solo sentido: `moneda` con `comodin: false` es válido. Una `situacion` vacía se trata como ausente, no como error. Acumula todos los errores antes de detenerse.

El segundo archivo, `src/lib/contenido/textos.json`, tiene esta forma:

```json
{
  "regla": "Regla del juego: las respuestas que favorecen a la clase trabajadora quitan energía al villano; las que la perjudican te la quitan a ti.",
  "mision": "Texto de la misión en la introducción",
  "villanos": [
    { "id": 0, "nombre": "...", "emoji": "...", "textoIntro": "..." },
    { "id": 1, "nombre": "...", "emoji": "...", "textoIntro": "..." },
    { "id": 2, "nombre": "...", "emoji": "...", "textoIntro": "..." }
  ],
  "frases": {
    "victoria": "¡Has ganado!",
    "perfect": "PERFECT!",
    "derrota": "Esta vez has perdido.",
    "empateConRespuestas": "¡Empate!",
    "empateSinRespuestas": "Aquí no ha pasado nada, y eso también juega a favor de los villanos. Si nadie toma partido, ellos campan a sus anchas."
  },
  "credito": "Línea de crédito del vídeo",
  "fuente": "https://…documento de propuestas…",
  "fuentePreguntas": "https://…documento de preguntas…"
}
```

Son cinco frases y no cuatro porque el empate se parte en dos según haya habido respuestas o no. El validador comprueba que hay exactamente tres villanos con `id` correlativo desde 0, `nombre`, `emoji` y `textoIntro` no vacíos; que `regla`, `mision`, `credito`, `fuente` y `fuentePreguntas` no están vacíos; y que existen las cinco claves de `frases`. Los nombres de los villanos y la misión están tomados del documento de preguntas: El Rey del Ladrillo, El Buitre Empresario y La Presidenta del Miedo. El crédito lo redacta quien publica.

Los tipos que comparten los módulos se declaran en `src/lib/tipos.ts`:

```ts
type Pantalla = 'intro' | 'mapa' | 'batalla' | 'resultado' | 'final'
type Tema = 'casa' | 'zanahoria' | 'hospital' | 'moneda'
type Efecto = -2 | -1 | 0 | 1 | 2
type Resultado = 'victoria' | 'perfect' | 'derrota' | 'empate'
type Simbolos = Record<Tema, number>

interface Opcion   { texto: string; efecto: Efecto }
interface Reflexion { propuesta: string; pregunta: string }
interface Pregunta  { id: string; temas: Tema[]; comodin: boolean
                      situacion?: string; enunciado: string
                      opciones: Opcion[]; reflexion: Reflexion }
interface Respuesta { preguntaId: string; temas: Tema[]; efecto: Efecto }
interface ErrorContenido { id: string; campo: string; mensaje: string }

interface Villano { id: 0 | 1 | 2; nombre: string; emoji: string; textoIntro: string }
interface Textos {
  regla: string
  mision: string
  villanos: Villano[]
  frases: Record<'victoria' | 'perfect' | 'derrota'
                 | 'empateConRespuestas' | 'empateSinRespuestas', string>
  credito: string
  fuente: string
  fuentePreguntas: string
}

interface EstadoBatalla {
  pregunta: Pregunta
  ordenOpciones: number[]        // se calcula una vez por pregunta
  respuestas: Respuesta[]
  energiaJugador: number
  energiaVillano: number
  limiteMs: number
  resultado: Resultado | null    // no nulo = batalla cerrada
}

interface Guardado {
  version: 1
  villanoActivo: number
  completada: boolean
  ultimaBatalla: Resultado | null
  simbolos: Simbolos
  historial: string[]
}

interface EstadoPartida extends Guardado {
  pantalla: Pantalla
  batalla: EstadoBatalla | null
  almacenamientoDisponible: boolean
}
```

`derrotados` no se guarda: se deduce de `villanoActivo` como el rango `0 .. villanoActivo − 1`.

### Reglas del juego

`efecto` es una cantidad con signo: positivo quita energía al villano, negativo quita energía a quien juega, y `0` no hace nada.

```text
aplicarRespuesta(estado, efecto):
    si efecto > 0:  energiaVillano = limitar(energiaVillano - efecto, 0, energiaInicial)
    si efecto < 0:  energiaJugador = limitar(energiaJugador + efecto, 0, energiaInicial)

resultado(estado, motivo):
    si energiaJugador == 0                    -> derrota
    si energiaVillano == 0:
        si hay exactamente 3 respuestas y todas tienen efecto 2 -> perfect
        si no                                                    -> victoria
    si motivo == 'tiempo':
        comparar energías                     -> victoria, derrota o empate
```

`motivo` vale `'energia'` o `'tiempo'` y lo aporta quien cierra la batalla, no la función: la energía se deduce del estado, pero que el plazo haya vencido depende del reloj, no de los datos de la batalla.

Las dos barras se mantienen en el rango `0 .. energiaInicial`, aunque el efecto intentara salirse. Una batalla solo puede terminar una vez: la primera condición que se cumple cierra el resultado y las respuestas posteriores se descartan. «Perfect» exige exactamente tres respuestas, y las tres con efecto 2; una victoria por tiempo, o una victoria con más de tres respuestas, nunca es «perfect».

### Trabajo de ejemplo

Tres batallas trazadas sobre el esquema anterior. Sirven de caso de prueba y de comprobación de que la aritmética cierra.

**Victoria con «perfect».** Empiezan las dos barras a 5. Se responde una pregunta de `casa` con efecto 2: villano 3. Otra de `moneda` con efecto 2: villano 1. Otra de `hospital` con efecto 2: villano −1, limitado a 0. Son tres respuestas, todas de efecto 2, así que el resultado es «perfect» y `base` = 4. Con `n = 3` y un tema por pregunta, cada tema pesa 1/3 y su cuota es 1,333. Se trunca a 1 en cada uno, suman 3 y sobra 1 punto. Las tres partes decimales son iguales, así que decide el orden de desempate y el punto va a `casa`. Resultado: casa 4 → 6, moneda 4 → 5, hospital 4 → 5, zanahoria 4 → 4. La suma de los cambios es 4, igual que `base`.

**Derrota con una pregunta de dos temas.** Empiezan las dos barras a 5. Se responde una pregunta de temas `["casa","moneda"]` con efecto −2: jugador 3. Se responde otra de tema `["casa"]` con efecto −2: jugador 1. Se responde otra de tema `["casa"]` con efecto −1: jugador 0, derrota, `base` = −2. Con `n = 3`, `casa` pesa 1/6 + 1/3 + 1/3 = 5/6 y `moneda` pesa 1/6; los pesos suman 1. Cuotas: `casa` −1,667 y `moneda` −0,333. Truncadas hacia cero: −1 y 0, que suman −1, así que sobra −1 punto. El mayor valor absoluto de la parte decimal es el de `casa` (0,667 frente a 0,333), y el punto negativo va a `casa`. Resultado: casa 4 → 2, moneda 4 → 4. La suma de los cambios es −2.

**Empate sin respuestas.** `n = 0`, no hay tema del que repartir y `base` = 0. Los símbolos no cambian. El resultado es empate y se muestra el texto del empate sin respuestas.

### Selección de preguntas

Al empezar una partida se mezcla el banco completo y esa es la bolsa. Cada pregunta nueva se saca de la bolsa al empezar la batalla y después de cada respuesta aceptada, y pasa al historial. El historial es lo único que se guarda; la bolsa se deduce en cada carga como el banco menos el historial, mezclado de nuevo. Consecuencia aceptada: al recargar en mitad de una partida cambia el orden de las preguntas que quedan, porque la batalla se reinicia de todos modos.

La garantía es exactamente esta: no se repite ninguna pregunta mientras la bolsa tenga contenido. Cuando la bolsa queda vacía se vuelve a mezclar el banco entero, incluido lo ya usado, y desde ese momento las repeticiones son posibles. El historial no se reinicia entre batallas ni entre reintentos; solo se borra al empezar una partida nueva.

La regla del comodín se aplica al sacar: si la pregunta extraída es comodín y la batalla actual ya mostró uno, se busca la siguiente no comodín de la bolsa y se intercambian las posiciones. Si no queda ninguna no comodín, se permite el segundo comodín.

### Reparto del cambio en los símbolos

Solo cuentan las preguntas respondidas en la batalla. El peso de cada tema es la suma de las fracciones que aporta cada pregunta que lo incluye, repartida entre sus temas, de modo que los pesos sumen 1 y la suma de los cambios sea exactamente el cambio base.

```text
si n == 0:  no cambia ningún símbolo y se termina

base = perfect ? 4 : victoria ? 2 : derrota ? -2 : 0
peso(tema)  = Σ (1 / |temas(q)|) / n     para cada q respondida que incluye tema
cuota(tema) = base * peso(tema)
entero(tema) = truncar(cuota)            // hacia cero
resto = base - Σ entero
mientras resto != 0:
    candidato = tema con mayor |cuota(tema) - entero(tema)|
    empate -> orden casa, zanahoria, hospital, moneda
    entero(candidato) += signo(resto)
    resto -= signo(resto)
simbolo(tema) = limitar(simbolo(tema) + entero(tema), 0, 8)
```

Dos precisiones que el pseudocódigo resuelve y conviene dejar dichas. El truncado es hacia cero, no hacia abajo, para que una cuota de −1,667 se convierta en −1 y no en −2. Y el reparto del resto usa el valor absoluto de la parte decimal, con signo tomado de `base`, para que el número de puntos repartidos no dependa del signo del cambio.

El límite 0–8 se aplica al final y tiene la última palabra: si un símbolo está a 7 y le tocan +3, sube 1 y la suma de los cambios deja de coincidir con `base`. Es el único caso en que la igualdad no se cumple, y el test lo comprueba explícitamente.

El orden de desempate casa, zanahoria, hospital, moneda sustituye a la elección al azar que proponía `concepts_brief.md`, por decisión confirmada por el autor, para que la misma batalla produzca siempre el mismo mapa y el resultado sea comprobable.

### Mensaje de reflexión

Se construye con las preguntas respondidas, no con las mostradas. Se toma el tema con más respuestas; si hay empate, se usa el orden casa, zanahoria, hospital, moneda.

La propuesta la aporta la última pregunta respondida de ese tema que no sea comodín; si el tema ganador solo tiene comodines, la aporta el último comodín respondido. Los comodines nunca ganan un tema por sí mismos. Si no hubo ninguna respuesta, no hay tema y se muestra solo el texto del empate.

El mensaje tiene tres partes: una frase de resultado, la propuesta de la pregunta elegida y una pregunta abierta.

| Resultado | Frase | Resto del mensaje |
| --- | --- | --- |
| Victoria | «¡Has ganado!» | propuesta + pregunta abierta |
| Perfect | «PERFECT!» | propuesta + pregunta abierta |
| Derrota | «Esta vez has perdido.» | propuesta + pregunta abierta |
| Empate con respuestas | «¡Empate!» | propuesta + pregunta abierta |
| Empate sin respuestas | «Aquí no ha pasado nada, y eso también juega a favor de los villanos. Si nadie toma partido, ellos campan a sus anchas.» | — |

La regla del juego que se muestra en la introducción, literal: «Regla del juego: las respuestas que favorecen a la clase trabajadora quitan energía al villano; las que la perjudican te la quitan a ti.»

### Reloj

Al mostrarse la primera pregunta de la batalla se calcula un instante límite con `calcularLimite(ahora, duracionMs)`. El plazo no se detiene cuando la pestaña queda oculta. Un intervalo refresca el número visible, pero la decisión se toma con `estaVencida(limiteMs, ahora)`, que compara el momento real de la pulsación con el límite y no con el contador: una respuesta cuenta si devuelve `false`. La primera pulsación aceptada de cada pregunta cierra esa pregunta y las siguientes se ignoran. El intervalo vive en `Batalla.svelte`, que es el único punto con acceso al ciclo de vida de la pantalla, y al cumplirse el límite despacha `cerrarBatalla('tiempo')`.

La duración no se lee dentro de `reglas.ts`: entra como parámetro con `duracionBatallaMs` como valor por defecto, para que la prueba pueda variarla sin tocar la configuración.

### Persistencia

Se guarda un único objeto en `localStorage` bajo la clave `juego-bienestar:v1`:

```json
{
  "version": 1,
  "villanoActivo": 0,
  "completada": false,
  "ultimaBatalla": null,
  "simbolos": { "casa": 4, "zanahoria": 4, "hospital": 4, "moneda": 4 },
  "historial": ["vivienda-01", "trabajo-06"]
}
```

`ultimaBatalla` guarda el resultado de la última batalla cerrada y es lo que permite que el botón del villano activo se etiquete «Reintentar». La bolsa y la lista de villanos derrotados no se guardan porque se deducen. Al cargar se descartan los identificadores del historial que ya no existan en el banco, de modo que corregir o retirar una pregunta no rompe una partida en curso. Si la `version` guardada no coincide con la esperada, se descarta el progreso y se empieza de cero. Los campos se validan y se limitan uno a uno, así que un guardado manipulado no puede producir un estado imposible.

Momentos de guardado: después de cada respuesta aceptada se guarda el historial; al cerrar la batalla se guardan además los símbolos, el villano activo y el indicador de partida completa.

`src/lib/persistencia.ts` expone `cargar(): Guardado | null`, `guardar(g: Guardado): void`, `borrar(): void` y `almacenamientoDisponible(): boolean`, y recibe el objeto de almacenamiento como parámetro para poder probar los fallos. Si `localStorage` no está disponible, el juego sigue en memoria y el mapa avisa de que el progreso no se conservará. `src/lib/estado.ts` expone un store de Svelte con las acciones `empezarPartida()`, `entrarBatalla()`, `responder(indiceVisible)`, `cerrarBatalla(motivo)`, `volverAlMapa()`, `verFinal()` y `reiniciar()`. Ninguna recibe el villano ni la opción elegida: el villano activo ya está en el estado y la opción se resuelve con `ordenOpciones[indiceVisible]`, que es el índice que el componente tiene delante. `almacenamientoDisponible` se calcula una vez al arrancar y viaja en el estado, para que el mapa avise sin llamar al almacenamiento en cada render.

«Volver a jugar» borra la clave y devuelve a la introducción.

### Configuración

Todos los valores ajustables están en un solo archivo, `src/lib/config.ts`, y ningún otro archivo los declara como literales:

*   `duracionBatallaMs`: 120000.
*   `energiaInicial`: 5.
*   `escalaMinimo`, `escalaMaximo`, `escalaInicial`: 0, 8 y 4.
*   `cambioPerfect`, `cambioVictoria`, `cambioDerrota`: 4, 2 y −2.
*   `maxComodinesPorBatalla`: 1.
*   `bandasEtiqueta`: los cinco tramos de la escala con su texto, definidos en «Accesibilidad». La misma lista fija la clase de desenfoque del símbolo.
*   `sonidos`: `{ acierto, neutro, fallo, victoria }`, con rutas vacías mientras no existan los archivos.
*   `videoFinal`: la ruta pública del vídeo, construida sobre `import.meta.env.BASE_URL`. Con `base: './'` resuelve a `./video/video_meme.mp4`, relativa a la página.

### Paleta y tipografía

Todo el juego es un cartel: el mismo naranja de fondo, los mismos bloques de lima y la misma Impact en todas las pantallas. La paleta y la tipografía se declaran una sola vez como variables en `:root` dentro de `src/app.css`; ningún componente escribe un color literal.

| Variable | Color | Papel |
| --- | --- | --- |
| `--naranja` | `#F03900` naranja bermellón | fondo de las pantallas de cartel: intro, mapa, batalla, resultado y error |
| `--lima` | `#D2FF42` verde lima | relleno de lo que se pulsa, rótulos de villano y cuadros de contenido |
| `--lima-claro` | `#E4FF7A` | hover de los elementos lima |
| `--negro` | `#070606` | titulares sobre el naranja, texto sobre el lima, cuadro de la pregunta y pantalla final |
| `--blanco` | `#FFFFFF` | texto sobre el negro: pregunta, opciones del vídeo y crédito |

Bajo esas cinco, y en el mismo `:root`, la hoja declara las veladuras y la tipografía: `--velo`, `--velo-fuerte` y `--velo-tenue` para las pastillas del vídeo, su degradado y la pista de las barras de energía, y `--display`, que apila la fuente `Impact Web` con las copias del sistema. Impact viene incluida en Windows y macOS, pero no en Android ni en Linux, así que el juego sirve los dos formatos desde `src/assets/` y la hoja los declara con `@font-face`; sin ese respaldo, el cartel cambiaría de forma en la mitad de los móviles.

Los papeles de los colores son fijos y no se mezclan: sobre el naranja solo va negro (titulares y etiquetas) o blanco (texto sobre el cuadro negro de la pregunta); sobre el lima va negro (cuerpo de texto, opciones) o naranja (rótulos de titular y botones); y el negro de la pantalla final solo lleva blanco y lima. El texto del cartel va siempre en mayúsculas en la tipografía de titular, y el cuerpo de lectura —situaciones, enunciados, opciones y propuestas— queda en la tipografía del sistema con peso 500 declarado en `body`, para que las frases largas se lean sin esfuerzo.

**Contraste.** La paleta se elige por identidad y por decisión del autor, por delante del criterio de contraste. Las cifras medidas son: negro sobre naranja **5,1:1**, que cumple AA para texto normal; blanco sobre negro 20,2:1; negro sobre lima 17,5:1; blanco sobre el negro de la pregunta 20,2:1; y naranja sobre lima **3,4:1**, que solo alcanza el 3:1 de los componentes de interfaz. En consecuencia, el naranja sobre lima se reserva para los titulares y los botones del cartel —el mismo uso que el cartel de origen— y nunca para párrafos: el cuerpo va en negro sobre lima. Queda registrado como desviación aceptada y consciente, como la del blanco sobre naranja del diseño anterior, y no como un descuido.

### Accesibilidad

Las barras de energía llevan su valor en texto y el nombre de quien las tiene. Cada símbolo del mapa lleva una etiqueta de texto construida con estos cinco tramos de la escala 0–8:

| Valor | Etiqueta |
| --- | --- |
| 0–1 | «muy deteriorado» |
| 2–3 | «deteriorado» |
| 4 | «sin cambios» |
| 5–6 | «mejorado» |
| 7–8 | «muy mejorado» |

Los emoji son decorativos para los lectores de pantalla (`aria-hidden`) y nunca son la única forma de identificar un elemento. Las opciones son botones reales, con foco visible y orden de tabulación igual al visible. La pérdida de energía, el cierre de la batalla y el desbloqueo del villano siguiente se anuncian por una región activa (`aria-live`). El texto y los botones mantienen un contraste mínimo de 4,5:1 y 3:1 respectivamente, con la excepción declarada del naranja sobre el lima de los titulares y de los botones del cartel, que queda en 3,4:1 (véase «Paleta y tipografía»). Las transiciones se reducen si el sistema pide menos movimiento, y el desenfoque se reduce si el sistema pide más contraste; en ambos casos la etiqueta de texto sigue siendo la señal principal.

La línea de crédito y su enlace van sobre el fotograma del vídeo, cuyo brillo cambia a lo largo de la reproducción, así que cada uno lleva su propio fondo negro translúcido en lugar de confiar en la zona oscura del degradado. Sobre ese fondo, el blanco del crédito queda en 10,8:1 y el lima del enlace en 8,3:1 en el peor caso, con el fotograma completamente blanco debajo.

### Gráficos y activos

Casi todo el gráfico se resuelve dentro del propio navegador, con tres dibujos externos y una fuente:

*   **Retratos** de los tres villanos en `static/villanos/`: `el_rey_del_ladrillo.png`, `el_empresario_buitre.png` y `la_presidenta_del_miedo.png`, PNG con fondo transparente. La intro, el mapa, la batalla y el resultado los cargan con `retratoDeVillano(id)` de `src/lib/retratos.ts`, que construye la ruta sobre `import.meta.env.BASE_URL`, y `juego.json` los declara en `assets` para que la verificación compruebe que llegan a `dist/`. Son decorativos y llevan `alt` vacío: el nombre y el estado van siempre en texto al lado.
*   **Emoji** para los cuatro símbolos del bienestar: casa, alimentación, sanidad y salario. Se acompañan siempre de su etiqueta de texto.
*   **HTML y CSS** para lo que no tiene imagen equivalente: barras de energía, flechas del cartel, cuadro negro de la pregunta, retratos apagados de los villanos derrotados o bloqueados y superposición de los botones sobre el vídeo. La flecha del cartel se dibuja con un pseudoelemento y `clip-path`, de modo que el foco del teclado rodea el botón entero sin quedar recortado. El desenfoque de los símbolos se consigue con una propiedad de filtro sobre el emoji, graduada en cinco clases, `desenfoque-0` a `desenfoque-4`. La clase se deriva de la misma tabla de tramos que la etiqueta de texto, una clase por fila, de modo que un símbolo «muy deteriorado» siempre sale más difuminado que uno «deteriorado»; lo que se ajusta a ojo es el valor del filtro de cada clase, no el tramo al que pertenece.
*   **Sin bibliotecas de iconos.** Si un emoji no se lee bien o el sistema no lo tiene, se sustituye por una forma CSS simple en el mismo hueco.

El vídeo final está en `static/video/video_meme.mp4`: 78 segundos, H.264 con audio, 15,2 MB en el original. Antes de publicar se transcodifica a 480×854 con unos 400 kbps de vídeo y 64 kbps de audio, de modo que quede en unos 4,5 MB sin recortar ni un segundo; el permiso de la puerta G1 cubre la modificación. `vite.config.ts` declara `publicDir: 'static'`, así que llega al `dist/` como `video/video_meme.mp4`, y `config.ts` lo publica como `videoFinal`, construido sobre `import.meta.env.BASE_URL` para que la ruta siga siendo válida aunque el sitio viva en una subcarpeta. Se pide solo al montar la pantalla final. Mientras carga se muestra un fondo CSS con el texto «Cargando vídeo»; no hay imagen de espera. El vídeo es vertical, así que en pantalla de escritorio se muestra centrado con franjas laterales y nunca recortado. Si el navegador bloquea la reproducción automática o falta el archivo, aparece un botón para iniciar la reproducción y los otros dos botones siguen disponibles. La publicación del vídeo está cubierta por el permiso escrito de la puerta G1.

Los sonidos quedan pendientes. El juego se construye con cuatro marcadores explícitos, rutas vacías en la configuración y silencio cuando no hay archivo.

## Alternatives Considered

Cada alternativa con su razón documentada. «Motivo del descarte» es la razón concreta, no una preferencia.

| Alternativa | A favor | En contra | Motivo del descarte |
| --- | --- | --- | --- |
| **A.** Opciones en orden fijo | lectura más corta en batallas rápidas | permite ganar pulsando siempre la misma posición sin leer | el orden aleatorio evita que se pueda ganar sin leer |
| **B.** Banco solo de preguntas verificables | no premia opiniones ni presenta preferencias como hechos | el banco actual es casi todo política debatible; habría que escribir otro y cambiar la mecánica | se declara el criterio como regla del juego en la introducción |
| **C.** Un tema fijo por villano | relación directa entre villano y símbolo, sin cálculo de reparto | obliga a que cada batalla use un solo tema y deja fuera las preguntas de dos temas | se prefiere el reparto proporcional al tema de las preguntas respondidas |
| **D.** Terminar la batalla al agotar el banco | no repite preguntas y el final llega antes | el resultado dependería del tamaño del banco y no de las respuestas | se vuelve a mezclar el banco y se continúa |
| **E.** Modo sin límite de tiempo | resuelve el problema de quien lee despacio y cumple el criterio 2.2.1 de las WCAG | añade un modo más que probar y dos formas de entender el resultado por tiempo | se mantienen dos minutos, ajustables en configuración; la objeción de accesibilidad queda como riesgo aceptado |
| **F.** Vídeo con reproducción manual y subtítulos | no sorprende con sonido y cumple mejor las expectativas de accesibilidad | pierde el efecto de sorpresa que se busca al final | se prefiere la reproducción automática con sonido y salida en silencio si el navegador la bloquea; el subtitulado queda como riesgo abierto |
| **G.** Compartir un resumen de la partida | da algo concreto que enseñar y puede animar a jugar | incluye respuestas que revelan opiniones políticas | se comparte un enlace genérico, sin respuestas ni identificadores |
| **H.** JavaScript sin paso de compilación | sin dependencias ni Node; las reglas puras seguirían siendo comprobables con `node:test` | componentes escritos a mano, sin la ergonomía de Svelte ni comprobación de tipos en las plantillas | se elige Vite con Svelte y TypeScript por ergonomía y comprobación de tipos, no porque sea la única forma de tener pruebas |
| **I.** Svelte sin TypeScript | menos configuración y menos anotaciones | los errores de forma en las reglas aparecen al ejecutar, no al compilar | se mantiene TypeScript en la lógica |
| **J.** Contenido en un archivo TypeScript tipado | el compilador rechaza una pregunta mal formada antes de abrir el navegador | editar contenido exige conocer la forma del tipo, y quien redacta no necesariamente programa | se prefiere JSON validado, editable sin compilar |
| **K.** Hoja de cálculo con script de importación | se ven las columnas vacías de un vistazo y se edita en una hoja | dos artefactos que mantener sincronizados; una coma o un salto de línea rompe la tabla | se valida el JSON directamente, sin paso intermedio |
| **L.** Zod o Valibot para validar | mensajes de error detallados y tipos derivados del esquema | una dependencia más para una comprobación que ocurre una vez al arrancar | validador propio con mensajes ajustados; es un empate técnico y se revisa si el esquema crece |
| **M.** Reanudar la batalla tras una recarga, o empezar de cero sin conservar el desbloqueo | no se pierde el minuto en curso, o el guardado queda reducido a nada | guardar energía, villano y pregunta en curso obliga a decidir qué ocurre con el reloj; empezar de cero castiga una recarga accidental | al recargar se vuelve al mapa, la batalla reinicia con 5/5, el historial se conserva y el desbloqueo no se pierde |
| **N.** Recortar el vídeo | una sorpresa más corta mantiene la atención y pesa mucho menos | obliga a editar material de otras personas y a decidir qué parte se conserva | se publica el vídeo entero; el coste de banda se trata en G3 y transcodificar no es recortar |

## Risks and Mitigations

Cada riesgo con su impacto, su mitigación y lo que queda abierto. Las tres puertas marcadas como **G** bloquean la publicación.

*   **G1 · Permiso del vídeo — resuelto.** Existe permiso escrito de quienes grabaron el vídeo, que cubre la modificación y el uso en comunicación política. *Residual:* la línea de crédito debe presentarlo como meme no oficial con el nombre de quienes lo hicieron, y el permiso escrito se archiva con el proyecto, no se deduce del crédito. Si el audio incorpora música o imágenes de terceros que quienes grabaron no controlan, esa parte queda fuera de su permiso y se sustituye antes de publicar.
*   **Cifra de preguntas publicada.** La descripción de `index.html` anuncia treinta y tres preguntas y el banco tiene treinta y tres. La cifra coincide ya con el banco, así que G2 la deja cerrada por construcción. Son treinta y tres y no cuarenta porque siete de las preguntas del documento de origen no tienen ninguna medida en el documento de propuestas y se retiran del banco; el detalle está en `docs/revision-preguntas.md`. La frase habla de «unos minutos» y no de cinco, para no atarse a la duración de la batalla, que ya cambió una vez. Cualquier cambio en el tamaño del banco obliga a revisar la cifra.
*   **G2 · Afirmaciones políticas sin verificar.** El juego reproduce medidas y objetivos del documento de propuestas, cuya autoría y vigencia no están verificadas. Hay un solo documento de propuestas, así que treinta y tres URL idénticas no aportarían trazabilidad. *Mitigación decidida:* una única referencia `fuente` en `textos.json`, y una lista de comprobación editorial por pregunta registrada en `docs/revision-preguntas.md`, con estas columnas: la propuesta aparece literalmente en el documento de origen; el enunciado no nombra a ninguna persona ni grupo de forma despectiva; el enunciado no contiene huecos ni nombra al villano; el tema asignado es único o doble de forma justificada. Una segunda persona firma la lista antes de publicar. **Contenido cerrado.** Las 33 preguntas del banco pasan los cuatro criterios: cada reflexión cita una medida que aparece literalmente en el documento de propuestas, y las 30 citas de las preguntas nuevas están comprobadas por programa, no a ojo. Se retiraron siete preguntas del documento de origen porque el programa no dice nada sobre su tema. **Puerta cerrada el 2026-11-21** con la aprobación del autor tras leer los dos documentos de origen: los nombres de villano se mantienen y el desequilibrio de los símbolos se acepta, las dos cosas registradas en `docs/revision-preguntas.md`. *Residual:* la verificación vive en un archivo de proceso y no en el dato, así que el enlace al origen solo aparece en la pantalla final. Los tres nombres de villano los entrega el documento de preguntas y están en `textos.json`; dos de ellos son caricaturas de colectivos o cargos identificables, y la segunda lectura los mantiene por decisión del autor, con la objeción registrada en `docs/revision-preguntas.md`.
*   **G3 · Ancho de banda — resuelto.** Cada partida completa descarga 15,2 MB con el archivo original, que es el límite de un alojamiento gratuito: unas 6.600 partidas agotan 100 GB al mes. *Mitigación aplicada:* transcodificar a 480×854 con ~400 kbps de vídeo y 64 kbps de audio antes de publicar, de modo que la descarga quede en unos 4,5 MB y el mismo límite admita del orden de 22.000 partidas completas, sin CDN aparte ni infraestructura nueva. *Residual:* el contador del sitio no usa cookies ni identificadores persistentes, así que no hay aviso previo de consumo; el alojamiento se elige sin techo de ancho de banda siempre que sea posible, y el vídeo se sirve desde el mismo origen para que la afirmación de privacidad siga siendo cierta.
*   **Regla del reloj.** Al agotarse el tiempo gana quien tenga más energía, que es la decisión acordada y confirmada por el autor. *Impacto:* una sola respuesta correcta más la espera hasta agotar el tiempo ganan la batalla, así que una partida puede ver tres preguntas de las cuarenta. *Mitigación:* la medición «Preguntas por batalla» del plan de verificación; si el número medido es demasiado bajo, la palanca barata es `duracionBatallaMs` y la palanca correcta es exigir un mínimo de respuestas para la victoria por tiempo. *Residual:* con la regla tal cual, una respuesta correcta seguida de esperar gana; la decisión se mantiene y solo se reabre con el resultado de esa medición.
*   **Reproducción automática con audio — decidido en contra de la opción silenciosa.** *Impacto:* el navegador bloquea el sonido para quien llega sin haber interactuado, y el sonido sorprende a quien no lo espera. *Mitigación:* se intenta con sonido y, si el navegador lo rechaza, se reintenta en silencio; el botón de sonido y el de pausa están siempre a la vista, así que los criterios 1.4.2 (control del audio) y 2.2.1 (pausar) se cumplen tanto si suena como si no. *Residual:* al sonar por defecto, la falta de subtítulos pesa más que antes; el criterio 1.2.2 sigue abierto y necesita una transcripción del audio que hoy no existe.
*   **Límite de sesenta segundos.** *Impacto:* cinco opciones de texto en un móvil con lector de pantalla pueden no leerse a tiempo; el criterio 2.2.1 pide poder ampliar o desactivar el límite salvo que sea esencial. *Mitigación:* el límite es un valor de configuración y la duración se ajusta tras las pruebas. *Residual:* no se ofrece un modo sin límite, por decisión registrada en la Alternativa E.
*   **Puerta de validación.** *Impacto:* si el juego se negara a arrancar con contenido inválido, una coma en un archivo editado a mano dejaría la web en blanco para todo el mundo. *Mitigación:* el fallo se produce en la compilación; en ejecución se descartan las preguntas inválidas y solo se bloquea si no queda ninguna. *Residual:* una pregunta inválida puede pasar desapercibida en producción.
*   **Progreso guardado frente a contenido cambiado.** *Impacto:* el historial guardado referencia identificadores de pregunta que pueden desaparecer. *Mitigación:* descartar al cargar los identificadores desconocidos, con la validación campo a campo del guardado. *Residual:* el jugador puede ver repetida una pregunta que ya respondió antes de la corrección.
*   **Sin medición.** *Impacto:* el propósito declarado —que alguien busque la propuesta completa— no es comprobable con un contador de visitas, que no distingue esa acción. *Mitigación:* sesiones moderadas con 5–8 personas del público objetivo antes de publicar, con tres preguntas de comprensión y una de intención de búsqueda. *Residual:* es una muestra pequeña y no representa al público.

## Non-Functional Requirements

*   **Privacidad:** el juego no hace peticiones a servicios de terceros después de cargar, no usa cookies ni cuentas, y la analítica del sitio no deja identificadores persistentes. La única petición en tiempo de ejecución es la descarga del vídeo final desde el mismo origen. El alojamiento registra las visitas como cualquier servidor web, y compartir envía una dirección genérica sin datos de la partida.
*   **Almacenamiento no disponible:** en modo privado algunos navegadores lanzan un error al escribir en `localStorage`. El juego sigue jugándose en memoria y avisa en el mapa de que el progreso no se conservará.
*   **Rendimiento:** el banco completo ocupa unos 39 KB sin comprimir, a razón de 1,2 KB por pregunta medidos sobre el archivo real con 33 preguntas. El objetivo es que la primera pantalla sea usable en una conexión móvil lenta, sin pantallas intermedias de espera. El vídeo final, de unos 4,5 MB tras la transcodificación, se pide solo al llegar a la última pantalla.
*   **Compatibilidad:** las dos últimas versiones de Chrome, Safari, Firefox y Edge, y Safari en iOS 15 o superior, que es la versión mínima que admite las propiedades de filtro y los módulos que usa el diseño.
*   **Publicación y vuelta atrás:** la compilación produce un sitio estático completo —`index.html`, un JS, un CSS y el vídeo, unos 5,2 MB en total— y **no necesita nada del servidor**: ni Node, ni reescrituras de ruta, ni reglas de SPA, porque el juego no cambia la URL en ningún momento. Publicar es copiar `dist/`; volver atrás es volver a publicar la compilación anterior. Lo único que hay que pedirle al servidor es que sirva los `.mp4` como `video/mp4`, que es lo normal, y que si el sitio cuelga de una subcarpeta la URL lleve barra final, porque las rutas son relativas a la página. Abrir `dist/index.html` con `file://` no funciona: los módulos de JavaScript están bloqueados en ese protocolo. Está comprobado sirviendo el mismo `dist/` con un servidor estático en la raíz y en `/dist/`. Para que la vuelta atrás sea real hacen falta un repositorio con historial, un `package-lock.json` versionado y conservación de los artefactos publicados. Una corrección de contenido se publica con el guion de contenido: editar el JSON, `npm run validar`, `npm run build` y copiar `dist/`, sin tocar la lógica.
*   **Accesibilidad:** se comprueba con teclado, con lector de pantalla y con contraste de 4,5:1 en texto y 3:1 en componentes de interfaz, salvo la excepción declarada del naranja sobre el lima en titulares y botones del cartel. Los emoji nunca son la única señal de un estado.

## Additional Resources

*   `concepts_brief.md` y `mecanica_draft.md`: decisiones de ideación y borrador original de mecánica. Se archivan fuera del repositorio, en `_archivo-kahoot/`, porque son artefactos de sesión y no documentación del producto.
*   [Documento de preguntas](https://docs.google.com/document/d/1EYEYCDXQZD7GliQW8ku1Og2eAB-JLrcq/edit): banco de 40 preguntas sin revisar, con el orden original A–E; 33 entran al juego y 7 se retiran por no tener medida en el programa.
*   [Documento de propuestas](https://docs.google.com/document/d/1qzb-Gj18pDtTYQtpWNGcxoXz5H21mrCe9C_2sfuObCQ/edit): medidas y objetivos que alimentan los mensajes de reflexión.

## Future Improvements

*   **Modo de repaso:** mostrar al final las propuestas de los temas que aparecieron, para quien quiera leerlas sin volver a jugar.
*   **Sonidos propios:** grabar los cuatro marcadores en el barrio, en lugar de descargar archivos.
*   **Segunda partida:** un conjunto de preguntas distinto por villano, si el banco crece hasta permitir tres conjuntos separados.
*   **Subtítulos del vídeo:** resolver el criterio 1.2.2 de las WCAG, hoy abierto.

--------------------------------------------------------------------------------

## Detailed Implementation Plan

### Orden de trabajo

Seis fases de código. De la segunda en adelante, cada una termina con `npm run build`, `npm run check` y `npm test` en verde antes de empezar la siguiente; la primera todavía no tiene pruebas y su puerta es solo de compilación. En paralelo, desde el primer día, corre la revisión editorial del banco descrita en la puerta G2: no depende del código y es la tarea más larga, así que debe cerrarse antes de publicar, no al final.

1.  **Andamiaje.** `package.json`, `vite.config.ts`, `svelte.config.js`, `tsconfig.json`, `src/lib/config.ts`, `index.html` con el elemento `#app`, el título, la descripción para buscadores y para compartir, `theme-color` con el naranja de la paleta, un favicon SVG en línea y un `noscript` que avisa de que hace falta JavaScript, `src/main.ts` con el montaje del componente raíz mediante `mount(App, { target })` —la forma de Svelte 5, no `new App(...)`—, `src/App.svelte` como armazón vacío, `.gitignore` y repositorio con `git init`. Puerta: `npm run build` sale con código 0, produce `dist/` y `npm run preview` sirve el vídeo en su ruta. En esta fase `main.ts` solo monta: la validación previa y la llamada al validador dentro de `build` llegan en la fase 2, cuando el validador existe.
2.  **Tipos y validación.** `src/lib/tipos.ts`, `src/lib/validar.ts`, `src/lib/validar.test.ts`, `src/lib/contenido/textos.json` y `scripts/validar-contenido.ts`. Los tipos y el validador condicionan la compilación del resto de módulos. Al cerrar la fase, `main.ts` valida antes de montar y el guion `build` incorpora la llamada al validador, de modo que un error de contenido rompa la compilación.
3.  **Reglas puras.** `reglas.ts`, `seleccion.ts`, `azar.ts` con sus pruebas: energía, reparto, mensaje, reloj, bolsa y comodines. Las fases 4 a 6 dependen de estas reglas.
4.  **Estado y persistencia.** `persistencia.ts` y `estado.ts` con sus pruebas, incluida la inyección de un almacenamiento que falla.
5.  **Pantallas.** Se completa `App.svelte` y se escriben, en orden, `BarraEnergia`, `SimboloMapa`, `Intro`, `Mapa`, `Batalla`, `Resultado`, `Final` y `PantallaError`. La accesibilidad se cumple al escribir cada componente, no después.
6.  **Cierre.** Pruebas de componente, la transcodificación del vídeo a 480×854 y la comprobación de que la línea de crédito se lee sobre el fotograma en un móvil. Los cuatro marcadores de sonido quedan vacíos en `config.ts` hasta que existan los archivos: no se crea la carpeta todavía, para no dejar andamiaje de audio que puede no grabarse nunca.

### Módulos

La entrada, ocho módulos de lógica, nueve componentes, dos archivos de contenido, el vídeo, los estilos globales y tres archivos de apoyo a las pruebas y a la publicación. Los seis módulos con comportamiento propio tienen su archivo de pruebas; `config.ts` y `tipos.ts` solo declaran y no lo llevan.

| Archivo | Cambio | Responsabilidad | Pruebas |
| --- | --- | --- | --- |
| `src/main.ts` | crear | valida el contenido y monta el componente raíz sobre `#app` | — |
| `src/App.svelte` | crear | decide qué pantalla se ve; no contiene reglas | — |
| `src/lib/config.ts` | crear | valores ajustables; ningún otro archivo de `src/` los declara como literales | — |
| `src/lib/tipos.ts` | crear | los tipos del apartado «Esquema del contenido» | — |
| `src/lib/azar.ts` | crear | mezcla con generador inyectado | `azar.test.ts` |
| `src/lib/validar.ts` | crear | validación del contenido; acumula errores; devuelve `ErrorContenido[]` | `validar.test.ts` |
| `src/lib/seleccion.ts` | crear | bolsa, comodines e historial; recibe y devuelve estado, no lo guarda | `seleccion.test.ts` |
| `src/lib/reglas.ts` | crear | energía, resultado, reparto de símbolos, mensaje y reloj | `reglas.test.ts` |
| `src/lib/persistencia.ts` | crear | carga, guarda, borra y comprueba si el almacenamiento está disponible; recibe el almacenamiento | `persistencia.test.ts` |
| `src/lib/estado.ts` | crear | store de Svelte y acciones; guarda el historial tras cada respuesta y el resto al cerrar la batalla | `estado.test.ts` |
| `src/lib/contenido/preguntas.json` | modificar | banco de preguntas publicado: 33 de las 40 del documento de origen, las otras 7 retiradas por no tener medida en el programa | `../validar.test.ts` |
| `src/lib/contenido/textos.json` | crear | villanos, misión, regla del juego, frases de resultado, texto del empate, crédito y las referencias `fuente` y `fuentePreguntas` | `../validar.test.ts` |
| `scripts/validar-contenido.ts` | crear | ejecuta el validador sobre los dos archivos de contenido y sale con código 1 si hay errores | — |
| `src/app.css` | crear | variables de la paleta en `:root`, la fuente `Impact Web`, estilos globales compartidos, el cartel de la intro y del mapa, cinco clases de desenfoque y las reglas de movimiento y contraste reducidos | — |
| `src/lib/retratos.ts` | crear | ruta pública del retrato de cada villano, construida sobre `import.meta.env.BASE_URL` | `Mapa.test.ts` |
| `static/villanos/*.png` | crear | retratos de los tres villanos, con fondo transparente; declarados en `assets` de `juego.json` | — |
| `src/assets/impact-webfont.woff2`, `src/assets/impact-webfont.woff` | crear | fuente del cartel para Android y Linux, donde Impact no está instalada | — |
| `src/pruebas/preparacion.ts` | crear | `setupFiles` de Vitest; instala el simulador de `HTMLMediaElement.play` y la limpieza entre pruebas | — |
| `src/lib/pruebas-ayuda.ts` | crear | datos de prueba compartidos entre suites; no entra en el paquete | — |
| `static/video/video_meme.mp4` | modificar | vídeo fuente; se transcodifica a 480×854 antes de publicar | — |
| `docs/revision-preguntas.md` | modificar | lista de comprobación editorial cerrada y firmada: 40 filas, 33 aprobadas y 7 retiradas con su razón (puerta G2) | — |

Componentes: en `src/componentes/` viven `Intro.svelte`, `Mapa.svelte`, `Batalla.svelte`, `Resultado.svelte`, `Final.svelte` y `PantallaError.svelte`, que reciben estado y emiten acciones; `BarraEnergia.svelte` recibe valor, máximo, nombre y bando; `SimboloMapa.svelte` recibe emoji, nombre, valor y etiqueta; `Resultado.svelte` recibe además el villano al que se ha peleado para enseñar su retrato. Las pruebas de componente se colocan junto a su componente, en la misma carpeta: `Batalla.test.ts`, `Mapa.test.ts` y `Final.test.ts`. La región activa de la batalla vive en `Batalla.svelte` y anuncia la energía que se mueve en la última respuesta; la del resultado, en `Resultado.svelte`, anuncia el desenlace y el villano que se desbloquea. Las dos están ocultas a la vista: el estado ya se ve en las barras y en los textos, y el anuncio existe para quien no lo ve.

Herramientas: `package.json` con las versiones mayores fijadas —`svelte` 5, `vite` 8 y `@sveltejs/vite-plugin-svelte` 7, que es la pareja de Vite 8— y las versiones exactas resueltas por el `package-lock.json` versionado; el resto de dependencias de desarrollo son `typescript`, `svelte-check`, `vitest`, `jsdom`, `@testing-library/svelte`, `tsx` y `@types/node`, todas con versión mayor fijada al crear el andamiaje y comprobada contra Vite 8. Guiones: `dev`; `build`, que ejecuta el validador antes de compilar para que un error de contenido rompa la compilación; `preview`; `check` con `svelte-check --fail-on-warnings`; `test` con `vitest run`; y `validar` con `tsx scripts/validar-contenido.ts`. `vite.config.ts` declara el complemento de Svelte, `publicDir: 'static'`, `base: './'`, el entorno `jsdom` por defecto, `// @vitest-environment node` en las pruebas de lógica pura y `setupFiles` apuntando a `src/pruebas/preparacion.ts`, que instala el simulador de `HTMLMediaElement.play` que necesita `Final.test.ts`: el de jsdom no rechaza y la rama de fallo sería inalcanzable, así que el archivo se salta esa instalación y la limpieza de testing-library cuando la suite declara el entorno `node` y no hay DOM. Además, y esto no es obvio, `vite.config.ts` añade `resolve: { conditions: ['browser'] }` **solo cuando el modo es `test`**. Sin esa condición, Vitest resuelve Svelte 5 al build de servidor, donde `mount` no existe, y las pruebas de componente fallan. Con la condición aplicada siempre, la compilación de producción también resuelve al build de servidor: el paquete baja de unos 80 kB a unos 17 kB y la aplicación arranca rota sin dar ningún error de compilación. La condición tiene que quedarse dentro del `if` del modo de prueba; moverla fuera parece una limpieza inocente y no lo es. `svelte.config.js` se queda en la configuración mínima: Svelte 5 ya admite TypeScript en los componentes sin preprocesador. `.gitignore` excluye `node_modules`, `dist` y `.DS_Store`, y no excluye `static/`, `docs/` ni `package-lock.json`. `tsconfig.json` activa el modo estricto, `resolveJsonModule` e incluye `src` y `scripts`. El contenido se importa de forma estática, nunca con `fetch`; el import llega como datos sin tipo y solo se convierte en `Pregunta[]` después de que `validar.ts` lo acepte, porque el JSON tipado por TypeScript da `string[]` en `temas` y no `Tema[]`.

### Plan de verificación

*   **Compilación:** `npm run build` y `npm run check` deben salir con código 0, el segundo tratando los avisos de Svelte como errores (`--fail-on-warnings`). La compilación por sí sola no comprueba tipos.
*   **Pruebas unitarias:** `npm test` sale con código 0 y ejecuta los seis archivos de la tabla de módulos: `azar.test.ts`, `validar.test.ts`, `seleccion.test.ts`, `reglas.test.ts`, `persistencia.test.ts` y `estado.test.ts`.
*   **Trazas de «Trabajo de ejemplo»:** las tres se ejecutan como casos de prueba con sus valores esperados —desempate, resto negativo y `n = 0`— y las tres pasan.
*   **Casos nombrados de las reglas:** en `reglas.test.ts`, cuatro respuestas con tres de efecto 2 no son «perfect», y una victoria por tiempo con menos de tres tampoco. En `seleccion.test.ts`: no repetir mientras la bolsa tiene contenido, remezclar al vaciarse, el intercambio de comodín, el segundo comodín cuando solo quedan comodines, y el historial que se borra al empezar partida. En `persistencia.test.ts`: identificadores desconocidos filtrados al cargar, versión distinta que descarta el progreso, y almacenamiento que lanza sin impedir jugar.
*   **Casos nombrados del mensaje:** en `reglas.test.ts`: elección del tema con más respuestas, desempate por el orden fijo, la última pregunta no comodín como fuente de la propuesta, el tema que solo tiene comodines, y el caso sin respuestas que muestra únicamente el texto del empate.
*   **Límite 0–8:** un caso en el que el límite recorta el reparto y la suma deja de coincidir con `base`, comprobado de forma explícita.
*   **Duración configurable:** un caso parametrizado sobre `duracionBatallaMs` que comprueba que el límite cambia sin tocar nada más.
*   **Pruebas de componente:** `npm test` con entorno de navegador simulado: al mezclar las opciones cada una conserva su efecto, la segunda pulsación no cambia la energía, el villano bloqueado no es seleccionable, y si la reproducción automática falla aparece el botón de reproducir.
*   **Contenido:** `npm run validar` sin errores antes de publicar, y la compilación falla si hay errores de forma.
*   **Recorrido manual en móvil:** partida completa con derrota intermedia, comprobación de que el botón del villano activo pasa de «Luchar» a «Reintentar», y recarga en mitad de batalla comprobando que se vuelve al mapa con la batalla reiniciada. Ninguna de las pruebas enumeradas cubre este recorrido.
*   **Preguntas por batalla:** en las sesiones moderadas con 5–8 personas descritas en «Risks and Mitigations», contar las preguntas respondidas en cada batalla terminada —incluidas las de cero respuestas— y anotar la mediana, tomando la inferior si el número de batallas es par. Si la mediana es de tres o menos, la regla del reloj se reabre: con la comparación por energía, una respuesta correcta seguida de esperar a que se agote el tiempo gana la batalla y la partida no recorre las cuarenta preguntas.
*   **Recorrido con teclado — comprobado el 2026-11-21.** En un navegador real, el orden de tabulación sigue el orden visible, cada opción recibe el anillo de foco de 3 px y no hay trampa de foco: desde la última opción se sale de la página con normalidad. Las dos preferencias del sistema también están verificadas con el emulador: con `prefers-reduced-motion` no queda ninguna transición ni animación, y con `prefers-contrast: more` desaparece el desenfoque de los símbolos.
*   **Lector de pantalla — pendiente de una persona.** Que los anuncios se emitan está comprobado (las regiones activas contienen el texto y no están ocultas con `display: none`), pero oírlos depende del lector y de quien lo escucha. Es la mitad de esta comprobación que no se puede automatizar.
*   **Contraste:** el texto y los botones se miden en 4,5:1 y 3:1, con las cifras de la excepción del naranja sobre el lima ya anotadas en «Paleta y tipografía» para que nadie vuelva a abrir la discusión desde cero.
*   **Navegación privada:** el juego avisa de que el progreso no se conservará y permite jugar igualmente.
*   **Vídeo bloqueado:** con la reproducción automática desactivada, el final sigue ofreciendo reproducir, silenciar, pausar, compartir y volver a jugar.
*   **Vídeo transcodificado:** con `ffmpeg` instalado, `ffprobe` informa 480 px de lado corto (480×854), 78 segundos de duración y un peso entre 4 y 5 MB.
*   **Línea de crédito:** en una captura a 375 px de ancho sobre el fotograma de 480×854, dos personas comprueban que se lee sin ampliar, que nombra a quienes hicieron el vídeo y que lo presenta como meme no oficial. En escritorio el vídeo aparece centrado con franjas laterales, sin recorte.
