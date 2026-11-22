# Revisión editorial del banco de preguntas

Lista de comprobación de la puerta G2 del diseño ([quiz-bienestar.md](./quiz-bienestar.md)). Una fila por pregunta. Se firma antes de publicar.

Revisión hecha contra los dos documentos de origen, exportados como texto:

*   **Documento de preguntas** (`1EYEYCDXQZD7GliQW8ku1Og2eAB-JLrcq`): 40 preguntas numeradas, con la introducción y los tres villanos.
*   **Documento de propuestas** (`1qzb-Gj18pDtTYQtpWNGcxoXz5H21mrCe9C_2sfuObCQ`): medidas por tema, en catalán.

## Criterios

*   **A · Fuente:** la `reflexion.propuesta` aparece en el documento de propuestas, y la medida citada es la que el documento defiende, no una paráfrasis que cambie su alcance.
*   **B · Nombres:** el enunciado no nombra a ninguna persona, empresa ni grupo de forma despectiva. Es un riesgo de captura de pantalla independiente de si el dato es correcto.
*   **C · Redacción:** el enunciado no tiene huecos, no nombra al villano, no está duplicado y se puede leer entero en el tiempo de la batalla.
*   **D · Tema:** el tema asignado es único, o doble cuando la pregunta toca de verdad dos temas.

Leyenda: `✓` cumple · `✗` no cumple · `⚠` cumple con reserva · `retirada` queda fuera del banco.

## Estado

De las 40 preguntas del documento de origen, **33 entran al banco y 7 quedan retiradas** por no tener ninguna medida en el documento de propuestas.

De las 33 que entran:

*   **Las 33 tienen reflexión redactada y pasan los cuatro criterios.**
*   **Las 33 están en `src/lib/contenido/preguntas.json`** y `npm run validar` las acepta.
*   **No hay huecos, ni nombres de villano, ni «guiris de turno»** en ningún enunciado: el más largo mide 127 caracteres.
*   **Las dos reservas están decididas:** los nombres de villano se mantienen y el desequilibrio de los símbolos se acepta. Las dos quedan escritas con su razón, no borradas.

## Tabla

| ID | N.º | Tema | A · Fuente | B · Nombres | C · Redacción | D · Tema |
| --- | --- | --- | --- | --- | --- | --- |
| `vivienda-01` | 1 | casa | ✓ | ✓ | ✓ | ✓ |
| `vivienda-02` | 2 | casa | ✓ | ✓ | ✓ | ✓ |
| `vivienda-03` | 3 | casa | ✓ | ✓ | ✓ | ✓ |
| `trabajo-04` | 4 | moneda | ✓ | ✓ | ✓ | ✓ |
| `trabajo-05` | 5 | moneda | ✓ | ✓ | ✓ | ✓ |
| `trabajo-06` | 6 | moneda | ✓ | ✓ | ✓ | ✓ |
| `salarios-07` | 7 | moneda | ✓ | ✓ | ✓ | ✓ |
| `trabajo-08` | 8 | moneda | ✓ | ✓ | ✓ | ✓ |
| `trabajo-09` | 9 | moneda | ✓ | ✓ | ✓ | ✓ |
| `sanidad-10` | 10 | hospital | ✓ | ✓ | ✓ | ✓ |
| `sanidad-11` | 11 | hospital | ✓ | ✓ | ✓ | ✓ |
| `sanidad-12` | 12 | hospital | ✓ | ✓ | ✓ | ✓ |
| `sanidad-13` | 13 | hospital | ✓ | ✓ | ✓ | ✓ |
| `comodin-14` | 14 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `comodin-15` | 15 | — | retirada | retirada | retirada | retirada |
| `sanidad-16` | 16 | hospital | ✓ | ✓ | ✓ | ✓ |
| `sanidad-17` | 17 | hospital | ✓ | ✓ | ✓ | ✓ |
| `sanidad-18` | 18 | hospital | ✓ | ✓ | ✓ | ✓ |
| `trabajo-19` | 19 | moneda | ✓ | ✓ | ✓ | ✓ |
| `vivienda-20` | 20 | casa + moneda | ✓ | ✓ | ✓ | ✓ |
| `comodin-21` | 21 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `comodin-22` | 22 | — | retirada | retirada | retirada | retirada |
| `trabajo-23` | 23 | moneda | ✓ | ✓ | ✓ | ✓ |
| `comodin-24` | 24 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `comodin-25` | 25 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `sanidad-26` | 26 | hospital | ✓ | ✓ | ✓ | ✓ |
| `trabajo-27` | 27 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `alimentacion-28` | 28 | zanahoria | ✓ | ✓ | ✓ | ✓ |
| `alimentacion-29` | 29 | — | retirada | retirada | retirada | retirada |
| `comodin-30` | 30 | — | retirada | retirada | retirada | retirada |
| `comodin-31` | 31 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `comodin-32` | 32 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `comodin-33` | 33 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `comodin-34` | 34 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `comodin-35` | 35 | — | retirada | retirada | retirada | retirada |
| `comodin-36` | 36 | — | retirada | retirada | retirada | retirada |
| `comodin-37` | 37 | — | retirada | retirada | retirada | retirada |
| `comodin-38` | 38 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `comodin-39` | 39 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |
| `trabajo-40` | 40 | moneda (comodín) | ✓ | ✓ | ✓ | ✓ |

Las siete filas marcadas `retirada` no son un suspenso. Se retiran del banco porque el documento de propuestas no contiene ninguna medida sobre lenguas, energía nuclear, referéndums, cultura, producción agraria ni vehículos, así que no hay nada que enseñar al jugador al terminar la batalla. Los enunciados quedan en el documento de origen por si el programa crece.

## Mapa de medidas

Cada pregunta del documento de origen contra la medida del documento de propuestas que sostiene su reflexión. El programa tiene dieciocho secciones temáticas.

| N.º | ID | Sección | Medida que la respalda |
| --- | --- | --- | --- |
| 1 | `vivienda-01` | §1 Vivienda | Crear 1,5 millones de viviendas públicas en 12 años |
| 2 | `vivienda-02` | §1 Vivienda | Expropiar viviendas de grandes tenedores para el parque público |
| 3 | `vivienda-03` | §1 Vivienda | Eliminar los pisos turísticos en zonas tensionadas |
| 4 | `trabajo-04` | §2 Trabajo | Repartir los beneficios empresariales con las plantillas |
| 5 | `trabajo-05` | §4 Impuestos | Impuesto mínimo del 3 % sobre patrimonios de más de 50 M € |
| 6 | `trabajo-06` | §2 Trabajo | Combatir la precariedad y los abusos empresariales |
| 7 | `salarios-07` | §2 Trabajo | 37,5 horas y avanzar hacia las 32 |
| 8 | `trabajo-08` | §15 Industria | Apoyo a las pymes y mejores condiciones de financiación *(débil)* |
| 9 | `trabajo-09` | §8 Pensiones | Revalorización vinculada al coste de la vida |
| 10 | `sanidad-10` | §5 Sanidad | 8 % del PIB y sanidad universal y pública |
| 11 | `sanidad-11` | §5 Sanidad | Reforzar la atención primaria |
| 12 | `sanidad-12` | §5 Sanidad | Ampliar la salud mental pública |
| 13 | `sanidad-13` | §5 Sanidad | Salud bucodental, visual y auditiva en la cobertura pública |
| 14 | `comodin-14` | §6 Educación | Menos ratios y comedores escolares gratuitos |
| 15 | `comodin-15` | — | **Retirada**: el programa no menciona lenguas |
| 16 | `sanidad-16` | §8 Dependencia | Reforzar el sistema público de dependencia |
| 17 | `sanidad-17` | §8 Dependencia | Mejorar la atención a domicilio |
| 18 | `sanidad-18` | §8 Dependencia | Avanzar hacia un sistema público de cuidados |
| 19 | `trabajo-19` | §12 Feminismos | Mejorar las condiciones de quien cuida |
| 20 | `vivienda-20` | §7 Infancia | Prestación universal de 200 € por menor |
| 21 | `comodin-21` | §11 Transición | Acelerar el despliegue de renovables |
| 22 | `comodin-22` | — | **Retirada**: el programa no menciona nucleares |
| 23 | `trabajo-23` | §10 Energía | Tres horas de luz gratuita y comercializadora pública |
| 24 | `comodin-24` | §11 Transición | Reforzar el transporte público para reducir la contaminación |
| 25 | `comodin-25` | §9 Transporte | Pacto de Estado por el ferrocarril |
| 26 | `sanidad-26` | §11 Transición | Reforzar el transporte público para reducir la contaminación |
| 27 | `trabajo-27` | §16 Municipios | Servicios públicos en los municipios rurales |
| 28 | `alimentacion-28` | §3 Coste de la vida | Controlar los márgenes de las grandes distribuidoras |
| 29 | `alimentacion-29` | — | **Retirada**: el programa no habla de producción agraria |
| 30 | `comodin-30` | — | **Retirada**: el programa no habla de vehículos |
| 31 | `comodin-31` | §14 Migraciones | Ley integral contra el racismo y vías legales y seguras |
| 32 | `comodin-32` | §14 Migraciones | Procedimientos estables de regularización |
| 33 | `comodin-33` | §18 Democracia | República federal y plurinacional |
| 34 | `comodin-34` | §16 Municipios | Financiación autonómica más justa |
| 35 | `comodin-35` | — | **Retirada**: el programa no menciona ningún referéndum |
| 36 | `comodin-36` | — | **Retirada**: el programa no menciona lenguas |
| 37 | `comodin-37` | — | **Retirada**: el programa no menciona cultura |
| 38 | `comodin-38` | §18 Democracia | República federal y plurinacional |
| 39 | `comodin-39` | §17 Paz | Rechazar el 5 % del PIB en gasto militar |
| 40 | `trabajo-40` | §15 Industria | Nueva política industrial pública |

**Resultado del mapa: 33 preguntas tienen medida —una de ellas con un vínculo débil, marcada como tal— y siete no tienen ninguna.**

## Verificación del criterio A

Las 33 propuestas, con la línea del documento de origen donde aparecen. Las 30 de las preguntas nuevas están comprobadas por programa: el guion que construyó el banco falla si alguna cita no aparece literalmente en el texto exportado del documento de propuestas.

| ID | N.º | Documento de propuestas |
| --- | --- | --- |
| `vivienda-01` | 1 | «Crear 1,5 milions d'habitatges públics en 12 anys, invertint-hi l'1% del PIB anual.» |
| `vivienda-02` | 2 | «Expropiar progressivament habitatges de grans tenidors corporatius per incorporar-los al parc públic» |
| `vivienda-03` | 3 | «Eliminar progressivament els pisos turístics dels edificis residencials situats en zones tensionades en un màxim de tres anys.» |
| `trabajo-04` | 4 | «Repartir els beneficis empresarials amb les plantilles» |
| `trabajo-05` | 5 | «Tax the Rich: establir un impost mínim anual del 3% sobre els patrimonis nets individuals superiors a 50 milions d’euros.» |
| `trabajo-06` | 6 | «Millorar els drets laborals i combatre la precarietat i els abusos empresarials.» |
| `salarios-07` | 7 | «Reduir immediatament la jornada laboral a 37,5 hores setmanals, sense reducció salarial.» + «Avançar progressivament cap a les 32 hores setmanals…» |
| `trabajo-08` | 8 | «Donar suport a les petites i mitjanes empreses, simplificant tràmits i millorant les condicions de finançament.» |
| `trabajo-09` | 9 | «Garantir que les pensions mantinguin el poder adquisitiu, amb revaloritzacions vinculades al cost de la vida.» |
| `sanidad-10` | 10 | «Invertir almenys el 8% del PIB en sanitat pública…» + «Garantir una sanitat universal, pública i de gestió directa…» |
| `sanidad-11` | 11 | «Reforçar l’atenció primària, amb més professionals i recursos.» |
| `sanidad-12` | 12 | «Ampliar l’atenció pública a la salut mental, amb més personal especialitzat.» |
| `sanidad-13` | 13 | «Incorporar progressivament la salut bucodental, visual i auditiva a la cobertura pública.» |
| `comodin-14` | 14 | «Reduir les ràtios a les aules per millorar l’atenció individualitzada.» + «Garantir menjadors escolars gratuïts a l’educació infantil i primària de la xarxa pública.» |
| `sanidad-16` | 16 | «Reforçar el sistema públic de dependència, ampliant els serveis i recursos disponibles.» |
| `sanidad-17` | 17 | «Millorar l’atenció domiciliària i els serveis públics de cures.» |
| `sanidad-18` | 18 | «Avançar cap a un sistema públic de cures que garanteixi una atenció digna.» |
| `trabajo-19` | 19 | «Millorar les condicions laborals de les persones cuidadores, especialment en sectors feminitzats.» |
| `vivienda-20` | 20 | «Crear una prestació universal de 200 euros mensuals per cada menor de 18 anys.» |
| `comodin-21` | 21 | «Accelerar el desplegament d’energies renovables, reduint la dependència dels combustibles fòssils.» |
| `trabajo-23` | 23 | «Garantir tres hores de llum gratuïta al dia» + «Crear una comercialitzadora pública d’energia» |
| `comodin-24` | 24 | «Reforçar el transport públic i el ferrocarril, per reduir la contaminació.» |
| `comodin-25` | 25 | «Impulsar un pacte d’Estat pel ferrocarril, prioritzant el manteniment i la qualitat del servei.» |
| `sanidad-26` | 26 | «Invertir el 3,5% del PIB anual en transició ecològica, segons el compromís general del programa.» |
| `trabajo-27` | 27 | «Garantir serveis públics als municipis rurals, per combatre la despoblació i les desigualtats territorials.» |
| `alimentacion-28` | 28 | «Controlar els marges de benefici de les grans empreses distribuïdores i combatre els abusos.» |
| `comodin-31` | 31 | «Aprovar una llei integral contra el racisme» + «Garantir vies legals i segures per a la migració i l’asil.» |
| `comodin-32` | 32 | «Establir procediments estables de regularització» |
| `comodin-33` | 33 | «Avançar cap a una república federal i plurinacional, que reconegui la diversitat territorial i nacional.» |
| `comodin-34` | 34 | «Impulsar un sistema de finançament autonòmic més just, que garanteixi els recursos necessaris per als serveis públics.» |
| `comodin-38` | 38 | «Avançar cap a una república federal i plurinacional, que reconegui la diversitat territorial i nacional.» |
| `comodin-39` | 39 | «Rebutjar l’objectiu de destinar el 5% del PIB a despesa militar en el marc de l’OTAN.» |
| `trabajo-40` | 40 | «Impulsar una nova política industrial pública, per crear ocupació estable i de qualitat.» |

## Reescrituras aplicadas

Los siete enunciados que incumplían B o C, con el texto que hay ahora en el banco:

| ID | Antes | Ahora |
| --- | --- | --- |
| `vivienda-01` | Rellenaba el hueco con «el Rey del Ladrillo»; 194 caracteres | «¿Qué medida ayudaría más a este joven a pagar un alquiler sin dedicar la mayor parte de su salario?» |
| `vivienda-02` | Hueco `______________` sin rellenar | «¿Qué debería hacerse para que ninguna familia tenga que vivir en la calle mientras se especula con viviendas vacías?» |
| `vivienda-03` | Hueco rellenado con el villano y «los guiris de turno»; 209 caracteres | «¿Qué medida ayudaría a que tus vecinos no tengan que mudarse lejos de su trabajo cuando el barrio se llena de pisos turísticos?» |
| `sanidad-26` | Preguntaba por mascarillas y covid bajo un título sobre zonas de bajas emisiones | «¿Qué debería hacerse con las zonas de bajas emisiones?» |
| `trabajo-27` | Hueco sin rellenar y «areas» sin tilde | «¿Qué sería más útil para que el campo no se convierta en campos de golf?» |
| `alimentacion-28` | Hueco sin rellenar y frase mal construida | «¿Qué debería hacerse para que lo que pagamos por la comida no acabe en los bolsillos de los grandes intermediarios?» |
| `comodin-31` | Hueco con la marca de trabajo «(Nombre del personaje malo)» y frase truncada | «¿Qué estrategia elegirías para que la llegada de personas de otros países no se convierta en un problema para nadie?» |

`alimentacion-29` ya no necesita decisión: se retira, así que la pregunta doble que mezclaba dos enunciados desaparece del banco.

## Cambios posteriores a la firma

Una vez firmada la lista se revisaron los 33 mensajes buscando repeticiones, y aparecieron cuatro. Los cambios de abajo no alteran el resultado de ningún criterio: cada reflexión sigue citando literalmente una medida del documento de propuestas, y las dos medidas nuevas se comprobaron contra el texto exportado igual que las demás.

| ID | Qué cambió | Por qué |
| --- | --- | --- |
| `trabajo-06` | Deja de citar el reparto de beneficios | Su pregunta es de temporalidad, no de reparto: el reparto ya lo usa la 4, y las dos daban el mismo mensaje |
| `trabajo-19` | Deja de citar los servicios públicos de cuidados | Se solapaba con la 17; se queda con las condiciones laborales de quien cuida, que es lo que pregunta |
| `sanidad-12` | Se acorta la propuesta | Compartía la fórmula «con más profesionales» con la 11 |
| `sanidad-26` | Cambia de medida: pasa del transporte a la inversión del 3,5 % del PIB | Compartía medida y casi texto con la 24, que es la pregunta de movilidad |
| `comodin-38` | Se separa de la 33 | Las dos citaban la misma medida con el mismo párrafo; ahora la 38 dice «república» y la 33 dice «diversidad territorial» |
| `trabajo-40` | Cambia de enunciado | «¿Qué estrategia te parece más adecuada?» era idéntico al de la 11 y no decía de qué hablaba; ahora nombra la economía, que es lo que preguntan sus opciones |

Queda una sola pareja que comparte medida: la 33 y la 38, porque el programa tiene una única medida sobre el modelo territorial. Se acepta por la misma razón que el desequilibrio de los símbolos.

## Reservas que quedan

**Equilibrio de los símbolos — aceptado.** El banco que entra tiene 21 preguntas de `moneda`, 8 de `hospital`, 4 de `casa` y **1 de `zanahoria`**. Con nueve extracciones por partida, la probabilidad de que el símbolo de la alimentación aparezca alguna vez es del 27%: tres de cada cuatro partidas terminan sin haberlo tocado. El reparto de cambios pesa los temas por número de respuestas, así que ese símbolo quedará casi inmóvil. **Decisión del autor: se acepta y se publica así**, porque los criterios A–D juzgan cada pregunta y no el conjunto, y porque corregirlo exigiría escribir preguntas que el documento de origen no tiene. Queda como limitación conocida; si la medición de sesiones muestra que el mapa resulta monótono, la salida sigue siendo añadir preguntas de alimentación desde las dos únicas medidas disponibles: la cesta básica y el control de márgenes.

**Los tres nombres de villano — segunda lectura hecha.** El criterio B se aplica a los enunciados, y estos nombres son personajes de ficción, no personas reales: no incumplen B. Dos de los tres son caricaturas de colectivos o cargos identificables —«El Buitre Empresario» apunta a empresarios y «La Presidenta del Miedo» evoca un cargo público— y el documento de propuestas es de un partido. **Decisión del autor: se mantienen los tres**, porque son personajes y porque los define el documento de preguntas de origen. Queda registrada la razón, no solo el resultado: si alguien vuelve a abrir el asunto, la objeción existe y está sopesada.

## Lo que el documento de origen añade y el diseño excluye

El documento de preguntas propone tres niveles de dificultad: Fácil (un villano, 10 preguntas), Normal (dos villanos, 25) y Difícil (los tres, 40). El diseño juega siempre los tres villanos, que es el nivel difícil, y reparte las preguntas por batalla en lugar de por partida.

También incluye una nota interna —«la respuesta correcta es la del FA (que en el borrador de preguntes es siempre la A)»— que confirma por qué el diseño mezcla las opciones y guarda el efecto en el dato en lugar de la letra. El banco conserva ese efecto en el orden original: la opción A vale 2, la B 1, la C 0, la D −1 y la E −2. Es una convención heredada del documento, no una medición.

## Pendiente

Nada. Los cuatro criterios están verificados, las siete retiradas están razonadas, las dos reservas están decididas y la lista está aprobada.

## Firma

*   Revisión editorial: **aprobada el 2026-11-21 por el autor tras leer los dos documentos de origen**
*   Segunda lectura de los nombres de villano: **hecha el 2026-11-21; se mantienen los tres nombres**
*   Fecha de cierre de la puerta G2: **2026-11-21**
