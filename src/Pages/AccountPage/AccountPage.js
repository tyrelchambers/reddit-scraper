import React, {useState, useEffect} from 'react'
import { observer } from 'mobx-react-lite';
import './AccountPage.scss';
import Axios from 'axios';
import { inject } from 'mobx-react';
import Home from './subpages/Home/Home';
import AltMessage from './subpages/AltMessage/AltMessage';
import Dashboard from '../Dashboard/Dashboard';
import tabs from './tabs'
import Tabs from '../../layouts/Tabs/Tabs';
import Security from './Security/Security';
import { getInitialGreeting } from '../../api/get';

const AccountPage = inject("UserStore")(observer(({UserStore}) => {
  const [ user, setUser ] = useState({
    email: "",
    defaultMessage: "",
    altMessage: ""
  });
  const [ redditProfile, setRedditProfile ] = useState({});
  const [ initialGreeting, setInitialGreeting ] = useState({
    text: '',
  });
  const [ repeatGreeting, setRepeatGreeting ] = useState();

  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    const profile = JSON.parse(window.localStorage.getItem("reddit_profile"));
    const im = async () => {
      const data = await getInitialGreeting();
      setInitialGreeting({...initialGreeting, ...data[0]})
    }

    im();
    getUserProfile(UserStore.getToken());
    setRedditProfile({...profile});
  }, []);

  const getUserProfile = (token) => {
    Axios.get(`${process.env.REACT_APP_BACKEND}/api/profile/auth`, {
      headers: {
        "token": token
      }
    })
    .then(res => setUser({...res.data}))
    .catch(console.log);
  }

 

  return (
    <>
    <div className="d-f fxd-c animated fadeIn faster account-wrapper">
      <h1>Account</h1>
        <Tabs url="/dashboard/account" data={tabs}/>

        {params.get("t") === "security" &&
          <Security
            UserStore={UserStore}
          />
        }

        {params.get("t") === "default_message" &&
          <Home
            redditProfile={redditProfile}
            initialGreeting={initialGreeting}
            setInitialGreeting={setInitialGreeting}
          />
        }

        {params.get("t") === "alt_message" &&
          <AltMessage
            redditProfile={redditProfile}
            user={user}
            setUser={setUser}
            UserStore={UserStore}
            repeatGreeting={repeatGreeting}
          />
        }          
      </div>
    </>
  )
}));

export default AccountPage;