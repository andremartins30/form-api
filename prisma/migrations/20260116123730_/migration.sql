/*
  Warnings:

  - You are about to drop the column `submissionId` on the `CadeiaValor` table. All the data in the column will be lost.
  - You are about to drop the column `submissionId` on the `Equipamento` table. All the data in the column will be lost.
  - You are about to drop the column `submissionId` on the `Profissional` table. All the data in the column will be lost.
  - You are about to drop the `FormSubmission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `planoId` to the `CadeiaValor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planoId` to the `Equipamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planoId` to the `Profissional` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CadeiaValor" DROP CONSTRAINT "CadeiaValor_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "Equipamento" DROP CONSTRAINT "Equipamento_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "FormSubmission" DROP CONSTRAINT "FormSubmission_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "FormSubmission" DROP CONSTRAINT "FormSubmission_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Profissional" DROP CONSTRAINT "Profissional_submissionId_fkey";

-- DropIndex
DROP INDEX "CadeiaValor_submissionId_idx";

-- DropIndex
DROP INDEX "Equipamento_submissionId_idx";

-- DropIndex
DROP INDEX "Profissional_submissionId_idx";

-- AlterTable
ALTER TABLE "CadeiaValor" DROP COLUMN "submissionId",
ADD COLUMN     "planoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Equipamento" DROP COLUMN "submissionId",
ADD COLUMN     "planoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profissional" DROP COLUMN "submissionId",
ADD COLUMN     "planoId" TEXT NOT NULL;

-- DropTable
DROP TABLE "FormSubmission";

-- CreateTable
CREATE TABLE "FormPlano" (
    "id" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "formVersion" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "nomeProponente" TEXT NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "municipio" TEXT NOT NULL,
    "telefone1" TEXT,
    "telefone2" TEXT,
    "email" TEXT,
    "categoriaId" INTEGER,
    "itemId" INTEGER,
    "possuiAgricultores" BOOLEAN NOT NULL DEFAULT false,
    "quantidadeFamilias" INTEGER,
    "publicoAgricultura" BOOLEAN NOT NULL DEFAULT true,
    "declaracaoVeracidade" BOOLEAN NOT NULL DEFAULT false,
    "dataPropostaSubmissao" TIMESTAMP(3),
    "localProposta" TEXT,
    "responsavelTecnico" TEXT,
    "gestorNome" TEXT,
    "payloadFormatado" JSONB NOT NULL,
    "payloadOriginal" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormPlano_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormPlano_municipio_idx" ON "FormPlano"("municipio");

-- CreateIndex
CREATE INDEX "FormPlano_categoriaId_idx" ON "FormPlano"("categoriaId");

-- CreateIndex
CREATE INDEX "FormPlano_formType_idx" ON "FormPlano"("formType");

-- CreateIndex
CREATE INDEX "FormPlano_status_idx" ON "FormPlano"("status");

-- CreateIndex
CREATE INDEX "FormPlano_cnpj_idx" ON "FormPlano"("cnpj");

-- CreateIndex
CREATE INDEX "FormPlano_createdAt_idx" ON "FormPlano"("createdAt");

-- CreateIndex
CREATE INDEX "CadeiaValor_planoId_idx" ON "CadeiaValor"("planoId");

-- CreateIndex
CREATE INDEX "Equipamento_planoId_idx" ON "Equipamento"("planoId");

-- CreateIndex
CREATE INDEX "Profissional_planoId_idx" ON "Profissional"("planoId");

-- AddForeignKey
ALTER TABLE "FormPlano" ADD CONSTRAINT "FormPlano_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormPlano" ADD CONSTRAINT "FormPlano_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profissional" ADD CONSTRAINT "Profissional_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "FormPlano"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CadeiaValor" ADD CONSTRAINT "CadeiaValor_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "FormPlano"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipamento" ADD CONSTRAINT "Equipamento_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "FormPlano"("id") ON DELETE CASCADE ON UPDATE CASCADE;
