export type CreateEventInput = {
  name: string;
  description?: string | null;
  date: Date;
  partnerId: string;
};

export type CreateEventOutput = {
  id: string;
  name: string;
};

export type UpdateEventInput = {
  name: string;
  description: string | null;
  date: Date;
};

export type UpdateEventOutput = {
  id: string;
  name: string;
};

export type AddSectionInput = {
  name: string;
  description: string;
  totalSpots: number;
  price: number;
  eventId: string;
};

export type AddSectionOutput = {
  id: string;
  name: string;
};

export type FindSectionsOutput = Array<{
  name: string;
  description: string | null;
  isPublished: boolean;
  totalSpots: number;
  totalSpotsReserved: number;
  price: number;
  spots: Array<SpotOutput>;
}>;

export type SpotOutput = {
  id: string;
  location: string | null;
  isReserved: boolean;
  isPublished: boolean;
};

export type FindSpotsOutput = Array<SpotOutput>;
