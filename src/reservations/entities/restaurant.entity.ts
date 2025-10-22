import { ISODateTime } from "src/shared/types";

export class Restaurant {
  id: string;
  name: string;
  timezone: string;                                
  shifts?: Array<{ start: string; end: string }>; 
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

