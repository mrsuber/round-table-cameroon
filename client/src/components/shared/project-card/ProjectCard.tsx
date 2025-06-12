import React from 'react'
import { SeenIcon } from '../../../icons'

// styles import
import styles from './projectcard.module.css'

type Props = {
  img: string
  title: string
  images: string[]
  name: string
  type: string
  user: string
  contributions: number
  seen: number
  style?: object
}

const ProjectCard: React.FC<Props> = ({
  img,
  title,
  images,
  name,
  type,
  user,
  contributions,
  seen,
  style
}) => {
  return (
    <div className={styles.container} style={style}>
      <div className={styles.img__wrapper}>
        <img src={img} alt={title} crossOrigin='anonymous' />
      </div>
      <div>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.owner}>
          <div className={styles.user}>
            <img src={user} alt={name} />
          </div>
          <div className={styles.owner__name}>
            <p className={styles.name}>{name}</p>
            <h3 className={styles.type}>{type}</h3>
          </div>
        </div>
      </div>
      <div className={styles.images}>
        {images &&
          images.map((img, index) => <img key={index} alt='pic' src={img} crossOrigin='anonymous' />)}
      </div>
      <div className={styles.investors}>
        <p className={styles.contributors}>
          {contributions} <span>contributors</span>
        </p>
        <div className={styles.viewers}>
          <span style={{ marginRight: '1.6rem' }}>
            <SeenIcon />
          </span>
          <p className={styles.number__seen}>{seen}</p>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
