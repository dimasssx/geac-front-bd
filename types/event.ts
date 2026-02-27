export type EventCategory =
  | "palestra"
  | "seminario"
  | "cultural"
  | "feira"
  | "workshop"
  | "livre"
  | "conferencia"
  | "festival"
  | "outro";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  campus: string;
  speakers: string[];
  capacity: number;
  registered: number;
  requirements: Array<{ id: number; description: string }>;
  organizer: string;
  organizerEmail: string;
  organizerType: string;
  image?: string;
  tags: string[];
  isRegistered?: boolean;
  onlineLink: string;
  status?: string; // todo: olha aqui dps pra ve se n quebra nada
}

export interface EventRequestDTO {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  categoryId: number;
  requirementIds: number[];
  locationId?: number;
  workloadHours: number;
  maxCapacity: number;
  onlineLink?: string;
  tags: number[];
  speakers: number[];
  orgId: string;
}

export interface LocationResponseDTO {
  id: number;
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  referencePoint: string;
  capacity: number;
}

export interface EventResponseDTO {
  id: string;
  title: string;
  description: string;
  onlineLink: string;
  startTime: string;
  endTime: string;
  workloadHours: number;
  maxCapacity: number;
  status: string;
  createdAt: string;
  categoryId: number;
  categoryName: string;
  location: Location;
  organizerName: string;
  organizerEmail: string;
  requirements: Array<{ id: number; description: string }>;
  tags: string[];
  speakers: string[];
  registeredCount?: number;
  isRegistered?: boolean;
}

export interface Location {
  id: number;
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  referencePoint: string;
  campus: string;
  capacity: number;
}

export interface RegistrationResponseDTO {
  userId: string;
  userName: string;
  userEmail: string;
  attended: boolean;
  status: string;
}
