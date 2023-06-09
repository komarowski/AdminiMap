import React from 'react';
import { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { useFetch, useSearchDebounce } from '../../customHooks';
import { Tabs, URLParams } from '../../constants';
import { ITag, ISuggestionDTO, INoteDTO } from '../../types';
import TagList from '../lists/tag-list';
import NoteList from '../lists/note-list';
import SuggestionList from '../lists/suggestion-list';
import { TagArray } from '../../constants';
import { convertStringToInt } from '../../utils';


interface IProps {
  zIndex: string;
}

const useSearchRequest = (searchQuery: string | null, searchTags: number): Array<INoteDTO> => {
  let request = 'api/notes?query=';
  if (searchQuery){
    request += searchQuery;
  }
  if (searchTags !== 0) {
    request += '&tags=' + searchTags;
  }
  return useFetch<Array<INoteDTO>>(request, [], true);
};

const useSuggestionRequest = (suggestionQuery: string): Array<ISuggestionDTO> => {
  // let requset: string | null;
  // if (suggestionQuery && !suggestionQuery.startsWith("t/")){
  //   requset = 'api/search?start=' + suggestionQuery;
  // } else {
  //   requset = null;
  // }
  const request = (!suggestionQuery || suggestionQuery.startsWith("t/")) 
    ? null 
    : 'api/search?start=' + suggestionQuery;
  return useFetch<Array<ISuggestionDTO>>(request, [], true);
};

const getTagsSelected = (tagsNumber: number): Array<ITag> => {
  let result: Array<ITag> = [];
  TagArray.forEach(tag => {
    if ((tagsNumber & tag.number) === tag.number) {
      result.push({ number: tag.number, title: tag.title});
    }
  });
  return result;
};

const getTagsUnselected = (tagsNumber: number): Array<ISuggestionDTO> => {
  let result: Array<ISuggestionDTO> = TagArray.map(tag => ({ number: 't/' + tag.number, title: tag.title}));
  TagArray.forEach(tag => {
    if ((tagsNumber & tag.number) === tag.number) {
      result = result.filter(item => item.number !== ('t/' + tag.number));
    }
  });
  return result;
};


const WidgetSearch: React.FunctionComponent<IProps> = (props) => {
  const suggestionModal = React.useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get(URLParams.SearchQuery));

  const [tagSum, setTagSum] = useState(convertStringToInt(searchParams.get(URLParams.TagSum), 0));
  const [tagArraySelected, setTagArraySelected] = useState<Array<ITag>>(getTagsSelected(tagSum));
  const [tagArrayUnselected, setTagArrayUnselected] = useState<Array<ISuggestionDTO>>(getTagsUnselected(tagSum));
  const [suggestionQuery, setSuggestionQuery] = useSearchDebounce();

  const searchResult = useSearchRequest(searchQuery, tagSum);
  // TODO: not call when searchSugestionQuery start with "t/"
  //const searchSugestionResult = useFetch<Array<ISuggestionDTO>>(suggestionQuery && 'api/search?start=' + suggestionQuery, [], true);
  const searchSugestionResult = useSuggestionRequest(suggestionQuery);

  const displaySuggestionModal = (isShow: boolean): void => {
    if (suggestionModal.current){
      suggestionModal.current.style.display = isShow ? "block" : "none";
    }
  };

  const handleInputChange = (event: React.FocusEvent<HTMLInputElement, Element>): void => {
    const query = event.target.value;
    setSuggestionQuery(query);
    if (query.length > 0) {
      displaySuggestionModal(true);
    } else {
      displaySuggestionModal(false);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      setSearchQuery(event.currentTarget.value);
      searchParams.set(URLParams.SearchQuery, event.currentTarget.value);
      setSearchParams(searchParams);
      displaySuggestionModal(false);
    }
  };

  const handleInputFocus = (): void => {
    if (suggestionQuery.length > 0) {
      displaySuggestionModal(true);
    }
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement, Element>): void => {
    if (!(event.relatedTarget)){
      displaySuggestionModal(false);
    }
  };

  const changeTagSum = (newTagSum: number): void => {
    searchParams.set(URLParams.TagSum, newTagSum.toString()); 
    setSearchParams(searchParams);
    setTagSum(newTagSum);
    setTagArraySelected(getTagsSelected(newTagSum));
    setTagArrayUnselected(getTagsUnselected(newTagSum));
  }

  const handleSuggestionClick = (number: string): void => {
    if (number.startsWith("t/")) {
      const tagInt = convertStringToInt(number.substring(2), 0);
      changeTagSum(tagSum + tagInt);
    } else if (number.startsWith("u/")) {
      searchParams.set(URLParams.SearchQuery, number); 
      setSearchParams(searchParams);
      setSearchQuery(number);
    } else {
      searchParams.set(URLParams.TabNumber, Tabs.Note);
      searchParams.set(URLParams.NoteNumber, number); 
      setSearchParams(searchParams);
    }
    displaySuggestionModal(false);
  };

  const handleTagCloseClick = (tag: number): void => {
    changeTagSum(tagSum - tag);
  };

  const renderSuggestionList = (): JSX.Element => {
    if (suggestionQuery.startsWith("t/")){
      return <SuggestionList sugestionArray={tagArrayUnselected} handleSuggestionClick={handleSuggestionClick}/>
    }
    if (searchSugestionResult.length > 0) {
      return <SuggestionList sugestionArray={searchSugestionResult} handleSuggestionClick={handleSuggestionClick}/>
    }
    return <div className="w4-widget__head__filter__result">No results...</div>;
  } 

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
              <div ref={suggestionModal} className="w4-widget__modal w4-widget__modal--input w4-theme-text w4-container" style={{display:"none"}}>
                {
                  renderSuggestionList()
                }
              </div>     
            </div>
          </div>
          <TagList tagArray={tagArraySelected} handleTagCloseClick={handleTagCloseClick}/>
        </div>
        <div className="w4-widget__body w4-container w4-theme-text">
          {
            (searchQuery == null || searchQuery === '')  && 
            <h2 style={{marginBottom: '10px'}}>Last updated</h2>
          }
          {
            (searchQuery != null && searchResult.length === 0) && 
            <h2>Your search - {searchQuery} - did not match any note.</h2>
          }
          <NoteList searchResult={searchResult} handleSuggestionClick={handleSuggestionClick}/>
        </div>
      </div>
    </div>
  );
}

export default WidgetSearch;