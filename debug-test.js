// Teste para verificar as funções de formatação
const formatCPF = (value) => {
  if (!value) return '-'
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return value
}

const formatPhone = (value) => {
  if (!value) return '-'
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return value
}

const mockCliente = {
  id: "094c7ede-784a-425c-8be1-90665c57ea4c",
  nome: "Pedro Oliveira Costa",
  cpf: "987.654.321-00",
  telefone: "11999998888",
  email: "pedro@email.com",
  consentimentoLgpd: true,
  criadoEm: "2025-09-15T18:20:02"
};

console.log('Testando formatação:');
console.log('CPF formatado:', formatCPF(mockCliente.cpf));
console.log('Telefone formatado:', formatPhone(mockCliente.telefone));
console.log('Email:', mockCliente.email || '-');
console.log('LGPD:', mockCliente.consentimentoLgpd ? 'Sim' : 'Não');
console.log('Criado em:', new Date(mockCliente.criadoEm).toLocaleDateString('pt-BR'));
