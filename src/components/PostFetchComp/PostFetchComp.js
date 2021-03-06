import React, { useRef } from 'react'
import './PostFetchComp.scss';
import { MainButton } from '../Buttons/Buttons';
import SelectField from '../SelectField/SelectField';
import optionsJSON from './categoryOptions';
import timeframeJSON from './timeframeOptions';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

 const PostFetchComp = ({setCategoryOptions, categoryOptions, loading, PostStore, executeFetch}) => {
    const inputRef = useRef();
    const subreddit = PostStore.subreddit;
    return (
    <section className="w-100pr d-f post-fetch-header">
      <div className=" w-100pr post-fetch-search mb- bg">  
        <label className="form-label dark">Enter Subreddit</label>
        <div className="d-f ai-c h-48px mobile-fetch-inputs mt--">
          <div className="d-f fx-1 h-100p">
            <div className="preffix" style={{height: '100%'}}>
              <p>r/</p>
            </div>
            <input type="text" className="form-input w-100pr mr- search-input post-fetch-search-input" placeholder="subreddit" value={subreddit} onChange={(e) => PostStore.setSubreddit(e.target.value)} ref={inputRef}/>
          </div>

          <SelectField
            data={optionsJSON}
            defaultLabel="Hot"
            options={categoryOptions}
            setOptions={setCategoryOptions}
            prop="category"
          />

          {(categoryOptions.category === "top" || categoryOptions.category === "controversial") &&
            <SelectField
              data={timeframeJSON}
              defaultLabel="Past 24 Hours"
              options={categoryOptions}
              setOptions={setCategoryOptions}
              prop="timeframe"
            />
          }
          <MainButton 
            className={`btn btn-primary  ${subreddit.length === 0 ? "disabled" : ""}`}
            onClick={() => {
              executeFetch()
            }}
            disabled={loading}
            loading={loading}
            value="Get Posts"
          >
            <i className="fas fa-sync"></i>
          </MainButton>
        </div>
      </div>
    </section>
    )
  }


  export default inject("PostStore")(observer(PostFetchComp));

 

 

