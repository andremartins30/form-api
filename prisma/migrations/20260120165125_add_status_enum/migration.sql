/*
  Warnings:

  - The `status` column on the `FormPlano` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusPlano" AS ENUM ('EM_ANALISE', 'APROVADO', 'NEGADO');

-- AlterTable
ALTER TABLE "FormPlano" DROP COLUMN "status",
ADD COLUMN     "status" "StatusPlano" NOT NULL DEFAULT 'EM_ANALISE';

-- CreateIndex
CREATE INDEX "FormPlano_status_idx" ON "FormPlano"("status");
