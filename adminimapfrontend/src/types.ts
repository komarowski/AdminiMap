
export interface ITag {
  number: number;
  title: string;
}

// #region <Map widget types>
export interface IMarkerOverlay {
  anchor: [number, number];
  number: string;
  title: string;
  userName: string;
  display: string;
}

export interface IMapArgs {
  event: any;
  anchor: any;
  payload: any;
}
// #endregion  

// #region <DTO types>
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
  tagsString: string;
  userName: string;
  lastUpdate: string;
} 
// #endregion  