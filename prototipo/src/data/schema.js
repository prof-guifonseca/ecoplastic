/**
 * @typedef {Object} Condominio
 * @property {string} id
 * @property {string} nome
 * @property {number} unidades
 * @property {string} endereco
 *
 * @typedef {Object} Maquina
 * @property {string} id
 * @property {number} capacidadeKg
 * @property {number} ocupadoKg
 * @property {number} ultimaColeta - timestamp ms
 *
 * @typedef {Object} Cooperativa
 * @property {string} id
 * @property {string} nome
 * @property {number} precoKg
 * @property {number} distanciaKm
 *
 * @typedef {Object} Morador
 * @property {string} id
 * @property {string} nome
 * @property {string} apto
 * @property {string} email
 * @property {number} pontos
 * @property {number} kgTotal
 * @property {boolean} ativo
 * @property {number} criadoEm
 *
 * @typedef {Object} Convite
 * @property {string} id
 * @property {string} email
 * @property {string} apto
 * @property {'pendente'|'aceito'} status
 * @property {number} criadoEm
 *
 * @typedef {Object} Coleta
 * @property {string} id
 * @property {number} data - timestamp ms
 * @property {'agendada'|'concluida'|'pendente'|'cancelada'} status
 * @property {number} pesoKg
 * @property {number} valorBruto
 * @property {string} cooperativaId
 *
 * @typedef {Object} Transacao
 * @property {string} id
 * @property {'deposito'|'resgate'|'bonus'} tipo
 * @property {string} moradorId
 * @property {number} [kg]
 * @property {number} pontos
 * @property {number} [valor]
 * @property {string} [recompensaId]
 * @property {number} ts
 *
 * @typedef {Object} Recompensa
 * @property {string} id
 * @property {string} titulo
 * @property {string} descricao
 * @property {string} ico
 * @property {number} custoPontos
 * @property {string} parceiro
 * @property {number} estoque
 *
 * @typedef {Object} ConfigPontos
 * @property {number} pontosPorKg
 * @property {number} pontosPorGarrafa
 * @property {number} valorReaisPorPonto
 * @property {number} splitCondominio
 *
 * @typedef {Object} State
 * @property {number} schemaVersion
 * @property {'sindico'|'morador'|null} persona
 * @property {string|null} currentMoradorId
 * @property {Condominio} condominio
 * @property {Maquina} maquina
 * @property {{atualId: string, lista: Cooperativa[]}} cooperativa
 * @property {ConfigPontos} configPontos
 * @property {Morador[]} moradores
 * @property {Convite[]} convites
 * @property {Coleta[]} coletas
 * @property {Transacao[]} transacoes
 * @property {Recompensa[]} recompensas
 */

export {};
