-- Script para migrar de UUID para IDs inteiros auto-incrementais
-- ATENÇÃO: Isso vai apagar todos os dados das tabelas Category e Item!

-- Passo 1: Remover as tabelas existentes (com CASCADE para remover dependências)
DROP TABLE IF EXISTS "Item" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;

-- Passo 2: Criar tabela Category com ID inteiro
CREATE TABLE "Category" (
    "id" SERIAL PRIMARY KEY,
    "value" TEXT NOT NULL UNIQUE,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Passo 3: Criar tabela Item com ID inteiro
CREATE TABLE "Item" (
    "id" SERIAL PRIMARY KEY,
    "categoryId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Item_categoryId_value_key" UNIQUE ("categoryId", "value")
);

-- Passo 4: Criar índice
CREATE INDEX "Item_categoryId_idx" ON "Item"("categoryId");

-- Passo 5: Recriar triggers
CREATE OR REPLACE FUNCTION update_category_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER category_updated_at_trigger
    BEFORE UPDATE ON "Category"
    FOR EACH ROW
    EXECUTE FUNCTION update_category_updated_at();

CREATE OR REPLACE FUNCTION update_item_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER item_updated_at_trigger
    BEFORE UPDATE ON "Item"
    FOR EACH ROW
    EXECUTE FUNCTION update_item_updated_at();

-- Passo 6: Verificar estrutura
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('Category', 'Item')
ORDER BY table_name, ordinal_position;
