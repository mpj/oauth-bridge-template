import React from 'react';

function RecentList() {
  if (localStorage.getItem('savedSongs') === null) localStorage.setItem('savedSongs', JSON.stringify([]))
  const savedSongs = JSON.parse(localStorage.getItem('savedSongs'))
  return (
    <div>
      Recently played: {savedSongs.join(', ')}
    </div>
  )
}

export default RecentList