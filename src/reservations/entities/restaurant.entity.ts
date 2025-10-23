import { ISODateTime } from "src/shared/types";

export type Shift = {
  start: string; 
  end: string;   
}
export class Restaurant {
  id: string;
  name: string;
  timezone: string;                                
  shifts?: Array<Shift>; 
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

