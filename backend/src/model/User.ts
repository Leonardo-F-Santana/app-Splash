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

  constructor(id: Uuid, nome: string, documento: Documento, apartamento: number, bloco: number, nascimento: Date){
    this.id = id
    this.nome = nome
    this.documento = documento
    this.apartamento = apartamento
    this.bloco = bloco
    this.nascimento = nascimento
  }

  static create(id: string, nome: string, documento: string, apartamento: number, bloco: number, nascimento: Date): User {
    const uuid = new Uuid(id)
    const currentDocumento = DocumentoFactory.create(documento)

    return new User(uuid, nome, currentDocumento, apartamento, bloco, nascimento)
  }
}