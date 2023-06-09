import React from 'react';
import { useFetch } from '../../customHooks';
import { INoteDTO } from '../../types';


interface IProps {
  noteNumber: string | null;
  zIndex: string;
}

const noteIndexContent: JSX.Element = 
  <div className="w4-container w4-blog">
    <h2>Overview</h2>
    <p>
     <a href="https://github.com/komarowski/AdminiMap">AdminiMap</a> is a travel blogging platform with an interactive map showing all the trips taken by users.
    </p>
    <p>
      The map makes it easy to find all the destinations presented on the platform. You can also use <a href="/?tab=1">the search</a> by blog name or username.
    </p>
    <h2>How does it works?</h2>
    <p>
      <a href="https://www.markdownguide.org/getting-started/">The Markdown</a> markup language is used for writing articles.
    </p>
  </div>;

const WidgetNote: React.FunctionComponent<IProps> = (props) => {
  const note = useFetch<INoteDTO | null>(props.noteNumber && 'api/note?number=' + props.noteNumber, null, true);
  const noteHtml = useFetch<string>(props.noteNumber && `/notes/${props.noteNumber}/index.html`, '', false);

  const renderNoteHeader = (title: string, date: string | null = null, userName: string | null = null, tags: string | null = null): JSX.Element => {
    return (
      <div className="w4-container w4-theme-cyan">
        <div className="w4-flex" style={{alignItems: "flex-start", justifyContent: "space-between"}}>
          <h1>{title}</h1> 
          {
            date && 
            <div style={{margin: "5px 0"}}> {new Date(date).toLocaleDateString("en-US")}</div>
          } 
        </div>
        {/* {
          userName && 
          <div className="w4-flex">
            <div className="w4-tag w4-theme w4-flex">
              <div className="w4-tag-text">u/{userName}</div>
            </div>
          </div>
        } */}
        <div className="w4-flex" style={{alignItems: "flex-start", justifyContent: "space-between"}}>
          {
            tags && 
            <div className="w4-tag w4-theme w4-flex">
              <div className="w4-tag-text">{tags}</div>
            </div>
          }
          {
            userName && 
            <div className="w4-tag w4-tag-text">u/{userName}</div>
          }
        </div>    
      </div>
    );
  }

  const renderNote = () => {
    if (props.noteNumber) {
      if (note) {
        return (
          <div className="w4-widget__body w4-theme-text">
            {renderNoteHeader(note.title, note.lastUpdate, note.userName, note.tagsString)}
            <div className="w4-container w4-blog" dangerouslySetInnerHTML={{__html: noteHtml}} />
          </div>
        );
      }

      return (
        <div className="w4-widget__body w4-theme-text">
          {renderNoteHeader(`Note with number "${props.noteNumber}" not found!`)}
          <div className="w4-container w4-blog"></div>
        </div>
      );
    }

    return (
      <div className="w4-widget__body w4-theme-text">
        {renderNoteHeader("Welcome to AdminiMap service!")}
        {noteIndexContent}
      </div>
    );
  }

  return (
    <div className="w4-section w4-section--note" style={{zIndex: props.zIndex}}>
      <div className="w4-widget w4-flex-column">
        {renderNote()}
      </div>
    </div>
  );
}

export default WidgetNote;