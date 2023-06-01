export interface IMarkerDTO {
  number: string;
  title: string;
  userName: string;
  latitude: number;
  longitude: number;
}

export interface ISuggestionDTO {
  number: string;
  title: string;
}

export interface INoteDTO {
  id: number;
  number: string;
  title: string;
  userName: string;
  lastUpdate: string;
}
