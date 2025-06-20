import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [fbReady, setFbReady] = useState(false);

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1420242802316786',
        // appId:'932082188994951',
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
      setFbReady(true);
    };

    (function (d, s, id) {
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      const fjs = d.getElementsByTagName(s)[0];
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const handleLogin = () => {
    if (!fbReady) {
      alert('Facebook SDK is still loading...');
      return;
    }

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          window.FB.api('/me', { fields: 'id,name,email' }, function (userData) {
            const facebookId = userData.id;

            window.FB.api('/me/accounts', function (pageData) {
              console.log('📦 Page Data:', pageData); 
              if (!pageData?.data?.length) {
                alert('No Facebook Pages found.');
                return;
              }

              const page = pageData.data[0];
              const facebookPageId = page.id;
              const facebookPageAccessToken = page.access_token;

              axios.post('https://facebook-seven-cyan.vercel.app/user/facebookuser', {
                facebookId,
                facebookPageId,
                facebookPageAccessToken
              })
                .then((res) => {
                  localStorage.setItem('userId', JSON.stringify(res.data.user._id));
                  navigate('/home');
                })
                .catch((err) => {
                  console.error('❌ Backend error:', err);
                  alert('Error saving user data.');
                });
            });
          });
        } else {
          alert(`Facebook login was cancelled or failed.`);
        }
      },
  {
    scope: 'pages_show_list, pages_manage_posts',
    auth_type: 'rerequest' // 👈 Forces Facebook to ask again
  }
    );
  };

  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <button
        onClick={handleLogin}
        disabled={!fbReady}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#1877F2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: fbReady ? 'pointer' : 'not-allowed',
          width: '250px',
        }}
      >
        Login with Facebook
      </button>
    </div>
  );
};

export default Login;
