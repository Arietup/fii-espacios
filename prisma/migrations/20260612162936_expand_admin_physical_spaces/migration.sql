-- AlterTable
ALTER TABLE "Bloque" ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "ubicacion" TEXT;

-- AlterTable
ALTER TABLE "Espacio" ADD COLUMN     "accesoPublico" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "altoCm" INTEGER,
ADD COLUMN     "anchoCm" INTEGER,
ADD COLUMN     "areaM2" DOUBLE PRECISION,
ADD COLUMN     "cantidadPuestos" INTEGER,
ADD COLUMN     "estadoFisicoId" TEXT,
ADD COLUMN     "largoCm" INTEGER,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "ubicacionReferencia" TEXT;

-- AlterTable
ALTER TABLE "Planta" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "orden" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Tipo" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "icono" TEXT,
ADD COLUMN     "orden" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "EstadoFisico" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "color" TEXT NOT NULL DEFAULT '#64748B',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstadoFisico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsoEspacio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsoEspacio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipamiento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantaPlano" (
    "id" TEXT NOT NULL,
    "plantaId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "nombre" TEXT,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "principal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantaPlano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EspacioUso" (
    "espacioId" TEXT NOT NULL,
    "usoId" TEXT NOT NULL,

    CONSTRAINT "EspacioUso_pkey" PRIMARY KEY ("espacioId","usoId")
);

-- CreateTable
CREATE TABLE "EspacioEquipamiento" (
    "id" TEXT NOT NULL,
    "espacioId" TEXT NOT NULL,
    "equipamientoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "estado" TEXT,
    "observaciones" TEXT,

    CONSTRAINT "EspacioEquipamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EspacioComentario" (
    "id" TEXT NOT NULL,
    "espacioId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "tipoComentario" TEXT,
    "visiblePublicamente" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EspacioComentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EspacioImagen" (
    "id" TEXT NOT NULL,
    "espacioId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "nombre" TEXT,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EspacioImagen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EstadoFisico_nombre_key" ON "EstadoFisico"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "UsoEspacio_nombre_key" ON "UsoEspacio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Equipamiento_nombre_key" ON "Equipamiento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "EspacioEquipamiento_espacioId_equipamientoId_key" ON "EspacioEquipamiento"("espacioId", "equipamientoId");

-- AddForeignKey
ALTER TABLE "PlantaPlano" ADD CONSTRAINT "PlantaPlano_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Planta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Espacio" ADD CONSTRAINT "Espacio_estadoFisicoId_fkey" FOREIGN KEY ("estadoFisicoId") REFERENCES "EstadoFisico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspacioUso" ADD CONSTRAINT "EspacioUso_espacioId_fkey" FOREIGN KEY ("espacioId") REFERENCES "Espacio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspacioUso" ADD CONSTRAINT "EspacioUso_usoId_fkey" FOREIGN KEY ("usoId") REFERENCES "UsoEspacio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspacioEquipamiento" ADD CONSTRAINT "EspacioEquipamiento_espacioId_fkey" FOREIGN KEY ("espacioId") REFERENCES "Espacio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspacioEquipamiento" ADD CONSTRAINT "EspacioEquipamiento_equipamientoId_fkey" FOREIGN KEY ("equipamientoId") REFERENCES "Equipamiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspacioComentario" ADD CONSTRAINT "EspacioComentario_espacioId_fkey" FOREIGN KEY ("espacioId") REFERENCES "Espacio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspacioComentario" ADD CONSTRAINT "EspacioComentario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspacioImagen" ADD CONSTRAINT "EspacioImagen_espacioId_fkey" FOREIGN KEY ("espacioId") REFERENCES "Espacio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
