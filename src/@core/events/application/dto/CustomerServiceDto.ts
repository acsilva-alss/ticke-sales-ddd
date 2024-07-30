export type RegisterInput = {
  name: string;
  cpf: string;
};

export type RegisterOutput = {
  id: string;
  cpf: string;
  name: string;
};

export type ListOutput = Array<{
  id: string;
  cpf: string;
  name: string;
}>;
