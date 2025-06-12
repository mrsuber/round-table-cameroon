import React from 'react'

// styles impport
import styles from './contributors.module.css'

type Props = {
  img: string
  name: string
  position: string
  descr: string
}

type Data = {
  data: Props[]
}

const Contributors: React.FC<Data> = ({ data }) => {
  return (
    <div className={styles.wrapper}>
      {data.map((contributor, index) => (
        <div className={styles.container} key={index}>
          <div>
            <div className={styles.img__wrapper}>
              <img src={contributor.img} alt={contributor.name} crossOrigin='anonymous' />
            </div>
          </div>
          <div className={styles.details}>
            <h3>{contributor.name}</h3>
            <p className={styles.position}>{contributor.position}</p>
            <p className={styles.desc}>{contributor.descr}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Contributors
