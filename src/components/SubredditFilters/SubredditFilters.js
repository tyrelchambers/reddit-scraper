import React, { useState } from 'react'
import './SubredditFilters.scss';
import filterOptionsJSON from './filterOptions';
import SelectField from '../SelectField/SelectField';

const SubredditFilters = ({ setReloadPosts, posts, setPosts, reloadPosts}) => {
  const [ keywords, setKeywords ] = useState("");
  const [ filterOptions, setFilterOptions ] = useState({
    seriesOnly: false,
    upvotes: 0,
    operator: ">"
  });

  return(
    <div className="d-f fxd-c w-100pr filters-wrapper">
      <div className=" d-f mt+ w-100pr">
        <div className="d-f w-100pr ai-c inputs">
          <SelectField 
            data={filterOptionsJSON}
            label="Greater than"
            options={filterOptions}
            setOptions={setFilterOptions}
            prop="operator"
          />
          
          <input type="number" className="input ml-" placeholder="Upvote Count (default: 0)" onChange={e => setFilterOptions({...filterOptions, upvotes: e.target.value})}/>
          <input type="text" className="input ml-" placeholder="keywords separated by commas" onChange={(e) => setKeywords(e.target.value)}/>

        </div>

        <div className="filter-actions d-f ai-c">
          <button className={`btn btn-tiertiary ${filterOptions.seriesOnly ? "active" : ""}`} onClick={() => setFilterOptions({...filterOptions, seriesOnly: !filterOptions.seriesOnly})}>Series Only</button>

          <button className="btn btn-tiertiary" onClick={() => {
            resetFilters(setFilterOptions);
            setReloadPosts(!reloadPosts);
          }}>Reset Filters</button>
          <button className="btn btn-secondary ml-" onClick={() => {
            applyFilters(posts, setPosts, keywords, filterOptions.upvotes, filterOptions.operator, filterOptions.seriesOnly);
          }}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}


const resetFilters = (setFilterOptions) => {
  return setFilterOptions({
    upvotes: 0,
    seriesOnly: false,
    operator: ">"
  });
}

const seriesOnlyFilter = (data) => {
  const newPromise = new Promise((resolve, reject) => {
    const posts = data.filter(x => x.flair === "Series");
    resolve(posts);
  });

  return newPromise;
}


const keywordSearch = (data, posts) => {
  if ( !data || data.length === 0 ) return false;
  
  const newPromise = new Promise((resolve, reject) => {
    const keywords = data.split(", ");
    let results;
    for ( let i = 0; i < keywords.length; i++ ) {
      let postsTitle = posts.filter(x => x.title.toLowerCase().includes(keywords[i].toLowerCase()));
      let postsBody = posts.filter(x => x.selftext.toLowerCase().includes(keywords[i].toLowerCase()));
      let set = new Set([...postsTitle, ...postsBody]);
      results = [...set];
    }
    resolve(results);
  });

  return newPromise;
}

const operatorSort = (upvoteCount, posts, operator) => {
  const newPromise = new Promise((resolve, reject) => {
    const op = operator;
    if ( op === ">") {
      let newPosts = posts.filter(x => x.ups > upvoteCount);
      resolve(newPosts);
    };

    if ( op === "<") {
      let newPosts = posts.filter(x => x.ups < upvoteCount);
      resolve(newPosts);
    };

    if ( op === "===") {
      let newPosts = posts.filter(x => x.ups == upvoteCount);
      resolve(newPosts);
    };
    reject("No operator specified");

  }); 

  return newPromise;
}

const applyFilters = async (posts, setPosts, keywords = "", upvoteCount = 0, operator, seriesOnly) => {
  let newPosts = [...posts];

  if ( keywords.length ) {
    await keywordSearch(keywords, posts).then(res => newPosts = [...res]).catch(console.log);
  }

  if ( seriesOnly ) {
    await seriesOnlyFilter(newPosts, seriesOnly).then(res => newPosts = [...res]).catch(console.log);
  }

  if ( upvoteCount > 0 ) {
    await operatorSort(upvoteCount, newPosts, operator).then(res => newPosts = [...res]).catch(console.log);
  }
  
  return setPosts([...newPosts]);
}

export default SubredditFilters;