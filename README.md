# OAuth bridge template

This service logs in to Spotify and redirects the user to a given frontend application with a valid access_token as a parameter in the url.

In order to start developing, register a Spotify Application here:
https://developer.spotify.com/my-applications/#!/

On that page, add http://localhost:3000 as a callback url (don't forget to hit save at the bottom of the page)

Write these commands in your terminal (replacing XXXX AND YYYY with your acutal client id and secret from the page where you registered your application)

```
export SPOTIFY_CLIENT_ID=XXXX
export SPOTIFY_CLIENT_SECRET=YYYY
```

(You will need to the above two lines every time you start a new terminal, alternatively put it into your ~/.bash_profile if you want to be fancy)

This app is made to be deployed on Heroky. Before you do, you need to configure the app with the following commands:

```
heroku config:set CLIENT_ID=XXXXX
heroku config:set CLIENT_SECRET=YYYYY
heroku config:set REDIRECT_URI=http://mybackend.herokuapp.com
heroku config:set FRONTEND_URI=http://myfrontend.herokuapp.com
```
