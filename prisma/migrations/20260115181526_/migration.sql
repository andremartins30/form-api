/*
  Warnings:

  - You are about to drop the column `payload` on the `FormSubmission` table. All the data in the column will be lost.
  - Added the required column `cnpj` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formType` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipio` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeProponente` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payloadFormatado` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormSubmission" DROP COLUMN "payload",
ADD COLUMN     "categoriaId" INTEGER,
ADD COLUMN     "cnpj" VARCHAR(14) NOT NULL,
ADD COLUMN     "dataPropostaSubmissao" TIMESTAMP(3),
ADD COLUMN     "declaracaoVeracidade" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "formType" TEXT NOT NULL,
ADD COLUMN     "gestorNome" TEXT,
ADD COLUMN     "itemId" INTEGER,
ADD COLUMN     "localProposta" TEXT,
ADD COLUMN     "municipio" TEXT NOT NULL,
ADD COLUMN     "nomeProponente" TEXT NOT NULL,
ADD COLUMN     "payloadFormatado" JSONB NOT NULL,
ADD COLUMN     "payloadOriginal" JSONB,
ADD COLUMN     "possuiAgricultores" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicoAgricultura" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "quantidadeFamilias" INTEGER,
ADD COLUMN     "responsavelTecnico" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pendente',
ADD COLUMN     "telefone1" TEXT,
ADD COLUMN     "telefone2" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Profissional" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "instituicao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profissional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CadeiaValor" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "produto" TEXT,
    "mercados" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CadeiaValor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nome" TEXT,
    "quantidade" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Profissional_submissionId_idx" ON "Profissional"("submissionId");

-- CreateIndex
CREATE INDEX "Profissional_tipo_idx" ON "Profissional"("tipo");

-- CreateIndex
CREATE INDEX "CadeiaValor_submissionId_idx" ON "CadeiaValor"("submissionId");

-- CreateIndex
CREATE INDEX "CadeiaValor_tipo_idx" ON "CadeiaValor"("tipo");

-- CreateIndex
CREATE INDEX "Equipamento_submissionId_idx" ON "Equipamento"("submissionId");

-- CreateIndex
CREATE INDEX "Equipamento_tipo_idx" ON "Equipamento"("tipo");

-- CreateIndex
CREATE INDEX "FormSubmission_municipio_idx" ON "FormSubmission"("municipio");

-- CreateIndex
CREATE INDEX "FormSubmission_categoriaId_idx" ON "FormSubmission"("categoriaId");

-- CreateIndex
CREATE INDEX "FormSubmission_formType_idx" ON "FormSubmission"("formType");

-- CreateIndex
CREATE INDEX "FormSubmission_status_idx" ON "FormSubmission"("status");

-- CreateIndex
CREATE INDEX "FormSubmission_cnpj_idx" ON "FormSubmission"("cnpj");

-- CreateIndex
CREATE INDEX "FormSubmission_createdAt_idx" ON "FormSubmission"("createdAt");

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profissional" ADD CONSTRAINT "Profissional_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CadeiaValor" ADD CONSTRAINT "CadeiaValor_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipamento" ADD CONSTRAINT "Equipamento_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
