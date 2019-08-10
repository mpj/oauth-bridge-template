let express = require('express')
let request = require('request')
let querystring = require('querystring')

let app = express()

let redirect_uri =
  process.env.REDIRECT_URI ||
  'http://localhost:3000/callback'


app.get('/', (req, res) => {
  res.send('connected to backend server!')
})

app.get('/login', function (req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: '95118ce99bf54ed1968a2b05641a748c',
      scope: 'user-read-currently-playing user-read-private',
      redirect_uri
    }))
})

app.get('/callback', function (req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        '95118ce99bf54ed1968a2b05641a748c' + ':' + 'c826048e01704d21954988c4fa31f0f7'
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    var access_token = body.access_token
    let uri = 'http://localhost:8080'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 3000
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)