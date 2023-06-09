import { ITag } from "./types";

export const TagArray: Array<ITag> = [
  { number: 1, title: "Travel"},
  { number: 2, title: "Location"},
  { number: 4, title: "Sights"},
  { number: 8, title: "One day trip"}
];

// #region <Router params>
export const Tabs = {
  Search: '1',
  Note: '2',
  Map: '3',
};

export const URLParams = {
  SearchQuery: 'search',
  TagSum: 'tag',
  NoteNumber: 'note',
  TabNumber: 'tab',
};
// #endregion  