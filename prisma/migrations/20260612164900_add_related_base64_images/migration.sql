/*
  Warnings:

  - You are about to drop the column `url` on the `EspacioImagen` table. All the data in the column will be lost.
  - Added the required column `base64` to the `EspacioImagen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `EspacioImagen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipoImagen" ADD VALUE 'CROQUIS';
ALTER TYPE "TipoImagen" ADD VALUE 'OTRO';

-- DropIndex
DROP INDEX "Imagen_entidad_entidadId_idx";

-- DropIndex
DROP INDEX "Imagen_entidad_entidadId_tipo_idx";

-- AlterTable
ALTER TABLE "EspacioImagen" DROP COLUMN "url",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "base64" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "tipo" "TipoImagen" NOT NULL DEFAULT 'FOTO';

-- CreateTable
CREATE TABLE "BloqueImagen" (
    "id" TEXT NOT NULL,
    "bloqueId" TEXT NOT NULL,
    "tipo" "TipoImagen" NOT NULL DEFAULT 'FOTO',
    "nombre" TEXT,
    "descripcion" TEXT,
    "mimeType" TEXT NOT NULL,
    "base64" TEXT NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloqueImagen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantaImagen" (
    "id" TEXT NOT NULL,
    "plantaId" TEXT NOT NULL,
    "tipo" "TipoImagen" NOT NULL DEFAULT 'PLANO',
    "nombre" TEXT,
    "descripcion" TEXT,
    "mimeType" TEXT NOT NULL,
    "base64" TEXT NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantaImagen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BloqueImagen_bloqueId_idx" ON "BloqueImagen"("bloqueId");

-- CreateIndex
CREATE INDEX "BloqueImagen_bloqueId_tipo_idx" ON "BloqueImagen"("bloqueId", "tipo");

-- CreateIndex
CREATE INDEX "PlantaImagen_plantaId_idx" ON "PlantaImagen"("plantaId");

-- CreateIndex
CREATE INDEX "PlantaImagen_plantaId_tipo_idx" ON "PlantaImagen"("plantaId", "tipo");

-- CreateIndex
CREATE INDEX "EspacioImagen_espacioId_idx" ON "EspacioImagen"("espacioId");

-- CreateIndex
CREATE INDEX "EspacioImagen_espacioId_tipo_idx" ON "EspacioImagen"("espacioId", "tipo");

-- AddForeignKey
ALTER TABLE "BloqueImagen" ADD CONSTRAINT "BloqueImagen_bloqueId_fkey" FOREIGN KEY ("bloqueId") REFERENCES "Bloque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantaImagen" ADD CONSTRAINT "PlantaImagen_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Planta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
