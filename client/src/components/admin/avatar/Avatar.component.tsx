import pic from '../../../assets/images/placeholer.png';
import { avatarTypes } from './Avatar.type';
import classes from './Avatar.module.css';

const Avatar = ({
  src,
  onClick,
  bgColor = '',
  padding = '2px',
  margin,
  border,
  size = '32px',
  borderRadius = '50%',
  style,
  imageStyle,
  id,
  ...props
}: avatarTypes) => {
  return (
    <div className={classes.container} {...props} id={id}>
      <div
        className={classes.content}
        style={{
          backgroundColor: bgColor,
          padding: padding,
          width: size,
          height: size,
          borderRadius,
          border: border,
          margin: margin,
          ...style,
        }}
        onClick={onClick}
      >
        <img
          src={src ?? pic}
          alt='profile'
          style={{
            objectFit: 'cover',
            objectPosition: 'top',
            width: '100%',
            height: '100%',
            borderRadius: borderRadius,
            ...imageStyle,
          }}
          crossOrigin='anonymous'
        />
      </div>
    </div>
  );
};

export default Avatar;
