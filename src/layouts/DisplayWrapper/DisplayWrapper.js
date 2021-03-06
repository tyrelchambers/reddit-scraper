import React from 'react'
import Header from '../Header/Header';
import Announcement from '../Announcement/Announcement';

const DisplayWrapper = (props) => {
  return (
    <div >
      <Header />
      <Announcement 
        title={props.announcementTitle}
        body={props.announcementBody}
      />
      {props.children}
    </div>
  )
}


export default DisplayWrapper
