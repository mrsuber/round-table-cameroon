import { logoImages } from '../../../assets/data/logoImages';
import { AddDottedIcon } from '../../../assets/svg';
import Button from '../../admin/button/Button.component';
import { useState } from 'react';
import classes from './LogoSelect.module.css';

export interface LogoSelectProps {
  title?: string;
  label?: string;
  images?: any[];
  onClick?: (item?: any) => void;
  onDeleteLogo?: (item?: any) => void;
  onChange?: any;
}

const LogoSelect = ({
  title = 'Choose Logo',
  label = 'Recent Uploads',
  images = [],
  onClick,
  onChange,
  onDeleteLogo,
}: LogoSelectProps) => {
  const [activeImage, setActiveImage] = useState<string>('');
  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>{title}</h2>
      <span className={classes.label}>{label}</span>
      <div className={classes.logos}>
        {images?.length > 0 &&
          images?.map((img: any) => (
            <div key={img.id} className={classes.logoImageContainer}>
              <div className={classes.imageContainer}>
                <img
                  src={img.src ?? img}
                  alt='logo'
                  className={classes.image}
                  onClick={() => onClick?.(img)}
                  onMouseOver={() => setActiveImage(img)}
                  onMouseLeave={() => setActiveImage('')}
                />
              </div>
              <div className={classes.deleteBtn} onClick={() => onDeleteLogo?.(img)}>
                Delete
              </div>
            </div>
          ))}
        <input id='upload' type='file' style={{ display: 'none' }} onChange={onChange} />
        <label htmlFor='upload' className={classes.imageContainer}>
          <AddDottedIcon />
        </label>
      </div>
    </div>
  );
};

export default LogoSelect;
