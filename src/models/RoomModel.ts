export interface RoomModel {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  location: Location;
  imageUrl: string;
  amenities: string[];
  time: number; // Timestamp
}
export interface Location {
  address: string;
  city: string;
  district: string;
  ward: string;
  title: string;
}
