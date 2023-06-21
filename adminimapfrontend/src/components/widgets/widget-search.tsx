import React from 'react';
import { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { useFetch, useSearchDebounce } from '../../customHooks';
import { Tabs, URLParams } from '../../constants';
import { ITag, ISuggestionDTO, INoteDTO } from '../../types';
import TagListSelected from '../lists/tag-selected-list';
import NoteList from '../lists/note-list';
import SuggestionList from '../lists/suggestion-list';
import { TagArray } from '../../constants';
import { convertStringToInt, getDefaultIfNull } from '../../utils';
import TagListUnselected from '../lists/tag-unselected-list';
import { FilterIcon } from '../icons/icons';


const useSearchRequest = (searchQuery: string | null, tagSum: number): Array<INoteDTO> => {
  let request = 'api/notes?query=';
  if (searchQuery){
    request += searchQuery;
  }
  if (tagSum !== 0) {
    request += '&tags=' + tagSum;
  }
  return useFetch<Array<INoteDTO>>(request, [], true);
};

const useSuggestionRequest = (suggestionQuery: string): Array<ISuggestionDTO> => {
  const request = suggestionQuery ? 'api/search?start=' + suggestionQuery : null;
  return useFetch<Array<ISuggestionDTO>>(request, [{title: "Start with \"u/\" to search by user", number: "u/"}], true);
};

const getSelectedTags = (tagsNumber: number): Array<ITag> => {
  let result: Array<ITag> = [];
  TagArray.forEach(tag => {
    if ((tagsNumber & tag.number) === tag.number) {
      result.push({ number: tag.number, title: tag.title});
    }
  });
  return result;
};

const getUnselectedTags = (tagsNumber: number): Array<ITag> => {
  let result: Array<ITag> = TagArray.map(tag => tag);
  TagArray.forEach(tag => {
    if ((tagsNumber & tag.number) === tag.number) {
      result = result.filter(item => item.number !== tag.number);
    }
  });
  return result;
};

interface IProps {
  zIndex: string;
}

const WidgetSearch: React.FunctionComponent<IProps> = (props) => {
  const suggestionInput = React.useRef<HTMLInputElement>(null);
  const suggestionModal = React.useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultQuery = getDefaultIfNull<string>(searchParams.get(URLParams.SearchQuery), '');
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const [suggestionQuery, setSuggestionQuery] = useSearchDebounce(defaultQuery);
  
  const [tagSum, setTagSum] = useState(convertStringToInt(searchParams.get(URLParams.TagSum), 0));
  const [tagArraySelected, setTagArraySelected] = useState<Array<ITag>>(getSelectedTags(tagSum));
  const [tagArrayUnselected, setTagArrayUnselected] = useState<Array<ITag>>(getUnselectedTags(tagSum));
  
  const searchResult = useSearchRequest(searchQuery, tagSum);
  const searchSugestionResult = useSuggestionRequest(suggestionQuery);

  const [showFilterModal, setShowFilterModal] = useState('none');

  const displaySuggestionModal = (isShow: boolean): void => {
    suggestionModal.current!.style.display = isShow ? "block" : "none";
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      setSearchQuery(event.currentTarget.value);
      searchParams.set(URLParams.SearchQuery, event.currentTarget.value);
      setSearchParams(searchParams);
      displaySuggestionModal(false);
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
    setTagArraySelected(getSelectedTags(newTagSum));
    setTagArrayUnselected(getUnselectedTags(newTagSum));
  }

  const handleSuggestionClick = (text: string): void => {
    if (text === 'u/'){
      setSuggestionQuery(text);
      suggestionInput.current!.focus();
      suggestionInput.current!.value = text;
      return;
    }
    if (text.startsWith("u/")) {
      searchParams.set(URLParams.SearchQuery, text); 
      setSearchParams(searchParams);
      setSearchQuery(text);
      suggestionInput.current!.value = text;
    } else {
      searchParams.set(URLParams.TabNumber, Tabs.Note);
      searchParams.set(URLParams.NoteNumber, text);
      setSearchParams(searchParams);
    }
    displaySuggestionModal(false);
  };

  return (
    <div className="w4-section w4-section--search" style={{zIndex: props.zIndex}}>
      <div className="w4-widget w4-flex-column">
        <div className="w4-widget__head w4-container w4-theme-cyan">
          <div className="w4-flex w4-margin-top w4-margin-bottom" style={{position: "relative"}}>
            <div className="w4-widget__head__input">
              <input 
                ref={suggestionInput}
                className="w4-input" 
                type="text"
                placeholder="search by titles"
                onChange={(e) => setSuggestionQuery(e.target.value)} 
                onKeyDown={handleInputKeyDown}
                onFocus={() => displaySuggestionModal(true)}
                onBlur={handleInputBlur}
              />
              <div ref={suggestionModal} className="w4-widget__modal w4-widget__modal--input w4-theme-text w4-container">
                <SuggestionList 
                  suggestionArray={searchSugestionResult} 
                  handleSuggestionClick={handleSuggestionClick}
                />
              </div>     
            </div>
            <div className="w4-button w4-button-primary w4-widget__head__button w4-theme" onClick={() => setShowFilterModal('block')}>
              {FilterIcon}              
            </div>
            <div className="w4-widget__modal w4-widget__modal--filter w4-theme-text w4-container" style={{display: showFilterModal, zIndex:'10'}}>
              <h2>Tags:</h2>
              <TagListUnselected 
                tagArray={tagArrayUnselected} 
                handleTagSelect={(tag) => changeTagSum(tagSum + tag)} 
              />
            </div>
            <div className="w4-modal-background" 
              onClick={() => setShowFilterModal('none')} 
              style={{display: showFilterModal}} 
            />
          </div>
          <TagListSelected 
            tagArray={tagArraySelected} 
            handleTagUnselect={(tag) => changeTagSum(tagSum - tag)}
          />
        </div>
        <div className="w4-widget__body w4-container w4-theme-text">
          {
            !searchQuery && <h2 style={{marginBottom: '10px'}}>Last updated</h2>
          }
          {
            (searchQuery && searchResult.length === 0) && 
            <h2>Your search - {searchQuery} - did not match any note.</h2>
          }
          <NoteList 
            searchResult={searchResult} 
            handleSuggestionClick={handleSuggestionClick}
          />
        </div>
      </div>
    </div>
  );
}

export default WidgetSearch;