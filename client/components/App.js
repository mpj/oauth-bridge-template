import React, { Component, useState, useEffect } from 'react';
import SongBanner from './SongBanner.js'
import RecentList from './RecentList.js'

//import dependecies
import queryString from 'query-string';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'



const App = () => {
  const [user, setUser] = useState({})
  const [currentSong, setCurrentSong] = useState({})
  const [spiderData, setSpiderData] = useState({})
  const [radarData, setRadarData] = useState([])
  useEffect(init, [])

  function fetchCurrentPlaying() {
    console.log(new Date())
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    //fetch the currently playing song for spotify user
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(res => {
      console.log(res)
      res.json()
    })
      .then(res => {
        if (Object.keys(currentSong).length === 0 || res.item.id !== currentSong.item.id) {
          console.log('switched songs!!!')
          setCurrentSong(res)
          saveCurrSong()
          fetchAudioAnalysis()
        }
      })
      .catch(error => {
        console.log(error)
      })

  }

  function fetchAudioAnalysis() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    let url = `https://api.spotify.com/v1/audio-features/${currentSong.item.id}`
    fetch(url, { headers: { 'Authorization': 'Bearer ' + accessToken } })
      .then(res => res.json())
      .then(res => {
        setSpiderData(res)
        assignSpiderData()
      })
      .catch(error => {
        console.log(error)
      })
  }

  function assignSpiderData() {
    const mockData = [
      {
        data: {
          danceability: spiderData.danceability || 0.5,
          valence: spiderData.valence || 0.5,
          energy: spiderData.energy || 0.5,
          popularity: currSong.item.popularity / 100 || 0.5,
          acousticness: spiderData.acousticness || 0.5,
        },
        meta: { color: 'green' }
      },
    ];
    //populate/init data to be used by RadarChart
    setRadarData(mockData)
  }

  function saveCurrSong() {
    if (localStorage.getItem('savedSongs') === null) localStorage.setItem('savedSongs', JSON.stringify([]))
    const savedSongs = JSON.parse(localStorage.getItem('savedSongs')) //parse saved songs array
    savedSongs.push(currentSong.item.name)
    if (savedSongs.length === 6) savedSongs.shift()
    localStorage.setItem('savedSongs', JSON.stringify(savedSongs))
    console.log('saved item to local storage!')
  }


  function init() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(res => res.json())
      .then(res => {
        setUser(res)
        fetchCurrentPlaying()
      })
      .catch(error => console.log(error))
  }


  // componentDidMount() {
  //   setInterval(this.fetchCurrentPlaying, 1000);
  // }


  const captions = {
    // columns
    danceability: 'Danceability',
    valence: 'Valence',
    energy: 'Energy',
    acousticness: 'Acousticness',
    popularity: 'Popularity'
  };

  // let albumImg
  // if (Object.keys(currentSong).length === 0) albumImg = null
  // else albumImg = <img id='albumImage' src={currentSong.item.album.images[0].url} width='300' length='300' />

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

      {Object.keys(currentSong).length === 0 ? <span id='noSong'>No Song Currently Playing...</span> : <SongBanner currSong={currentSong} />}

      <br></br>

      {Object.keys(currentSong).length === 0 ? <h1>sup</h1> : <img id='albumImage' src={currentSong.item.album.images[0].url} width='300' length='300' />}

      <RadarChart captions={captions} data={radarData} size={300} />

      <br></br>

      <button onClick={fetchCurrentPlaying}>Fetch Currently Playing</button>

      {/* <RecentList /> */}

    </div>
  );
}


export default App;
