import { ISODateTime } from "src/shared/types";
export class Table {
  id: string;
  sectorId: string;
  name: string;
  minSize: number;                                 
  maxSize: number;                                
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
