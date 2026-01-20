import { z } from 'zod';
import { FormRepository } from '../repositories/form.repository';
import { FormPlano, StatusPlano } from '@prisma/client';
import {
    CreatePlanoInput,
    PayloadFormatado,
    ExtractedPlanoData,
    PlanoFilters,
    PaginatedPlanos
} from '../types/formPlano.types';

// Schema de validação Zod para novo formato (híbrido)
export const createPlanoSchemaV2 = z.object({
    payloadFormatado: z.any(), // JSON formatado do frontend
    payloadOriginal: z.any().optional(), // Dados brutos opcionais
});

// Schema antigo (compatibilidade)
export const createPlanoSchemaLegacy = z.object({
    formVersion: z.string().min(1, 'formVersion é obrigatório'),
    answers: z.record(z.string(), z.any()).or(z.any()),
});

export class FormService {
    private formRepository: FormRepository;

    constructor() {
        this.formRepository = new FormRepository();
    }

    /**
     * Extrai campos normalizados do payload formatado
     */
    private extractPlanoData(payload: PayloadFormatado): ExtractedPlanoData {
        const contato = payload.informacoes_contato;
        const solicitacao = payload.solicitacao;
        const agricultores = payload.agricultores_familiares;
        const compromissos = payload.compromissos;
        const localData = payload.local_data_proposta;
        const responsaveis = payload.responsaveis;

        // Extrair profissionais
        const profissionais = payload.profissionais?.detalhes?.map(p => ({
            tipo: p.tipo,
            instituicao: p.instituicao,
        })) || [];

        // Extrair cadeias de valor
        const cadeiasValor = payload.cadeias_valor_principais?.detalhes?.map(cv => ({
            tipo: cv.tipo,
            produto: cv.produto || '',
            mercados: cv.mercados || [],
        })) || [];

        // Extrair equipamentos
        const equipamentos = payload.capacidade_atendimento?.detalhes?.map(eq => ({
            tipo: eq.tipo,
            nome: eq.nome,
            quantidade: eq.quantidade,
        })) || [];

        // Mapear tipo de formulário
        const formTypeMap: Record<string, string> = {
            'Padrão': 'default',
            'Calcário': 'calcario',
            'Mudas': 'mudas'
        };

        const formType = formTypeMap[payload.tipo_formulario] || 'default';

        // Extrair data da proposta
        let dataPropostaSubmissao: Date | undefined;
        if (localData?.data) {
            const parsedDate = new Date(localData.data);
            if (!isNaN(parsedDate.getTime())) {
                dataPropostaSubmissao = parsedDate;
            }
        }

        return {
            // Metadados
            formType,
            formVersion: '2.0', // Versão híbrida
            status: StatusPlano.EM_ANALISE,

            // Informações de Contato
            nomeProponente: contato.nome_proponente,
            cnpj: contato.cnpj.replace(/\D/g, ''), // Remove formatação
            municipio: contato.municipio,
            telefone1: contato.telefone_1,
            telefone2: contato.telefone_2,
            email: contato.email,

            // Solicitação
            categoriaValue: solicitacao.categoria,
            itemValue: solicitacao.item,

            // Flags
            possuiAgricultores: agricultores?.possui === 'Sim',
            quantidadeFamilias: agricultores?.quantidade_familias
                ? parseInt(agricultores.quantidade_familias, 10)
                : undefined,
            publicoAgricultura: payload.publico_agricultura_familiar === 'Sim',
            declaracaoVeracidade: payload.declaracao_veracidade === true,

            // Datas
            dataPropostaSubmissao,
            localProposta: localData?.local,

            // Responsáveis
            responsavelTecnico: responsaveis?.responsavel_tecnico,
            gestorNome: responsaveis?.gestor,

            // Dados relacionais
            profissionais,
            cadeiasValor,
            equipamentos,
        };
    }

    /**
     * Cria um novo plano de formulário (versão híbrida)
     */
    async createPlano(input: CreatePlanoInput): Promise<FormPlano> {
        // Validação com Zod
        const validatedData = createPlanoSchemaV2.parse(input);

        // Extrair dados normalizados do payload formatado
        const extractedData = this.extractPlanoData(validatedData.payloadFormatado);

        // Persistir no banco com dados híbridos
        const plano = await this.formRepository.create({
            ...extractedData,
            payloadFormatado: validatedData.payloadFormatado,
            payloadOriginal: validatedData.payloadOriginal,
        });

        return plano;
    }

    /**
     * Cria plano no formato legado (compatibilidade)
     * @deprecated Use createPlano com payloadFormatado
     */
    async createPlanoLegacy(input: any): Promise<FormPlano> {
        const validatedData = createPlanoSchemaLegacy.parse(input);

        // Criar com dados mínimos no formato antigo
        const extractedData: ExtractedPlanoData = {
            formType: 'default',
            formVersion: validatedData.formVersion,
            status: StatusPlano.EM_ANALISE,
            nomeProponente: 'Não especificado',
            cnpj: '00000000000000',
            municipio: 'Não especificado',
            possuiAgricultores: false,
            publicoAgricultura: true,
            declaracaoVeracidade: false,
            profissionais: [],
            cadeiasValor: [],
            equipamentos: [],
        };

        return await this.formRepository.create({
            ...extractedData,
            payloadFormatado: validatedData.answers,
        });
    }

    /**
     * Lista planos com filtros e paginação (versão leve para listagem)
     */
    async getPlanosLight(filters: PlanoFilters): Promise<PaginatedPlanos> {
        return await this.formRepository.findManyLight(filters);
    }

    /**
     * Lista planos com filtros e paginação (completo)
     */
    async getPlanos(filters: PlanoFilters): Promise<PaginatedPlanos> {
        return await this.formRepository.findMany(filters);
    }

    /**
     * Busca um plano específico por ID com todos os relacionamentos
     */
    async getPlanoById(id: string): Promise<FormPlano | null> {
        return await this.formRepository.findById(id);
    }

    /**
     * Atualiza um plano existente
     */
    async updatePlano(id: string, input: CreatePlanoInput): Promise<FormPlano> {
        console.log('🔍 [SERVICE] Verificando existência do plano:', id);

        // Verificar se o plano existe
        const planoExistente = await this.formRepository.findById(id);
        if (!planoExistente) {
            throw new Error('Plano não encontrado');
        }

        console.log('📋 [SERVICE] Plano existente encontrado:', planoExistente.nomeProponente);

        // Verificar se o plano pode ser editado (não pode estar aprovado ou negado)
        if (planoExistente.status === StatusPlano.APROVADO || planoExistente.status === StatusPlano.NEGADO) {
            throw new Error(`Não é possível editar um plano com status ${planoExistente.status}`);
        }

        // Tentar validar como formato híbrido novo (v2)
        const validationV2 = createPlanoSchemaV2.safeParse(input);

        if (validationV2.success) {
            console.log('✓ [SERVICE] Validação V2 bem-sucedida');
            // Formato híbrido novo detectado
            const validatedData = validationV2.data;
            const extractedData = this.extractPlanoData(validatedData.payloadFormatado);

            console.log('📊 [SERVICE] Dados extraídos:', {
                nomeProponente: extractedData.nomeProponente,
                municipio: extractedData.municipio,
                categoria: extractedData.categoriaValue,
                item: extractedData.itemValue
            });

            const resultado = await this.formRepository.update(id, {
                ...extractedData,
                payloadFormatado: validatedData.payloadFormatado,
                payloadOriginal: validatedData.payloadOriginal,
            });

            console.log('✅ [SERVICE] Update executado no repository');
            return resultado;
        }

        console.log('⚠️ [SERVICE] Tentando validação legacy');
        // Se não é V2, tentar formato legacy
        const validationLegacy = createPlanoSchemaLegacy.safeParse(input);

        if (!validationLegacy.success) {
            throw validationLegacy.error;
        }

        const validatedData = validationLegacy.data;

        // Formato legacy - dados mínimos
        const extractedData: ExtractedPlanoData = {
            formType: 'default',
            formVersion: validatedData.formVersion,
            status: StatusPlano.EM_ANALISE,
            nomeProponente: 'Não especificado',
            cnpj: '00000000000000',
            municipio: 'Não especificado',
            possuiAgricultores: false,
            publicoAgricultura: true,
            declaracaoVeracidade: false,
            profissionais: [],
            cadeiasValor: [],
            equipamentos: [],
        };

        return await this.formRepository.update(id, {
            ...extractedData,
            payloadFormatado: validatedData.answers,
        });
    }

    /**
     * Gera estatísticas agregadas
     */
    async getStats(filters?: Partial<PlanoFilters>) {
        return await this.formRepository.getStats(filters);
    }

    /**
     * Lista todos os planos (compatibilidade)
     * @deprecated Use getPlanos() com filtros
     */
    async getAllPlanos(): Promise<FormPlano[]> {
        return await this.formRepository.findAll();
    }
}

