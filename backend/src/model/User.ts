import { DocumentoFactory } from './DocumentoFactory';
import { Documento } from "./Documento";
import { Uuid } from "./Uuid";


export class User {
  private id: Uuid
  private nome: string
  private documento: Documento
  private apartamento: number
  private bloco: number
  private nascimento: Date

  constructor(nome: string, documento: Documento, apartamento: number, bloco: number, nascimento: Date, id?: string){
    this.id = id ? new Uuid(id) : Uuid.randomGenerator()
    this.nome = nome
    this.documento = documento
    this.apartamento = apartamento
    this.bloco = bloco
    this.nascimento = nascimento
  }

  static create(nome: string, documento: string, apartamento: number, bloco: number, nascimento: Date, id?: string): User {
    const currentDocumento = DocumentoFactory.create(documento)

    return new User(nome, currentDocumento, apartamento, bloco, nascimento, id)
  }
}