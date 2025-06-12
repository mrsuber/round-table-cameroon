import { useEffect, useState } from 'react'

export const UseScrollPosition = () => {
  // initially we have the scroll position of the entire window set unto 0
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset)
    }

    // update the scroll position upon scrolling
    window.addEventListener('scroll', updatePosition)

    updatePosition()

    // clean-up function
    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return scrollPosition
}
