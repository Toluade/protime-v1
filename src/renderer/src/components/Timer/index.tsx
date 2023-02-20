/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from 'react'
import useInterval from '../../utils/useInterval'

type Props = {
  hours: any
  minutes: any
  seconds: any
  timerStarted: boolean
  countDown?: number
  setCountDown: Dispatch<SetStateAction<number>>
}

const Timer = ({ hours, minutes, seconds, timerStarted, setCountDown }: Props) => {
  useInterval(timerStarted, setCountDown)
  return (
    <div className="timer">
      <p id="hour" className="timer__item">
        {hours}
      </p>
      <p className="column timer__item">:</p>
      <p id="min" className="timer__item">
        {minutes}
      </p>

      <p className="column timer__item">:</p>
      <p id="sec" className="timer__item">
        {seconds}
      </p>
    </div>
  )
}

export default Timer
