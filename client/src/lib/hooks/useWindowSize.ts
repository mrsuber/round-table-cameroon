import React from 'react'

export default function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    width: window !== undefined ? window.innerWidth : 1200,
    height: window !== undefined ? window.innerHeight : 800,
  })

  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }

  React.useEffect(() => {
    window.addEventListener('resize', changeWindowSize)

    return () => {
      window.removeEventListener('resize', changeWindowSize)
    }
  }, [])

  return windowSize
}
