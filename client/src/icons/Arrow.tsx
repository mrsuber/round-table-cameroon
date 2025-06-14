/* eslint-disable */

import React from 'react'

function Arrow({ ...props }) {
  return (
    <div>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 25'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
      >
        <path
          d='M14 18.5L12.6 17.05L16.15 13.5H4V11.5H16.15L12.6 7.95L14 6.5L20 12.5L14 18.5Z'
          fill={props?.fill !== undefined ? props?.fill : '#FDFDFD'}
        />
      </svg>
    </div>
  )
}

export default Arrow
