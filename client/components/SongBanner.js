import React from 'react';


function SongBanner({ currSong }) {
  const artistsArr = currSong.item.artists.map(element => element.name)
  return (
    <>
      <h4><span id='currentPlaying'>Currently Playing:</span>  {currSong.item.name} by {artistsArr[0]}</h4>
    </>
  );
}

export default SongBanner