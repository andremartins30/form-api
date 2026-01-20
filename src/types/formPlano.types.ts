/**
 * Tipos TypeScript para estrutura de dados do formulário
 * Baseados no JSON formatado do frontend
 */

import { StatusPlano } from '@prisma/client';

export { StatusPlano };

// ============================================
// Interfaces para Dados Formatados
// ============================================

export interface InformacoesContato {
    nome_proponente: string;
    cnpj: string;
    municipio: string;
    telefone_1?: string;
    telefone_2?: string;
    email?: string;
}

export interface Solicitacao {
    categoria: string;
    item: string;
}

export interface AgricultoresFamiliares {
    possui: string;
    quantidade_familias?: string; // Vem como string do frontend
}

export interface OrganizacaoComunidades {
    organizados: string;
    tipos_comunidades?: string[];
    quantidades?: Record<string, number>;
}

export interface DetalhesCadeiaValor {
    tipo: string;
    produto: string;
    mercados: string[];
}

export interface CadeiasValorPrincipais {
    tipos: string[];
    detalhes?: DetalhesCadeiaValor[];
}

export interface PoliticasPublicas {
    executa: string;
    quais?: string;
}

export interface DetalhesProfissional {
    tipo: string;
    instituicao: string;
}

export interface Profissionais {
    possui_quadro: string;
    tipos: string[];
    detalhes?: DetalhesProfissional[];
}

export interface DificuldadesProponente {
    principais: string[];
    outras_descricao?: string;
}

export interface DesafiosAgricultores {
    principais: string[];
    outros_descricao?: string;
}

export interface DetalhesEquipamento {
    tipo: string;
    nome?: string;
    quantidade: number;
}

export interface CapacidadeAtendimento {
    equipamentos: string[];
    detalhes?: DetalhesEquipamento[];
}

export interface ListaProdutor {
    nome: string;
    cpf: string;
    area_hectares: number;
    localizacao: string;
}

export interface ListaProdutorMudas {
    nome: string;
    cpf: string;
    especie: string;
    quantidade_mudas: number;
}

export interface ResponsabilidadeDetalhada {
    resposta: string;
    descricao?: string;
}

export interface Compromissos {
    gestao_administrativa_operacional?: string;
    local_armazenamento_adequado?: string;
    responsabiliza_custos?: ResponsabilidadeDetalhada;
    monitoramento_atividades?: ResponsabilidadeDetalhada;
    relatorio_anual?: ResponsabilidadeDetalhada;
}

export interface LocalDataProposta {
    local: string;
    data: string;
}

export interface Responsaveis {
    responsavel_tecnico: string;
    gestor: string;
}

/**
 * Interface completa do payload formatado
 */
export interface PayloadFormatado {
    informacoes_contato: InformacoesContato;
    tipo_formulario: string;
    solicitacao: Solicitacao;
    agricultores_familiares?: AgricultoresFamiliares;
    importancia_agricultura_familiar?: string;
    organizacao_comunidades?: OrganizacaoComunidades;
    cadeias_valor_principais?: CadeiasValorPrincipais;
    politicas_publicas?: PoliticasPublicas;
    profissionais?: Profissionais;
    dificuldades_proponente?: DificuldadesProponente;
    desafios_agricultores?: DesafiosAgricultores;
    capacidade_atendimento?: CapacidadeAtendimento;
    publico_agricultura_familiar?: string;
    lista_produtores?: ListaProdutor[];
    lista_produtores_mudas?: ListaProdutorMudas[];
    compromissos?: Compromissos;
    declaracao_veracidade?: boolean;
    local_data_proposta: LocalDataProposta;
    responsaveis: Responsaveis;
}

/**
 * Interface para input de criação de plano
 */
export interface CreatePlanoInput {
    payloadFormatado: PayloadFormatado;
    payloadOriginal?: any; // Dados brutos opcionais
}

/**
 * Interface para dados extraídos (campos normalizados)
 */
export interface ExtractedPlanoData {
    // Metadados
    formType: string;
    formVersion: string;
    status: StatusPlano;

    // Informações de Contato
    nomeProponente: string;
    cnpj: string;
    municipio: string;
    telefone1?: string;
    telefone2?: string;
    email?: string;

    // Solicitação
    categoriaValue?: string;
    itemValue?: string;

    // Flags principais
    possuiAgricultores: boolean;
    quantidadeFamilias?: number;
    publicoAgricultura: boolean;
    declaracaoVeracidade: boolean;

    // Datas
    dataPropostaSubmissao?: Date;
    localProposta?: string;

    // Responsáveis
    responsavelTecnico?: string;
    gestorNome?: string;

    // Dados relacionais
    profissionais: Array<{
        tipo: string;
        instituicao: string;
    }>;
    cadeiasValor: Array<{
        tipo: string;
        produto?: string;
        mercados: string[];
    }>;
    equipamentos: Array<{
        tipo: string;
        nome?: string;
        quantidade: number;
    }>;
}

/**
 * Interface para filtros de consulta
 */
export interface PlanoFilters {
    municipio?: string;
    categoriaId?: number;
    formType?: string;
    status?: string;
    dataInicio?: Date;
    dataFim?: Date;
    cnpj?: string;
    page?: number;
    limit?: number;
}

/**
 * Interface para resposta de listagem paginada
 */
export interface PaginatedPlanos {
    items: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

/**
 * Interface para estatísticas
 */
export interface PlanoStats {
    totalPlanos: number;
    totalFamilias: number;
    porMunicipio?: Array<{
        municipio: string;
        count: number;
        familias: number;
    }>;
    porCategoria?: Array<{
        categoria: string;
        count: number;
    }>;
    porStatus?: Array<{
        status: string;
        count: number;
    }>;
}
