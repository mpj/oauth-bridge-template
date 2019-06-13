import React, { Component } from 'react';
import queryString from 'query-string';

import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'
import Marquee from 'react-text-marquee';

import SongBanner from './SongBanner.js'



class App extends Component {
  constructor(props) {
    super(props);
    this.fetchCurrentPlaying = this.fetchCurrentPlaying.bind(this);
    this.fetchAudioAnalysis = this.fetchAudioAnalysis.bind(this);
    this.assignSpiderData = this.assignSpiderData.bind(this);
    this.state = {
      user: {},
      currSong: {},
      spiderData: {},
      data: []
    }
  }

  fetchCurrentPlaying() {
    console.log(new Date())
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    //fetch the currently playing song for spotify user
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(res => res.json())
      .then(data => this.setState({ currSong: data }, this.fetchAudioAnalysis))
      .catch(error => {
        this.setState({ currSong: {}, spiderData: {} })
        console.log(error)
      })

  }

  fetchAudioAnalysis() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    let url = `https://api.spotify.com/v1/audio-features/${this.state.currSong.item.id}`
    fetch(url, { headers: { 'Authorization': 'Bearer ' + accessToken } })
      .then(res => res.json())
      .then(data => {
        this.setState({ spiderData: data })
      }).then(() => this.assignSpiderData())
      .catch(error => { console.log(error) })
  }

  assignSpiderData() {
    const mockData = [
      {
        data: {
          danceability: this.state.spiderData.danceability || 0.5,
          valence: this.state.spiderData.valence || 0.5,
          energy: this.state.spiderData.energy || 0.5,
          popularity: this.state.currSong.item.popularity / 100 || 0.5,
          acousticness: this.state.spiderData.acousticness || 0.5,
        },
        meta: { color: 'green' }
      },
    ];
    //populate/init data to be used by RadarChart
    this.setState({ data: mockData });
    console.log(this.state)
  }

  saveCurrSong() {
    //post current song into database
    //
  }

  componentWillMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(res => res.json())
      .then(data => this.setState({ user: data }))
      .then(() => this.fetchCurrentPlaying())
      .catch(error => console.log(error))
  }


  // componentDidMount() {
  //   setInterval(this.fetchCurrentPlaying, 1500);
  // }


  render() {

    const captions = {
      // columns
      danceability: 'Danceability',
      valence: 'Valence',
      energy: 'Energy',
      acousticness: 'Acousticness',
      popularity: 'Popularity'
    };

    let albumImg
    if (Object.keys(this.state.currSong).length === 0) albumImg = null
    else albumImg = <img id='albumImage' src={this.state.currSong.item.album.images[0].url} width='300' length='300' />

    //trying to extract all the artists
    // let artistsArr
    // if (Object.keys(this.state.currSong).length === 0) artistsArr = []
    // else {
    //   artistsArr = this.state.currSong.item.artists.map(element => {
    //     return element.name
    //   })
    // }

    return (
      <div>
        {/* <h2>Welcome, {this.state.user.display_name}</h2> */}

        {Object.keys(this.state.currSong).length === 0 ? <span id='noSong'>no song currently playing...</span> : <SongBanner currSong={this.state.currSong} />}

        <br></br>
        {albumImg}
        <RadarChart captions={captions} data={this.state.data} size={300} />
        <br></br>
        <button onClick={this.fetchCurrentPlaying}>Fetch Currently Playing</button>



      </div>
    );
  }
}


export default App;
