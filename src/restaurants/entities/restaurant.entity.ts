export type Shift = {
  start: string; 
  end: string;   
}
export class Restaurant {
  id: string;
  name: string;
  timezone: string;                                
  shifts?: Array<Shift>; 
  createdAt: string;
  updatedAt: string;
}

