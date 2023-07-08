import { IMapState, ITag } from "./types";

export const TAGS: Array<ITag> = [
  { number: 1, title: "mytravel"},
  { number: 2, title: "attractions"},
  { number: 4, title: "walkingplaces"},
  { number: 8, title: "forinstagram"}
];

export const DEFAULTMAPSTATE: IMapState = {
  zoom: 15, 
  long: 76.9184966987745, 
  lat: 43.24979821566148
}

// #region <Router params>
export const Tabs = {
  SEARCH: '1',
  NOTE: '2',
  MAP: '3',
};

export const URLParams = {
  SEARCHQUERY: 'search',
  TAGSUM: 'tag',
  NOTENUMBER: 'note',
};

export const Pages = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
};
// #endregion  


export const LocalStorageParams = {
  USERNAME: 'UserName',
  TOKEN: 'Token',
  ACCESSLEVEL: 'AccessLevel',
  MAPSTATE: 'MapState'
};