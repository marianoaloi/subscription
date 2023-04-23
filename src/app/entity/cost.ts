export interface Cost {
    tags: any[]
    subscription:subsciptionDesc
    value: string
    cobranca: string
    rg: string
    componente: string
    moeda: string
}


export interface subsciptionDesc{
    name:string
    id:string
    processed:boolean
  }