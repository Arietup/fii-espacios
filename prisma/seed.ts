import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";

config({ path: ".env.local" });
config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function mimeTypeFromPath(filePath: string) {
  if (filePath.toLowerCase().endsWith(".svg")) return "image/svg+xml";
  if (filePath.toLowerCase().endsWith(".png")) return "image/png";
  if (filePath.toLowerCase().endsWith(".jpg") || filePath.toLowerCase().endsWith(".jpeg")) return "image/jpeg";
  if (filePath.toLowerCase().endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

async function seedPlantaPlano(plantaId: string, imagenUrl: string, nombrePlanta: string) {
  const relativePath = imagenUrl.replace(/^\/+/, "");
  const absolutePath = join(process.cwd(), "public", relativePath.replace(/^public[\\/]/, ""));
  const file = await readFile(absolutePath);
  const nombre = basename(imagenUrl);
  const data = {
    plantaId,
    tipo: "PLANO" as const,
    nombre,
    mimeType: mimeTypeFromPath(imagenUrl),
    base64: file.toString("base64"),
    descripcion: `Plano de ${nombrePlanta}`,
    principal: true,
    orden: 0,
  };
  const existente = await prisma.plantaImagen.findFirst({
    where: { plantaId, tipo: "PLANO", nombre },
  });
  if (existente) {
    await prisma.plantaImagen.update({ where: { id: existente.id }, data });
  } else {
    await prisma.plantaImagen.create({ data });
  }
  return nombre;
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

const TIPOS = [
  { id: "aula",        etiqueta: "Aula",                    accent: "#8B5CF6", color: "bg-[#8B5CF6]/12 text-[#7C3AED]",   orden: 0 },
  { id: "laboratorio", etiqueta: "Laboratorio",             accent: "#10B981", color: "bg-[#10B981]/12 text-[#0D9488]",   orden: 1 },
  { id: "taller",      etiqueta: "Taller",                  accent: "#F59E0B", color: "bg-[#F59E0B]/15 text-[#B45309]",   orden: 2 },
  { id: "oficina",     etiqueta: "Oficina",                 accent: "#3B82F6", color: "bg-[#3B82F6]/12 text-[#1D4ED8]",   orden: 3 },
  { id: "auditorio",   etiqueta: "Auditorio / Gradas",      accent: "#F97316", color: "bg-[#F97316]/14 text-[#C2410C]",   orden: 4 },
  { id: "bano",        etiqueta: "Baño",                    accent: "#0EA5E9", color: "bg-[#0EA5E9]/12 text-[#0369A1]",   orden: 5 },
  { id: "deposito",    etiqueta: "Depósito / Bodega",       accent: "#64748B", color: "bg-[#64748B]/14 text-[#475569]",   orden: 6 },
  { id: "circulacion", etiqueta: "Circulación / Escaleras", accent: "#64748B", color: "bg-[#64748B]/10 text-[#475569]",   orden: 7 },
  { id: "servicio",    etiqueta: "Servicios generales",     accent: "#EC4899", color: "bg-[#EC4899]/12 text-[#BE185D]",   orden: 8 },
] as const;

// ─── Estados físicos ─────────────────────────────────────────────────────────

const ESTADOS_FISICOS = [
  { nombre: "Bueno",         descripcion: "Espacio en buen estado de conservación y operación.", color: "#22C55E", orden: 0 },
  { nombre: "Regular",       descripcion: "Espacio con desgaste menor pero funcional.",          color: "#F59E0B", orden: 1 },
  { nombre: "Malo",          descripcion: "Espacio con deterioro significativo, requiere mantenimiento.", color: "#EF4444", orden: 2 },
  { nombre: "En reparación", descripcion: "Espacio fuera de servicio por trabajos de mejora.",   color: "#8B5CF6", orden: 3 },
  { nombre: "Sin uso",       descripcion: "Espacio no utilizado actualmente.",                   color: "#94A3B8", orden: 4 },
];

// ─── Usos de espacio ─────────────────────────────────────────────────────────

const USOS_ESPACIO = [
  { nombre: "Docencia presencial",       descripcion: "Clases dictadas en aula física.",                         orden: 0 },
  { nombre: "Docencia virtual",          descripcion: "Clases virtuales transmitidas desde el espacio.",         orden: 1 },
  { nombre: "Prácticas de laboratorio",  descripcion: "Actividades experimentales con equipos especializados.",  orden: 2 },
  { nombre: "Investigación",             descripcion: "Proyectos de investigación y desarrollo.",                 orden: 3 },
  { nombre: "Reuniones administrativas", descripcion: "Reuniones del personal administrativo o directivo.",      orden: 4 },
  { nombre: "Tutoría / Asesoría",        descripcion: "Atención a estudiantes por parte de docentes.",           orden: 5 },
  { nombre: "Evaluaciones / Exámenes",   descripcion: "Aplicación de pruebas y exámenes.",                      orden: 6 },
  { nombre: "Eventos académicos",        descripcion: "Conferencias, simposios y eventos de formación.",         orden: 7 },
  { nombre: "Almacenamiento",            descripcion: "Bodega o depósito de materiales y equipos.",              orden: 8 },
  { nombre: "Servicios estudiantiles",   descripcion: "Atención y servicios al estudiante.",                     orden: 9 },
];

// ─── Equipamiento ────────────────────────────────────────────────────────────

const EQUIPAMIENTOS = [
  { nombre: "Proyector / videoproyector",      descripcion: "Equipo de proyección para presentaciones.",     categoria: "Audio / Video" },
  { nombre: "Televisor / monitor",             descripcion: "Pantalla de visualización.",                    categoria: "Audio / Video" },
  { nombre: "Sistema de audio",                descripcion: "Amplificador, bocinas y micrófono.",             categoria: "Audio / Video" },
  { nombre: "Cámara web",                      descripcion: "Cámara para videoconferencias.",                 categoria: "Audio / Video" },
  { nombre: "Computadora de escritorio",       descripcion: "PC de escritorio completo.",                    categoria: "Cómputo" },
  { nombre: "Laptop docente",                  descripcion: "Computadora portátil para el docente.",         categoria: "Cómputo" },
  { nombre: "Impresora / escáner",             descripcion: "Equipo de impresión o escaneo.",                categoria: "Cómputo" },
  { nombre: "Pizarrón / pizarra",              descripcion: "Superficie de escritura vertical.",             categoria: "Mobiliario" },
  { nombre: "Pizarrón digital interactivo",    descripcion: "Pizarrón interactivo digital.",                 categoria: "Mobiliario" },
  { nombre: "Escritorio docente",              descripcion: "Mesa de trabajo para el docente.",              categoria: "Mobiliario" },
  { nombre: "Sillas / butacas",                descripcion: "Asientos para estudiantes.",                    categoria: "Mobiliario" },
  { nombre: "Mesas de trabajo",                descripcion: "Mesas para prácticas o trabajo en equipo.",     categoria: "Mobiliario" },
  { nombre: "Estantes / armarios",             descripcion: "Muebles de almacenamiento.",                    categoria: "Mobiliario" },
  { nombre: "Casilleros / lockers",            descripcion: "Compartimentos individuales de almacenaje.",    categoria: "Mobiliario" },
  { nombre: "Aire acondicionado",              descripcion: "Sistema de climatización.",                     categoria: "Instalaciones" },
  { nombre: "Red eléctrica / tomacorrientes",  descripcion: "Puntos de alimentación eléctrica.",            categoria: "Instalaciones" },
  { nombre: "Red de datos / internet",         descripcion: "Conexión a red LAN e internet.",               categoria: "Instalaciones" },
  { nombre: "Red Wi-Fi",                       descripcion: "Cobertura inalámbrica de internet.",            categoria: "Instalaciones" },
  { nombre: "Agua potable / lavamanos",        descripcion: "Punto de agua corriente.",                     categoria: "Instalaciones" },
  { nombre: "Equipos de laboratorio",          descripcion: "Instrumentos y equipos especializados.",        categoria: "Laboratorio" },
];

// ─── Bloques ─────────────────────────────────────────────────────────────────

const PLANTAS_ABC = [
  { nombre: "Planta Baja",  nivel: 0, imagenUrl: "/planos/bloque-a-b-c-planta-baja.svg" },
  { nombre: "Planta Media", nivel: 1, imagenUrl: "/planos/bloque-a-b-c-planta-media.svg" },
  { nombre: "Planta Alta",  nivel: 2, imagenUrl: "/planos/bloque-a-b-c-planta-alta.svg" },
];

const BLOQUES_DATA = [
  { slug: "a",   nombre: "Bloque A",       orden: 0, resumen: "Aulas, oficinas administrativas y zona de gradas",                   descripcion: "Edificio de tres niveles ubicado en el extremo oeste del conjunto principal. Comparte la escalera central con el Bloque B y alberga, en planta baja, una zona de gradas/auditorio en su esquina suroeste.", plantas: PLANTAS_ABC },
  { slug: "b",   nombre: "Bloque B",       orden: 1, resumen: "Aulas centrales organizadas alrededor de un patio interior",          descripcion: "Edificio central del conjunto, de tres niveles, con un vacío/patio interior en planta baja. Conecta mediante dos escaleras (oeste y este) con los bloques A y C respectivamente.", plantas: PLANTAS_ABC },
  { slug: "c",   nombre: "Bloque C",       orden: 2, resumen: "Aulas, oficinas y zona de gradas (simétrico al Bloque A)",            descripcion: "Edificio de tres niveles ubicado en el extremo este del conjunto principal, con distribución similar al Bloque A y una zona de gradas/auditorio en su esquina noreste.", plantas: PLANTAS_ABC },
  { slug: "g",   nombre: "Bloque G de Aulas", orden: 3, resumen: "Edificio alargado de aulas en fila, dos niveles",                 descripcion: "Construcción rectangular alargada compuesta por una serie de aulas dispuestas en fila a ambos lados de una escalera central.", plantas: [{ nombre: "Planta Baja", nivel: 0, imagenUrl: "/planos/bloque-g.svg" }, { nombre: "Planta Alta", nivel: 1, imagenUrl: "/planos/bloque-g.svg" }] },
  { slug: "d-e", nombre: "Bloque D y E",   orden: 4, resumen: "Unidad de laboratorios, talleres y oficinas en forma de L",           descripcion: "Conjunto formado por dos cuerpos (D y E) que funcionan como una sola unidad en planta de forma de L. Incluye laboratorios, oficinas, depósitos, baños y una escalera de conexión entre cuerpos.", plantas: [{ nombre: "Planta Baja", nivel: 0, imagenUrl: "/planos/bloque-d-e.svg" }] },
  { slug: "f",   nombre: "Bloque F",       orden: 5, resumen: "Nave de talleres / laboratorio con bodega y baños",                   descripcion: "Nave de un solo nivel tipo taller, con un área abierta de trabajo (estructura con columnas), una zona de casilleros/bodega y un módulo de baños en uno de sus extremos.", plantas: [{ nombre: "Planta Única", nivel: 0, imagenUrl: "/planos/bloque-f.svg" }] },
];

// ─── Espacios ─────────────────────────────────────────────────────────────────

type EspacioSeed = { slug: string; codigo: string; nombre: string; tipo: string; bloqueSlug: string; plantaNombre: string; descripcion: string; capacidad?: number };

const ESPACIOS_DATA: EspacioSeed[] = [
  // BLOQUE A – PB
  { slug: "a-pb-decanato",              codigo: "A-PB-01",      nombre: "Decanato",                                                   tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Despacho del Decanato de la Facultad de Ingeniería Industrial." },
  { slug: "a-pb-secretaria-decanato",   codigo: "A-PB-02",      nombre: "Secretaría del Decanato",                                    tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Oficina de secretaría que atiende al Decanato." },
  { slug: "a-pb-archivero",             codigo: "A-PB-03",      nombre: "Archivero",                                                  tipo: "deposito",    bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Espacio destinado al archivo de documentación administrativa." },
  { slug: "a-pb-subdecanato",           codigo: "A-PB-04",      nombre: "Subdecanato",                                                tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Despacho del Subdecanato de la Facultad." },
  { slug: "a-pb-secretaria-vicedecanato", codigo: "A-PB-05",    nombre: "Secretaría de Vicedecanato",                                 tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Oficina de secretaría que atiende al Vicedecanato." },
  { slug: "a-pb-secretaria-general",    codigo: "A-PB-06",      nombre: "Secretaría General",                                         tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Oficina de la Secretaría General de la Facultad." },
  { slug: "a-pb-area-investigadores",   codigo: "A-PB-07",      nombre: "Área de Investigadores",                                     tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Espacio de trabajo destinado al personal de investigación." },
  { slug: "a-pb-administracion-edificio", codigo: "A-PB-08",    nombre: "Administración del Edificio",                                tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Oficina encargada de la administración y mantenimiento del edificio." },
  { slug: "a-pb-bodega-1",              codigo: "A-PB-09",      nombre: "Bodega 1",                                                   tipo: "deposito",    bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Bodega de almacenamiento general." },
  { slug: "a-pb-bodega-2",              codigo: "A-PB-10",      nombre: "Bodega 2",                                                   tipo: "deposito",    bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Segunda bodega de almacenamiento, contigua a la anterior." },
  { slug: "a-pb-interventoria",         codigo: "A-PB-11",      nombre: "Departamento de Interventoría",                              tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Oficina del Departamento de Interventoría de la Facultad." },
  { slug: "a-pb-talento-humano",        codigo: "A-PB-12",      nombre: "Departamento de Talento Humano",                             tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Oficina del Departamento de Talento Humano." },
  { slug: "a-pb-direccion-industrial",  codigo: "A-PB-13",      nombre: "Dirección de Carrera de Ingeniería Industrial",              tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Despacho de la Dirección de la carrera de Ingeniería Industrial." },
  { slug: "a-pb-sala-docentes-industrial", codigo: "A-PB-14",   nombre: "Sala de Docentes de Ingeniería Industrial",                  tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Sala de trabajo y reuniones para los docentes de la carrera de Ingeniería Industrial." },
  { slug: "a-pb-gradas",                codigo: "A-PB-15",      nombre: "Gradas / Auditorio",                                         tipo: "auditorio",   bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Espacio con graderío escalonado para charlas y actividades académicas.", capacidad: 80 },
  { slug: "a-escalera",                 codigo: "A-CIR-01",     nombre: "Escalera Bloque A-B",                                        tipo: "circulacion", bloqueSlug: "a", plantaNombre: "Planta Baja",  descripcion: "Escalera de conexión vertical entre los tres niveles, compartida con el Bloque B." },
  // BLOQUE A – PM
  { slug: "a-pm-instituto-postgrado",   codigo: "A-PM-01",      nombre: "Instituto de Postgrado, Investigación y Educación Continua", tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Media", descripcion: "Oficinas del instituto encargado de los programas de postgrado, investigación y educación continua." },
  { slug: "a-pm-oficina-computo",       codigo: "A-PM-02",      nombre: "Oficina de Cómputo",                                         tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Media", descripcion: "Oficina de soporte y gestión de equipos de cómputo." },
  { slug: "a-pm-lab-computacion-101",   codigo: "14A-101",      nombre: "Laboratorio de Computación 14A-101",                         tipo: "laboratorio", bloqueSlug: "a", plantaNombre: "Planta Media", descripcion: "Laboratorio de cómputo para clases y prácticas." },
  { slug: "a-pm-biblioteca",            codigo: "14A-101-BIB",  nombre: "Biblioteca 14A-101 — Ing. Alfredo Hincapié Segura",          tipo: "servicio",    bloqueSlug: "a", plantaNombre: "Planta Media", descripcion: "Biblioteca de la Facultad, dedicada al Ing. Alfredo Hincapié Segura." },
  { slug: "a-pm-area-prensa",           codigo: "A-PM-03",      nombre: "Área de Prensa",                                             tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Media", descripcion: "Espacio destinado a la oficina de prensa y comunicación de la Facultad." },
  { slug: "a-pm-banos",                 codigo: "A-PM-04",      nombre: "Baños M-H",                                                  tipo: "bano",        bloqueSlug: "a", plantaNombre: "Planta Media", descripcion: "Módulo de baños para hombres y mujeres." },
  // BLOQUE A – PA
  { slug: "a-pa-lab-computo-202",       codigo: "14A-202",      nombre: "Laboratorio de Cómputo 14A-202",                             tipo: "laboratorio", bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Laboratorio de cómputo para la carrera de Teleinformática." },
  { slug: "a-pa-direccion-teleinformatica", codigo: "A-PA-01",  nombre: "Dirección de Carrera de Teleinformática",                    tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Despacho de la Dirección de la carrera de Teleinformática." },
  { slug: "a-pa-aula-201",              codigo: "14A-201",      nombre: "Aula 14A-201",                                               tipo: "aula",        bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Aula de clases de la carrera de Teleinformática.", capacidad: 40 },
  { slug: "a-pa-lab-computo-201",       codigo: "14A-201-LAB",  nombre: "Laboratorio de Cómputo 14A-201",                             tipo: "laboratorio", bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Laboratorio de cómputo de la carrera de Teleinformática." },
  { slug: "a-pa-aula-203",              codigo: "14A-203",      nombre: "Aula 14A-203",                                               tipo: "aula",        bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "a-pa-aula-204",              codigo: "14A-204",      nombre: "Aula 14A-204",                                               tipo: "aula",        bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "a-pa-aula-205",              codigo: "14A-205",      nombre: "Aula 14A-205",                                               tipo: "aula",        bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Aula de clases de la carrera de Teleinformática.", capacidad: 40 },
  { slug: "a-pa-aula-206",              codigo: "14A-206",      nombre: "Aula 14A-206",                                               tipo: "aula",        bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Aula de clases de la carrera de Teleinformática.", capacidad: 40 },
  { slug: "a-pa-banos",                 codigo: "A-PA-02",      nombre: "Baños M-H",                                                  tipo: "bano",        bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Módulo de baños para hombres y mujeres." },
  { slug: "a-pa-sala-docentes-teleinformatica", codigo: "A-PA-03", nombre: "Sala de Docentes de Teleinformática",                    tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Sala de trabajo y reuniones para los docentes de la carrera de Teleinformática." },
  { slug: "a-pa-sala-reuniones-tutorias", codigo: "A-PA-04",    nombre: "Sala de Reuniones y Tutorías de Teleinformática",            tipo: "oficina",     bloqueSlug: "a", plantaNombre: "Planta Alta",  descripcion: "Espacio para reuniones y tutorías académicas de la carrera de Teleinformática." },
  // BLOQUE B – PB
  { slug: "b-pb-lab-fisica-1",  codigo: "14B-001",    nombre: "Laboratorio de Física 1",                        tipo: "laboratorio", bloqueSlug: "b", plantaNombre: "Planta Baja",  descripcion: "Laboratorio especializado para prácticas de Física 1." },
  { slug: "b-pb-lab-fisica-2",  codigo: "14B-002",    nombre: "Laboratorio de Física 2",                        tipo: "laboratorio", bloqueSlug: "b", plantaNombre: "Planta Baja",  descripcion: "Laboratorio especializado para prácticas de Física 2." },
  { slug: "b-pb-banos",         codigo: "B-PB-01",    nombre: "Baños H-M",                                      tipo: "bano",        bloqueSlug: "b", plantaNombre: "Planta Baja",  descripcion: "Módulo de baños para hombres y mujeres." },
  { slug: "b-pb-sala-conferencias", codigo: "B-PB-02", nombre: "Sala de Conferencias Econ. Vicente Rodríguez",  tipo: "servicio",    bloqueSlug: "b", plantaNombre: "Planta Baja",  descripcion: "Sala de conferencias dedicada al Econ. Vicente Rodríguez." },
  { slug: "b-pb-bodega-documentos", codigo: "B-PB-03", nombre: "Bodega de Documentos",                         tipo: "deposito",    bloqueSlug: "b", plantaNombre: "Planta Baja",  descripcion: "Bodega destinada al archivo y resguardo de documentos." },
  { slug: "b-pb-oficina-informacion-carreras", codigo: "B-PB-04", nombre: "Oficina de Información de Carreras", tipo: "oficina",    bloqueSlug: "b", plantaNombre: "Planta Baja",  descripcion: "Oficina de atención e información sobre las carreras de la Facultad." },
  { slug: "b-escalera-oeste",   codigo: "B-CIR-01",   nombre: "Escalera Bloque A-B",                            tipo: "circulacion", bloqueSlug: "b", plantaNombre: "Planta Baja",  descripcion: "Escalera de conexión vertical compartida con el Bloque A." },
  { slug: "b-escalera-este",    codigo: "B-CIR-02",   nombre: "Escalera Bloque B-C",                            tipo: "circulacion", bloqueSlug: "b", plantaNombre: "Planta Baja",  descripcion: "Escalera de conexión vertical compartida con el Bloque C." },
  // BLOQUE B – PM
  { slug: "b-pm-lab-computo-101", codigo: "14B-101",    nombre: "Laboratorio de Cómputo 14B-101",               tipo: "laboratorio", bloqueSlug: "b", plantaNombre: "Planta Media", descripcion: "Laboratorio de cómputo para clases y prácticas." },
  { slug: "b-pm-facultad-gestor-academico", codigo: "B-PM-01", nombre: "Gestor General de Formación Académica", tipo: "oficina",     bloqueSlug: "b", plantaNombre: "Planta Media", descripcion: "Oficina del Gestor General de Formación Académica." },
  { slug: "b-pm-aula-101",      codigo: "14B-101-AULA", nombre: "Aula 14B-101",                                 tipo: "aula",        bloqueSlug: "b", plantaNombre: "Planta Media", descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "b-pm-aula-102",      codigo: "14B-102",      nombre: "Aula 14B-102",                                 tipo: "aula",        bloqueSlug: "b", plantaNombre: "Planta Media", descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "b-pm-aula-103",      codigo: "14B-103",      nombre: "Aula 14B-103",                                 tipo: "aula",        bloqueSlug: "b", plantaNombre: "Planta Media", descripcion: "Aula de clases.", capacidad: 40 },
  // BLOQUE B – PA
  { slug: "b-pa-lab-da-vinci",  codigo: "B-PA-01",     nombre: "Laboratorio Da Vinci de Proyectos Teleinformáticos", tipo: "laboratorio", bloqueSlug: "b", plantaNombre: "Planta Alta", descripcion: "Laboratorio destinado al desarrollo de proyectos de la carrera de Teleinformática." },
  { slug: "b-pa-aula-201",      codigo: "14B-201",     nombre: "Aula 14B-201",                                  tipo: "aula",        bloqueSlug: "b", plantaNombre: "Planta Alta",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "b-pa-aula-202",      codigo: "14B-202",     nombre: "Aula 14B-202",                                  tipo: "aula",        bloqueSlug: "b", plantaNombre: "Planta Alta",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "b-pa-lab-computo-201", codigo: "14B-201-LAB", nombre: "Laboratorio de Cómputo 14B-201",              tipo: "laboratorio", bloqueSlug: "b", plantaNombre: "Planta Alta",  descripcion: "Laboratorio de cómputo de la carrera de Teleinformática." },
  // BLOQUE C – PB
  { slug: "c-pb-aula-003",   codigo: "14C-003",  nombre: "Aula 14C-003",                     tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Baja",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pb-aula-004",   codigo: "14C-004",  nombre: "Aula 14C-004",                     tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Baja",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pb-aula-005",   codigo: "14C-005",  nombre: "Aula 14C-005",                     tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Baja",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pb-aula-006",   codigo: "14C-006",  nombre: "Aula 14C-006",                     tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Baja",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pb-aula-007",   codigo: "14C-007",  nombre: "Aula 14C-007",                     tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Baja",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pb-lab-microcontroladores", codigo: "C-PB-01", nombre: "Laboratorio de Microcontroladores", tipo: "laboratorio", bloqueSlug: "c", plantaNombre: "Planta Baja", descripcion: "Laboratorio especializado en microcontroladores." },
  { slug: "c-pb-banos",      codigo: "C-PB-02",  nombre: "Baños H-M",                        tipo: "bano",        bloqueSlug: "c", plantaNombre: "Planta Baja",  descripcion: "Módulo de baños para hombres y mujeres." },
  { slug: "c-pb-feuiis",     codigo: "C-PB-03",  nombre: "FEUIIS — Federación de Estudiantes", tipo: "oficina",   bloqueSlug: "c", plantaNombre: "Planta Baja",  descripcion: "Oficina de la Federación de Estudiantes Universitarios de la Facultad." },
  { slug: "c-escalera",      codigo: "C-CIR-01", nombre: "Escalera Bloque B-C",               tipo: "circulacion", bloqueSlug: "c", plantaNombre: "Planta Baja", descripcion: "Escalera de conexión vertical compartida con el Bloque B." },
  // BLOQUE C – PM
  { slug: "c-pm-lab-computo-101",  codigo: "14C-101",      nombre: "Laboratorio de Cómputo 14C-101",          tipo: "laboratorio", bloqueSlug: "c", plantaNombre: "Planta Media", descripcion: "Laboratorio de cómputo para clases y prácticas." },
  { slug: "c-pm-lab-computo-102",  codigo: "14C-102",      nombre: "Laboratorio de Cómputo 14C-102",          tipo: "laboratorio", bloqueSlug: "c", plantaNombre: "Planta Media", descripcion: "Laboratorio de cómputo para clases y prácticas." },
  { slug: "c-pm-aula-101",         codigo: "14C-101-AULA", nombre: "Aula 14C-101",                            tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Media", descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pm-aula-102-redes",   codigo: "14C-102-AULA", nombre: "Aula 14C-102 / Lab. de Redes de Mantenimiento", tipo: "laboratorio", bloqueSlug: "c", plantaNombre: "Planta Media", descripcion: "Aula que funciona también como laboratorio de redes de mantenimiento." },
  { slug: "c-pm-aula-103",         codigo: "14C-103",      nombre: "Aula 14C-103",                            tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Media", descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pm-banos",            codigo: "C-PM-01",      nombre: "Baños M-H",                               tipo: "bano",        bloqueSlug: "c", plantaNombre: "Planta Media", descripcion: "Módulo de baños para hombres y mujeres." },
  { slug: "c-pm-secretaria-sistemas", codigo: "C-PM-02",   nombre: "Secretaría de Sistemas de Información",   tipo: "oficina",     bloqueSlug: "c", plantaNombre: "Planta Media", descripcion: "Oficina de secretaría de la carrera de Sistemas de Información." },
  { slug: "c-pm-sala-profesores-sistemas", codigo: "C-PM-03", nombre: "Sala de Profesores (Ing. en Sistemas)", tipo: "oficina",   bloqueSlug: "c", plantaNombre: "Planta Media", descripcion: "Sala de trabajo y reuniones para los docentes de la carrera de Ingeniería en Sistemas." },
  { slug: "c-pm-dts",              codigo: "C-PM-04",      nombre: "Departamento Técnico de Sistemas (D.T.S.)", tipo: "oficina",   bloqueSlug: "c", plantaNombre: "Planta Media", descripcion: "Oficina del Departamento Técnico de Sistemas." },
  { slug: "c-pm-vinculacion-bienestar", codigo: "C-PM-05", nombre: "Vinculación con la Comunidad — Bienestar Estudiantil", tipo: "oficina", bloqueSlug: "c", plantaNombre: "Planta Media", descripcion: "Oficina de Vinculación con la Comunidad y Bienestar Estudiantil." },
  // BLOQUE C – PA
  { slug: "c-pa-aula-201",  codigo: "14C-201",     nombre: "Aula 14C-201",                tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Alta",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pa-aula-202",  codigo: "14C-202",     nombre: "Aula 14C-202",                tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Alta",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pa-aula-203",  codigo: "14C-203",     nombre: "Aula 14C-203",                tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Alta",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pa-aula-204",  codigo: "14C-204",     nombre: "Aula 14C-204",                tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Alta",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pa-aula-205",  codigo: "14C-205",     nombre: "Aula 14C-205",                tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Alta",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pa-aula-206",  codigo: "14C-206",     nombre: "Aula 14C-206",                tipo: "aula",        bloqueSlug: "c", plantaNombre: "Planta Alta",  descripcion: "Aula de clases.", capacidad: 40 },
  { slug: "c-pa-lab-computo-201", codigo: "14C-201-LAB", nombre: "Laboratorio de Cómputo 14C-201", tipo: "laboratorio", bloqueSlug: "c", plantaNombre: "Planta Alta", descripcion: "Laboratorio de cómputo para clases y prácticas." },
  { slug: "c-pa-lab-computo-202", codigo: "14C-202-LAB", nombre: "Laboratorio de Cómputo 14C-202", tipo: "laboratorio", bloqueSlug: "c", plantaNombre: "Planta Alta", descripcion: "Laboratorio de cómputo para clases y prácticas." },
  { slug: "c-pa-archivero", codigo: "C-PA-01",     nombre: "Archivero",                   tipo: "deposito",    bloqueSlug: "c", plantaNombre: "Planta Alta",  descripcion: "Espacio destinado al archivo de documentación." },
  { slug: "c-pa-banos",     codigo: "C-PA-02",     nombre: "Baños H-M",                   tipo: "bano",        bloqueSlug: "c", plantaNombre: "Planta Alta",  descripcion: "Módulo de baños para hombres y mujeres." },
  // BLOQUE G
  { slug: "g-pb-aula1", codigo: "G-PB-01", nombre: "Aula G-PB-01", tipo: "aula", bloqueSlug: "g", plantaNombre: "Planta Baja", descripcion: "Primera aula de la fila oeste de la planta baja del Bloque G.", capacidad: 35 },
  { slug: "g-pb-aula2", codigo: "G-PB-02", nombre: "Aula G-PB-02", tipo: "aula", bloqueSlug: "g", plantaNombre: "Planta Baja", descripcion: "Aula intermedia de la fila oeste, junto a la escalera central.", capacidad: 35 },
  { slug: "g-pb-aula3", codigo: "G-PB-03", nombre: "Aula G-PB-03", tipo: "aula", bloqueSlug: "g", plantaNombre: "Planta Baja", descripcion: "Primera aula de la fila este, junto a la escalera central.", capacidad: 35 },
  { slug: "g-pb-aula4", codigo: "G-PB-04", nombre: "Aula G-PB-04", tipo: "aula", bloqueSlug: "g", plantaNombre: "Planta Baja", descripcion: "Aula final de la fila este de la planta baja.", capacidad: 35 },
  { slug: "g-escalera", codigo: "G-CIR-01", nombre: "Escalera central", tipo: "circulacion", bloqueSlug: "g", plantaNombre: "Planta Baja", descripcion: "Escalera que conecta planta baja y planta alta." },
  { slug: "g-pa-aula1", codigo: "G-PA-01", nombre: "Aula G-PA-01", tipo: "aula", bloqueSlug: "g", plantaNombre: "Planta Alta", descripcion: "Aula de la fila oeste en planta alta.", capacidad: 35 },
  { slug: "g-pa-aula2", codigo: "G-PA-02", nombre: "Aula G-PA-02", tipo: "aula", bloqueSlug: "g", plantaNombre: "Planta Alta", descripcion: "Aula de la fila oeste en planta alta, junto a la escalera central.", capacidad: 35 },
  { slug: "g-pa-aula3", codigo: "G-PA-03", nombre: "Aula G-PA-03", tipo: "aula", bloqueSlug: "g", plantaNombre: "Planta Alta", descripcion: "Aula de la fila este en planta alta, junto a la escalera central.", capacidad: 35 },
  { slug: "g-pa-aula4", codigo: "G-PA-04", nombre: "Aula G-PA-04", tipo: "aula", bloqueSlug: "g", plantaNombre: "Planta Alta", descripcion: "Aula final de la fila este en planta alta.", capacidad: 35 },
  // BLOQUE D y E
  { slug: "de-taller-principal", codigo: "D-01",     nombre: "Taller / Laboratorio principal",  tipo: "laboratorio", bloqueSlug: "d-e", plantaNombre: "Planta Baja", descripcion: "Espacio amplio en el cuerpo D destinado a prácticas de laboratorio o taller.", capacidad: 30 },
  { slug: "de-oficinas-d",       codigo: "D-02",     nombre: "Oficinas técnicas",                tipo: "oficina",     bloqueSlug: "d-e", plantaNombre: "Planta Baja", descripcion: "Conjunto de oficinas pequeñas adyacentes al taller principal del cuerpo D." },
  { slug: "de-deposito",         codigo: "D-03",     nombre: "Depósito / Bodega de materiales",  tipo: "deposito",    bloqueSlug: "d-e", plantaNombre: "Planta Baja", descripcion: "Bodega de almacenamiento de materiales y herramientas del taller." },
  { slug: "de-banos",            codigo: "D-04",     nombre: "Baños",                            tipo: "bano",        bloqueSlug: "d-e", plantaNombre: "Planta Baja", descripcion: "Módulo de baños ubicado en la conexión entre los cuerpos D y E." },
  { slug: "de-escalera",         codigo: "DE-CIR-01", nombre: "Escalera de conexión D-E",        tipo: "circulacion", bloqueSlug: "d-e", plantaNombre: "Planta Baja", descripcion: "Escalera ubicada en la unión entre ambos cuerpos del bloque." },
  { slug: "de-aula-e",           codigo: "E-01",     nombre: "Laboratorio E-01",                 tipo: "laboratorio", bloqueSlug: "d-e", plantaNombre: "Planta Baja", descripcion: "Laboratorio amplio ubicado en el cuerpo E.", capacidad: 30 },
  { slug: "de-oficina-e",        codigo: "E-02",     nombre: "Oficina E-02",                     tipo: "oficina",     bloqueSlug: "d-e", plantaNombre: "Planta Baja", descripcion: "Oficina ubicada junto al ingreso del cuerpo E." },
  // BLOQUE F
  { slug: "f-taller",  codigo: "F-01", nombre: "Taller / Nave de prácticas", tipo: "taller",   bloqueSlug: "f", plantaNombre: "Planta Única", descripcion: "Área principal de la nave, de planta abierta con estructura de columnas.", capacidad: 25 },
  { slug: "f-oficina", codigo: "F-02", nombre: "Oficina / Sala de control",  tipo: "oficina",  bloqueSlug: "f", plantaNombre: "Planta Única", descripcion: "Pequeña oficina ubicada en la esquina de ingreso de la nave." },
  { slug: "f-bodega",  codigo: "F-03", nombre: "Bodega / Casilleros",        tipo: "deposito", bloqueSlug: "f", plantaNombre: "Planta Única", descripcion: "Zona de almacenamiento y casilleros ubicada junto a los baños." },
  { slug: "f-banos",   codigo: "F-04", nombre: "Baños",                      tipo: "bano",     bloqueSlug: "f", plantaNombre: "Planta Única", descripcion: "Módulo de baños distribuido en tres compartimentos." },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin1234";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { username },
    update: {},
    create: { username, name: "Administrador", passwordHash, role: "ADMIN" },
  });
  console.log(`✓ Usuario admin: ${admin.username}`);

  for (const tipo of TIPOS) {
    await prisma.tipo.upsert({ where: { id: tipo.id }, update: { etiqueta: tipo.etiqueta, color: tipo.color, accent: tipo.accent, orden: tipo.orden }, create: tipo });
  }
  console.log(`✓ Tipos: ${TIPOS.length}`);

  for (const estado of ESTADOS_FISICOS) {
    await prisma.estadoFisico.upsert({ where: { nombre: estado.nombre }, update: { descripcion: estado.descripcion, color: estado.color, orden: estado.orden }, create: estado });
  }
  console.log(`✓ Estados físicos: ${ESTADOS_FISICOS.length}`);

  for (const uso of USOS_ESPACIO) {
    await prisma.usoEspacio.upsert({ where: { nombre: uso.nombre }, update: { descripcion: uso.descripcion, orden: uso.orden }, create: uso });
  }
  console.log(`✓ Usos de espacio: ${USOS_ESPACIO.length}`);

  for (const equip of EQUIPAMIENTOS) {
    await prisma.equipamiento.upsert({ where: { nombre: equip.nombre }, update: { descripcion: equip.descripcion, categoria: equip.categoria }, create: equip });
  }
  console.log(`✓ Equipamientos: ${EQUIPAMIENTOS.length}`);

  let planosBase64 = 0;
  for (const bloqueData of BLOQUES_DATA) {
    const { plantas, ...bloqueFields } = bloqueData;
    const bloque = await prisma.bloque.upsert({
      where:  { slug: bloqueFields.slug },
      update: { nombre: bloqueFields.nombre, resumen: bloqueFields.resumen, descripcion: bloqueFields.descripcion, orden: bloqueFields.orden },
      create: bloqueFields,
    });
    for (const plantaData of plantas) {
      const existente = await prisma.planta.findFirst({ where: { bloqueId: bloque.id, nombre: plantaData.nombre } });
      let planta;
      if (existente) {
        planta = await prisma.planta.update({ where: { id: existente.id }, data: { nivel: plantaData.nivel, imagenUrl: plantaData.imagenUrl } });
      } else {
        planta = await prisma.planta.create({ data: { ...plantaData, bloqueId: bloque.id } });
      }
      await seedPlantaPlano(planta.id, plantaData.imagenUrl, `${bloque.nombre} - ${plantaData.nombre}`);
      planosBase64++;
    }
  }
  console.log(`✓ Bloques y plantas: ${BLOQUES_DATA.length}`);
  console.log(`✓ Planos Base64: ${planosBase64}`);

  let creados = 0, actualizados = 0;
  for (const esp of ESPACIOS_DATA) {
    const bloque = await prisma.bloque.findUnique({ where: { slug: esp.bloqueSlug } });
    if (!bloque) { console.warn(`  ⚠ Bloque no encontrado: ${esp.bloqueSlug}`); continue; }
    const planta = await prisma.planta.findFirst({ where: { bloqueId: bloque.id, nombre: esp.plantaNombre } });
    if (!planta) { console.warn(`  ⚠ Planta no encontrada: ${esp.plantaNombre} en ${esp.bloqueSlug}`); continue; }
    const espData = { slug: esp.slug, codigo: esp.codigo, nombre: esp.nombre, descripcion: esp.descripcion, capacidad: esp.capacidad ?? null, tipoId: esp.tipo, bloqueId: bloque.id, plantaId: planta.id };
    const existente = await prisma.espacio.findUnique({ where: { slug: esp.slug } });
    if (existente) { await prisma.espacio.update({ where: { slug: esp.slug }, data: espData }); actualizados++; }
    else { await prisma.espacio.create({ data: espData }); creados++; }
  }
  console.log(`✓ Espacios: ${creados} creados, ${actualizados} actualizados`);
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
