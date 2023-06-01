import React from 'react';
import { useFetch } from '../../customHooks';
import { INoteDTO } from '../../typesDTO';


interface IProps {
  noteNumber: string | null;
  zIndex: string;
}

const WidgetNote: React.FunctionComponent<IProps> = (props) => {
  const note = useFetch<INoteDTO | null>(props.noteNumber && 'api/note?number=' + props.noteNumber, null, true);
  const noteHtml = useFetch<string>(props.noteNumber && `/notes/${props.noteNumber}/index.html`, '', false)

  const renderNote = () => {
    if (props.noteNumber) {
      if (note) {
        return (
          <div className="w4-widget__body w4-theme-text">
            <div className="w4-container w4-theme-cyan">
              <div className="w4-flex" style={{alignItems: "flex-start", justifyContent: "space-between"}}>
                <h1>{note.title}</h1> 
                <div style={{margin: "5px 0"}}> {new Date(note.lastUpdate).toLocaleDateString("en-US")}</div>
              </div>
              <div className="w4-flex">
                <div className="w4-tag w4-theme w4-flex">
                  <div className="w4-tag-text">u/{note.userName}</div>
                </div>
              </div>
            </div>
            <div className="w4-container w4-blog line-numbers" dangerouslySetInnerHTML={{__html: noteHtml}} />
          </div>
        );
      }

      return (
        <div className="w4-widget__body w4-theme-text">
          <div className="w4-container w4-theme-cyan">
            <div className="w4-flex">
              <h1>Not Found</h1> 
            </div>
          </div>
          <div className="w4-container w4-blog line-numbers">
            Note with number "{props.noteNumber}" not found!
          </div>
        </div>
      );
    }

    return (
      <div className="w4-widget__body w4-theme-text">
        <div className="w4-container w4-theme-cyan">
          <div className="w4-flex">
            <h1>Welcome to AdminiMap service!</h1> 
          </div>
        </div>
        <div className="w4-container w4-blog line-numbers">
          <h2>Overview</h2>
          <p>
            AdminiMap is a travel blogging platform with an interactive map showing all the trips taken by users.
          </p>
          <p>
            The map makes it easy to find all the destinations presented on the platform. You can also use <a href="/?tab=1">the search</a> by blog name or username.
          </p>
          <h2>How does it works?</h2>
          <p>
          <a href="https://www.markdownguide.org/getting-started/">The Markdown</a> markup language is used for writing articles.
          </p>
        </div>
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