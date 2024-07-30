import {
  AggregateRoot,
  AnyCollection,
  ICollection,
  MyCollectionFactory,
  Name,
  Uuid,
} from 'src/@core/common';
import { PartnerId } from './Partner';
import { Section, SectionId } from './Section';
import { SpotId } from './Spot';

export class EventId extends Uuid {}

export type CreateEventCommand = {
  name: string;
  description?: string | null;
  date: Date;
  partnerId: PartnerId;
};

export type AddSectionCommand = {
  name: string;
  description?: string | null;
  totalSpots: number;
  price: number;
};

export type EventConstructorProps = {
  id?: EventId | string;
  name: Name;
  description: string | null;
  date: Date;
  isPublished: boolean;
  totalSpots: number;
  totalSpotsReserved: number;
  partnerId: PartnerId | string;
};

export class Event extends AggregateRoot {
  id: EventId;
  name: Name;
  description: string | null;
  date: Date;
  isPublished: boolean;
  totalSpots: number;
  totalSpotsReserved: number;
  partnerId: PartnerId;
  private _sections: ICollection<Section>;

  constructor(props: EventConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventId(props.id)
        : props.id ?? new EventId();

    this.name = props.name;
    this.description = props.description;
    this.date = props.date;
    this.isPublished = props.isPublished;
    this.totalSpots = props.totalSpots;
    this.totalSpotsReserved = props.totalSpotsReserved;
    this.partnerId =
      props.partnerId instanceof PartnerId
        ? props.partnerId
        : new PartnerId(props.partnerId);
    this._sections = MyCollectionFactory.create<Section>(this);
  }

  static create(command: CreateEventCommand) {
    return new Event({
      ...command,
      name: new Name(command.name),
      description: command.description ?? null,
      isPublished: false,
      totalSpots: 0,
      totalSpotsReserved: 0,
    });
  }

  public changeName(name: string) {
    this.name = new Name(name);
  }

  public changeDescription(description: string | null) {
    this.description = description;
  }

  public changeDate(date: Date) {
    this.date = date;
  }

  public publishAll() {
    this.publish();
    this._sections.forEach((section) => section.publishAll());
  }

  public publish() {
    this.isPublished = true;
  }

  public unPublishAll() {
    this.unPublish();
    this._sections.forEach((section) => section.unPublishAll());
  }

  public unPublish() {
    this.isPublished = false;
  }

  public addSection(command: AddSectionCommand) {
    const section = Section.create(command);
    this._sections.add(section);
    this.totalSpots += section.totalSpots;
  }

  public changeSectionInformation(command: {
    sectionId: SectionId;
    name?: string;
    description?: string | null;
  }) {
    const section = [...this._sections].find((section) =>
      section.id.equals(command.sectionId),
    );
    if (!section) {
      throw new Error('Section not found');
    }
    'name' in command && section.changeName(command.name);
    'description' in command && section.changeDescription(command.description);
  }

  public changeLocation(command: {
    sectionId: SectionId;
    spotId: SpotId;
    location: string;
  }) {
    const section = [...this._sections].find((section) =>
      section.id.equals(command.sectionId),
    );
    if (!section) {
      throw new Error('Section not found');
    }
    section.changeLocation(command);
  }

  public allowReserveSpot(data: { sectionId: SectionId; spotId: SpotId }) {
    if (!this.isPublished) {
      return false;
    }

    const section = [...this._sections].find((s) =>
      s.id.equals(data.sectionId),
    );
    if (!section) {
      throw new Error('Section not found');
    }

    return section.allowReserveSpot(data.spotId);
  }

  public markSpotAsReserved(command: { sectionId: SectionId; spotId: SpotId }) {
    const section = [...this._sections].find((s) =>
      s.id.equals(command.sectionId),
    );

    if (!section) {
      throw new Error('Section not found');
    }

    section.markSpotAsReserved(command.spotId);
  }

  public findSection(sectionId: SectionId) {
    return this._sections.find((s) => s.id.equals(sectionId));
  }

  get sections(): ICollection<Section> {
    return this._sections as ICollection<Section>;
  }

  set sections(sections: AnyCollection<Section>) {
    this._sections = MyCollectionFactory.createFrom<Section>(sections);
  }

  public toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      description: this.description,
      date: this.date,
      isPublished: this.isPublished,
      totalSpots: this.totalSpots,
      totalSpotsReserved: this.totalSpotsReserved,
      partnerId: this.partnerId.value,
      sections: [...this._sections].map((section) => section.toJSON()),
    };
  }
}
