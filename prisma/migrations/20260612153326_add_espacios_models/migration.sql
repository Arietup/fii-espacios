-- CreateTable
CREATE TABLE "Tipo" (
    "id" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "accent" TEXT NOT NULL,

    CONSTRAINT "Tipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bloque" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "resumen" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bloque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planta" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 0,
    "imagenUrl" TEXT NOT NULL,
    "bloqueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Planta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Espacio" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "capacidad" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "tipoId" TEXT NOT NULL,
    "bloqueId" TEXT NOT NULL,
    "plantaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Espacio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bloque_slug_key" ON "Bloque"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Espacio_slug_key" ON "Espacio"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Espacio_codigo_key" ON "Espacio"("codigo");

-- AddForeignKey
ALTER TABLE "Planta" ADD CONSTRAINT "Planta_bloqueId_fkey" FOREIGN KEY ("bloqueId") REFERENCES "Bloque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Espacio" ADD CONSTRAINT "Espacio_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "Tipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Espacio" ADD CONSTRAINT "Espacio_bloqueId_fkey" FOREIGN KEY ("bloqueId") REFERENCES "Bloque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Espacio" ADD CONSTRAINT "Espacio_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Planta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
