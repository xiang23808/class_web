<template>
    <div>
      <h1>Loading...</h1>
    </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    mounted() {
      this.handleLineLoginCallback();
    },
    methods: {
      async handleLineLoginCallback() {
        const code = this.$route.query.code; // Get the authorization code from the query parameter
  
        if (code) {
          try {
            const response = await axios.post('https://api.line.me/oauth2/v2.1/token', null, {
              params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.VUE_APP_API+'/line', // Replace with your callback URL
                client_id: '2000515887',
                client_secret: '4b9cc5e72c762b4a47287eaaecb5653d'
              }
            });
  
            const accessToken = response.data.access_token;
            //todo 1发回后端拉取用户信息换取token
            //todo 2保存token，跳转首页
            console.log(accessToken);
            // You can now use the accessToken to make requests to LINE API or authenticate the user in your backend
          } catch (error) {
            console.error('Error exchanging authorization code for access token:', error);
          }
        }
      }
    }
  };
  </script>
  