export interface IDetailProvideer{
    id?:string;
    provideer:string;
    service:string;
    excelHeader:string;
    code:string;
}

export interface IDataResponseDetailProvideer {
    code: number;
    message: string;
    data: IDetailProvideer[]
}