-- Verificar se a tabela Item existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'Item';

-- Se a tabela existir, remover o trigger antigo (se existir)
DROP TRIGGER IF EXISTS item_updated_at_trigger ON "Item";

-- Recriar a função (garantir que existe)
CREATE OR REPLACE FUNCTION update_item_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar o trigger novamente
CREATE TRIGGER item_updated_at_trigger
    BEFORE UPDATE ON "Item"
    FOR EACH ROW
    EXECUTE FUNCTION update_item_updated_at();

-- Verificar se o trigger foi criado
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'item_updated_at_trigger';
