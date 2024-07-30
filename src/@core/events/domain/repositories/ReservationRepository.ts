import { IRepository } from 'src/@core/common';
import { Reservation } from '../entities';

export interface ReservationRepository extends IRepository<Reservation> {}
