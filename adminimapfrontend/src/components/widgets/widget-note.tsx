import React from 'react';
import { useFetch } from '../../customHooks';
import { INoteDTO } from '../../types';


const IndexNote: JSX.Element = 
  (
    <div className="w4-widget__body w4-theme-text">
      <div className="w4-container w4-theme-cyan">
        <h1>Welcome to AdminiMap service!</h1>   
      </div>
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
      </div>
    </div>
  );


interface INotFoundProps {
  noteNumber: string;
}

const NotFoundNote: React.FunctionComponent<INotFoundProps> = (props) => {
  return (
    <div className="w4-widget__body w4-theme-text">
      <div className="w4-container w4-theme-cyan">
        <h1>{`Note with number "${props.noteNumber}" not found!`}</h1>    
      </div>
      <div className="w4-container w4-blog"></div>
    </div>
  );
}

interface INoteProps {
  note: INoteDTO;
}

const Note: React.FunctionComponent<INoteProps> = (props) => {
  const noteHtml = useFetch<string>(`/notes/${props.note.number}/index.html`, '', false);

  return (
    <div className="w4-widget__body w4-theme-text">
      <div className="w4-container w4-theme-cyan">
        <div className="w4-flex" style={{alignItems: "flex-start", justifyContent: "space-between"}}>
          <h1>{props.note.title}</h1>
          <div style={{margin: "5px 0"}}> {new Date(props.note.lastUpdate).toLocaleDateString("en-US")}</div>
        </div>
        <div className="w4-flex" style={{alignItems: "center", justifyContent: "space-between"}}>
          <div className="w4-tag w4-theme w4-flex" style={{fontSize: "14px"}}>
            {props.note.tagsString}
          </div>
          <div className="w4-tag w4-tag-text">u/{props.note.userName}</div>
        </div>    
      </div>
      <div className="w4-container w4-blog" dangerouslySetInnerHTML={{__html: noteHtml}} />
    </div>
  );
}

interface IProps {
  noteNumber: string | null;
  note: INoteDTO | null;
  zIndex: string;
}

const WidgetNote: React.FunctionComponent<IProps> = (props) => {
  return (
    <div className="w4-section w4-section--note" style={{zIndex: props.zIndex}}>
      <div className="w4-widget w4-flex-column">
        {
          props.noteNumber 
          ? (props.note 
              ? <Note note={props.note} /> 
              : <NotFoundNote noteNumber={props.noteNumber} />
            )
          : IndexNote
        }
      </div>
    </div>
  );
}

export default WidgetNote;