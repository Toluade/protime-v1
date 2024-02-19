import { useState, useEffect, Dispatch, SetStateAction } from 'react'

/**
 * This is a hook that returns a countdown timer
 * @param {number} inputValue - The value inputer on the form
 * @param {boolean} isFormated - Set if return value should have a leading zero for single digit numbers
 *
 * @returns {obj} { hours, minutes, seconds }
 */

type BreakDownType = {
  days: number
  hours: number
  minutes: number
  seconds: number
}
type Return = {
  hours: number
  minutes: number
  seconds: number
  resetTimer: () => void | null
  startTimer: () => void
  pauseTimer: () => void
  stopTimer: () => void
  isPaused: boolean
  timerStarted: boolean
  timeUp: boolean
  countDown: number
  setCountDown: Dispatch<SetStateAction<number>>
}

const useCountDownTimer = (inputValue: number | undefined, isFormated: boolean): Return => {
  const [timerStarted, setTimerStarted] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [timeUp, setTImeUp] = useState<boolean>(false)

  const [countDown, setCountDown] = useState(300000)

  const startTimer = (): void => setTimerStarted(true)
  const pauseTimer = (): void => {
    setTimerStarted(false)
    setIsPaused(false)
  }
  // const resumeTimer = (): void => setIsPaused(false)
  const stopTimer = (): void => {
    if (!timerStarted && inputValue) {
      setCountDown(inputValue)
    } else {
      setCountDown((count) => count - count)
      setTimerStarted(false)
    }
  }

  const resetTimer = (): void | null => (inputValue ? setCountDown(inputValue) : null)

  useEffect(() => {
    if (countDown === 0) {
      setTImeUp(true)
      setTimerStarted(false)
    } else {
      setTImeUp(false)
    }
  }, [countDown])

  const { hours, minutes, seconds }: BreakDownType = isFormated
    ? zeroFormat(getReturnValues(countDown))
    : getReturnValues(countDown)

  return {
    // ...(isFormated ? zeroFormat(getReturnValues(countDown)) : getReturnValues(countDown)),
    hours,
    minutes,
    seconds,
    resetTimer,
    startTimer,
    pauseTimer,
    // resumeTimer,
    stopTimer,
    timerStarted,
    isPaused,
    timeUp,
    countDown,
    setCountDown
  }
}

const getReturnValues = (countDown: number): BreakDownType => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

const zeroFormat = (obj: BreakDownType): BreakDownType => {
  const objVal = { ...obj }

  Object.keys(objVal).forEach(function (key) {
    objVal[key] = addZero(objVal[key])
  })

  return objVal
}

const addZero = (val: number): string | number => {
  return val < 10 ? '0' + val : val
}

export default useCountDownTimer
