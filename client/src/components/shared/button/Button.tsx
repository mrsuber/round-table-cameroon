import React from 'react'

import styles from './button.module.css'
import Spinner from '../../loaders/spinner/Spinner';

type Props = {
  btnText?: string
  icon?: JSX.Element
  hoverController?: (index: number) => void
  index?: number
  className?: string
  onClick?: () => void
  loading?: boolean
  children?: React.ReactNode | React.ReactNode[]
}

const Button: React.FC<Props> = ({ btnText, icon, loading, hoverController, index, className, onClick,children=null }) => {
  // const [hoverState, setHoverState] = useState<boolean>(false)
  return (
    <div>
      <button
        onMouseEnter={() => {
          if (hoverController !== undefined) {
            hoverController(index !== undefined ? index : -1)
          }
        }}
        onMouseLeave={() => {
          if (hoverController !== undefined) {
            hoverController(-1)
          }
        }}
        onClick={onClick}
        className={`${styles.btn__styles} ${className}`}
      >
        {btnText}
        {loading ? <Spinner /> : icon}
        {children}
      </button>
    </div>
  )
}

export default Button
