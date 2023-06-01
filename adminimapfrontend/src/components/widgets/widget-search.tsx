import React from 'react';
import { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { useFetch, useSearchDebounce } from '../../customHooks';
import { Tabs, URLParams } from '../../routerParams';
import { ISuggestionDTO, INoteDTO } from '../../typesDTO';


interface IProps {
  zIndex: string;
}

const WidgetSearch: React.FunctionComponent<IProps> = (props) => {
  const inputSugestionModal = React.useRef<HTMLDivElement>(null)
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get(URLParams.SearchQuery));
  const [searchSugestionQuery, setSearchSugestionQuery] = useSearchDebounce();
  const searchResult = useFetch<Array<INoteDTO>>(searchQuery && 'api/notes?query=' + searchQuery, [], true);
  const searchSugestionResult = useFetch<Array<ISuggestionDTO>>(searchSugestionQuery && 'api/search?start=' + searchSugestionQuery, [], true);

  const setInputSugestionModalDisplay = (isShow: boolean): void => {
    if (inputSugestionModal.current){
      inputSugestionModal.current.style.display = isShow ? "block" : "none";
    }
  }

  const handleInputChange = (event: React.FocusEvent<HTMLInputElement, Element>): void => {
    setSearchSugestionQuery(event.target.value);
    if (event.target.value.length > 0) {
      setInputSugestionModalDisplay(true);
    } else {
      setInputSugestionModalDisplay(false);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      setSearchQuery(event.currentTarget.value);
      searchParams.set(URLParams.SearchQuery, event.currentTarget.value);
      setSearchParams(searchParams);
      setInputSugestionModalDisplay(false);
    }
  };

  const handleInputFocus = (): void => {
    if (searchSugestionQuery.length > 0) {
      setInputSugestionModalDisplay(true);
    }
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement, Element>): void => {
    if (!(event.relatedTarget)){
      setInputSugestionModalDisplay(false);
    }
  };

  const handleSuggestionClick = (number: string): void => {
    if (number.startsWith("u/")) {
      searchParams.set(URLParams.SearchQuery, number); 
      setSearchParams(searchParams);
    } else {
      searchParams.set(URLParams.TabNumber, Tabs.Note);
      searchParams.set(URLParams.NoteNumber, number); 
      setSearchParams(searchParams);
    }
    setInputSugestionModalDisplay(false);
  };

  return (
    <div className="w4-section w4-section--search" style={{zIndex: props.zIndex}}>
      <div className="w4-widget w4-flex-column">
        <div className="w4-widget__head w4-container w4-theme-cyan">
          <div className="w4-flex w4-margin-top w4-margin-bottom" style={{position: "relative"}}>
            <div className="w4-widget__head__input">
              <input 
                className="w4-input" 
                type="text"
                placeholder="search title or user"
                onChange={handleInputChange} 
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <div ref={inputSugestionModal} className="w4-widget__modal w4-widget__modal--input w4-theme-text w4-container" style={{display:"none"}}>
                {
                  searchSugestionResult.length > 0 ? 
                  <div>
                    {searchSugestionResult.map(suggestion => (
                      <div key={suggestion.number} className="w4-widget__head__filter__result" onClick={() => handleSuggestionClick(suggestion.number)}>
                        <button>{suggestion.title}</button>
                      </div>
                    ))}
                  </div> : 
                  <div className="w4-widget__head__filter__result">No results...</div>
                }
              </div>     
            </div>
          </div>
        </div>
        <div className="w4-widget__body w4-container w4-theme-text">
          {searchResult.map(note => (
            <div key={note.id} className="w4-search-result" onClick={() => handleSuggestionClick(note.number)}>
              <div className="w4-flex">
                <span className="w4-dot"></span>
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
        </div>
      </div>
    </div>
  );
}

export default WidgetSearch;