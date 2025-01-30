const addCpfMask = (cpf: string): string => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) {
    return cpf;
  }
  cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  return cpf;
}

export default addCpfMask;
