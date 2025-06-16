import dayjs from "dayjs";
import { client, db } from ".";
import {
	cargo,
	cargoTreinamento,
	colaborador,
	setor,
	treinamento,
	treinamentoColaborador,
} from "./schema";

async function seed() {
	console.log("Seeding database...");

	const startTime = Date.now();

	await db.delete(treinamentoColaborador);
	await db.delete(cargoTreinamento);
	await db.delete(treinamento);
	await db.delete(colaborador);
	await db.delete(cargo);
	await db.delete(setor);

	console.log("\nDatabase cleared.\n");

	const setorId = await db
		.insert(setor)
		.values({ descricao: "Geral" })
		.returning()
		.then((res) => res[0].id);

	const cargoResult = await db
		.insert(cargo)
		.values([
			{ descricao: "Almoxarife II", setor: setorId }, // 0
			{ descricao: "Analista Administrativo PL", setor: setorId }, // 1
			{ descricao: "Analista Customer Service Pl", setor: setorId }, // 2
			{ descricao: "Analista Customer Service Sr", setor: setorId }, // 3
			{ descricao: "Analista de Garantia de Qualidade Jr", setor: setorId }, // 4
			{ descricao: "Analista de Laboratório Pl", setor: setorId }, // 5
			{ descricao: "Analista de Logística Pl", setor: setorId }, // 6
			{ descricao: "Analista de Manutenção Jr", setor: setorId }, // 7
			{ descricao: "Analista de Marketing Jr", setor: setorId }, // 8
			{ descricao: "Analista de Meio Ambiente Sr", setor: setorId }, // 9
			{ descricao: "Analista de P C P Pl", setor: setorId }, // 10
			{ descricao: "Analista de Recursos Humanos Jr", setor: setorId }, // 11
			{ descricao: "Analista de Sistema de Gestão Pl", setor: setorId }, // 12
			{ descricao: "Analista de TI Jr", setor: setorId }, // 13
			{ descricao: "Assistente Administrativo", setor: setorId }, // 14
			{ descricao: "Assistente de Laboratório", setor: setorId }, // 15
			{ descricao: "Assistente de P C P", setor: setorId }, // 16
			{ descricao: "Assistente de Rastreabilidade", setor: setorId }, // 17
			{ descricao: "Assistente de Recursos Humanos", setor: setorId }, // 18
			{ descricao: "Comprador Sr", setor: setorId }, // 19
			{ descricao: "Coordenador de Manutenção", setor: setorId }, // 20
			{ descricao: "Coordenador de Meio Ambiente", setor: setorId }, // 21
			{ descricao: "Coordenador de P & D", setor: setorId }, // 22
			{ descricao: "Coordenador de P C P", setor: setorId }, // 23
			{ descricao: "Coordenador de Produção", setor: setorId }, // 24
			{ descricao: "Coordenador de Recursos Humanos", setor: setorId }, // 25
			{ descricao: "Diretor de Negócio", setor: setorId }, // 26
			{
				descricao: "Diretor de Pesquisa Clínica em Saúde e Nutrição",
				setor: setorId,
			}, // 27
			{ descricao: "Diretor de Vendas", setor: setorId }, // 28
			{ descricao: "Eletrotécnico II", setor: setorId }, // 29
			{ descricao: "Engenheiro de Automação", setor: setorId }, // 30
			{ descricao: "Especialista Comercial I", setor: setorId }, // 31
			{ descricao: "Especialista de Processos", setor: setorId }, // 32
			{ descricao: "Gerente Administrativo", setor: setorId }, // 33
			{ descricao: "Gerente Comercial", setor: setorId }, // 34
			{ descricao: "Gerente de Garantia de Qualidade", setor: setorId }, // 35
			{ descricao: "Gerente de Manutenção", setor: setorId }, // 36
			{ descricao: "Instrumentista", setor: setorId }, // 37
			{ descricao: "Mecânico de Manutenção II", setor: setorId }, // 38
			{ descricao: "Mecânico de Manutenção III", setor: setorId }, // 39
			{ descricao: "Monitor de Produção", setor: setorId }, // 40
			{ descricao: "Operador de Armazenagem e Expedição", setor: setorId }, // 41
			{ descricao: "Operador de Caldeiras I", setor: setorId }, // 42
			{ descricao: "Operador de ETA/ ETE I", setor: setorId }, // 43
			{ descricao: "Operador de ETA/ ETE II", setor: setorId }, // 44
			{ descricao: "Operador de Higienização I", setor: setorId }, // 45
			{ descricao: "Operador de Higienização II", setor: setorId }, // 46
			{ descricao: "Operador de Máquinas e Processos I", setor: setorId }, // 47
			{ descricao: "Operador de Máquinas e Processos II", setor: setorId }, // 48
			{ descricao: "Operador de Máquinas e Processos III", setor: setorId }, // 49
			{ descricao: "Pedreiro", setor: setorId }, // 50
			{ descricao: "Porteiro", setor: setorId }, // 51
			{ descricao: "Soldador II", setor: setorId }, // 52
			{ descricao: "Supervisor Administrativo", setor: setorId }, // 53
			{ descricao: "Supervisor de Garantia de Qualidade", setor: setorId }, // 54
			{ descricao: "Supervisor de Laboratório", setor: setorId }, // 55
			{ descricao: "Supervisor de Manutenção", setor: setorId }, // 56
			{ descricao: "Supervisor de P C P", setor: setorId }, // 57
			{ descricao: "Supervisor de Produção", setor: setorId }, // 58
			{ descricao: "Técnico Eletromecânico I", setor: setorId }, // 59
			{ descricao: "Técnico Eletromecânico II", setor: setorId }, // 60
			{ descricao: "Técnico Eletromecânico III", setor: setorId }, // 61
			{ descricao: "Técnico em Automação II", setor: setorId }, // 62
			{ descricao: "Técnico Instrumentista", setor: setorId }, // 63
			{ descricao: "Técnico Segurança do Trabalho Pl", setor: setorId }, // 64
			{ descricao: "Vigilante", setor: setorId }, // 65
			{ descricao: "Outros", setor: setorId }, // 66
		])
		.returning();

	console.log("Cargos: ", cargoResult.length);

	const colaboradorResult = await db
		.insert(colaborador)
		.values([
			{ nome: "ADAUTO CARVALHO DE LIMA", cargo: cargoResult[48].id }, // 0
			{ nome: "ADERCILIO FERREIRA LIMA", cargo: cargoResult[50].id }, // 1
			{ nome: "ADILSON GALDINO DA SILVA", cargo: cargoResult[39].id }, // 2
			{ nome: "ADMILSON MARCELINO RUIZ", cargo: cargoResult[49].id }, // 3
			{ nome: "ADRIANA ALMEIDA DE OLIVEIRA", cargo: cargoResult[45].id }, // 4
			{ nome: "AGNALDO RODRIGUES DOS SANTOS", cargo: cargoResult[65].id }, // 5
			{ nome: "ALAF GILBERTO DA SILVA", cargo: cargoResult[59].id }, // 6
			{ nome: "ALBERTO CRISTIANO VARGAS", cargo: cargoResult[44].id }, // 7
			{ nome: "ALEF CAIQUE TIBURTINO DA SILVA", cargo: cargoResult[38].id }, // 8
			{ nome: "ALEX SANDRO ALVES DA SILVA", cargo: cargoResult[47].id }, // 9
			{ nome: "ALEXANDRA MELO DOS SANTOS", cargo: cargoResult[3].id }, // 10
			{ nome: "ALEXANDRE DA SILVA DE OLIVEIRA", cargo: cargoResult[50].id }, // 11
			{ nome: "ALEXANDRE SOARES PEPINELLI", cargo: cargoResult[28].id }, // 12
			{ nome: "ALINE BARDELLI MENESES", cargo: cargoResult[5].id }, // 13
			{ nome: "ALISON EUGENIO", cargo: cargoResult[47].id }, // 14
			{ nome: "ANA CAROLINA DOS SANTOS", cargo: cargoResult[12].id }, // 15
			{ nome: "ANA CAROLINA SALUSTIANO DA SILVA", cargo: cargoResult[45].id }, // 16
			{ nome: "ANDERSON DIAS DOS SANTOS", cargo: cargoResult[47].id }, // 17
			{ nome: "ANDERSON JEFERSON BRITO DOS SANTOS", cargo: cargoResult[61].id }, // 18
			{ nome: "ANDERSON JOSE DA SILVA", cargo: cargoResult[48].id }, // 19
			{ nome: "ANDERSON MARCELINO RUIZ", cargo: cargoResult[45].id }, // 20
			{ nome: "ANDERSON NOVAIS RIBEIRO", cargo: cargoResult[42].id }, // 21
			{ nome: "ANDRE DA SILVA FEITOSA", cargo: cargoResult[65].id }, // 22
			{ nome: "ANDRE RAFAEL PEREIRA DO AMARAL", cargo: cargoResult[6].id }, // 23
			{ nome: "ANDRE RICARDO MARASSATO", cargo: cargoResult[21].id }, // 24
			{ nome: "ANDREA MARCIA SILVA MOURA", cargo: cargoResult[28].id }, // 25
			{ nome: "ANGELO DO AMARAL SANTOS", cargo: cargoResult[19].id }, // 26
			{ nome: "ANILTON BARROSO DE ANDRADE", cargo: cargoResult[48].id }, // 27
			{ nome: "ANTONIO CARLOS MONTEIRO DA SILVA", cargo: cargoResult[49].id }, // 28
			{ nome: "ANTONIO JUNIOR RIBEIRO JEREMIAS", cargo: cargoResult[60].id }, // 29
			{
				nome: "BRUNO PABLO CAMPOS RAMALHO DE SOUZA DIAS",
				cargo: cargoResult[47].id,
			}, // 30
			{ nome: "CAIO SERGIO PURO DOS SANTOS", cargo: cargoResult[47].id }, // 31
			{ nome: "CAIO VINICIUS GAMA DOS SANTOS", cargo: cargoResult[47].id }, // 32
			{ nome: "CARLOS AUGUSTO GONCALVES DE PAULA", cargo: cargoResult[60].id }, // 33
			{ nome: "CARLOS EDUARDO LOPES DE ASSIS", cargo: cargoResult[49].id }, // 34
			{ nome: "CATHIA DOS REIS NEVES", cargo: cargoResult[22].id }, // 35
			{ nome: "CESAR VINICIUS BRASIL RAMOS", cargo: cargoResult[52].id }, // 36
			{ nome: "CESAR YOSHIAKI TOKUNAGA", cargo: cargoResult[24].id }, // 37
			{
				nome: "CLAUDENICE APARECIDA ANDRADE VIEIRA",
				cargo: cargoResult[15].id,
			}, // 38
			{ nome: "CLAUDINEI DE MIRANDA MOREIRA", cargo: cargoResult[40].id }, // 39
			{ nome: "CLAUDIO PEREIRA DA CRUZ", cargo: cargoResult[47].id }, // 40
			{ nome: "CLEBER BARBOSA DOS SANTOS FILHO", cargo: cargoResult[41].id }, // 41
			{ nome: "CLEIA REGINA BARROS", cargo: cargoResult[15].id }, // 42
			{
				nome: "CRISLAINE BARBOSA TROPALDI TOKUNAGA",
				cargo: cargoResult[54].id,
			}, // 43
			{ nome: "CRISTIANE ROSA DE LIMA DANTAS", cargo: cargoResult[45].id }, // 44
			{ nome: "CRISTOFER NUNES SILVA", cargo: cargoResult[51].id }, // 45
			{ nome: "DANIEL SOUZA DE FARIAS", cargo: cargoResult[47].id }, // 46
			{ nome: "DANIELA PRZYGODDA SOUZA SANCHES", cargo: cargoResult[47].id }, // 47
			{
				nome: "DANIELLA MARCHESI SERRANO WENCESLAU",
				cargo: cargoResult[35].id,
			}, // 48
			{ nome: "DANILO MARCELO DE OLIVEIRA", cargo: cargoResult[9].id }, // 49
			{ nome: "DAVI PEREIRA DA SILVA CONCEICAO", cargo: cargoResult[58].id }, // 50
			{ nome: "DENIVER MARIANO DE SOUZA", cargo: cargoResult[47].id }, // 51
			{ nome: "DIEGO RAFAEL CACHOEIRA VIEIRA", cargo: cargoResult[47].id }, // 52
			{ nome: "DIRCEIA DA SILVA MIUDO SANTOS", cargo: cargoResult[17].id }, // 53
			{ nome: "EDILAINE CHALEGRE DE SOUZA GARBIN", cargo: cargoResult[5].id }, // 54
			{ nome: "EDILAINE DE OLIVEIRA SILVA", cargo: cargoResult[45].id }, // 55
			{ nome: "EDILEUZA FERREIRA SODRE CAVALCANTE", cargo: cargoResult[45].id }, // 56
			{ nome: "EDILSON MENDES TANAKA", cargo: cargoResult[60].id }, // 57
			{ nome: "EDIMILSON GOMES DA SILVA", cargo: cargoResult[47].id }, // 58
			{ nome: "EDMILSON DA SILVA LIMA", cargo: cargoResult[65].id }, // 59
			{ nome: "EDNEIA GOMES DA SILVA", cargo: cargoResult[45].id }, // 60
			{ nome: "EDUARDO FRANCISCO THEODORO", cargo: cargoResult[43].id }, // 61
			{ nome: "EGLE VANESA ALAUZET HEERDT", cargo: cargoResult[34].id }, // 62
			{ nome: "ELIAS ALVES DE MEDEIROS", cargo: cargoResult[48].id }, // 63
			{ nome: "EMANUEL SANTOS DA SILVA", cargo: cargoResult[43].id }, // 64
			{ nome: "EMERSON FERREIRA DA CUNHA", cargo: cargoResult[47].id }, // 65
			{ nome: "ENDREW AGUIAR DOS SANTOS LIMA", cargo: cargoResult[42].id }, // 66
			{ nome: "ERICK WILLIAN SENA SILVA", cargo: cargoResult[45].id }, // 67
			{ nome: "EUDES AMANCIO DOS SANTOS", cargo: cargoResult[49].id }, // 68
			{ nome: "EVERTON ESTEVAO RIBEIRO", cargo: cargoResult[47].id }, // 69
			{ nome: "FABIO HENRIQUE BEZERRA BORBA", cargo: cargoResult[37].id }, // 70
			{ nome: "FABIO RODRIGUES DOS SANTOS", cargo: cargoResult[42].id }, // 71
			{ nome: "FELIPE MARTINS PACITO", cargo: cargoResult[47].id }, // 72
			{ nome: "FERNANDO HENRIQUE BORTOLANZA", cargo: cargoResult[33].id }, // 73
			{ nome: "FERNANDO SIQUEIRA GOMES", cargo: cargoResult[58].id }, // 74
			{ nome: "FLAVIA DOS SANTOS LIMA", cargo: cargoResult[18].id }, // 75
			{ nome: "FRANCIELLY CRISTINA ARROIO", cargo: cargoResult[31].id }, // 76
			{ nome: "GILBERTO ALVES DOS SANTOS", cargo: cargoResult[48].id }, // 77
			{ nome: "GILBERTO LUCAS LEITE FRINCHERA", cargo: cargoResult[47].id }, // 78
			{ nome: "GIOVANI GONCALVES", cargo: cargoResult[53].id }, // 79
			{ nome: "GIOVANNI GROSSI CREMA", cargo: cargoResult[57].id }, // 80
			{ nome: "GISLAINE CRISTIANA FERREIRA", cargo: cargoResult[47].id }, // 81
			{ nome: "GLACY DOS SANTOS COSTA", cargo: cargoResult[4].id }, // 82
			{ nome: "GUILHERME CARDOSO LIMA DOS SANTOS", cargo: cargoResult[48].id }, // 83
			{ nome: "GUILHERME GUILMO GUEDES", cargo: cargoResult[41].id }, // 84
			{ nome: "GUSTAVO COUTINHO BORGES", cargo: cargoResult[47].id }, // 85
			{
				nome: "GUTELMEIRI ALESSANDRA CARVALHO COSTA",
				cargo: cargoResult[47].id,
			}, // 86
			{ nome: "HEITOR AMARAL DOS SANTOS", cargo: cargoResult[42].id }, // 87
			{ nome: "HELTON DE ARAGAO SANTOS", cargo: cargoResult[64].id }, // 88
			{ nome: "HIGOR DA SILVA PEREIRA DIAS", cargo: cargoResult[56].id }, // 89
			{ nome: "HUGO PEDRO BRITO SANTOS", cargo: cargoResult[41].id }, // 90
			{ nome: "ISABELA HENRIQUE AGUIAR", cargo: cargoResult[4].id }, // 91
			{ nome: "ISRAEL DIACOV", cargo: cargoResult[47].id }, // 92
			{ nome: "ISRAEL LEONCIO DOS SANTOS", cargo: cargoResult[49].id }, // 93
			{ nome: "ITAI EDUARDO SANTOS VENTURA", cargo: cargoResult[47].id }, // 94
			{
				nome: "IVAIR CASTILHO JOSE JOAQUIM MESSIAS DA CRUZ",
				cargo: cargoResult[47].id,
			}, // 95
			{ nome: "JACQUELINE SILVA SANTOS MANGOLIN", cargo: cargoResult[55].id }, // 96
			{ nome: "JAIR FRANCISCO DE PAULA", cargo: cargoResult[48].id }, // 97
			{ nome: "JEFERSON ADRIANO KICH", cargo: cargoResult[32].id }, // 98
			{ nome: "JEFERSON SILVA COSTA", cargo: cargoResult[45].id }, // 99
			{ nome: "JHENIFER VIEIRA DE LUCENA MUNIZ", cargo: cargoResult[14].id }, // 100
			{ nome: "JHONATAN SAN MARTINS", cargo: cargoResult[47].id }, // 101
			{ nome: "JOAO GABRIEL CORREIA GILBERTO", cargo: cargoResult[20].id }, // 102
			{ nome: "JOAO PEREIRA CABRAL JUNIOR", cargo: cargoResult[0].id }, // 103
			{ nome: "JOAO VITOR MONTES PINHEIRO", cargo: cargoResult[7].id }, // 104
			{ nome: "JOAQUIM FRANCISCO DA ROCHA", cargo: cargoResult[45].id }, // 105
			{ nome: "JONATHAN PEREIRA LOPES", cargo: cargoResult[51].id }, // 106
			{ nome: "JORGE PAULO DE OLIVEIRA", cargo: cargoResult[42].id }, // 107
			{ nome: "JOSE HENRIQUE ANDERSEN", cargo: cargoResult[47].id }, // 108
			{ nome: "JOSE MALDONADO OLIVEIRA", cargo: cargoResult[47].id }, // 109
			{ nome: "JULIO CESAR SANTOS ROCHA", cargo: cargoResult[48].id }, // 110
			{ nome: "JULIO CEZAR MANOEL BULCAO", cargo: cargoResult[48].id }, // 111
			{ nome: "KLEBER FELIX VIEIRA", cargo: cargoResult[65].id }, // 112
			{ nome: "KLEBERSON ANTUNES MAGALHAES", cargo: cargoResult[42].id }, // 113
			{ nome: "KLEBERSON KAUAN FERREIRA MARTINS", cargo: cargoResult[47].id }, // 114
			{ nome: "LEANDRO COLEGNAC AZEVEDO", cargo: cargoResult[47].id }, // 115
			{ nome: "LEANDRO COSTA NOVAIS", cargo: cargoResult[65].id }, // 116
			{ nome: "LEANDRO RODRIGUES DE MELO", cargo: cargoResult[44].id }, // 117
			{ nome: "LEANDRO SANTOS PAVAO", cargo: cargoResult[41].id }, // 118
			{ nome: "LEIDY LAURA TORRES MUNIZ FRINCHERA", cargo: cargoResult[47].id }, // 119
			{ nome: "LEONARDO DO NASCIMENTO SILVA", cargo: cargoResult[41].id }, // 120
			{ nome: "LIZIANE BRAVO CABREIRA", cargo: cargoResult[16].id }, // 121
			{ nome: "LUAN MATEUS DE LIMA FERREIRA", cargo: cargoResult[52].id }, // 122
			{ nome: "LUCIANO APARECIDO DA SILVA", cargo: cargoResult[47].id }, // 123
			{ nome: "LUIZ GUILHERME ANDRADE", cargo: cargoResult[23].id }, // 124
			{ nome: "LUIZ HENRIQUE ALVES SOUZA", cargo: cargoResult[47].id }, // 125
			{ nome: "LUIZ ROBERTO DA SILVA", cargo: cargoResult[42].id }, // 126
			{ nome: "MANOEL DA CONCEICAO SANTOS JUNIOR", cargo: cargoResult[52].id }, // 127
			{ nome: "MARCELA SILVA DOMINGUES", cargo: cargoResult[31].id }, // 128
			{ nome: "MARCELO FERREIRA CARDOSO", cargo: cargoResult[29].id }, // 129
			{ nome: "MARCELO GONCALVES BATISTA", cargo: cargoResult[40].id }, // 130
			{ nome: "MARCELO GONCALVES DA COSTA RIBEIRO", cargo: cargoResult[47].id }, // 131
			{ nome: "MARCIO JOSE DE SOUZA", cargo: cargoResult[29].id }, // 132
			{ nome: "MARCIO MENDES DE OLIVEIRA", cargo: cargoResult[48].id }, // 133
			{ nome: "MARCO AURELIO PEREIRA ROVARI", cargo: cargoResult[49].id }, // 134
			{ nome: "MARCOS ANTONIO GIRARDI LEITE", cargo: cargoResult[60].id }, // 135
			{ nome: "MARCOS FERMINIO MALAGUTI", cargo: cargoResult[47].id }, // 136
			{ nome: "MARIA APARECIDA SANTOS DE SOUZA", cargo: cargoResult[45].id }, // 137
			{ nome: "MARIA APARECIDA VICENTE", cargo: cargoResult[45].id }, // 138
			{ nome: "MARIA EDUARDA GOMES DE OLIVEIRA", cargo: cargoResult[18].id }, // 139
			{
				nome: "MARIA JULIANA ANTERO DA SILVA DO AMARAL",
				cargo: cargoResult[25].id,
			}, // 140
			{ nome: "MARIANA LUIZA LENZ", cargo: cargoResult[10].id }, // 141
			{ nome: "MARIANA RUBIO SILVA", cargo: cargoResult[8].id }, // 142
			{ nome: "MATHEUS CONSULO NOVAES DE BRITO", cargo: cargoResult[5].id }, // 143
			{ nome: "MURILO BARACAT DA SILVA", cargo: cargoResult[63].id }, // 144
			{ nome: "NELSON FILHO FRANCISCO DA HORA", cargo: cargoResult[43].id }, // 145
			{ nome: "NOEL MONTEIRO DOMICIANO", cargo: cargoResult[48].id }, // 146
			{ nome: "NORTHON SALOMAO GASPAR", cargo: cargoResult[5].id }, // 147
			{ nome: "ORANDI VICENTE DE LIMA JUNIOR", cargo: cargoResult[58].id }, // 148
			{ nome: "OSVALDO CAVIQUIOLLI JUNIOR", cargo: cargoResult[47].id }, // 149
			{ nome: "OSVANE DE OLIVEIRA PADILHA", cargo: cargoResult[47].id }, // 150
			{ nome: "PAULO FERNANDES DE SOUZA", cargo: cargoResult[47].id }, // 151
			{ nome: "PAULO FERNANDO SILVA DE OLIVEIRA", cargo: cargoResult[52].id }, // 152
			{ nome: "PAULO HENRIQUE TEODORO", cargo: cargoResult[48].id }, // 153
			{ nome: "PAULO RICARDO DE ANDRADE", cargo: cargoResult[31].id }, // 154
			{ nome: "PEDRO HENRIQUE DE OLIVEIRA LIMA", cargo: cargoResult[66].id }, // 154
			{ nome: "PEDRO HENRIQUE RODRIGUES", cargo: cargoResult[48].id }, // 155
			{ nome: "PLINIO LUIS COIMBRA DE PAULI", cargo: cargoResult[24].id }, // 156
			{ nome: "RAFAEL FERNANDES NEGRAO", cargo: cargoResult[41].id }, // 157
			{
				nome: "RAFAELLA BASTOS VASCONCELOS DE CARVALHO",
				cargo: cargoResult[66].id,
			}, // 158
			{ nome: "RAYANE MIRANDA SILVA", cargo: cargoResult[11].id }, // 159
			{ nome: "REGINALDO BENEDITO DA LUZ", cargo: cargoResult[58].id }, // 160
			{ nome: "REGINALDO JOSE DE CAMPOS JUNIOR", cargo: cargoResult[63].id }, // 161
			{ nome: "RENATO DA LUZ SILVA", cargo: cargoResult[47].id }, // 162
			{ nome: "RENATO OLIVEIRA DE JESUS", cargo: cargoResult[13].id }, // 163
			{ nome: "RENATO RIBEIRO OLIVEira", cargo: cargoResult[48].id }, // 164
			{ nome: "RENATO SOARES", cargo: cargoResult[46].id }, // 165
			{ nome: "RHUANITO LUZ SANTOS", cargo: cargoResult[7].id }, // 166
			{ nome: "RICARDO ANGELINO DA SILVA", cargo: cargoResult[38].id }, // 167
			{ nome: "RICARDO CONFALONIERI GELAIN", cargo: cargoResult[26].id }, // 168
			{ nome: "RICARDO NUNES", cargo: cargoResult[0].id }, // 169
			{ nome: "RICARDO PINTO DOS SANTOS", cargo: cargoResult[47].id }, // 170
			{ nome: "ROBERTO ALVES DA SILVA", cargo: cargoResult[47].id }, // 171
			{ nome: "RODRIGO BAZAN DA SILVA", cargo: cargoResult[47].id }, // 172
			{ nome: "RODRIGO PEREIRA SANCHES", cargo: cargoResult[47].id }, // 173
			{ nome: "ROGER RODRIGUES DE SANTANA", cargo: cargoResult[60].id }, // 174
			{ nome: "ROGERIO FERNANDES NEGRAO", cargo: cargoResult[41].id }, // 175
			{ nome: "RONAN GUSTAVO BUENO", cargo: cargoResult[38].id }, // 176
			{ nome: "SANDRA DA SILVA MEDEIROS", cargo: cargoResult[45].id }, // 177
			{ nome: "SAULO SOBRAL DE ANDRADE", cargo: cargoResult[47].id }, // 178
			{ nome: "SILVIO CESAR SOARES RAMOS", cargo: cargoResult[40].id }, // 179
			{ nome: "SONIA STEPHANIE CONDOLEO ALMEIDA", cargo: cargoResult[2].id }, // 180
			{ nome: "TAMARA PEREIRA DE CARVALHO", cargo: cargoResult[45].id }, // 181
			{ nome: "THAIS YZUMI OTSURU", cargo: cargoResult[34].id }, // 182
			{ nome: "TIAGO PEREIRA DA SILVA", cargo: cargoResult[47].id }, // 183
			{ nome: "ULISSES SPURAS DE AGUIAR", cargo: cargoResult[36].id }, // 184
			{ nome: "VALTER SOUZA SANTOS", cargo: cargoResult[45].id }, // 185
			{ nome: "VINICIUS DA SILVA BATISTA", cargo: cargoResult[48].id }, // 186
			{
				nome: "VINICIUS FERNANDES CASTRO DOS SANTOS",
				cargo: cargoResult[56].id,
			}, // 187
			{ nome: "VIVIAN ZAGUE", cargo: cargoResult[27].id }, // 188
			{ nome: "WALLACE RODRIGUES VIANA", cargo: cargoResult[3].id }, // 189
			{ nome: "WENDEL SILVA DE ALMEIDA", cargo: cargoResult[47].id }, // 190
			{ nome: "WESLEI SOUZA DE CARVALHO", cargo: cargoResult[40].id }, // 191
			{ nome: "WESLEY JOSE FERREIRA ORTEGA", cargo: cargoResult[42].id }, // 192
			{ nome: "WESLLEY SILVA MATOS", cargo: cargoResult[41].id }, // 193
		])
		.returning();

	console.log("Colaboradores: ", colaboradorResult.length);

	const treinamentoResult = await db
		.insert(treinamento)
		.values([
			{ nome: "Programa de gerenciamento de risco (PGR)", validade: 365 }, // 0
			{ nome: "Plano de ação emergencial ( PAE)", validade: 365 }, // 1
			{ nome: "Identificação de perigo (APR)", validade: 365 }, // 2
			{ nome: "Programa de conservação auditiva (PCA)", validade: 365 }, // 3
			{
				nome: "Programa de proteção respiratória ( PPR )",
				validade: 365,
			}, // 4
			{
				nome: "Brigada de emergencia proteção contra incêndio",
				validade: 365,
			}, // 5
			{ nome: "Simulados de emergencia", validade: 365 }, // 6
			{ nome: "NR 01 - Integração e ordem de serviço", validade: 365 }, // 7
			{
				nome: "NR 6 - Equipamento de proteção individual",
				validade: 365,
			}, // 8
			{
				nome: "NR 10 - Serviços em instalações com eletricidade (SEP)",
				validade: 365,
			}, // 9
			{
				nome: "NR 10 - Serviços em instalações com eletricidade",
				validade: 365,
			}, // 10
			{ nome: "NR11- Operação Segura de PTA", validade: 365 }, // 11
			{
				nome: "NR11- Operação Segura Pá Carregadeira, Bob Cat, Trator e Grua",
				validade: 365,
			}, // 12
			{
				nome: "NR 11- Operador de Empilhadeira/Transpaleteira Elétrica",
				validade: 365,
			}, // 13
			{
				nome: "NR 12 - Segurança na operação de maquinas e equipamentos",
				validade: 365,
			}, // 14
			{
				nome: "NR 12 - CONTROLE DE ENERGIAS PERIGOSA (TAGOUT / LOCKOUT)",
				validade: 365,
			}, // 15
			{
				nome: "NR 13 - Segurança na operação de caldeiras e vasos e unidades de processo",
				validade: 365,
			}, // 16
			{
				nome: "NR 15 - Produtos quimicos, segurança no transporte, armazenamento e manuseio de produtos quimicos",
				validade: 365,
			}, // 17
			{
				nome: "NR 20 - Operação com inflamaveis e combustiveis",
				validade: 365,
			}, // 18
			{ nome: "NR 33 - Trabalhador autorizado e vigia", validade: 365 }, // 19
			{ nome: "NR 33 - Supervisor de espaço confinado", validade: 365 }, // 20
			{
				nome: "NR 34 - Treinamento de segurança para trabalho a quente",
				validade: 365,
			}, // 21
			{ nome: "NR 35 - Trabalho em altura", validade: 365 }, // 22
			{
				nome: "Segurança na Operação de Sistema de Refrigeração (NH3) - Amônia",
				validade: 365,
			}, // 23
			{ nome: "Segurança na Descarga de Químicos", validade: 365 }, // 24
			{ nome: "Direção Defensiva", validade: 365 }, // 25
		])
		.returning();

	console.log("Treinamentos: ", treinamentoResult.length);

	const cargoTreinamentoResult = await db
		.insert(cargoTreinamento)
		.values([
			{ cargo: cargoResult[0].id, treinamento: treinamentoResult[7].id }, // 0
			{ cargo: cargoResult[0].id, treinamento: treinamentoResult[8].id }, // 1
			{ cargo: cargoResult[0].id, treinamento: treinamentoResult[13].id }, // 2
			{ cargo: cargoResult[0].id, treinamento: treinamentoResult[14].id }, // 3
			{ cargo: cargoResult[0].id, treinamento: treinamentoResult[22].id }, // 4
			{ cargo: cargoResult[1].id, treinamento: treinamentoResult[7].id }, // 5
			{ cargo: cargoResult[1].id, treinamento: treinamentoResult[8].id }, // 6
			{ cargo: cargoResult[1].id, treinamento: treinamentoResult[22].id }, // 7
			{ cargo: cargoResult[2].id, treinamento: treinamentoResult[7].id }, // 8
			{ cargo: cargoResult[2].id, treinamento: treinamentoResult[8].id }, // 9
			{ cargo: cargoResult[2].id, treinamento: treinamentoResult[22].id }, // 10
			{ cargo: cargoResult[3].id, treinamento: treinamentoResult[7].id }, // 11
			{ cargo: cargoResult[3].id, treinamento: treinamentoResult[8].id }, // 12
			{ cargo: cargoResult[3].id, treinamento: treinamentoResult[22].id }, // 13
			{ cargo: cargoResult[4].id, treinamento: treinamentoResult[7].id }, // 14
			{ cargo: cargoResult[4].id, treinamento: treinamentoResult[8].id }, // 15
			{ cargo: cargoResult[4].id, treinamento: treinamentoResult[17].id }, // 16
			{ cargo: cargoResult[4].id, treinamento: treinamentoResult[22].id }, // 17
			{ cargo: cargoResult[5].id, treinamento: treinamentoResult[7].id }, // 18
			{ cargo: cargoResult[5].id, treinamento: treinamentoResult[8].id }, // 19
			{ cargo: cargoResult[5].id, treinamento: treinamentoResult[17].id }, // 20
			{ cargo: cargoResult[5].id, treinamento: treinamentoResult[22].id }, // 21
			{ cargo: cargoResult[6].id, treinamento: treinamentoResult[7].id }, // 22
			{ cargo: cargoResult[6].id, treinamento: treinamentoResult[8].id }, // 23
			{ cargo: cargoResult[6].id, treinamento: treinamentoResult[13].id }, // 24
			{ cargo: cargoResult[6].id, treinamento: treinamentoResult[18].id }, // 25
			{ cargo: cargoResult[6].id, treinamento: treinamentoResult[22].id }, // 26
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[0].id }, // 27
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[1].id }, // 28
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[2].id }, // 29
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[7].id }, // 30
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[8].id }, // 31
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[14].id }, // 32
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[15].id }, // 33
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[19].id }, // 34
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[21].id }, // 35
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[22].id }, // 36
			{ cargo: cargoResult[8].id, treinamento: treinamentoResult[7].id }, // 37
			{ cargo: cargoResult[8].id, treinamento: treinamentoResult[8].id }, // 38
			{ cargo: cargoResult[8].id, treinamento: treinamentoResult[22].id }, // 39
			{ cargo: cargoResult[9].id, treinamento: treinamentoResult[0].id }, // 40
			{ cargo: cargoResult[9].id, treinamento: treinamentoResult[1].id }, // 41
			{ cargo: cargoResult[9].id, treinamento: treinamentoResult[2].id }, // 42
			{ cargo: cargoResult[9].id, treinamento: treinamentoResult[7].id }, // 43
			{ cargo: cargoResult[9].id, treinamento: treinamentoResult[8].id }, // 44
			{ cargo: cargoResult[9].id, treinamento: treinamentoResult[19].id }, // 45
			{ cargo: cargoResult[9].id, treinamento: treinamentoResult[22].id }, // 46
			{ cargo: cargoResult[10].id, treinamento: treinamentoResult[7].id }, // 47
			{ cargo: cargoResult[10].id, treinamento: treinamentoResult[8].id }, // 48
			{ cargo: cargoResult[10].id, treinamento: treinamentoResult[22].id }, // 49
			{ cargo: cargoResult[11].id, treinamento: treinamentoResult[0].id }, // 50
			{ cargo: cargoResult[11].id, treinamento: treinamentoResult[1].id }, // 51
			{ cargo: cargoResult[11].id, treinamento: treinamentoResult[7].id }, // 52
			{ cargo: cargoResult[11].id, treinamento: treinamentoResult[8].id }, // 53
			{ cargo: cargoResult[11].id, treinamento: treinamentoResult[22].id }, // 54
			{ cargo: cargoResult[12].id, treinamento: treinamentoResult[7].id }, // 55
			{ cargo: cargoResult[12].id, treinamento: treinamentoResult[8].id }, // 56
			{ cargo: cargoResult[12].id, treinamento: treinamentoResult[22].id }, // 57
			{ cargo: cargoResult[13].id, treinamento: treinamentoResult[7].id }, // 58
			{ cargo: cargoResult[13].id, treinamento: treinamentoResult[8].id }, // 59
			{ cargo: cargoResult[13].id, treinamento: treinamentoResult[10].id }, // 60
			{ cargo: cargoResult[13].id, treinamento: treinamentoResult[22].id }, // 61
			{ cargo: cargoResult[14].id, treinamento: treinamentoResult[7].id }, // 62
			{ cargo: cargoResult[14].id, treinamento: treinamentoResult[8].id }, // 63
			{ cargo: cargoResult[14].id, treinamento: treinamentoResult[22].id }, // 64
			{ cargo: cargoResult[15].id, treinamento: treinamentoResult[7].id }, // 65
			{ cargo: cargoResult[15].id, treinamento: treinamentoResult[8].id }, // 66
			{ cargo: cargoResult[15].id, treinamento: treinamentoResult[17].id }, // 67
			{ cargo: cargoResult[15].id, treinamento: treinamentoResult[22].id }, // 68
			{ cargo: cargoResult[16].id, treinamento: treinamentoResult[7].id }, // 69
			{ cargo: cargoResult[16].id, treinamento: treinamentoResult[8].id }, // 70
			{ cargo: cargoResult[16].id, treinamento: treinamentoResult[22].id }, // 71
			{ cargo: cargoResult[17].id, treinamento: treinamentoResult[7].id }, // 72
			{ cargo: cargoResult[17].id, treinamento: treinamentoResult[8].id }, // 73
			{ cargo: cargoResult[17].id, treinamento: treinamentoResult[22].id }, // 74
			{ cargo: cargoResult[18].id, treinamento: treinamentoResult[7].id }, // 75
			{ cargo: cargoResult[18].id, treinamento: treinamentoResult[8].id }, // 76
			{ cargo: cargoResult[18].id, treinamento: treinamentoResult[22].id }, // 77
			{ cargo: cargoResult[19].id, treinamento: treinamentoResult[7].id }, // 78
			{ cargo: cargoResult[19].id, treinamento: treinamentoResult[8].id }, // 79
			{ cargo: cargoResult[19].id, treinamento: treinamentoResult[22].id }, // 80
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[0].id }, // 81
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[1].id }, // 82
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[2].id }, // 83
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[5].id }, // 84
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[6].id }, // 85
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[7].id }, // 86
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[8].id }, // 87
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[14].id }, // 88
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[15].id }, // 89
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[19].id }, // 90
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[20].id }, // 91
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[21].id }, // 92
			{ cargo: cargoResult[20].id, treinamento: treinamentoResult[22].id }, // 93
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[0].id }, // 94
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[1].id }, // 95
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[2].id }, // 96
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[5].id }, // 97
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[6].id }, // 98
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[7].id }, // 99
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[8].id }, // 100
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[19].id }, // 101
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[20].id }, // 102
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[22].id }, // 103
			{ cargo: cargoResult[22].id, treinamento: treinamentoResult[7].id }, // 104
			{ cargo: cargoResult[22].id, treinamento: treinamentoResult[8].id }, // 105
			{ cargo: cargoResult[22].id, treinamento: treinamentoResult[22].id }, // 106
			{ cargo: cargoResult[23].id, treinamento: treinamentoResult[7].id }, // 107
			{ cargo: cargoResult[23].id, treinamento: treinamentoResult[8].id }, // 108
			{ cargo: cargoResult[23].id, treinamento: treinamentoResult[22].id }, // 109
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[0].id }, // 110
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[1].id }, // 111
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[2].id }, // 112
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[5].id }, // 113
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[6].id }, // 114
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[7].id }, // 115
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[8].id }, // 116
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[19].id }, // 117
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[20].id }, // 118
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[22].id }, // 119
			{ cargo: cargoResult[25].id, treinamento: treinamentoResult[0].id }, // 120
			{ cargo: cargoResult[25].id, treinamento: treinamentoResult[1].id }, // 121
			{ cargo: cargoResult[25].id, treinamento: treinamentoResult[5].id }, // 122
			{ cargo: cargoResult[25].id, treinamento: treinamentoResult[6].id }, // 123
			{ cargo: cargoResult[25].id, treinamento: treinamentoResult[7].id }, // 124
			{ cargo: cargoResult[25].id, treinamento: treinamentoResult[8].id }, // 125
			{ cargo: cargoResult[25].id, treinamento: treinamentoResult[22].id }, // 126
			{ cargo: cargoResult[26].id, treinamento: treinamentoResult[7].id }, // 127
			{ cargo: cargoResult[26].id, treinamento: treinamentoResult[8].id }, // 128
			{ cargo: cargoResult[27].id, treinamento: treinamentoResult[7].id }, // 129
			{ cargo: cargoResult[27].id, treinamento: treinamentoResult[8].id }, // 130
			{ cargo: cargoResult[28].id, treinamento: treinamentoResult[7].id }, // 131
			{ cargo: cargoResult[28].id, treinamento: treinamentoResult[8].id }, // 132
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[0].id }, // 133
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[1].id }, // 134
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[2].id }, // 135
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[7].id }, // 136
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[8].id }, // 137
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[10].id }, // 138
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[14].id }, // 139
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[15].id }, // 140
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[19].id }, // 141
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[21].id }, // 142
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[22].id }, // 143
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[0].id }, // 144
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[1].id }, // 145
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[2].id }, // 146
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[7].id }, // 147
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[8].id }, // 148
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[10].id }, // 149
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[14].id }, // 150
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[15].id }, // 151
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[19].id }, // 152
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[21].id }, // 153
			{ cargo: cargoResult[30].id, treinamento: treinamentoResult[22].id }, // 154
			{ cargo: cargoResult[31].id, treinamento: treinamentoResult[7].id }, // 155
			{ cargo: cargoResult[31].id, treinamento: treinamentoResult[8].id }, // 156
			{ cargo: cargoResult[31].id, treinamento: treinamentoResult[22].id }, // 157
			{ cargo: cargoResult[31].id, treinamento: treinamentoResult[25].id }, // 158
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[0].id }, // 159
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[1].id }, // 160
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[7].id }, // 161
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[8].id }, // 162
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[19].id }, // 163
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[22].id }, // 164
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[0].id }, // 165
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[1].id }, // 166
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[5].id }, // 167
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[6].id }, // 168
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[7].id }, // 169
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[8].id }, // 170
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[22].id }, // 171
			{ cargo: cargoResult[34].id, treinamento: treinamentoResult[7].id }, // 172
			{ cargo: cargoResult[34].id, treinamento: treinamentoResult[8].id }, // 173
			{ cargo: cargoResult[34].id, treinamento: treinamentoResult[22].id }, // 174
			{ cargo: cargoResult[34].id, treinamento: treinamentoResult[25].id }, // 175
			{ cargo: cargoResult[35].id, treinamento: treinamentoResult[0].id }, // 176
			{ cargo: cargoResult[35].id, treinamento: treinamentoResult[1].id }, // 177
			{ cargo: cargoResult[35].id, treinamento: treinamentoResult[5].id }, // 178
			{ cargo: cargoResult[35].id, treinamento: treinamentoResult[6].id }, // 179
			{ cargo: cargoResult[35].id, treinamento: treinamentoResult[7].id }, // 180
			{ cargo: cargoResult[35].id, treinamento: treinamentoResult[8].id }, // 181
			{ cargo: cargoResult[35].id, treinamento: treinamentoResult[22].id }, // 182
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[0].id }, // 183
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[1].id }, // 184
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[2].id }, // 185
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[5].id }, // 186
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[6].id }, // 187
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[7].id }, // 188
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[8].id }, // 189
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[14].id }, // 190
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[15].id }, // 191
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[19].id }, // 192
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[20].id }, // 193
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[21].id }, // 194
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[22].id }, // 195
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[0].id }, // 196
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[1].id }, // 197
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[2].id }, // 198
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[7].id }, // 199
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[8].id }, // 200
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[10].id }, // 201
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[14].id }, // 202
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[15].id }, // 203
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[19].id }, // 204
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[21].id }, // 205
			{ cargo: cargoResult[37].id, treinamento: treinamentoResult[22].id }, // 206
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[0].id }, // 207
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[1].id }, // 208
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[2].id }, // 209
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[7].id }, // 210
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[8].id }, // 211
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[14].id }, // 212
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[15].id }, // 213
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[19].id }, // 214
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[21].id }, // 215
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[22].id }, // 216
			{ cargo: cargoResult[39].id, treinamento: treinamentoResult[0].id }, // 217
			{ cargo: cargoResult[39].id, treinamento: treinamentoResult[1].id }, // 218
			{ cargo: cargoResult[39].id, treinamento: treinamentoResult[2].id }, // 219
			{ cargo: cargoResult[39].id, treinamento: treinamentoResult[7].id }, // 220
			{ cargo: cargoResult[39].id, treinamento: treinamentoResult[8].id }, // 221
			{ cargo: cargoResult[39].id, treinamento: treinamentoResult[14].id }, // 222
			{ cargo: cargoResult[39].id, treinamento: treinamentoResult[15].id }, // 223
			{ cargo: cargoResult[39].id, treinamento: treinamentoResult[19].id }, // 224
			{ cargo: cargoResult[39].id, treinamento: treinamentoResult[21].id }, // 225
			{ cargo: cargoResult[39].id, treinamento: treinamentoResult[22].id }, // 226
			{ cargo: cargoResult[40].id, treinamento: treinamentoResult[7].id }, // 227
			{ cargo: cargoResult[40].id, treinamento: treinamentoResult[8].id }, // 228
			{ cargo: cargoResult[40].id, treinamento: treinamentoResult[14].id }, // 229
			{ cargo: cargoResult[40].id, treinamento: treinamentoResult[18].id }, // 230
			{ cargo: cargoResult[40].id, treinamento: treinamentoResult[22].id }, // 231
			{ cargo: cargoResult[41].id, treinamento: treinamentoResult[7].id }, // 232
			{ cargo: cargoResult[41].id, treinamento: treinamentoResult[8].id }, // 233
			{ cargo: cargoResult[41].id, treinamento: treinamentoResult[13].id }, // 234
			{ cargo: cargoResult[41].id, treinamento: treinamentoResult[14].id }, // 235
			{ cargo: cargoResult[41].id, treinamento: treinamentoResult[17].id }, // 236
			{ cargo: cargoResult[41].id, treinamento: treinamentoResult[22].id }, // 237
			{ cargo: cargoResult[42].id, treinamento: treinamentoResult[7].id }, // 238
			{ cargo: cargoResult[42].id, treinamento: treinamentoResult[8].id }, // 239
			{ cargo: cargoResult[42].id, treinamento: treinamentoResult[14].id }, // 240
			{ cargo: cargoResult[42].id, treinamento: treinamentoResult[16].id }, // 241
			{ cargo: cargoResult[42].id, treinamento: treinamentoResult[22].id }, // 242
			{ cargo: cargoResult[43].id, treinamento: treinamentoResult[7].id }, // 243
			{ cargo: cargoResult[43].id, treinamento: treinamentoResult[8].id }, // 244
			{ cargo: cargoResult[43].id, treinamento: treinamentoResult[14].id }, // 245
			{ cargo: cargoResult[43].id, treinamento: treinamentoResult[19].id }, // 246
			{ cargo: cargoResult[43].id, treinamento: treinamentoResult[22].id }, // 247
			{ cargo: cargoResult[44].id, treinamento: treinamentoResult[7].id }, // 248
			{ cargo: cargoResult[44].id, treinamento: treinamentoResult[8].id }, // 249
			{ cargo: cargoResult[44].id, treinamento: treinamentoResult[14].id }, // 250
			{ cargo: cargoResult[44].id, treinamento: treinamentoResult[19].id }, // 251
			{ cargo: cargoResult[44].id, treinamento: treinamentoResult[22].id }, // 252
			{ cargo: cargoResult[45].id, treinamento: treinamentoResult[7].id }, // 253
			{ cargo: cargoResult[45].id, treinamento: treinamentoResult[8].id }, // 254
			{ cargo: cargoResult[45].id, treinamento: treinamentoResult[14].id }, // 255
			{ cargo: cargoResult[45].id, treinamento: treinamentoResult[17].id }, // 256
			{ cargo: cargoResult[45].id, treinamento: treinamentoResult[22].id }, // 257
			{ cargo: cargoResult[46].id, treinamento: treinamentoResult[7].id }, // 258
			{ cargo: cargoResult[46].id, treinamento: treinamentoResult[8].id }, // 259
			{ cargo: cargoResult[46].id, treinamento: treinamentoResult[14].id }, // 260
			{ cargo: cargoResult[46].id, treinamento: treinamentoResult[17].id }, // 261
			{ cargo: cargoResult[46].id, treinamento: treinamentoResult[22].id }, // 262
			{ cargo: cargoResult[47].id, treinamento: treinamentoResult[7].id }, // 263
			{ cargo: cargoResult[47].id, treinamento: treinamentoResult[8].id }, // 264
			{ cargo: cargoResult[47].id, treinamento: treinamentoResult[14].id }, // 265
			{ cargo: cargoResult[47].id, treinamento: treinamentoResult[18].id }, // 266
			{ cargo: cargoResult[47].id, treinamento: treinamentoResult[19].id }, // 267
			{ cargo: cargoResult[47].id, treinamento: treinamentoResult[22].id }, // 268
			{ cargo: cargoResult[48].id, treinamento: treinamentoResult[7].id }, // 269
			{ cargo: cargoResult[48].id, treinamento: treinamentoResult[8].id }, // 270
			{ cargo: cargoResult[48].id, treinamento: treinamentoResult[14].id }, // 271
			{ cargo: cargoResult[48].id, treinamento: treinamentoResult[18].id }, // 272
			{ cargo: cargoResult[48].id, treinamento: treinamentoResult[19].id }, // 273
			{ cargo: cargoResult[48].id, treinamento: treinamentoResult[22].id }, // 274
			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[7].id }, // 275
			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[8].id }, // 276
			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[14].id }, // 277
			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[18].id }, // 278
			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[19].id }, // 279
			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[22].id }, // 280
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[0].id }, // 281
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[1].id }, // 282
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[2].id }, // 283
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[7].id }, // 284
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[8].id }, // 285
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[14].id }, // 286
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[15].id }, // 287
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[19].id }, // 288
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[21].id }, // 289
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[22].id }, // 290
			{ cargo: cargoResult[51].id, treinamento: treinamentoResult[7].id }, // 291
			{ cargo: cargoResult[51].id, treinamento: treinamentoResult[8].id }, // 292
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[0].id }, // 293
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[1].id }, // 294
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[2].id }, // 295
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[7].id }, // 296
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[8].id }, // 297
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[14].id }, // 298
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[15].id }, // 299
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[19].id }, // 300
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[21].id }, // 301
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[22].id }, // 302
			{ cargo: cargoResult[53].id, treinamento: treinamentoResult[0].id }, // 303
			{ cargo: cargoResult[53].id, treinamento: treinamentoResult[1].id }, // 304
			{ cargo: cargoResult[53].id, treinamento: treinamentoResult[5].id }, // 305
			{ cargo: cargoResult[53].id, treinamento: treinamentoResult[6].id }, // 306
			{ cargo: cargoResult[53].id, treinamento: treinamentoResult[7].id }, // 307
			{ cargo: cargoResult[53].id, treinamento: treinamentoResult[8].id }, // 308
			{ cargo: cargoResult[53].id, treinamento: treinamentoResult[22].id }, // 309
			{ cargo: cargoResult[54].id, treinamento: treinamentoResult[0].id }, // 310
			{ cargo: cargoResult[54].id, treinamento: treinamentoResult[1].id }, // 311
			{ cargo: cargoResult[54].id, treinamento: treinamentoResult[5].id }, // 312
			{ cargo: cargoResult[54].id, treinamento: treinamentoResult[6].id }, // 313
			{ cargo: cargoResult[54].id, treinamento: treinamentoResult[7].id }, // 314
			{ cargo: cargoResult[54].id, treinamento: treinamentoResult[8].id }, // 315
			{ cargo: cargoResult[54].id, treinamento: treinamentoResult[22].id }, // 316
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[0].id }, // 317
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[1].id }, // 318
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[5].id }, // 319
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[6].id }, // 320
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[7].id }, // 321
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[8].id }, // 322
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[17].id }, // 323
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[22].id }, // 324
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[0].id }, // 325
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[1].id }, // 326
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[2].id }, // 327
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[5].id }, // 328
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[6].id }, // 329
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[7].id }, // 330
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[8].id }, // 331
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[14].id }, // 332
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[15].id }, // 333
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[19].id }, // 334
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[20].id }, // 335
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[21].id }, // 336
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[22].id }, // 337
			{ cargo: cargoResult[57].id, treinamento: treinamentoResult[7].id }, // 338
			{ cargo: cargoResult[57].id, treinamento: treinamentoResult[8].id }, // 339
			{ cargo: cargoResult[57].id, treinamento: treinamentoResult[22].id }, // 340
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[0].id }, // 341
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[1].id }, // 342
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[2].id }, // 343
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[5].id }, // 344
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[6].id }, // 345
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[7].id }, // 346
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[8].id }, // 347
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[19].id }, // 348
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[20].id }, // 349
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[22].id }, // 350
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[0].id }, // 351
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[1].id }, // 352
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[2].id }, // 353
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[7].id }, // 354
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[8].id }, // 355
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[10].id }, // 356
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[14].id }, // 357
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[15].id }, // 358
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[19].id }, // 359
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[21].id }, // 360
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[22].id }, // 361
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[0].id }, // 362
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[1].id }, // 363
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[2].id }, // 364
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[7].id }, // 365
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[8].id }, // 366
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[10].id }, // 367
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[14].id }, // 368
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[15].id }, // 369
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[19].id }, // 370
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[21].id }, // 371
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[22].id }, // 372
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[0].id }, // 373
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[1].id }, // 374
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[2].id }, // 375
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[7].id }, // 376
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[8].id }, // 377
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[10].id }, // 378
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[14].id }, // 379
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[15].id }, // 380
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[19].id }, // 381
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[21].id }, // 382
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[22].id }, // 383
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[0].id }, // 384
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[1].id }, // 385
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[2].id }, // 386
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[7].id }, // 387
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[8].id }, // 388
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[10].id }, // 389
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[14].id }, // 390
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[15].id }, // 391
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[19].id }, // 392
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[21].id }, // 393
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[22].id }, // 394
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[0].id }, // 395
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[1].id }, // 396
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[2].id }, // 397
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[7].id }, // 398
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[8].id }, // 399
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[10].id }, // 400
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[14].id }, // 401
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[15].id }, // 402
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[19].id }, // 403
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[21].id }, // 404
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[22].id }, // 405
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[0].id }, // 406
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[1].id }, // 407
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[2].id }, // 408
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[3].id }, // 409
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[4].id }, // 410
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[5].id }, // 411
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[6].id }, // 412
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[7].id }, // 413
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[8].id }, // 414
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[19].id }, // 415
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[20].id }, // 416
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[22].id }, // 417
			{ cargo: cargoResult[65].id, treinamento: treinamentoResult[7].id }, // 418
			{ cargo: cargoResult[65].id, treinamento: treinamentoResult[8].id }, // 419
		])
		.returning();

	console.log("Cargos x Treinamentos: ", cargoTreinamentoResult.length);

	console.log("\nSeed completed successfully");

	const endTime = Date.now();
	console.log(
		`Seed completed in \x1b[33m${(endTime - startTime).toFixed(0)}\x1b[0m miliseconds\n`,
	);
}

seed()
	.catch((e) => {
		console.error(e);
	})
	.finally(() => {
		client.end();
	});
