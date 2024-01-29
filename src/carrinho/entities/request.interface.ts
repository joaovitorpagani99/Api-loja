import { Request } from 'express';
import { User } from './user.interface';

export interface RequestInt extends Request {
  user: User;
}