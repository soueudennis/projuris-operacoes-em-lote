// Mock data for the prototype
const PROCESSES = [
  { id: 1, pasta: '1234', status: 'Ativo',     cliente: 'Aaron Ortega',     numero: '1071089-04.2016.8.26.0100', natureza: 'Trabalhista', advogado: 'Alexander Stevens', cadastro: '25/05/2020', valor: 'R$ 142.500,00' },
  { id: 2, pasta: '1234', status: 'Encerrado', cliente: 'Ricky Kim',        numero: '1046889-30.2016.8.26.0100', natureza: 'Trânsito',    advogado: 'Marina Costa',      cadastro: '21/12/2020', valor: 'R$ 18.200,00' },
  { id: 3, pasta: '1234', status: 'Encerrado', cliente: 'Estella Goodwin',  numero: '1101118-08.2014.8.26.0100', natureza: 'Criminal',    advogado: 'Pedro Almeida',     cadastro: '13/06/2020', valor: 'R$ 64.000,00' },
  { id: 4, pasta: '1234', status: 'Ativo',     cliente: 'Gary Chandler',    numero: '0188026-90.2011.8.26.0100', natureza: 'Família',     advogado: 'Marina Costa',      cadastro: '11/04/2020', valor: 'R$ 32.800,00' },
  { id: 5, pasta: '1234', status: 'Ativo',     cliente: 'Lena Osborne',     numero: '0028766-69.2014.8.26.0100', natureza: 'Criminal',    advogado: 'Pedro Almeida',     cadastro: '20/05/2020', valor: 'R$ 220.000,00' },
  { id: 6, pasta: '1234', status: 'Encerrado', cliente: 'Mar Jennings',     numero: '0037868-47.2016.8.26.0100', natureza: 'Societário',  advogado: 'Helena Vieira',     cadastro: '21/10/2020', valor: 'R$ 480.000,00' },
  { id: 7, pasta: '1234', status: 'Ativo',     cliente: 'Edna Smith',       numero: '1071089-04.2016.8.26.0100', natureza: 'Eleitoral',   advogado: 'Helena Vieira',     cadastro: '04/03/2020', valor: 'R$ 12.450,00' },
  { id: 8, pasta: '1234', status: 'Ativo',     cliente: 'Jerome Hoffman',   numero: '0180864-15.2009.8.26.0100', natureza: 'Eleitoral',   advogado: 'Alexander Stevens', cadastro: '02/09/2020', valor: 'R$ 9.300,00' },
  { id: 9, pasta: '1234', status: 'Ativo',     cliente: 'Rhoda Price',      numero: '0005622-61.2017.8.26.0100', natureza: 'Família',     advogado: 'Marina Costa',      cadastro: '13/07/2020', valor: 'R$ 41.000,00' },
  { id: 10, pasta: '1234', status: 'Ativo',    cliente: 'Walter Perez',     numero: '0005622-61.2017.8.26.0100', natureza: 'Trabalhista', advogado: 'Pedro Almeida',     cadastro: '27/09/2020', valor: 'R$ 88.500,00' },
  { id: 11, pasta: '1234', status: 'Ativo',    cliente: 'Sofia Martins',    numero: '0091223-12.2018.8.26.0100', natureza: 'Trabalhista', advogado: 'Pedro Almeida',     cadastro: '14/01/2021', valor: 'R$ 52.700,00' },
  { id: 12, pasta: '1234', status: 'Ativo',    cliente: 'Bruno Tavares',    numero: '0011455-87.2019.8.26.0100', natureza: 'Trabalhista', advogado: 'Pedro Almeida',     cadastro: '08/02/2021', valor: 'R$ 27.000,00' },
];

const ADVOGADOS = [
  { id: 'as', nome: 'Alexander Stevens', oab: 'OAB/SP 234.512', area: 'Trabalhista', carga: 28 },
  { id: 'mc', nome: 'Marina Costa',      oab: 'OAB/SP 198.443', area: 'Família',     carga: 19 },
  { id: 'pa', nome: 'Pedro Almeida',     oab: 'OAB/SP 167.221', area: 'Criminal',    carga: 24 },
  { id: 'hv', nome: 'Helena Vieira',     oab: 'OAB/SP 245.910', area: 'Societário',  carga: 11 },
  { id: 'rs', nome: 'Rafael Souza',      oab: 'OAB/SP 312.119', area: 'Trabalhista', carga: 7 },
];

const OPERACOES = [
  { key: 'advogado', titulo: 'Trocar advogado responsável', desc: 'Reatribuir os processos selecionados a outro profissional.', icon: 'swap', ai: true },
  { key: 'encerrar', titulo: 'Encerrar processos',          desc: 'Mover para o status Encerrado com motivo e data.',          icon: 'archive', ai: true },
  { key: 'status',   titulo: 'Alterar status',              desc: 'Trocar o status atual de todos os processos selecionados.',  icon: 'flag', ai: false },
  { key: 'tags',     titulo: 'Adicionar etiquetas',         desc: 'Aplicar uma ou mais etiquetas aos processos.',               icon: 'tag', ai: false },
  { key: 'tarefas',  titulo: 'Delegar tarefas',             desc: 'Criar e atribuir uma mesma tarefa para todos.',              icon: 'task', ai: true },
];

const STATUS_TAG = {
  'Ativo':     { label: 'Ativo',     cls: 'tag tag--purple' },
  'Encerrado': { label: 'Encerrado', cls: 'tag tag--gray' },
  'Suspenso':  { label: 'Suspenso',  cls: 'tag tag--orange' },
  'Em revisão':{ label: 'Em revisão',cls: 'tag tag--blue' },
};

window.PROCESSES = PROCESSES;
window.ADVOGADOS = ADVOGADOS;
window.OPERACOES = OPERACOES;
window.STATUS_TAG = STATUS_TAG;
