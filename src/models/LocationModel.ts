export interface LocationModel {
  title: string;
  id: string;
  language: string;
  resultType: string;
  administrativeAreaType?: string;
  address: Address;
  highlights: Highlights;
}

export interface Address {
  label: string;
  countryCode: string;
  countryName: string;
  county: string;
  city?: string;
  street?: string;
  district?: string;
  postalCode?: string;
}

export interface Highlights {
  title: Title[];
  address: Address2;
}

export interface Title {
  start: number;
  end: number;
}

export interface Address2 {
  label: Label[];
  county?: County[];
  street?: Street[];
  city?: City[];
}

export interface Label {
  start: number;
  end: number;
}

export interface County {
  start: number;
  end: number;
}

export interface Street {
  start: number;
  end: number;
}

export interface City {
  start: number;
  end: number;
}
