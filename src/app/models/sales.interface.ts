export interface ISales {
  branchOffices: string;
  service: string;
  dateTransaction: Date;
  valueTransaction: number;
  totalAmount: number;
  typeService: string;
  create_at?: string | Date;
  update_at?: string | Date;
  delete_at?: string | Date;
  is_valid?: boolean;
}

export interface SummaryItem {
  id: string;
  value: string;
  totalAmount: number;
}

export interface ISalesDaily {
  id?: string;
  amountStart: number;
  amountEnd: number;
  branchOffices:string;
  dateSales: any;
  totalAmount: number;
  groupTransaction: IGroupedTransaction []
}

export interface IGroupedTransaction {
  dayTransaction: string;
  branchOffices: string;
  amounByService: IAmountByService[];
}

export interface IAmountByService {
  typeService: string;
  service: string;
  totalAmount: number;
}
