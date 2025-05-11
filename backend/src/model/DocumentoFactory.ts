import { Cnpj } from "./Cnpj";
import { Cpf } from "./Cpf";
import { Documento } from "./Documento";


export class DocumentoFactory{
  static create(value: string): Documento {
    if(Cpf.isValid(value)) {
      return new Cpf(value)
    }

    if(Cnpj.isValid(value)) {
      return new Cnpj(value)
    }

    throw new Error(`O valor do documento não é valido: ${value}`)
  }
}