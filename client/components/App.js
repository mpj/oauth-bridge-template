import React, { useState, useEffect } from 'react';
import SongBanner from './SongBanner.js'

//import dependecies
import queryString from 'query-string';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'



const App = () => {
  const [user, setUser] = useState({})
  const [currentSong, setCurrentSong] = useState(null)
  const [audioAnalysis, setAudioAnalysis] = useState({})
  const [radarData, setRadarData] = useState([])
  useEffect(init, [])
  useEffect(() => {
    if (currentSong === null) return
    else handleSongChange();
  }, [currentSong])


  function init() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(res => res.json())
      .then(userData => {
        setUser(userData)
        fetchCurrentPlaying()
      })
      .catch(error => console.log(error))
  }



  function fetchCurrentPlaying() {
    console.log(new Date())     //logs everytime a fetch happens
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    //fetch the currently playing song for spotify user
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(res => res.json()) //if error retrieving current song(eg: no song playing), it goes straight to .catch
      .then(song => {
        console.log(song)
        if (!currentSong || song.item.id !== currentSong.item.id) {
          console.log('switching songs!')
          setCurrentSong(song);
        }
      })
      .catch(error => {
        console.log('error in fetching current song -', error)
        setCurrentSong(null)
      })
  }

  function handleSongChange() {
    fetchAudioAnalysis();
    assignRadarData();
  }

  function fetchAudioAnalysis() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    let url = `https://api.spotify.com/v1/audio-features/${currentSong.item.id}`
    fetch(url, { headers: { 'Authorization': 'Bearer ' + accessToken } })
      .then(res => res.json())
      .then(res => setAudioAnalysis(res))
      .catch(error => console.log(error))
  }

  function assignRadarData() {
    const mockData = [
      {
        data: {
          danceability: audioAnalysis.danceability || 0.5,
          valence: audioAnalysis.valence || 0.5,
          energy: audioAnalysis.energy || 0.5,
          popularity: currentSong.item.popularity / 100 || 0.5,
          acousticness: audioAnalysis.acousticness || 0.5,
        },
        meta: { color: 'green' }
      },
    ];
    //populate/init data to be used by RadarChart
    setRadarData(mockData)
  }

  const captions = {
    // columns
    danceability: 'Danceability',
    valence: 'Valence',
    energy: 'Energy',
    acousticness: 'Acousticness',
    popularity: 'Popularity'
  };

  return (
    <div>
      <h1>Visual Musiq - {user.display_name}</h1>

      {!currentSong ? <h5 id='noSong'>No Songs Currently Playing...</h5> :
        (
          <div>
            <SongBanner currSong={currentSong} />
            <div>
              <img id='albumImage' src={currentSong.item.album.images[0].url} width='300' length='300' />
              <RadarChart captions={captions} data={radarData} size={300} />
            </div>
          </div>
        )}

      <button onClick={fetchCurrentPlaying}>Currently Playing</button>

    </div>
  );
}

export default App;
