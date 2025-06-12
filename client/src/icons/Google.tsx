import React from 'react'

const Google = ({ ...props }) => {
  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 40 41'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M26.8844 15.325H19.8197V17.3725H24.8351C24.5809 20.23 22.1387 21.4525 19.8274 21.4525C16.8767 21.4525 14.2881 19.1875 14.2881 16C14.2881 12.925 16.7535 10.5475 19.8351 10.5475C22.2157 10.5475 23.6102 12.025 23.6102 12.025L25.074 10.54C25.074 10.54 23.1941 8.5 19.7581 8.5C15.3821 8.5 12 12.1 12 16C12 19.7875 15.1818 23.5 19.8737 23.5C23.9954 23.5 27 20.7475 27 16.6825C27 15.82 26.8844 15.325 26.8844 15.325Z'
        fill='#003136'
      />
      <g filter='url(#filter0_d_183_1193)'>
        <circle cx='20' cy='16.5' r='15.5' stroke='#00262A' shapeRendering='crispEdges' />
      </g>
      <defs>
        <filter
          id='filter0_d_183_1193'
          x='0'
          y='0.5'
          width='40'
          height='40'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset dy='4' />
          <feGaussianBlur stdDeviation='2' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0' />
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_183_1193' />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_183_1193'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  )
}

export default Google
