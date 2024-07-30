import {
  AnyCollection,
  Entity,
  ICollection,
  MyCollectionFactory,
  Name,
  Uuid,
} from 'src/@core/common';
import { Spot, SpotId } from './Spot';

export class SectionId extends Uuid {}

export type SectionCreateCommand = {
  name: string;
  description?: string | null;
  totalSpots: number;
  price: number;
};

export type SectionConstructorProps = {
  id?: SectionId | string;
  name: Name;
  description: string | null;
  isPublished: boolean;
  totalSpots: number;
  totalSpotsReserved: number;
  price: number;
};

export class Section extends Entity {
  id: SectionId;
  name: Name;
  description: string | null;
  isPublished: boolean;
  totalSpots: number;
  totalSpotsReserved: number;
  price: number;
  private _spots: ICollection<Spot>;

  constructor(props: SectionConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new SectionId(props.id)
        : props.id ?? new SectionId();
    this.name = props.name;
    this.description = props.description;
    this.isPublished = props.isPublished;
    this.totalSpots = props.totalSpots;
    this.totalSpotsReserved = props.totalSpotsReserved;
    this.price = props.price;
    this._spots = MyCollectionFactory.create<Spot>(this);
  }

  static create(command: SectionCreateCommand) {
    const section = new Section({
      ...command,
      name: new Name(command.name),
      description: command.description ?? null,
      isPublished: false,
      totalSpotsReserved: 0,
    });

    section.initSpots();
    return section;
  }

  private initSpots() {
    for (let i = 0; i < this.totalSpots; i++) {
      this._spots.add(Spot.create());
    }
  }

  public changeName(name: string) {
    this.name = new Name(name);
  }

  public changeDescription(description: string | null) {
    this.description = description;
  }

  public changePrice(price: number) {
    this.price = price;
  }

  public changeLocation(command: { spotId: SpotId; location: string }) {
    const spot = [...this._spots].find((spot) =>
      spot.id.equals(command.spotId),
    );
    if (!spot) {
      throw new Error('Spot not found');
    }
    spot.changeLocation(command.location);
  }

  public publishAll() {
    this.publish();
    this._spots.forEach((spot) => spot.publish());
  }

  public unPublishAll() {
    this.unPublish();
    this._spots.forEach((spot) => spot.unPublish());
  }

  public publish() {
    this.isPublished = true;
  }

  public unPublish() {
    this.isPublished = false;
  }

  public allowReserveSpot(spotId: SpotId) {
    if (!this.isPublished) {
      return false;
    }

    const spot = [...this._spots].find((spot) => spot.id.equals(spotId));

    if (!spot) {
      throw new Error('Spot not found');
    }

    if (spot.isReserved) {
      return false;
    }

    if (!spot.isPublished) {
      return false;
    }

    return true;
  }

  public markSpotAsReserved(spotId: SpotId) {
    const spot = [...this._spots].find((spot) => spot.id.equals(spotId));
    if (!spot) {
      throw new Error('Spot not found');
    }
    if (spot.isReserved) {
      throw new Error('Spot already reserved');
    }
    spot.markAsReserved();
  }

  get spots(): ICollection<Spot> {
    return this._spots as ICollection<Spot>;
  }

  set spots(_spots: AnyCollection<Spot>) {
    this._spots = MyCollectionFactory.createFrom<Spot>(_spots);
  }

  public toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      description: this.description,
      isPublished: this.isPublished,
      totalSpots: this.totalSpots,
      totalSpotsReserved: this.totalSpotsReserved,
      price: this.price,
      spots: [...this._spots].map((spot) => spot.toJSON()),
    };
  }
}
