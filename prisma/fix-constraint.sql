-- Script para corrigir a constraint única da tabela Item
-- Execute este script no PostgreSQL

-- Passo 1: Remover o índice único antigo (se existir)
DROP INDEX IF EXISTS "Item_categoryId_value_key";

-- Passo 2: Remover a constraint antiga (se existir)
ALTER TABLE "Item" DROP CONSTRAINT IF EXISTS "Item_categoryId_value_key";

-- Passo 3: Adicionar a constraint única corretamente
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_value_key" UNIQUE ("categoryId", "value");

-- Passo 4: Verificar se a constraint foi criada com sucesso
SELECT 
    conname AS constraint_name, 
    contype AS constraint_type,
    CASE 
        WHEN contype = 'u' THEN 'UNIQUE'
        WHEN contype = 'p' THEN 'PRIMARY KEY'
        WHEN contype = 'f' THEN 'FOREIGN KEY'
    END AS type_description
FROM pg_constraint 
WHERE conrelid = '"Item"'::regclass 
AND conname = 'Item_categoryId_value_key';
