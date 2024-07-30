import { Cascade, EntitySchema } from '@mikro-orm/core';
import { Partner } from '../../domain/entities/Partner';
import { OrderIdSchemaType, PartnerIdSchemaType } from './types';
import {
  Customer,
  Event,
  Section,
  Spot,
  Reservation,
  Order,
  OrderStatus,
} from '../../domain';
import {
  CustomerIdSchemaType,
  EventIdSchemaType,
  SectionIdSchemaType,
  SpotIdSchemaType,
  CpfSchemaType,
  NameSchemaType,
} from './types/';

export const PartnerSchema = new EntitySchema<Partner>({
  class: Partner,
  properties: {
    id: { primary: true, type: PartnerIdSchemaType },
    name: { type: NameSchemaType },
  },
});

export const CustomerSchema = new EntitySchema<Customer>({
  class: Customer,
  uniques: [{ properties: ['cpf'] }],
  properties: {
    id: {
      type: CustomerIdSchemaType,
      primary: true,
    },
    cpf: { type: CpfSchemaType },
    name: { type: NameSchemaType },
  },
});

export const EventSchema = new EntitySchema<Event>({
  class: Event,
  properties: {
    id: {
      type: EventIdSchemaType,
      primary: true,
    },
    name: { type: NameSchemaType },
    description: { type: 'text', nullable: true },
    date: { type: 'date' },
    isPublished: { type: 'boolean', default: false },
    totalSpots: { type: 'number', default: 0 },
    totalSpotsReserved: { type: 'number', default: 0 },
    sections: {
      kind: '1:m',
      entity: () => Section,
      mappedBy: (section) => section.eventId,
      eager: true,
      cascade: [Cascade.ALL],
    },
    partnerId: {
      kind: 'm:1',
      entity: () => Partner,
      hidden: true,
      mapToPk: true,
      type: PartnerIdSchemaType,
      //inherited: true,
    },
  },
});

export const SectionSchema = new EntitySchema<Section>({
  class: Section,
  properties: {
    id: {
      type: SectionIdSchemaType,
      primary: true,
    },
    name: { type: NameSchemaType },
    description: { type: 'text', nullable: true },
    isPublished: { type: 'boolean', default: false },
    totalSpots: { type: 'number', default: 0 },
    totalSpotsReserved: { type: 'number', default: 0 },
    price: { type: 'number', default: 0 },
    spots: {
      kind: '1:m',
      entity: () => Spot,
      mappedBy: (spot) => spot.sectionId,
      eager: true,
      cascade: [Cascade.ALL],
    },
    eventId: {
      kind: 'm:1',
      entity: () => Event,
      hidden: true,
      mapToPk: true,
      type: EventIdSchemaType,
    },
  },
});

export const SpotSchema = new EntitySchema<Spot>({
  class: Spot,
  properties: {
    id: {
      type: new SpotIdSchemaType(),
      primary: true,
    },
    location: { type: 'string', length: 255, nullable: true },
    isReserved: { type: 'boolean', default: false },
    isPublished: { type: 'boolean', default: false },
    sectionId: {
      kind: 'm:1',
      entity: () => Section,
      hidden: true,
      mapToPk: true,
      type: new SectionIdSchemaType(),
    },
  },
});

export const ReservationSchema = new EntitySchema<Reservation>({
  class: Reservation,
  properties: {
    spotId: {
      type: SpotIdSchemaType,
      primary: true,
      kind: 'm:1',
      entity: () => Spot,
      mapToPk: true,
    },
    date: { type: 'date' },
    customerId: {
      type: CustomerIdSchemaType,
      kind: 'm:1',
      entity: () => Customer,
      mapToPk: true,
      hidden: true,
    },
  },
});

export const OrderSchema = new EntitySchema<Order>({
  class: Order,
  properties: {
    id: {
      type: OrderIdSchemaType,
      primary: true,
    },
    amount: { type: 'number' },
    status: { enum: true, items: () => OrderStatus },
    customerId: {
      kind: 'm:1',
      entity: () => Customer,
      mapToPk: true,
      hidden: true,
      //inherited: true,
      type: CustomerIdSchemaType,
    },
    spotId: {
      kind: 'm:1',
      entity: () => Spot,
      hidden: true,
      mapToPk: true,
      //inherited: true,
      type: SpotIdSchemaType,
    },
  },
});
