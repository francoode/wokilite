import { ISODateTime } from "src/shared/types";

export class Table {
  id: string;
  sectorId: string;
  name: string;
  minSize: number;                                 // minimum party size
  maxSize: number;                                 // maximum party size
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
