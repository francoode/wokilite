import { ISODateTime } from 'src/shared/types';


export class Sector {
  id: string;
  restaurantId: string;
  name: string;                                    
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
