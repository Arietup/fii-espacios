-- CreateEnum
CREATE TYPE "TipoImagen" AS ENUM ('PLANO', 'REFERENCIAL', 'FOTO');

-- CreateTable
CREATE TABLE "Imagen" (
    "id" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "tipo" "TipoImagen" NOT NULL,
    "nombre" TEXT,
    "mimeType" TEXT NOT NULL,
    "base64" TEXT NOT NULL,
    "descripcion" TEXT,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Imagen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Imagen_entidad_entidadId_idx" ON "Imagen"("entidad", "entidadId");

-- CreateIndex
CREATE INDEX "Imagen_entidad_entidadId_tipo_idx" ON "Imagen"("entidad", "entidadId", "tipo");
