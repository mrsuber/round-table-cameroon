import React from 'react'

const Facebook: React.FC = ({ ...props }) => {
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
        d='M20.7143 15.1111H25L24.5238 17H20.7143V25.5H18.8095V17H15V15.1111H18.8095V13.3431C18.8095 11.6592 18.9867 11.0481 19.3181 10.4323C19.6429 9.82393 20.1446 9.3264 20.7581 9.00433C21.379 8.67567 21.9952 8.5 23.6933 8.5C24.1905 8.5 24.6267 8.54722 25 8.64167V10.3889H23.6933C22.4324 10.3889 22.0486 10.4626 21.6571 10.6703C21.3676 10.8233 21.1524 11.0368 20.9981 11.3239C20.7886 11.7121 20.7143 12.0927 20.7143 13.3431V15.1111Z'
        fill='#003136'
      />
      <g filter='url(#filter0_d_183_1199)'>
        <circle cx='20' cy='16.5' r='15.5' stroke='#00262A' shapeRendering='crispEdges' />
      </g>
      <defs>
        <filter
          id='filter0_d_183_1199'
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
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_183_1199' />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_183_1199'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  )
}

export default Facebook
