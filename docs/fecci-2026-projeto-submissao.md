# Texto-base para submissão na FECCI 2026

Nota para adaptação ao template: este arquivo foi organizado conforme os elementos do Anexo I do Edital 01 - Regulamento Geral da FECCI 2026. Antes da submissão, remover esta nota, preencher nomes, séries e instituição, conferir o template oficial e manter no máximo 3 estudantes autores/expositores.

Nível sugerido: FECCI Junior ou FECCI Jovem, conforme a série dos autores oficiais.

Área temática sugerida: Inovação Tecnológica & Robótica.

Categoria especial sugerida: Desenvolvimento de Produtos.

## Título da pesquisa

ECOPLASTIC: SISTEMA INTELIGENTE DE COMPACTAÇÃO E GAMIFICAÇÃO PARA INCENTIVAR A RECICLAGEM DE PET EM CONDOMÍNIOS

## Nome dos autores

[ESTUDANTE 1]; [ESTUDANTE 2]; [ESTUDANTE 3]

Professor orientador: [NOME DO PROFESSOR ORIENTADOR]

Professor coorientador, se houver: [NOME DO PROFESSOR COORIENTADOR]

## Ano/série e instituição de origem

[ESTUDANTE 1] - [ANO/SÉRIE] - [INSTITUIÇÃO]

[ESTUDANTE 2] - [ANO/SÉRIE] - [INSTITUIÇÃO]

[ESTUDANTE 3] - [ANO/SÉRIE] - [INSTITUIÇÃO]

Instituição principal: [NOME DA INSTITUIÇÃO DO ORIENTADOR]

## Resumo

O EcoPlastic é um protótipo de sistema inteligente para incentivar a reciclagem de garrafas PET em condomínios. O problema investigado foi a dificuldade de transformar o descarte reciclável em uma prática rastreável, eficiente e motivadora para moradores, síndicos e cooperativas. O objetivo foi desenvolver e analisar uma solução que integra compactador inteligente, leitura por QR code, gamificação, painel administrativo, gestão de coletas, simulador financeiro e relatório ESG. A metodologia envolveu definição do problema, estudo do fluxo de descarte, modelagem de requisitos, prototipagem de uma plataforma navegável, simulação do ciclo de depósito, organização de indicadores e avaliação preliminar de viabilidade técnica e econômica. Como resultado parcial, obteve-se um protótipo funcional com área do morador, área do síndico, histórico, ranking, recompensas, coletas, dashboard, relatório ESG e demonstração 3D do equipamento. Espera-se que o EcoPlastic contribua para aumentar a adesão à reciclagem, reduzir volume logístico, gerar dados ambientais e apoiar parcerias entre condomínios e cooperativas.

## Palavras-chave

coleta seletiva; economia circular; resíduos sólidos; sustentabilidade; inovação tecnológica

## Introdução

A produção de resíduos sólidos urbanos é um desafio ambiental, econômico e social. Entre esses resíduos, as garrafas PET ocupam espaço significativo, exigem organização logística para coleta e dependem da participação dos cidadãos para serem corretamente encaminhadas à reciclagem. Mesmo quando há coleta seletiva, muitos materiais deixam de ser reciclados por falta de adesão, ausência de incentivos, baixa rastreabilidade e dificuldade de comprovar o impacto gerado.

Nos condomínios, esse problema se torna ainda mais evidente. A concentração de moradores pode favorecer a coleta seletiva, mas também exige gestão, comunicação e acompanhamento. O síndico precisa organizar coletas, negociar com cooperativas, acompanhar volumes e comunicar resultados. Os moradores, por sua vez, precisam perceber sentido prático em separar e depositar os materiais. Sem dados claros, o descarte sustentável pode depender apenas de campanhas pontuais, que nem sempre mudam hábitos de forma contínua.

O EcoPlastic surgiu como proposta de solução para esse cenário. O projeto combina um compactador inteligente de PET com uma plataforma digital para moradores e síndicos. A máquina conceitual recebe garrafas, compacta o volume e gera eventos de descarte. A plataforma transforma esses eventos em pontos, ranking, histórico, relatórios, indicadores financeiros e relatório ESG. Assim, o sistema busca aproximar tecnologia, sustentabilidade, economia circular e engajamento comunitário.

O problema de pesquisa pode ser formulado da seguinte maneira: como um sistema integrado, com compactador inteligente, gamificação e painel de gestão, pode aumentar a adesão dos moradores à reciclagem de PET em condomínios e gerar evidências ambientais úteis para síndicos e cooperativas?

A hipótese de trabalho é que um sistema que transforma o descarte de PET em evento rastreável, pontuação para moradores, indicador para síndicos e dado operacional para cooperativas pode aumentar o engajamento, melhorar a eficiência da coleta e tornar mais visível o impacto ambiental da reciclagem.

O objetivo geral da pesquisa foi desenvolver e analisar o EcoPlastic como protótipo de sistema inteligente para incentivar, registrar e gerir a reciclagem de PET em condomínios. Como objetivos específicos, buscou-se identificar dificuldades relacionadas à adesão dos moradores, prototipar um compactador inteligente conceitual, desenvolver uma plataforma digital, simular o ciclo de descarte por QR code, avaliar preliminarmente a viabilidade técnica e econômica e organizar evidências para apresentação científica.

## Encaminhamento metodológico

A pesquisa foi desenvolvida como projeto de inovação tecnológica e pesquisa aplicada. O processo partiu da observação de um problema socioambiental: embora muitos condomínios tenham interesse em reciclagem, a adesão dos moradores, a organização das coletas e a mensuração do impacto ainda são limitadas. A partir dessa constatação, foram definidos os principais atores do sistema: morador, síndico, cooperativa parceira e equipamento de coleta.

A primeira etapa consistiu na definição do problema e do público-alvo. O grupo analisou como o descarte de PET poderia gerar valor ambiental, econômico e pedagógico se fosse acompanhado por dados. Essa etapa levou à decisão de construir uma solução integrada, em vez de uma campanha isolada de reciclagem.

Na segunda etapa, foram definidos os requisitos do sistema. Para o morador, o protótipo deveria permitir identificação por QR code, acúmulo de pontos, histórico de depósitos, ranking e troca de recompensas. Para o síndico, o sistema deveria apresentar indicadores de kg coletados, receita, moradores ativos, coletas, gráficos, relatório ESG e simulação financeira. Para o equipamento, a proposta deveria demonstrar compactação de PET, capacidade de armazenamento e integração com a plataforma.

Na terceira etapa, foi desenvolvido o protótipo navegável. A aplicação foi construída com HTML, CSS e JavaScript modular, sem necessidade de instalação de dependências ou etapa de build. O estado é persistido em `localStorage`, permitindo simular dados do condomínio, moradores, transações, coletas e recompensas. O protótipo também utiliza gráficos, QR code e geração de PDF para relatório ESG.

Na quarta etapa, foi construída uma demonstração visual do equipamento. A página "Conheça o equipamento" apresenta um render 3D do compactador inteligente, com ciclo de descarte, estimativa de lista de materiais, modelo de negócio, compactação e diferenciais. Essa demonstração permite explicar o funcionamento físico sem depender de materiais perigosos ou de um equipamento industrial completo durante a feira.

Na quinta etapa, foram simulados fluxos de uso. O morador acessa o app, gera QR code, simula o depósito de PET, recebe pontos e acompanha o histórico. O painel do síndico reflete esses eventos em dashboards, rankings, coletas, financeiro e relatório ESG. Essa simulação ajuda a verificar se a proposta conecta corretamente ação individual, gestão coletiva e impacto ambiental.

A avaliação preliminar de viabilidade considerou três dimensões: técnica, econômica e ambiental. A viabilidade técnica foi analisada pela existência de protótipo navegável e demonstração do equipamento. A viabilidade econômica foi discutida a partir do modelo de negócio, da lista de materiais, do SaaS mensal e da repartição de receita da venda do PET. A viabilidade ambiental foi abordada pela redução de volume, pelo incentivo à coleta seletiva e pela geração de indicadores de impacto.

Caso ferramentas de inteligência artificial tenham sido usadas em organização, revisão textual ou apoio técnico, esse uso deve ser declarado como complementar, com revisão humana e responsabilidade final dos estudantes autores e do professor orientador.

## Resultados esperados/parciais/totais

Como resultado parcial, o EcoPlastic apresenta um site de entrada com a proposta do produto, uma página de demonstração do equipamento e um protótipo navegável da plataforma. Esses elementos permitem demonstrar o funcionamento do sistema para diferentes públicos, especialmente moradores, síndicos e avaliadores.

O protótipo do síndico inclui dashboard com indicadores, gráficos dos últimos meses, gestão de coletas, área financeira, moradores, ranking, convites, configurações e relatório ESG. O relatório pode ser baixado em PDF, o que reforça a proposta de transformar a reciclagem em evidência comunicável e útil para a gestão do condomínio.

O protótipo do morador inclui saldo de pontos, equivalência em reais, histórico de atividade, posição no ranking, QR code rotativo e troca de recompensas. Ao simular um depósito, o sistema adiciona massa de PET, credita pontos, atualiza histórico, ranking e indicadores do painel administrativo. Esse ciclo demonstra a lógica central do EcoPlastic: cada descarte deixa de ser invisível e passa a gerar dado, recompensa e impacto.

A demonstração 3D do equipamento apresenta o compactador inteligente de PET, seus componentes conceituais e o ciclo de operação. O modelo destaca compactação, armazenamento, identificação do morador, app de pontos, relatório ESG, revenue share e acionamento de coleta. Esses elementos sustentam a proposta como produto tecnológico em desenvolvimento.

Os resultados esperados incluem aumento da adesão dos moradores à coleta seletiva, redução do volume logístico de PET, geração de dados ambientais para o síndico, aproximação com cooperativas e criação de incentivos para participação contínua. Espera-se também que o projeto demonstre como tecnologia, gamificação e economia circular podem atuar juntas para resolver um problema cotidiano.

Como limitações, o protótipo ainda não possui backend real, autenticação definitiva, integração com sensores físicos, pagamentos ou validação em condomínio real. Essas limitações são coerentes com a fase atual do projeto, que se concentra na prova conceitual, na simulação funcional e na análise preliminar de viabilidade.

## Considerações finais

O EcoPlastic demonstra potencial como solução tecnológica para tornar a reciclagem de PET em condomínios mais eficiente, rastreável e motivadora. Ao integrar compactador inteligente, QR code, gamificação, painel administrativo, gestão de coletas e relatório ESG, o projeto propõe uma forma de transformar descarte em informação útil para moradores, síndicos e cooperativas.

O processo de desenvolvimento permitiu vivenciar etapas de investigação, definição de problema, prototipagem, simulação, análise de impacto e comunicação científica. A proposta também apresenta aplicabilidade social e ambiental, pois pode ser adaptada para condomínios, escolas, projetos de sustentabilidade e parcerias com cooperativas.

Ainda são necessários testes com usuários reais, construção e validação física do equipamento, integração com sensores e ampliação dos dados ambientais. Mesmo assim, os resultados parciais indicam que o EcoPlastic é uma proposta viável de desenvolvimento de produto, com potencial de continuidade em pilotos e projetos de inovação sustentável.

## Referências

ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. ABNT NBR 10004: Resíduos sólidos: classificação. Rio de Janeiro: ABNT, 2004.

BRASIL. Lei nº 12.305, de 2 de agosto de 2010. Institui a Política Nacional de Resíduos Sólidos. Brasília, DF: Presidência da República, 2010. Disponível em: https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/lei/l12305.htm. Acesso em: 5 jun. 2026.

BRASIL. Lei nº 9.795, de 27 de abril de 1999. Dispõe sobre a educação ambiental, institui a Política Nacional de Educação Ambiental e dá outras providências. Brasília, DF: Presidência da República, 1999. Disponível em: https://www.planalto.gov.br/ccivil_03/leis/l9795.htm. Acesso em: 5 jun. 2026.

CONSELHO NACIONAL DO MEIO AMBIENTE. Resolução CONAMA nº 275, de 25 de abril de 2001. Estabelece o código de cores para os diferentes tipos de resíduos. Brasília, DF: CONAMA, 2001.

ORGANIZAÇÃO DAS NAÇÕES UNIDAS. Objetivos de Desenvolvimento Sustentável. Disponível em: https://brasil.un.org/pt-br/sdgs. Acesso em: 5 jun. 2026.

PARANÁ FAZ CIÊNCIA. Edital 01 - Regulamento Geral: Feira de Cultura Científica Paraná Faz Ciência - FECCI 2026. Curitiba: Paraná Faz Ciência, 2026.

