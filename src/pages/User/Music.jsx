import React from 'react'
import styled from "styled-components";

const Music = () => {
  return (
    <MusicStyled>
      <div className='music-wrap'>
        <h1 id='music'>Music</h1>
        <h1 id='coming-soon'>Coming Soon !!</h1>
      </div>
    </MusicStyled>
  )
}

export default Music;

const MusicStyled = styled.section`
  .music-wrap {
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  #music {
    color:white
  }
  #coming-soon {
    color:#c925ed
  }
`;