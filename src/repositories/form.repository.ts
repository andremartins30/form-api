import { prisma } from '../db/prisma';
import { FormPlano, Prisma } from '@prisma/client';
import {
    ExtractedPlanoData,
    PlanoFilters,
    PaginatedPlanos
} from '../types/formPlano.types';

export class FormRepository {
    /**
     * Cria um novo plano de formulário com dados híbridos (normalizados + JSON)
     */
    async create(data: ExtractedPlanoData & {
        payloadFormatado: any;
        payloadOriginal?: any;
    }): Promise<FormPlano> {
        // Buscar IDs de categoria e item baseados nos values
        let categoriaId: number | undefined;
        let itemId: number | undefined;

        if (data.categoriaValue) {
            const categoria = await prisma.category.findUnique({
                where: { value: data.categoriaValue }
            });
            categoriaId = categoria?.id;
        }

        if (data.itemValue && categoriaId) {
            const item = await prisma.item.findFirst({
                where: {
                    categoryId: categoriaId,
                    value: data.itemValue
                }
            });
            itemId = item?.id;
        }

        // Criar plano com todos os dados relacionados em uma transação
        return await prisma.$transaction(async (tx) => {
            // 1. Criar FormPlano principal
            const plano = await tx.formPlano.create({
                data: {
                    // Metadados
                    formType: data.formType,
                    formVersion: data.formVersion,
                    status: data.status,

                    // Informações de Contato
                    nomeProponente: data.nomeProponente,
                    cnpj: data.cnpj,
                    municipio: data.municipio,
                    telefone1: data.telefone1,
                    telefone2: data.telefone2,
                    email: data.email,

                    // Solicitação (FKs)
                    categoriaId: categoriaId,
                    itemId: itemId,

                    // Flags
                    possuiAgricultores: data.possuiAgricultores,
                    quantidadeFamilias: data.quantidadeFamilias,
                    publicoAgricultura: data.publicoAgricultura,
                    declaracaoVeracidade: data.declaracaoVeracidade,

                    // Datas
                    dataPropostaSubmissao: data.dataPropostaSubmissao,
                    localProposta: data.localProposta,

                    // Responsáveis
                    responsavelTecnico: data.responsavelTecnico,
                    gestorNome: data.gestorNome,

                    // JSON completo
                    payloadFormatado: data.payloadFormatado,
                    payloadOriginal: data.payloadOriginal,
                },
            });

            // 2. Criar Profissionais relacionados
            if (data.profissionais && data.profissionais.length > 0) {
                await tx.profissional.createMany({
                    data: data.profissionais.map(prof => ({
                        planoId: plano.id,
                        tipo: prof.tipo,
                        instituicao: prof.instituicao,
                    })),
                });
            }

            // 3. Criar Cadeias de Valor relacionadas
            if (data.cadeiasValor && data.cadeiasValor.length > 0) {
                await tx.cadeiaValor.createMany({
                    data: data.cadeiasValor.map(cv => ({
                        planoId: plano.id,
                        tipo: cv.tipo,
                        produto: cv.produto,
                        mercados: cv.mercados,
                    })),
                });
            }

            // 4. Criar Equipamentos relacionados
            if (data.equipamentos && data.equipamentos.length > 0) {
                await tx.equipamento.createMany({
                    data: data.equipamentos.map(eq => ({
                        planoId: plano.id,
                        tipo: eq.tipo,
                        nome: eq.nome,
                        quantidade: eq.quantidade,
                    })),
                });
            }

            return plano;
        });
    }

    /**
     * Lista apenas campos básicos para listagem rápida (otimizado)
     */
    async findManyLight(filters: PlanoFilters): Promise<PaginatedPlanos> {
        const {
            municipio,
            categoriaId,
            formType,
            status,
            dataInicio,
            dataFim,
            cnpj,
            page = 1,
            limit = 50
        } = filters;

        // Construir condições do where
        const where: Prisma.FormPlanoWhereInput = {};

        if (municipio) {
            where.municipio = { contains: municipio, mode: 'insensitive' };
        }
        if (categoriaId) {
            where.categoriaId = categoriaId;
        }
        if (formType) {
            where.formType = formType;
        }
        if (status) {
            where.status = status;
        }
        if (cnpj) {
            where.cnpj = cnpj;
        }
        if (dataInicio || dataFim) {
            where.createdAt = {};
            if (dataInicio) where.createdAt.gte = dataInicio;
            if (dataFim) where.createdAt.lte = dataFim;
        }

        // Executar query com paginação e apenas campos essenciais
        const [items, total] = await Promise.all([
            prisma.formPlano.findMany({
                where,
                select: {
                    id: true,
                    nomeProponente: true,
                    cnpj: true,
                    municipio: true,
                    createdAt: true,
                    categoria: {
                        select: {
                            label: true,
                            value: true,
                        }
                    },
                    item: {
                        select: {
                            label: true,
                            value: true,
                        }
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.formPlano.count({ where }),
        ]);

        return {
            items,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Lista planos com filtros e paginação (completo com todos relacionamentos)
     */
    async findMany(filters: PlanoFilters): Promise<PaginatedPlanos> {
        const {
            municipio,
            categoriaId,
            formType,
            status,
            dataInicio,
            dataFim,
            cnpj,
            page = 1,
            limit = 50
        } = filters;

        // Construir condições do where
        const where: Prisma.FormPlanoWhereInput = {};

        if (municipio) {
            where.municipio = { contains: municipio, mode: 'insensitive' };
        }
        if (categoriaId) {
            where.categoriaId = categoriaId;
        }
        if (formType) {
            where.formType = formType;
        }
        if (status) {
            where.status = status;
        }
        if (cnpj) {
            where.cnpj = cnpj;
        }
        if (dataInicio || dataFim) {
            where.createdAt = {};
            if (dataInicio) where.createdAt.gte = dataInicio;
            if (dataFim) where.createdAt.lte = dataFim;
        }

        // Executar query com paginação
        const [items, total] = await Promise.all([
            prisma.formPlano.findMany({
                where,
                include: {
                    categoria: true,
                    item: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.formPlano.count({ where }),
        ]);

        return {
            items,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Busca um plano por ID com todos os relacionamentos
     */
    async findById(id: string): Promise<FormPlano | null> {
        return await prisma.formPlano.findUnique({
            where: { id },
            include: {
                categoria: true,
                item: true,
                profissionais: true,
                cadeiasValor: true,
                equipamentos: true,
            },
        });
    }

    /**
     * Gera estatísticas agregadas dos planos
     */
    async getStats(filters?: Partial<PlanoFilters>) {
        const where: Prisma.FormPlanoWhereInput = {};

        if (filters?.municipio) {
            where.municipio = { contains: filters.municipio, mode: 'insensitive' };
        }
        if (filters?.formType) {
            where.formType = filters.formType;
        }
        if (filters?.status) {
            where.status = filters.status;
        }

        // Total de planos
        const totalPlanos = await prisma.formPlano.count({ where });

        // Total de famílias
        const aggregation = await prisma.formPlano.aggregate({
            where,
            _sum: {
                quantidadeFamilias: true,
            },
        });

        // Agrupamento por município
        const porMunicipio = await prisma.formPlano.groupBy({
            by: ['municipio'],
            where,
            _count: true,
            _sum: {
                quantidadeFamilias: true,
            },
            orderBy: {
                _count: {
                    municipio: 'desc',
                },
            },
        });

        // Agrupamento por categoria
        const porCategoria = await prisma.formPlano.groupBy({
            by: ['categoriaId'],
            where: {
                ...where,
                categoriaId: { not: null },
            },
            _count: true,
        });

        // Buscar labels das categorias
        const categoriaIds = porCategoria
            .map(c => c.categoriaId)
            .filter((id): id is number => id !== null);

        const categorias = await prisma.category.findMany({
            where: { id: { in: categoriaIds } },
            select: { id: true, label: true },
        });

        const categoriasMap = new Map(categorias.map(c => [c.id, c.label]));

        // Agrupamento por status
        const porStatus = await prisma.formPlano.groupBy({
            by: ['status'],
            where,
            _count: true,
        });

        return {
            totalPlanos,
            totalFamilias: aggregation._sum.quantidadeFamilias || 0,
            porMunicipio: porMunicipio.map(m => ({
                municipio: m.municipio,
                count: m._count,
                familias: m._sum.quantidadeFamilias || 0,
            })),
            porCategoria: porCategoria.map(c => ({
                categoriaId: c.categoriaId,
                categoria: c.categoriaId ? categoriasMap.get(c.categoriaId) : 'Não especificada',
                count: c._count,
            })),
            porStatus: porStatus.map(s => ({
                status: s.status,
                count: s._count,
            })),
        };
    }

    /**
     * Lista todos os planos ordenados por data de criação (compatibilidade)
     * @deprecated Use findMany() com filtros para melhor performance
     */
    async findAll(): Promise<FormPlano[]> {
        return await prisma.formPlano.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                categoria: true,
                item: true,
            },
        });
    }
}

