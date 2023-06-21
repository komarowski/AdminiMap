
export interface ITag {
  number: number;
  title: string;
}

// #region <DTO types>

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
  latitude: number;
  longitude: number;
} 
// #endregion  