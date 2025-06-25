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
			{ descricao: "Analista Administrativo Jr", setor: setorId }, // 66
			{ descricao: "Analista de P & D Jr", setor: setorId }, // 67
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
			{
				nome: "PEDRO HENRIQUE DE OLIVEIRA LIMA",
				cargo: cargoResult[66].id,
			}, // 154
			{ nome: "PEDRO HENRIQUE RODRIGUES", cargo: cargoResult[48].id }, // 155
			{ nome: "PLINIO LUIS COIMBRA DE PAULI", cargo: cargoResult[24].id }, // 156
			{ nome: "RAFAEL FERNANDES NEGRAO", cargo: cargoResult[41].id }, // 157
			{
				nome: "RAFAELLA BASTOS VASCONCELOS DE CARVALHO",
				cargo: cargoResult[67].id,
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

	const treinamentoIndexesAllRoles = [0, 1, 2, 3, 4, 6, 7, 8, 25];

	let cargoTreinamentoResult = await db
		.insert(cargoTreinamento)
		.values(
			cargoResult.flatMap((cargo) =>
				treinamentoIndexesAllRoles.map((index) => ({
					cargo: cargo.id,
					treinamento: treinamentoResult[index].id,
				})),
			),
		)
		.returning();

	let length = cargoTreinamentoResult.length;

	cargoTreinamentoResult = await db
		.insert(cargoTreinamento)
		.values([
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[15].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[31].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[45].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[46].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[48].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[54].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[5].id },
			{ cargo: cargoResult[65].id, treinamento: treinamentoResult[5].id },

			{ cargo: cargoResult[22].id, treinamento: treinamentoResult[9].id },
			{ cargo: cargoResult[31].id, treinamento: treinamentoResult[9].id },
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[9].id },
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[9].id },

			{ cargo: cargoResult[22].id, treinamento: treinamentoResult[10].id },
			{ cargo: cargoResult[31].id, treinamento: treinamentoResult[10].id },
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[10].id },
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[10].id },

			{ cargo: cargoResult[31].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[40].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[41].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[42].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[11].id },
			{ cargo: cargoResult[65].id, treinamento: treinamentoResult[11].id },

			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[12].id },
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[12].id },
			{ cargo: cargoResult[57].id, treinamento: treinamentoResult[12].id },
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[12].id },

			{ cargo: cargoResult[0].id, treinamento: treinamentoResult[13].id },
			{ cargo: cargoResult[44].id, treinamento: treinamentoResult[13].id },
			{ cargo: cargoResult[46].id, treinamento: treinamentoResult[13].id },
			{ cargo: cargoResult[47].id, treinamento: treinamentoResult[13].id },
			{ cargo: cargoResult[48].id, treinamento: treinamentoResult[13].id },
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[13].id },
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[13].id },
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[13].id },
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[13].id },
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[13].id },
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[13].id },

			{ cargo: cargoResult[57].id, treinamento: treinamentoResult[14].id },
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[14].id },
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[14].id },
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[14].id },
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[14].id },
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[14].id },
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[14].id },
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[14].id },
			{ cargo: cargoResult[65].id, treinamento: treinamentoResult[14].id },

			{ cargo: cargoResult[6].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[11].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[22].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[23].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[31].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[40].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[41].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[42].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[51].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[53].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[57].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[15].id },
			{ cargo: cargoResult[65].id, treinamento: treinamentoResult[15].id },

			{ cargo: cargoResult[11].id, treinamento: treinamentoResult[16].id },
			{ cargo: cargoResult[23].id, treinamento: treinamentoResult[16].id },
			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[16].id },
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[16].id },

			{ cargo: cargoResult[0].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[5].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[6].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[17].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[51].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[53].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[54].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[55].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[56].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[57].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[17].id },
			{ cargo: cargoResult[65].id, treinamento: treinamentoResult[17].id },

			{ cargo: cargoResult[0].id, treinamento: treinamentoResult[18].id },

			{ cargo: cargoResult[11].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[22].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[31].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[32].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[40].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[41].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[42].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[49].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[51].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[53].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[59].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[60].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[61].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[62].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[63].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[19].id },
			{ cargo: cargoResult[65].id, treinamento: treinamentoResult[19].id },

			{ cargo: cargoResult[11].id, treinamento: treinamentoResult[20].id },
			{ cargo: cargoResult[22].id, treinamento: treinamentoResult[20].id },
			{ cargo: cargoResult[23].id, treinamento: treinamentoResult[20].id },
			{ cargo: cargoResult[33].id, treinamento: treinamentoResult[20].id },
			{ cargo: cargoResult[35].id, treinamento: treinamentoResult[20].id },

			{ cargo: cargoResult[2].id, treinamento: treinamentoResult[21].id },
			{ cargo: cargoResult[8].id, treinamento: treinamentoResult[21].id },
			{ cargo: cargoResult[27].id, treinamento: treinamentoResult[21].id },

			{ cargo: cargoResult[0].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[1].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[2].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[3].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[6].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[7].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[8].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[9].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[14].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[15].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[17].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[21].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[22].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[23].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[24].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[27].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[29].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[36].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[38].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[41].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[43].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[44].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[50].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[52].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[57].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[64].id, treinamento: treinamentoResult[22].id },
			{ cargo: cargoResult[65].id, treinamento: treinamentoResult[22].id },

			{ cargo: cargoResult[2].id, treinamento: treinamentoResult[23].id },
			{ cargo: cargoResult[6].id, treinamento: treinamentoResult[23].id },
			{ cargo: cargoResult[8].id, treinamento: treinamentoResult[23].id },
			{ cargo: cargoResult[15].id, treinamento: treinamentoResult[23].id },
			{ cargo: cargoResult[22].id, treinamento: treinamentoResult[23].id },
			{ cargo: cargoResult[57].id, treinamento: treinamentoResult[23].id },

			{ cargo: cargoResult[58].id, treinamento: treinamentoResult[24].id },
		])
		.returning();

	length += cargoTreinamentoResult.length;

	console.log("Cargos x Treinamentos: ", length);

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
