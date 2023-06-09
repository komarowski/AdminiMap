import React from 'react';
import { ISuggestionDTO } from '../../types';


interface IProps {
  sugestionArray: Array<ISuggestionDTO>;
  handleSuggestionClick: (number: string) => void;
}

const SuggestionList: React.FunctionComponent<IProps> = (props) => {
  return (
    <div>
      {props.sugestionArray.map(suggestion => (
        <div key={suggestion.number} className="w4-widget__head__filter__result" onClick={() => props.handleSuggestionClick(suggestion.number)}>
          <button>{suggestion.title}</button>
        </div>
      ))}
    </div>
  );
}

export default SuggestionList;