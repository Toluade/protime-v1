import { useEffect, useState } from 'react'

const showTime = (): string => {
  const [date, setDate] = useState(new Date())

  function refreshClock(): void {
    setDate(new Date())
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000)
    return function cleanup() {
      clearInterval(timerId)
    }
  }, [])

  //   var date = new Date();
  let h: number | string = date.getHours() // 0 - 23
  let m: number | string = date.getMinutes() // 0 - 59
  let s: number | string = date.getSeconds() // 0 - 59
  let session = 'AM'

  if (h == 0) {
    h = 12
    session = 'AM'
  }
  if (h == 12) {
    session = 'PM'
  }

  if (h > 12) {
    h = h - 12
    session = 'PM'
  }

  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s

  const time = h + ':' + m + ':' + s + ' ' + session
  // document.getElementById("MyClockDisplay").innerText = time;
  // document.getElementById("MyClockDisplay").textContent = time;

  //   useEffect(() => {
  //     setTimeout(showTime, 1000);
  //   }, [h, m, s]);

  return time
}

export default showTime
