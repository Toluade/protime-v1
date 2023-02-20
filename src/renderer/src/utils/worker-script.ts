const workercode = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timerInterval: any
  let time = 0
  self.onmessage = function ({ data: { turn } }): void {
    if (turn === 'off' || timerInterval) {
      clearInterval(timerInterval)
      time = 0
    }
    if (turn === 'on') {
      timerInterval = setInterval(() => {
        time = 1000
        self.postMessage({ time })
      }, 1000)
    }
  }
}

let code = workercode.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], { type: 'application/javascript' })
const worker_script = URL.createObjectURL(blob)

const timerWorker = new Worker(worker_script)

export default timerWorker
