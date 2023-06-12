import React from 'react';
import AdminiLogo from "../../assets/files/onmap.svg";
import { useSearchParams } from "react-router-dom";
import WidgetSearch from "../widgets/widget-search";
import WidgetNote from "../widgets/widget-note";
import WidgetMap from "../widgets/widget-map";
import { Tabs, URLParams } from '../../constants';


const HomePage: React.FunctionComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams({tab: Tabs.Note});
  const tabCurrent = searchParams.get(URLParams.TabNumber);
  const noteNumber = searchParams.get(URLParams.NoteNumber);

  function setTabSearchParameter(tabParameter: string) {
    searchParams.set(URLParams.TabNumber, tabParameter);
    setSearchParams(searchParams);
  }

  function getTabButtonClassActive(tabParameter: string) {
    return tabCurrent === tabParameter ? "w4-button-tab--active" : "w4-button-tab--inactive";
  }

  function getSectionZIndex(tabParameter: string) {
    return tabCurrent === tabParameter ? "2" : "1";
  }
 
  return (
    <div className="w4-flex-column" style={{height: "100%"}}>
      <header className="w4-header w4-theme">
        <div className="w4-navbar w4-flex">
          <a href="/" className="w4-button w4-logo">
            <img src={AdminiLogo} alt="AdminiMap logo" width="26" />
            &nbsp; AdminiMap 
          </a>
          <div className="w4-tab-container">
            <div className={`w4-button w4-button-tab ${getTabButtonClassActive(Tabs.Search)}`} onClick={() => setTabSearchParameter(Tabs.Search)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" height="20" width="20" fill="#ffffff">
              <path d="M39.8 41.95 26.65 28.8q-1.5 1.3-3.5 2.025-2 .725-4.25.725-5.4 0-9.15-3.75T6 18.75q0-5.3 3.75-9.05 3.75-3.75 9.1-3.75 5.3 0 9.025 3.75 3.725 3.75 3.725 9.05 0 2.15-.7 4.15-.7 2-2.1 3.75L42 39.75Zm-20.95-13.4q4.05 0 6.9-2.875Q28.6 22.8 28.6 18.75t-2.85-6.925Q22.9 8.95 18.85 8.95q-4.1 0-6.975 2.875T9 18.75q0 4.05 2.875 6.925t6.975 2.875Z" />
              </svg> &nbsp; Search
            </div>
            <div className={`w4-button w4-button-tab ${getTabButtonClassActive(Tabs.Note)}`} onClick={() => setTabSearchParameter(Tabs.Note)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" height="20" width="20" fill="#ffffff">
              <path d="M15.95 35.5h16.1v-3h-16.1Zm0-8.5h16.1v-3h-16.1ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z" />
              </svg> &nbsp; Note
            </div>
            <div className={`w4-button w4-button-tab ${getTabButtonClassActive(Tabs.Map)}`} style={{display: "none"}} onClick={() => setTabSearchParameter(Tabs.Map)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" height="20" width="20" fill="#ffffff">
              <path d="m13.15 34.85 14.5-7.15 7.15-14.5-14.5 7.15ZM24 26q-.85 0-1.425-.575Q22 24.85 22 24q0-.85.575-1.425Q23.15 22 24 22q.85 0 1.425.575Q26 23.15 26 24q0 .85-.575 1.425Q24.85 26 24 26Zm0 18q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z" />
              </svg> &nbsp; Map
            </div>
          </div>
        </div>
      </header>

      <main className="w4-main">
        <WidgetSearch zIndex={getSectionZIndex(Tabs.Search)} />
        <WidgetNote noteNumber={noteNumber} zIndex={getSectionZIndex(Tabs.Note)} />
        <WidgetMap zIndex={getSectionZIndex(Tabs.Map)} />
      </main>
    </div>
  )
}

export default HomePage;
