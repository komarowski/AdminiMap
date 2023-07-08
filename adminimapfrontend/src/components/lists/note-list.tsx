import React from 'react';
import { INoteDTO } from '../../types';


interface IProps {
  searchResult: Array<INoteDTO>;
  handleSuggestionClick: (number: string) => void;
}

const NoteList: React.FunctionComponent<IProps> = (props) => {
  return (
    <>
      {props.searchResult.map(note => (
        <div key={note.id} className="w4-search-result" onClick={() => props.handleSuggestionClick(note.number)}>
          <div className="w4-flex">
            <span className="w4-dot" />
            <h2>{note.title}</h2>
          </div>
          <div className="w4-search-result-container">
            <div className="w4-flex">
              <div className="w4-search-result__user"> u/{note.userName} </div>
              <div className="w4-search-result__date"> {new Date(note.lastUpdate).toLocaleDateString("en-US")} </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default NoteList;