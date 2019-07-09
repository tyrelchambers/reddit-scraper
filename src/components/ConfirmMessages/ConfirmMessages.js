import React, { useState, useEffect } from 'react'
import './ConfirmMessages.scss';
import Axios from 'axios';
import { fetchTokens } from '../../helpers/renewRefreshToken';
import { toast } from 'react-toastify';

export default function ConfirmMessages({data, index, setIndex, userProfile, removeMessagedAuthor}) {
  const [ defaultMessage, setDefaultMessage ] = useState("");
  const [ subject, setSubject ] = useState("");
  const [ redditProfile, setRedditProfile ] = useState({});

  useEffect(() => {
    setSubject(data.title);
    const profile = JSON.parse(window.localStorage.getItem("reddit_profile"));

    setRedditProfile({...profile});
  }, [data.title]);

  useEffect(() => {
    setDefaultMessage(userProfile.defaultMessage);
  }, [data]);

  const Username = () => redditProfile.subreddit ? <h4 className="mt-">From: {redditProfile.subreddit.display_name_prefixed}</h4> : null;

  return (
    <div className="confirm-messages-wrapper">
      <h1 className="confirm-title" id="author" data-author={data.author}>To: {data.author}</h1>
      <Username/>
      <div className="d-f fxd-c">
        <div className="field-group">
          <label htmlFor="subject" className="form-label" >Subject</label>
          <input type="text" className="form-input" placeholder="Enter a subject" name="subject" value={subject.length > 100 ? subject.slice(0, 97) + '...' : subject} onChange={(e) => setSubject(e.target.value)}/>
        </div>

        <div className="field-group">
          <label htmlFor="defaultMessage" className="form-label">Your Default Message</label>
          <textarea name="defaultMessage" className="default-message-input" id="defaultMessage" placeholder="Enter default message.." value={defaultMessage} onChange={(e) => setDefaultMessage(e.target.value)}></textarea>
        </div>

        <button className="btn btn-primary" onClick={() => {
          sendMessageToAuthors(data.author, subject, defaultMessage, removeMessagedAuthor);
        }} >Message Author</button>
      </div>
    </div>
  )
}

export const sendMessageToAuthors = async (author, subject, message, removeMessagedAuthor) => {
  const tokens = await fetchTokens().catch(err => false);
  const fmtSubject = subject;
  const link = `https://oauth.reddit.com/api/compose`;

  if (!tokens || !author) return toast.error("Something went wrong");
  if (!message ) return toast.error("A messaged is needed to send");
  if ( !fmtSubject ) return toast.error("A subejct is needed");

  const body = new FormData();
  body.set('to', `/u/${author}`);
  body.set("subject", fmtSubject);
  body.set("text", message);

  await Axios.post(link, body, {
    headers: {
      "Authorization": `bearer ${tokens.access_token}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
  .then(res => {
    toast.success(`Message sent to ${author}`)
    removeMessagedAuthor();
  })
  .catch(console.log);
  
}