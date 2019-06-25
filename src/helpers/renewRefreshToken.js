import Axios from 'axios';

export const renewRefreshToken = async () => {
  const encode = window.btoa(`${process.env.REACT_APP_REDDIT_APP_NAME}:${process.env.REACT_APP_REDDIT_APP_SECRET}`);
  const token = JSON.parse(window.localStorage.getItem('reddit_tokens'));

  if ( !token || !token.access_token ) return null;

  await Axios.post('https://www.reddit.com/api/v1/access_token', 
    `grant_type=refresh_token&refresh_token=${token.refresh_token}`,
  {
    headers: {
      "Authorization": `Basic ${encode}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(res => {
    window.localStorage.setItem('reddit_tokens', JSON.stringify({
      ...token,
      access_token: res.data.access_token
    }));
    getCurrentAuthenticatedUser(res.data.access_token);
  })
  .catch(console.log);
}

// called in renewRefreshToken
const getCurrentAuthenticatedUser = (token) => {

  Axios.get('https://oauth.reddit.com/api/v1/me', {
    headers: {
      "Authorization": `bearer ${token}`
    }
  })
  .then(res => window.localStorage.setItem('reddit_profile', JSON.stringify(res.data)))
  .catch(console.log);
}