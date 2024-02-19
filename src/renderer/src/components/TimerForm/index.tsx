/* eslint-disable react/display-name */
import { FormEvent, forwardRef, memo, useEffect, useState } from 'react'
import './style.scss'
import { minuteToMillisecond, secondsToMilliseconds } from '../../utils/util'
import { Switch } from '@chakra-ui/react'
import { feature } from '../../utils/storedItems'

type Props = {
  setContDownTime: (value: number) => void
  toggleOneBg: () => void
  oneBg: boolean
  onClose: () => void
}

type Ref = HTMLInputElement

const TimerForm = forwardRef<Ref, Props>(
  ({ setContDownTime, toggleOneBg, oneBg, onClose }, ref) => {
    const [inputValue, setInputValue] = useState<number>(5)

    const units = Object.values(feature.UNIT.options)
    const [unit, setUnit] = useState(localStorage.getItem(feature.UNIT.name) ?? units[0])

    const handleUnitChange = (e: FormEvent<HTMLSelectElement>): void => {
      localStorage.setItem(feature.UNIT.name, e.currentTarget.value)
      setUnit(e.currentTarget.value)
    }

    const handleChange = (e: FormEvent<HTMLInputElement>): void => {
      setInputValue(Number(e.currentTarget.value))
    }

    const onSubmit = (e: FormEvent): void => {
      e.preventDefault()
      if (unit === 'Seconds') {
        setContDownTime(secondsToMilliseconds(inputValue))
      } else if (unit === 'Minutes') {
        setContDownTime(minuteToMillisecond(inputValue))
      }
      onClose()
    }

    useEffect(() => {
      const form = document.getElementById('form')

      form?.addEventListener('dblclick', (event) => {
        event.stopPropagation()
      })

      return (): void =>
        form?.removeEventListener('dblclick', (event) => {
          event.stopPropagation()
        })
    }, [])

    const oneBgExpired = localStorage.getItem(feature.ONE_BG.name) === 'true'
    return (
      <>
        <div id="form" className="form__body">
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
              <select value={unit} onChange={handleUnitChange} className="form__select">
                {units?.map((unit, index) => (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div
              title="Use a single background for your timer (black for dark mode and white for light mode)."
              className="form__group"
            >
              <label className="form__label" htmlFor="">
                One background
              </label>

              <Switch
                size="md"
                colorScheme="purple"
                style={{ outline: 'none' }}
                isChecked={oneBg}
                onChange={toggleOneBg}
              />
              {!oneBgExpired && <span className="badge">NEW</span>}
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
  }
)

export default memo(TimerForm)
