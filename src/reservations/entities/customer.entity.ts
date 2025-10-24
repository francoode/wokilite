import { ISODateTime } from 'src/shared/types';

export class Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
