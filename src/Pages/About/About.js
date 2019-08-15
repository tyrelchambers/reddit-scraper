import React from 'react';
import './About.scss';
import DisplayWrapper from '../../layouts/DisplayWrapper/DisplayWrapper';

const About = () => {
  return(
    <DisplayWrapper hasHeader={true}>
      <div className="about-wrapper ml-a mr-a d-f fxd-c ai-c jc-c animated fadeIn">
        <h1>What is Reddex</h1>
        <p>Reddex is a little tool (right now) to fetch posts from reddit. You can get up 1000 posts from different subreddit categories. With this data, you can also filter by upvote count and keywords. This was made to help narrators such as <a href="https://youtube.com/storiesaftermidnight" target="_blank" rel="noopener noreferrer">myself</a>, to find stories without having to scroll for many minutes, 10s of minutes, through each subreddit.</p>

        <div className="mt+ d-f fxd-c ai-c">
          <h1>Reddex can help you:</h1>
          <ul className="simple-list pl-">
            <li>Find the best of Reddit</li>
            <li>Quickly link to Reddit posts for fast discovery</li>
            <li>Message multiple OPs right from Reddex</li>
            <li>Quickly find subreddits thanks to our searh autocomplete (only if you've loaded the subreddits)</li>
          </ul>
        </div>
      </div>
    </DisplayWrapper>
  );
  
}

export default About;
