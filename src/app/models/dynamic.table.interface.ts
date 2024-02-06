import { ElistOperationDatabase } from "./enum.tables";

export interface IDynamicFilterByProperty {
name:string;
operator:ElistOperationDatabase;
value:any;
}

export interface IDynamicDataResponse<T> {
    code: number;
    message: string;
    data: T[]
}
export interface IDynamicData<T> {
    code: number;
    message: string;
    data: T
}