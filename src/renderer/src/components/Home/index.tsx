import { createContext, FC, useEffect, useRef, useState } from 'react'
import './style.scss'
import { DisplayModes, SettingsProviderType } from './types'
import useCountDownTimer from '../../utils/useCountDownTimer'
import {
  MdPlayArrow,
  MdPause,
  MdStop,
  MdQueryBuilder,
  MdCached,
  MdDarkMode,
  MdLightMode,
  MdSettings,
  MdFullscreen,
  MdFullscreenExit,
  MdVolumeOff,
  MdVolumeUp
} from 'react-icons/md'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton
} from '@chakra-ui/react'
import TimerForm from '../TimerForm'
import Clock from '../Clock'
import TimeUp from '../TimeUp'
import Timer from '../Timer'
import alarm from '../../assets/audio/alarm.mp3'

export const SettingsContext = createContext<SettingsProviderType>({})

declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>
    msExitFullscreen?: () => Promise<void>
    webkitExitFullscreen?: () => Promise<void>
    mozFullScreenElement?: Element
    msFullscreenElement?: Element
    webkitFullscreenElement?: Element
  }

  interface HTMLElement {
    msRequestFullscreen?: () => Promise<void>
    mozRequestFullscreen?: () => Promise<void>
    webkitRequestFullscreen?: () => Promise<void>
  }
}

const Home: FC = () => {
  const { Provider } = SettingsContext

  const inputRef = useRef(null)

  const viewTypes = {
    CLOCK: 'clock',
    TIMER: 'timer',
    TIMEUP: 'time-up'
  }

  const [view, setView] = useState(viewTypes.CLOCK)

  const [muted, setMuted] = useState<boolean>(true)

  const toggleMute = (): void => setMuted(!muted)

  const [countDownMin, setCountDownMin] = useState<number>()

  const {
    hours,
    minutes,
    seconds,
    resetTimer,
    startTimer,
    pauseTimer,
    stopTimer,
    isPaused,
    timerStarted,
    timeUp,
    countDown,
    setCountDown
  } = useCountDownTimer(countDownMin, true)

  const play = (): void => {
    setShowClock(false)
    startTimer()
  }

  const setContDownTime = (value: number | undefined): void => {
    if (value === undefined) return
    setCountDown(value * 60 * 1000)
    setCountDownMin(value)
    // onCloseP()
    setShowClock(false)
  }

  const [showClock, setShowClock] = useState<boolean>(true)
  const toggleClock = (): void => {
    setShowClock(!showClock)
  }

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)

  const displayModes: DisplayModes = {
    systemDefault: '1',
    lightMode: '2',
    darkMode: '3'
  }
  const [displayPreference, setDisplayPreference] = useState<string>(displayModes.darkMode)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const onOpen = (): void => {
    setIsOpen(true)
  }
  const onClose = (): void => {
    setIsOpen(false)
  }

  function enterFullScreen(element: HTMLElement): void {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.mozRequestFullscreen) {
      element.mozRequestFullscreen() // Firefox
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen() // Safari
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen() // IE/Edge
    }
  }

  function exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }

  const fullScreenMode = (): void => {
    const container = document.getElementById('container')
    if (container !== null) {
      enterFullScreen(container)
    }
  }

  const toggleFullScreen = (): void => {
    // e.stopPropagation()
    if (isFullScreen) {
      exitFullscreen()
    } else {
      fullScreenMode()
    }
  }

  useEffect(() => {
    window.addEventListener('resize', (evt) => {
      evt
      if (window.innerHeight == screen.height) {
        setIsFullScreen(true)
      } else {
        setIsFullScreen(false)
      }
    })

    return () => {
      window.removeEventListener('resize', (evt) => {
        evt
        if (window.innerHeight == screen.height) {
          setIsFullScreen(true)
        } else {
          setIsFullScreen(false)
        }
      })
    }
  }, [])

  useEffect(() => {
    const container = document.getElementById('container')

    if (displayPreference === displayModes.systemDefault && container !== null) {
      container.classList.remove('darkMode')
      container.classList.remove('lightMode')
    } else if (displayPreference === displayModes.lightMode && container !== null) {
      container.classList.remove('darkMode')
      container.classList.add('lightMode')
    } else if (displayPreference === displayModes.darkMode && container !== null) {
      container.classList.add('darkMode')
      container.classList.remove('lightMode')
    }
  }, [displayPreference])

  useEffect(() => {
    const container = document.getElementById('container')
    if (!showClock) {
      if ((countDown < 10000 || timeUp) && container !== null) {
        container.classList.add('timeUp')
        container.classList.remove('redBg')
        container.classList.remove('greenBg')
        container.classList.remove('orangeBg')
        container.classList.remove('normalBg')
      } else if (countDown < 60000 && container !== null) {
        container.classList.add('redBg')
        container.classList.remove('timeUp')
        container.classList.remove('greenBg')
        container.classList.remove('orangeBg')
        container.classList.remove('normalBg')
      } else if (countDown < 120000 && container !== null) {
        container.classList.add('orangeBg')
        container.classList.remove('timeUp')
        container.classList.remove('greenBg')
        container.classList.remove('redBg')
        container.classList.remove('normalBg')
      } else if (container !== null) {
        container.classList.add('greenBg')
        container.classList.remove('timeUp')
        container.classList.remove('orangeBg')
        container.classList.remove('redBg')
        container.classList.remove('normalBg')
      }
    } else if (container !== null) {
      container.classList.add('normalBg')
      container.classList.remove('timeUp')
      container.classList.remove('orangeBg')
      container.classList.remove('redBg')
      container.classList.remove('greenBg')
    }
  }, [countDown, timeUp, showClock])

  useEffect(() => {
    window.addEventListener('keydown', (evt) => {
      if (evt.code === 'Space') {
        if (timerStarted) {
          pauseTimer()
        } else {
          play()
        }
      }
    })

    return () => {
      window.removeEventListener('keydown', (evt) => {
        if (evt.code === 'Space') {
          if (timerStarted) {
            pauseTimer()
          } else {
            play()
          }
        }
      })
    }
  }, [timerStarted])

  useEffect(() => {
    if (showClock) {
      setView(viewTypes.CLOCK)
    } else if (timeUp) {
      setView(viewTypes.TIMEUP)
    } else {
      setView(viewTypes.TIMER)
    }
  }, [showClock, timeUp])

  // const sound = document.createElement('audio')
  // sound.id = 'audio-player'
  // sound.src = alarm

  // document.getElementById('container').appendChild(sound)

  // const sound = new Audio(alarm)

  // useEffect(() => {
  //   if (timeUp) {
  //     sound.loop = true
  //     sound.play()
  //   } else {
  //     sound.pause()
  //   }
  // }, [timeUp])

  return (
    <Provider value={{ displayModes, displayPreference, setDisplayPreference }}>
      <div id="container" className={`container`} onDoubleClick={toggleFullScreen}>
        {timeUp && (
          <audio autoPlay muted={muted} loop>
            <source src={alarm} type="audio/mpeg" />
          </audio>
        )}
        <div className="iconContainer">
          <div className="left">
            <button className="iconWrapper">
              <MdQueryBuilder title="Toggle clock" className="icon" onClick={toggleClock} />
            </button>

            {!timerStarted || isPaused || timeUp ? (
              <button className="iconWrapper">
                <MdPlayArrow title="Start timer" className="icon" onClick={play} />
              </button>
            ) : null}
            {timerStarted && !isPaused && !timeUp && (
              <button className="iconWrapper">
                <MdPause title="Pause timer" className="icon" onClick={pauseTimer} />
              </button>
            )}

            <button className="iconWrapper">
              <MdStop title="Stop timer" className="icon" onClick={stopTimer} />
            </button>

            <button className="iconWrapper">
              <MdCached title="Restart timer" className="icon" onClick={resetTimer} />
            </button>

            <Popover
              isOpen={isOpen}
              initialFocusRef={inputRef}
              onOpen={onOpen}
              onClose={onClose}
              // placement="bottom"
              closeOnBlur={true}
              trigger="hover"
            >
              <PopoverTrigger>
                <button className="iconWrapper" aria-pressed="false" type="reset">
                  <MdSettings title="Set timer" className="icon" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="popover-content">
                {/* <PopoverArrow /> */}
                <PopoverCloseButton className="popover-close-button" />
                <PopoverBody>
                  <TimerForm ref={inputRef} {...{ setContDownTime }} />
                </PopoverBody>
              </PopoverContent>
            </Popover>

            {/* <span className="hasPopover" onMouseOver={showPopover} onMouseOut={hidePopover}>
              <button className="" aria-pressed="false" type="reset">
                <MdSettings title="Set timer" className="icon" />
              </button>
              <CustomPopover {...{ displayP }}>
                <TimerForm ref={inputRef} {...{ setContDownTime }} />
              </CustomPopover>
            </span> */}
          </div>
          <div className="right">
            {muted ? (
              <button className="iconWrapper">
                <MdVolumeOff
                  title="Toggle audio on and off (currently off)"
                  className="icon"
                  onClick={toggleMute}
                />
              </button>
            ) : (
              <button className="iconWrapper">
                <MdVolumeUp
                  title="Toggle audio on and off (currently on)"
                  className="icon"
                  onClick={toggleMute}
                />
              </button>
            )}
            {displayPreference === displayModes.darkMode ? (
              <button className="iconWrapper">
                <MdDarkMode
                  title="Toogle light and dark modes (currently dark mode)"
                  className="icon"
                  onClick={(): void => setDisplayPreference(displayModes.lightMode)}
                />
              </button>
            ) : (
              <button className="iconWrapper">
                <MdLightMode
                  title="Toogle light and dark modes (currently light mode)"
                  className="icon"
                  onClick={(): void => setDisplayPreference(displayModes.darkMode)}
                />
              </button>
            )}
            {!isFullScreen && (
              <button className="iconWrapper">
                <MdFullscreen title="Enter fullscreen" className="icon" onClick={fullScreenMode} />
              </button>
            )}
            {isFullScreen && (
              <button className="iconWrapper">
                <MdFullscreenExit
                  title="Enter fullscreen"
                  className="icon"
                  onClick={exitFullscreen}
                />
              </button>
            )}
          </div>
        </div>

        {view === viewTypes.CLOCK && <Clock />}
        {view === viewTypes.TIMEUP && <TimeUp />}
        {view === viewTypes.TIMER && (
          <Timer
            {...{
              hours,
              minutes,
              seconds,
              timerStarted,
              countDown,
              setCountDown
            }}
          />
        )}
      </div>
    </Provider>
  )
}

export default Home
