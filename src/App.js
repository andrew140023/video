import './App.css';
import './assets3/css/main.css'
import ReactPlayer from 'react-player';
import { createRef, useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom'
import { hot } from 'react-hot-loader'
import screenfull from 'screenfull'
import Duration from './Duration'

function App() {
  let url_list = ["https://youtu.be/IvtMu8DxR0A","https://youtu.be/mgHR0FMnDU8"];
  const [my_url,setmy_url] = useState(url_list[0]);
  console.log(my_url)
  const [state,setState] = useState({
    url: my_url,
    pip: false,
    playing: true,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false
  });

  const { url, playing, controls, light, volume, muted, loop, played, loaded, duration, playbackRate, pip } = state;
  
  let load = url => {
    console.log(url)
    setState({...state,
      url:url,
      played: 0,
      loaded: 0,
      pip: false
    })
  }

  useEffect(
    ()=>{
      setState({...state,url:my_url})
    },
    url
  )
  
  let handlePlayPause = () => {
    setState({...state,playing: !state.playing })
  }

  let handleStop = () => {
    setState({...state,url: null, playing: false })
  }

  let handleToggleControls = () => {
    const url = state.url
    setState({...state,
      controls: !state.controls,
      url: null
    })
  }

  let handleToggleLight = () => {
    setState({...state,light: !state.light })
  }

  let handleToggleLoop = () => {
    setState({...state,loop: !state.loop })
  }

  let handleVolumeChange = e => {
    setState({...state,volume: parseFloat(e.target.value) })
  }

  let handleToggleMuted = () => {
    setState({...state,muted: !state.muted })
  }

  let handleSetPlaybackRate = e => {
    setState({...state,playbackRate: parseFloat(e) })
  }

  let handleTogglePIP = () => {
    setState({...state,pip: !state.pip })
  }

  let handlePlay = () => {
    console.log('onPlay')
    setState({...state,playing: true })
  }

  let handleEnablePIP = () => {
    console.log('onEnablePIP')
    setState({...state,pip: true })
  }

  let handleDisablePIP = () => {
    console.log('onDisablePIP')
    setState({...state,pip: false })
  }

  let handlePause = () => {
    console.log('onPause')
    setState({...state,playing: false })
  }

  let handleSeekMouseDown = e => {
    setState({...state,seeking: true })
  }

  const handleSeekChange = e => {
    setState({...state, played: parseFloat(e.target.value) })
  }

  const handleSeekMouseUp = e => {
    setState({...state, seeking: false })
    player.current.seekTo(parseFloat(e.target.value))
  }

  let handleProgress = (locstate) => {
    console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!state.seeking) setState({...state,...locstate})
  }

  let handleEnded = () => {
    console.log('onEnded')
    setState({...state,playing: state.loop })
  }

  let handleDuration = (duration) => {
    console.log('onDuration', duration)
    setState({...state,duration })
  }

  let handleClickFullscreen = () => {
    screenfull.request(findDOMNode(player.current))
  }

  let renderLoadButton = (url, label) => {
    return (
      <button onClick={() => load(url)}>
        {label}
      </button>
    )
  }

  

  let h = window.innerHeight*0.6;
  let w = window.innerWidth*0.6;
//1920*1080
  if(h/w<1080/1920){
    h=w/1920*1080;
  }else{
    w=h/1080*1920;
  }

  const player = useRef(0);

  return (
    <>
    <div id="wrapper">
      <section id="main" class="wrapper">
        <div class="inner">
          <h1 class="major">Our Video</h1>
          
          <ul class="actions">
            <li>
              <ReactPlayer
                ref={player}
                className='react-player'
                width={w}
                height={"100%"}
                url={url}
                pip={pip}
                playing={playing}
                controls={controls}
                light={light}
                loop={loop}
                playbackRate={playbackRate}
                volume={volume}
                muted={muted}
                onReady={() => console.log('onReady')}
                onStart={() => console.log('onStart')}
                onPlay={handlePlay}
                onEnablePIP={handleEnablePIP}
                onDisablePIP={handleDisablePIP}
                onPause={handlePause}
                onBuffer={() => console.log('onBuffer')}
                onSeek={e => console.log('onSeek', e)}
                onEnded={handleEnded}
                onError={e => console.log('onError', e)}
                onProgress={(state)=>handleProgress(state)}
                onDuration={(duration)=>handleDuration(duration)}
              />
            </li>
            <li>
            <table>
            <tbody>
              <tr>
                <th>Sources</th>
                <td>
                <ul class="actions">
                  <li><button className={url_list[0]==my_url?"primary":""} onClick={()=>{setmy_url(url_list[0]);setState({...state,playing:false,url:url_list[0]})}}>介紹台灣</button></li>
                  <li><button className={url_list[1]==my_url?"primary":""} onClick={()=>{setmy_url(url_list[1]);setState({...state,playing:false,url:url_list[1]}) }}>台大景點介紹</button></li>
                  
                </ul>
                </td>
              </tr>
              <tr>
                <th>Controls</th>
                <td>
                <ul class="actions">
                  <li><button onClick={handlePlayPause}>{playing ? 'Pause' : 'Play'}</button></li>
                  <li><button onClick={handleClickFullscreen}>Fullscreen</button></li>
                  {light &&
                    <li><button onClick={() => this.p.showPreview()}>Show preview</button></li>}
                  {ReactPlayer.canEnablePIP(url) &&
                    <li><button onClick={()=>handleTogglePIP}>{pip ? 'Disable PiP' : 'Enable PiP'}</button></li>}
                </ul>
                <div class="col-6 col-12-small">
                      <input type="checkbox" id="controls" checked={controls} onChange={handleToggleControls} />
                      <label for="controls">build-in control bar</label>
                </div>
                
                </td>
              </tr>
              <tr>
                <th>Speed</th>
                <td>
                  <ul class="actions">
                    <li><button onClick={()=>handleSetPlaybackRate("1")}>1x</button></li>
                    <li><button onClick={()=>handleSetPlaybackRate("1.5")}>1.5x</button></li>
                    <li><button onClick={()=>handleSetPlaybackRate("2")}>2x</button></li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th>Seek</th>
                <td>
                  <input
                    type='range' min={0} max={0.999999} step='any'
                    value={played}
                    onMouseDown={handleSeekMouseDown}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekMouseUp}
                  />
                </td>
              </tr>
              <tr>
                <th>Volume</th>
                <td>
                  <input type='range' min={0} max={1} step='any' value={volume} onChange={handleVolumeChange} />
                </td>
              </tr>
              
              <tr>
                <th>
                  <label htmlFor='muted'>Muted</label>
                </th>
                <td>
                  <div class="col-6 col-12-small">
										<input type="checkbox" id="mute" checked={muted} onChange={handleToggleMuted} />
										<label for="mute">mute</label>
									</div>
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='loop'>Loop</label>
                </th>
                <td>
                  <div class="col-6 col-12-small">
										<input type="checkbox" id="loop" checked={loop} onChange={handleToggleLoop} />
										<label for="loop">Loop</label>
									</div>
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='light'>Light</label>
                </th>
                <td>
                  <div class="col-6 col-12-small">
										<input type="checkbox" id="light" checked={light} onChange={handleToggleLight} />
										<label for="light">Light mode</label>
									</div>
                </td>
              </tr>
              <tr>
                <th>Played</th>
                <td><progress max={1} value={played} /></td>
              </tr>
              <tr>
                <th>Loaded</th>
                <td><progress max={1} value={loaded} /></td>
              </tr>
            </tbody>
          </table>
              
            </li>
          </ul>

          <section className='section'>

          <h2>State</h2>

          <table>
            <tbody>
              <tr>
                <th>url</th>
                <td className={!url ? 'faded' : ''}>
                  {(url instanceof Array ? 'Multiple' : url) || 'null'}
                </td>
              </tr>
              <tr>
                <th>playing</th>
                <td>{playing ? 'true' : 'false'}</td>
              </tr>
              <tr>
                <th>volume</th>
                <td>{volume.toFixed(3)}</td>
              </tr>
              <tr>
                <th>played</th>
                <td>{played.toFixed(3)}</td>
              </tr>
              <tr>
                <th>loaded</th>
                <td>{loaded.toFixed(3)}</td>
              </tr>
              <tr>
                <th>duration</th>
                <td><Duration seconds={duration} /></td>
              </tr>
              <tr>
                <th>elapsed</th>
                <td><Duration seconds={duration * played} /></td>
              </tr>
              <tr>
                <th>remaining</th>
                <td><Duration seconds={duration * (1 - played)} /></td>
              </tr>
            </tbody>
          </table>
        </section>

        </div>
      </section>
    </div>
    </>
  );
}

export default App;
