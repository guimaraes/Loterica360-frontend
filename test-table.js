// Teste simples para verificar se a lógica da tabela está funcionando
const mockCliente = {
  id: "094c7ede-784a-425c-8be1-90665c57ea4c",
  nome: "Pedro Oliveira Costa",
  cpf: "987.654.321-00",
  telefone: "11999998888",
  email: "pedro@email.com",
  consentimentoLgpd: true,
  criadoEm: "2025-09-15T18:20:02"
};

const mockColumns = [
  { key: 'nome', label: 'Nome' },
  { key: 'cpf', label: 'CPF' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'email', label: 'Email' },
  { key: 'actions', label: 'Ações' }
];

console.log('Cliente mock:', mockCliente);
console.log('Colunas mock:', mockColumns);

// Simular a lógica da tabela
mockColumns.forEach(column => {
  const value = column.key === 'actions' ? mockCliente : mockCliente[column.key];
  console.log(`Coluna ${column.key}:`, value);
});
