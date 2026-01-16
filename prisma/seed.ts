import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categoriesData = [
        {
            value: "agroindustria",
            label: "Agroindústrias",
            formType: "default",
            order: 1,
            items: [
                { value: "despolpadeira", label: "Despolpadeira de fruta industrial", order: 1 },
                { value: "envasadora", label: "Envasadora embaladora automática", order: 2 },
                { value: "farinheira", label: "Farinheira móvel", order: 3 }
            ]
        },
        {
            value: "leite",
            label: "Equipamentos Leite",
            formType: "default",
            order: 2,
            items: [
                { value: "ordenhadeira", label: "Ordenhadeira mecânica", order: 1 },
                { value: "resfriador1000", label: "Resfriador 1000L", order: 2 },
                { value: "resfriador500", label: "Resfriador 500L", order: 3 },
                { value: "vertical10000", label: "Resfriador vertical 10.000L", order: 4 },
                { value: "vertical20000", label: "Resfriador vertical 20.000L", order: 5 },
                { value: "silo40000", label: "Silo vertical 40.000L", order: 6 }
            ]
        },
        {
            value: "transporte",
            label: "Transporte Leite",
            formType: "default",
            order: 3,
            items: [
                { value: "caminhao", label: "Caminhão tanque toco isotérmico", order: 1 }
            ]
        },
        {
            value: "calcario",
            label: "Insumos/Calcário",
            formType: "calcario",
            order: 4,
            items: [
                { value: "dolomitico", label: "Calcário dolomítico", order: 1 }
            ]
        },
        {
            value: "apicultura",
            label: "Insumos/Apicultura",
            formType: "default",
            order: 5,
            items: [
                { value: "kitG", label: "Kit apicultura G", order: 1 },
                { value: "kitGG", label: "Kit apicultura GG", order: 2 },
                { value: "kitM", label: "Kit apicultura M", order: 3 },
                { value: "kitXG", label: "Kit apicultura XG", order: 4 },
                { value: "kitXXG", label: "Kit apicultura XXG", order: 5 },
                { value: "caixa", label: "Caixa de abelha", order: 6 }
            ]
        },
        {
            value: "mudas",
            label: "Insumos/Mudas",
            formType: "mudas",
            order: 6,
            items: [
                { value: "banana_princesa", label: "Muda de Banana - Variedade: BRS Princesa, Tipo: Maçã", order: 1 },
                { value: "banana_terra_ana", label: "Muda de Banana - Variedade: BRS Terra-Anã, Tipo: Terra", order: 2 },
                { value: "banana_farta_velhaco", label: "Muda de Banana - Variedade: Farta Velhaco, Tipo: Terra", order: 3 },
                { value: "banana_nanica", label: "Muda de Banana - Variedade: Nanica, Tipo: Cavendish", order: 4 },
                { value: "citrus_laranja_pera", label: "Mudas de Citrus - Variedade: Laranja Pera IAC", order: 5 },
                { value: "citrus_lima_tahiti", label: "Mudas de Citrus - Variedade: Lima Ácida Tahiti", order: 6 },
                { value: "citrus_tangerina_pokan", label: "Mudas de Citrus - Variedade: Tangerina Pokan", order: 7 },
                { value: "maracuja", label: "Mudas de Maracujá", order: 8 },
                { value: "cacau", label: "Mudas de Cacau", order: 9 },
                { value: "cafe_conilon", label: "Mudas de Café - Coffea canephora, variedade Conilon", order: 10 }
            ]
        },
        {
            value: "semen",
            label: "Insumos/Sêmen",
            formType: "default",
            order: 7,
            items: [
                { value: "gir_leiteiro_conv", label: "Sêmen de Bovinos Convencional da Raça Gir Leiteiro", order: 1 },
                { value: "girolando_3_4_conv", label: "Sêmen de Bovinos Convencional da Raça Girolando 3/4 Sangue", order: 2 },
                { value: "girolando_5_8_conv", label: "Sêmen de Bovinos Convencional da Raça Girolando 5/8 Sangue", order: 3 },
                { value: "holandesa_conv", label: "Sêmen de Bovinos Convencional da Raça Holandesa", order: 4 },
                { value: "jersey_conv", label: "Sêmen de Bovinos Convencional da Raça Jersey", order: 5 },
                { value: "gir_leiteiro_sexado", label: "Sêmen de Bovinos Sexado de Fêmea da Raça Gir Leiteiro", order: 6 },
                { value: "girolando_3_4_sexado", label: "Sêmen de Bovinos Sexado de Fêmea da Raça Girolando 3/4 Sangue", order: 7 },
                { value: "girolando_5_8_sexado", label: "Sêmen de Bovinos Sexado de Fêmea da Raça Girolando 5/8 Sangue", order: 8 },
                { value: "holandesa_sexado", label: "Sêmen de Bovinos Sexado de Fêmea da Raça Holandesa", order: 9 },
                { value: "jersey_sexado", label: "Sêmen de Bovinos Sexado de Fêmea da Raça Jersey", order: 10 }
            ]
        },
        {
            value: "comercializacao",
            label: "Comercialização",
            formType: "default",
            order: 8,
            items: [
                { value: "barracas", label: "Barracas para feira", order: 1 }
            ]
        },
        {
            value: "mecanizacao",
            label: "Mecanização Agrícola",
            formType: "default",
            order: 9,
            items: [
                { value: "carreta_6tn", label: "Carreta Agrícola 6TN", order: 1 },
                { value: "carreta_basculante_6tn", label: "Carreta Agrícola Basculante 6TN", order: 2 },
                { value: "carreta_micro_trator", label: "Carreta para Micro Trator", order: 3 },
                { value: "carrinho_mao", label: "Carrinho Mão Pneu/Câmara 60 Lts", order: 4 },
                { value: "colhedora_cafe", label: "Colhedora de Café", order: 5 },
                { value: "colhedora_forragem_total", label: "Colhedora de Forragem Área Total", order: 6 },
                { value: "colhedora_forragem_1linha", label: "Colhedora de Forragens de 01 Linha", order: 7 },
                { value: "colhedora_milho_2linhas", label: "Colhedora de Milho 2 Linhas", order: 8 },
                { value: "conjunto_hidraulico", label: "Conjunto Hidráulico de Levante Frontal", order: 9 },
                { value: "desperfilhador", label: "Desperfilhador por Roto-Compressão", order: 10 },
                { value: "distribuidor_adubo", label: "Distribuidor de Adubo, Calcário, Fertilizantes e Orgânicos", order: 11 },
                { value: "enxada_rotativa", label: "Enxada Rotativa", order: 12 },
                { value: "enxada_rotativa_encanteirador", label: "Enxada Rotativa com Encanteirador", order: 13 },
                { value: "grade_aradora_14", label: "Grade Aradora 14 Discos", order: 14 },
                { value: "grade_aradora_16", label: "Grade Aradora 16 Discos", order: 15 },
                { value: "grade_niveladora_28", label: "Grade Niveladora 28 Discos", order: 16 },
                { value: "grade_niveladora_32", label: "Grade Niveladora 32 Discos", order: 17 },
                { value: "grade_niveladora_40", label: "Grade Niveladora 40 Discos", order: 18 },
                { value: "kit_irrigacao", label: "Kit Irrigação", order: 19 },
                { value: "micro_trator_diesel", label: "Micro Trator a Diesel", order: 20 },
                { value: "misturador_racao", label: "Misturador de Ração", order: 21 },
                { value: "motocultivador_gasolina", label: "Motocultivadores a Gasolina", order: 22 },
                { value: "perfurador_solo_hidraulico", label: "Perfurador de Solo Hidráulico", order: 23 },
                { value: "perfurador_solo_gasolina", label: "Perfurador de Solo a Gasolina 1,2CV", order: 24 },
                { value: "plantadeira_abacaxi", label: "Plantadeira de Abacaxi 2 Linhas", order: 25 },
                { value: "plantadeira_mandioca", label: "Plantadeira de Mandioca 2 Linhas", order: 26 },
                { value: "plantadeira_2linhas", label: "Plantadeira e Adubadeira 2 Linhas", order: 27 },
                { value: "plantadeira_4linhas", label: "Plantadeira e Adubadeira 4 Linhas", order: 28 },
                { value: "pulverizador_costal", label: "Pulverizador Costal a Gasolina 1,0CV", order: 29 },
                { value: "rocadeira_costal", label: "Roçadeira Costal a Gasolina 1,5CV", order: 30 },
                { value: "rocadeira_hidraulica", label: "Roçadeira Hidráulica", order: 31 },
                { value: "subsolador_2linhas", label: "Subsolador 2 Linhas", order: 32 },
                { value: "trator_plataformado_75cv", label: "Trator Plataformado 75 CV", order: 33 },
                { value: "trator_cabinado_110cv", label: "Trator Cabinado 110 CV", order: 34 },
                { value: "trator_cabinado_80cv", label: "Trator Cabinado 80 CV", order: 35 },
                { value: "triturador_graos", label: "Triturador de Grãos Secos", order: 36 }
            ]
        },
        {
            value: "veiculos",
            label: "Veículos",
            formType: "default",
            order: 10,
            items: [
                { value: "pickup_4x4_diesel_2p", label: "Pick-up, 4x4, Diesel 2 Portas", order: 1 },
                { value: "pickup_4x4_diesel_4p", label: "Pick-up, 4x4, Diesel 4 Portas", order: 2 },
                { value: "pickup_4x2_flex_4p", label: "Pick-up, 4x2, Flex, 4 Portas", order: 3 },
                { value: "pickup_4x2_flex_2p", label: "Pick-up, 4x2, Flex, 2 Portas", order: 4 }
            ]
        },
        {
            value: "veiculo_carga",
            label: "Veículo de Carga",
            formType: "default",
            order: 11,
            items: [
                { value: "caminhao_bau", label: "Caminhão Baú", order: 1 },
                { value: "caminhao_bau_refrigerado", label: "Caminhão Baú Refrigerado", order: 2 },
                { value: "pickup_4x2_flex_furgao", label: "Pick-up, 4x2, Flex, Furgão", order: 3 }
            ]
        },
        {
            value: "infraestrutura",
            label: "Infraestrutura",
            formType: "default",
            order: 12,
            items: [
                { value: "caminhao_cavalo_mecanico", label: "Caminhão Cavalo Mecânico", order: 1 },
                { value: "caminhao_pipa", label: "Caminhão Pipa", order: 2 },
                { value: "caminhao_truck_cacamba", label: "Caminhão Truck Caçamba Basculante 12M³", order: 3 },
                { value: "escavadeira_hidraulica", label: "Escavadeira Hidráulica", order: 4 },
                { value: "motoniveladora", label: "Motoniveladora", order: 5 },
                { value: "pa_carregadeira", label: "Pá Carregadeira", order: 6 },
                { value: "retroescavadeira", label: "Retroescavadeira", order: 7 },
                { value: "rolo_compactador", label: "Rolo Compactador 110 HP", order: 8 },
                { value: "semirreboque_basculante_3eixos", label: "Semirreboque Basculante 3 Eixos", order: 9 },
                { value: "semirreboque_prancha_2eixos", label: "Semirreboque Prancha 2 Eixos", order: 10 },
                { value: "semirreboque_prancha_3eixos", label: "Semirreboque Prancha 3 Eixos", order: 11 }
            ]
        }
    ];

    const communityTypesData = [
        { value: "comunidades_tradicionais", label: "Comunidades tradicionais", order: 1 },
        { value: "comunidades_indigenas", label: "Comunidades indígenas", order: 2 },
        { value: "quilombolas", label: "Comunidades quilombolas", order: 3 },
        { value: "assentamentos", label: "Assentamentos", order: 4 },
        { value: "associacoes", label: "Associações de produtores", order: 5 },
        { value: "comunidades_outras", label: "Comunidades outras", order: 6 },
        { value: "cooperativas", label: "Cooperativas de produtores", order: 7 },
        { value: "outros_grupos", label: "Outros", order: 8 }
    ];

    console.log('🌱 Iniciando seed...');

    // Seed de categorias
    for (const categoryData of categoriesData) {
        const { items, ...categoryInfo } = categoryData;

        console.log(`📦 Criando categoria: ${categoryInfo.label}`);

        const category = await prisma.category.upsert({
            where: { value: categoryInfo.value },
            update: categoryInfo,
            create: categoryInfo
        });

        console.log(`  ↳ Criando ${items.length} itens...`);

        for (const item of items) {
            await prisma.item.upsert({
                where: {
                    categoryId_value: {
                        categoryId: category.id,
                        value: item.value
                    }
                },
                update: { label: item.label, order: item.order },
                create: {
                    categoryId: category.id,
                    ...item
                }
            });
        }
    }

    // Seed de tipos de comunidades
    console.log('\n👥 Criando tipos de comunidades...');
    for (const communityType of communityTypesData) {
        await prisma.communityType.upsert({
            where: { value: communityType.value },
            update: { label: communityType.label, order: communityType.order },
            create: communityType
        });
    }

    console.log('✅ Seed concluído com sucesso!');
    console.log(`📊 Total: ${categoriesData.length} categorias criadas`);
    console.log(`👥 Total: ${communityTypesData.length} tipos de comunidades criadas`);
}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });