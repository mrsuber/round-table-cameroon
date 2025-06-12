import React from 'react'

const Linkedin = ({ ...props }) => {
  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 40 41'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g filter='url(#filter0_d_183_1196)'>
        <circle cx='20' cy='16.5' r='15.5' stroke='#00262A' shapeRendering='crispEdges' />
      </g>
      <path
        d='M16.358 23.5H13.248V13.4854H16.358V23.5ZM14.8011 12.1193C13.8068 12.1193 13 11.2954 13 10.3011C13 9.8234 13.1898 9.36529 13.5275 9.02752C13.8653 8.68976 14.3234 8.5 14.8011 8.5C15.2788 8.5 15.737 8.68976 16.0747 9.02752C16.4125 9.36529 16.6023 9.8234 16.6023 10.3011C16.6023 11.2954 15.7955 12.1193 14.8011 12.1193ZM27.9973 23.5H24.8944V18.625C24.8944 17.463 24.8708 15.9732 23.2775 15.9732C21.6607 15.9732 21.4126 17.2354 21.4126 18.5414V23.5H18.3059V13.4854H21.2883V14.8514H21.3317C21.7469 14.0645 22.7611 13.2341 24.274 13.2341C27.4214 13.2341 28 15.3068 28 17.9987V23.5H27.9973Z'
        fill='#003136'
      />
      <defs>
        <filter
          id='filter0_d_183_1196'
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
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_183_1196' />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_183_1196'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  )
}

export default Linkedin
