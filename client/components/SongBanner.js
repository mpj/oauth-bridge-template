import React from 'react';


function SongBanner(props) {
  let artistsArr
  if (Object.keys(props.currSong).length === 0) artistsArr = []
  else artistsArr = props.currSong.item.artists.map(element => element.name)

  return (
    <>
      <h4><span id='currentPlaying'>Currently Playing:</span>  {props.currSong.item.name} by {artistsArr[0]}</h4>
    </>
  );
}

export default SongBanner