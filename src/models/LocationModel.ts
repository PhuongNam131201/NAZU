export interface LocationModel {
  id: string;
  title: string;
  address: Address;
  access?: Access[]; // Mảng Access (tùy chọn)
  position?: Position; // Thêm thuộc tính position (tùy chọn)
}

export interface Address {
  city: string;
  countryCode: string;
  countryName: string;
  county: string;
  district: string;
  label: string;
  postalCode: string;
}

export interface Access {
  lat: number;
  lng: number;
}

export interface Position {
  lat: number;
  lng: number;
}
