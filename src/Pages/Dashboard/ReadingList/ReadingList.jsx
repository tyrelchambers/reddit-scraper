import React, { useState, useEffect } from 'react'
import Dashboard from '../Dashboard';
import './ReadingList.scss';
import ReadingListDumb from './ReadingListDumb';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import Axios from 'axios';
import HR from '../../../components/HR/HR';
import CompletedStories from './CompletedStories';

const ReadingList = inject("ReadingListStore")(observer(({ReadingListStore}) => {  
  useEffect(() => {
    const token = window.localStorage.getItem('token');

    getReadingListFromDb(token, ReadingListStore)
    getCompletedStoriesFromDb(token, ReadingListStore);
  }, []);

  return (
    <Dashboard>
      <h1 className="mb-">Reading List</h1>
      <HR />
      <div className="d-f">
        <ReadingListDumb 
          list={ReadingListStore.getToRead()}
          setExpanded={(v) => ReadingListStore.setDim(v)}
        />

        <CompletedStories 
          list={ReadingListStore.getReadingList()}
          addToRead={x => ReadingListStore.addToRead(x)}
        />
      </div>
    </Dashboard>
  )
}));

const getReadingListFromDb = (token, store) => {
  Axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/reading_list?permission=true`, {
    headers: {
      token
    }
  })
  .then(res => store.addToRead(res.data))
  .catch(console.log)
}

const getCompletedStoriesFromDb = (token, ReadingListStore) => {
  Axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/stories/completed`, {
    headers: {
      token
    }
  })
  .then(res => ReadingListStore.setReadingList(res.data))
  .catch(console.log);
}

export default ReadingList