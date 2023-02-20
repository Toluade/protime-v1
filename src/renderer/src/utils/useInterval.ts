/* eslint-disable @typescript-eslint/explicit-function-return-type */

/// <reference types="electron-vite/node" />
import { Dispatch, SetStateAction, useEffect } from 'react'
import createWorker from './worker-script'

const timerWorker = createWorker

const useInterval = (timerStarted: boolean, setCountDown: Dispatch<SetStateAction<number>>) => {
  useEffect(() => {
    timerWorker.onmessage = ({ data: { time } }) => {
      setCountDown((count) => (count > 0 ? count - time : count))
    }
  }, [])

  useEffect(() => {
    if (timerStarted) {
      timerWorker.postMessage({ turn: 'on' })
    } else {
      timerWorker.postMessage({ turn: 'off' })
    }
  }, [timerStarted])
}

export default useInterval
