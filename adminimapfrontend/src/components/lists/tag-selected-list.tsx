import React from 'react';
import { ITag } from '../../types';


interface IProps {
  tagArray: Array<ITag>;
  handleTagUnselectClick: (tag: number) => void;
}

const TagListSelected: React.FunctionComponent<IProps> = (props) => {
  return (
    <div className="w4-flex-wrap">
      {props.tagArray.map(tag => (
        <div key={tag.number} className="w4-tag w4-theme w4-flex">
          <div className="w4-tag-text"> {tag.title} </div>
          <div className="w4-button w4-button-tag-close" onClick={() => props.handleTagUnselectClick(tag.number)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="25" width="25" fill="#ffffff">
              <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"></path>
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TagListSelected;