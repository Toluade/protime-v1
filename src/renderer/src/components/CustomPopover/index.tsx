import { FC, ReactNode } from 'react'
import './style.scss'

type Props = {
  children: ReactNode
  displayP: string
}

const CustomPopover: FC<Props> = ({ children, displayP }) => {
  return (
    <div className="popover-container" style={{ display: displayP }}>
      {children}
    </div>
  )
}

export default CustomPopover
