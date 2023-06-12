import React from 'react';
import { ISuggestionDTO } from '../../types';


interface IProps {
  suggestionArray: Array<ISuggestionDTO>;
  handleSuggestionClick: (number: string) => void;
}

const SuggestionList: React.FunctionComponent<IProps> = (props) => {
  return (
    <div>
      {
        props.suggestionArray.length > 0 
        ? props.suggestionArray.map(suggestion => (
        <div key={suggestion.number} className="w4-widget__head__filter__result" onClick={() => props.handleSuggestionClick(suggestion.number)}>
          <button>{suggestion.title}</button>
        </div>))
        : <div className="w4-widget__head__filter__result">No results...</div>
      }
    </div>
  );
}

export default React.memo(SuggestionList);