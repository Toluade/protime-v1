/* eslint-disable react/display-name */
import { FormEvent, forwardRef, memo, useState } from 'react'
import './style.scss'

type Props = {
  setContDownTime: (e: number | undefined) => void
}

type Ref = HTMLInputElement

const TimerForm = forwardRef<Ref, Props>(({ setContDownTime }, ref) => {
  const [inputValue, setInputValue] = useState<number>(5)

  const handleChange = (e: FormEvent<HTMLInputElement>): void => {
    setInputValue(Number(e.currentTarget.value))
  }

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault()
    setContDownTime(inputValue)
  }
  return (
    <>
      <div className="form__body">
        <p className="form__title">Set Time</p>
        <form
          className="form"
          action=""
          // onSubmit={() => setContDownTime(inputValue)}
        >
          <div className="form__group">
            <input
              className="form__input"
              ref={ref}
              required
              name="minutes"
              type="number"
              autoFocus
              value={inputValue}
              onChange={handleChange}
            />
            <label className="form__label" htmlFor="minutes">
              Minutes
            </label>
          </div>
          <button
            disabled={Boolean(inputValue === undefined)}
            className="form__submit"
            type="submit"
            onClick={onSubmit}
          >
            Set
          </button>
        </form>
      </div>
    </>
  )
})

export default memo(TimerForm)
