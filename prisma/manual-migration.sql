-- Script de migração para adicionar as tabelas Category e Item
-- Execute este script manualmente no seu banco de dados PostgreSQL

-- Criar tabela Category
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Category_value_key" UNIQUE ("value")
);

-- Criar tabela Item
CREATE TABLE IF NOT EXISTS "Item" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Item_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Criar índices
CREATE UNIQUE INDEX IF NOT EXISTS "Item_categoryId_value_key" ON "Item"("categoryId", "value");
CREATE INDEX IF NOT EXISTS "Item_categoryId_idx" ON "Item"("categoryId");

-- Trigger para atualizar o updatedAt automaticamente na tabela Category
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

-- Trigger para atualizar o updatedAt automaticamente na tabela Item
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
