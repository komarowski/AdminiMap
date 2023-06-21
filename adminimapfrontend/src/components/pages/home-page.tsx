import React from 'react';
import AdminiLogo from "../../assets/files/onmap.svg";
import { useSearchParams } from "react-router-dom";
import WidgetSearch from "../widgets/widget-search";
import WidgetNote from "../widgets/widget-note";
import WidgetMap from "../widgets/widget-map";
import { Tabs, URLParams } from '../../constants';
import { SearchIcon, NoteIcon, MapIcon } from '../icons/icons';
import { INoteDTO } from '../../types';
import { useFetch } from '../../customHooks';


const HomePage: React.FunctionComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams({tab: Tabs.Note});
  const tabCurrent = searchParams.get(URLParams.TabNumber);
  const noteNumber = searchParams.get(URLParams.NoteNumber);
  const note = useFetch<INoteDTO | null>(noteNumber && 'api/note?number=' + noteNumber, null, true);

  const setTab = (tab: string): void => {
    searchParams.set(URLParams.TabNumber, tab);
    setSearchParams(searchParams);
  }

  const getActiveClass = (tab: string) => {
    return tabCurrent === tab ? "w4-button-tab--active" : "w4-button-tab--inactive";
  }

  const getSectionZIndex = (tab: string) => {
    return tabCurrent === tab ? "2" : "1";
  }
 
  return (
    <div className="w4-flex-column" style={{height: "100%"}}>
      <header className="w4-header w4-theme">
        <div className="w4-navbar w4-flex">
          <a href="/" className="w4-button w4-logo">
            <img src={AdminiLogo} alt="AdminiMap logo" width="26" /> &nbsp; AdminiMap 
          </a>
          <div className="w4-tab-container">
            <div className={`w4-button w4-button-tab ${getActiveClass(Tabs.Search)}`} onClick={() => setTab(Tabs.Search)}>
              {SearchIcon} &nbsp; Search
            </div>
            <div className={`w4-button w4-button-tab ${getActiveClass(Tabs.Note)}`} onClick={() => setTab(Tabs.Note)}>
              {NoteIcon} &nbsp; Note
            </div>
            <div className={`w4-button w4-button-tab w4-button-tab--map ${getActiveClass(Tabs.Map)}`} onClick={() => setTab(Tabs.Map)}>
              {MapIcon} &nbsp; Map
            </div>
          </div>
        </div>
      </header>

      <main className="w4-main">
        <WidgetSearch zIndex={getSectionZIndex(Tabs.Search)} />
        <WidgetNote noteNumber={noteNumber} note={note} zIndex={getSectionZIndex(Tabs.Note)} />
        <WidgetMap note={note} zIndex={getSectionZIndex(Tabs.Map)} />
      </main>
    </div>
  )
}

export default HomePage;
