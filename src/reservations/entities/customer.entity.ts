import { ISODateTime } from 'src/shared/types';

export class Customer {
  name: string;
  phone: string;
  email: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
