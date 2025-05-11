import { Documento } from "./Documento";

export class Cnpj implements Documento {

  private value: string

  constructor(value: string){
    if (!Cnpj.isValid(value)) {
      throw new Error(`O valor não é um CNPJ válido: ${value}`)
    }
    this.value = value
  }

  static isValid(value: string): boolean {
    return value.length == 11
  }

  getDocumento(): Documento {
    return this
  }
  getValue(): string {
    return this.value
  }
}