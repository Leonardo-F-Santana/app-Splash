import { Documento } from "./Documento";

export class Cpf implements Documento {

  private value: string

  constructor(value: string){
    if (!Cpf.isValid(value)) {
      throw new Error(`O valor não é um CPF válido: ${value}`)
    }
    this.value = value
  }

  static isValid(value: string): boolean {
    return value.length == 14
  }

  getDocumento(): Documento {
    return this
  }
  getValue(): string {
    return this.value
  }
}