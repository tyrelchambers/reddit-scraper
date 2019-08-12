import React from 'react'
import './ReadingList.scss';
import Axios from 'axios';

const CompletedStories = ({list, addToRead}) => {
  const stories = list.map((x, id) => 
    <li key={id} className="reading-list-item opaque">
      <div className="d-f fxd-c reading-list-header ">
        <div className="d-f ai-c jc-sb">
          <h3 className="reading-list-title mr+">{x.title}</h3>
          <h4 className="reading-list-author">{x.author}</h4>
        </div>
        <div className="message-tags mt-">
          <a className="message-story-tag" target="_blank" href={x.url}>Link to story</a>
        </div>
      </div>
      
      <div className="reading-list-body">
        <p>{x.selftext}</p>
      </div>
    </li>
  )
  return (
    <div className="m+ all-stories-wrapper fx-1">
      <h3>Completed Stories</h3>
      <ul className="reading-list-list ">
        {stories}
      </ul>
    </div>
  )
}


export default CompletedStories;