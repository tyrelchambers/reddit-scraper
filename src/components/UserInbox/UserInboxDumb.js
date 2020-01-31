import React from 'react'
import dateFns from 'date-fns'
import moment from 'moment';
import './UserInbox.scss';
import isEmpty from '../../helpers/objIsEmpty';
import { MainButton } from '../Buttons/Buttons';

const UserInboxDumb = ({data, key, onClick, getMoreMessages, loadingBtn, UserStore}) => {

  const currentUser = UserStore.redditProfile.name;
  const getLastReply = (x) => {
    let date;
    if ( isEmpty(x.data.replies) ) {
      date = dateFns.format(moment.unix(x.data.created_utc)._d, "MMM DD");
    } else {
      date = dateFns.format(moment.unix(x.data.replies.data.children[x.data.replies.data.children.length - 1].data.created_utc)._d, "MMM DD");;
    }
    
    return date;
  }
  const listItem = data.length > 0 ? data.map(x => {

    const formatThreads = () => {
      let lastReply;

      if ( x.data.replies.length === 0 ) {
        lastReply = x.data;      
      } else {
        lastReply = x.data.replies.data.children[x.data.replies.data.children.length - 1].data
      }

      return lastReply.author === currentUser.replace(/\s/g, "") ? `You: ${lastReply.body}` : lastReply.body;

    }

    return (
      <li key={x.data.id}  className="inbox-item d-f ai-c fx-2" name={x.data.name} onClick={(e) => {
        removeActiveClasses();
        e.target.closest('.inbox-item').classList.add('selected-inbox-message');
        onClick(x.data);
      }}>
        <i className="fas fa-user inbox-item-img mr+"></i>
        <div className="d-f fxd-c fx-1 ">
          <div className="d-f ai-c jc-sb fx-1 inbox-item-header-mobile">
            <h4 className="font-thin mb--">{x.data.author === currentUser.replace(/\s/g, "") ? x.data.dest : x.data.author}</h4>
            <p>{getLastReply(x)}</p>
          </div>
          <h4>{concatTitle(x.data.subject)}</h4>

          <p className="inbox-item-body">{formatThreads()}</p>
        </div>
      </li>
    );
  }) : <p className="mt+">No results found!</p>;

  return (
    <div key={key} className="inbox-left-wrapper ">
      <div className="h-48px w-100pr">
        <MainButton
          loading={loadingBtn}
          className="btn btn-tiertiary w-100pr"
          onClick={getMoreMessages}
        >
          Get More Messages
        </MainButton>
      </div>
      <ul className="mt+">
        {listItem}
      </ul>

      
    </div>
  )
}



const removeActiveClasses = () => {
  const el = document.querySelectorAll('.selected-inbox-message');
  if (el) {
    el.forEach(x => {
      x.classList.remove('selected-inbox-message');
    })
  }
}

const concatTitle = title => {
  const str = title.length < 70 ? title : title.slice(0,70) + "...";
  return str; 
}

export default UserInboxDumb
