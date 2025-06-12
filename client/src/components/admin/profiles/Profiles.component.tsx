import placeholder from '../../../assets/images/placeholer.png';
import classes from './Profiles.module.css';

interface profilesTypes {
  contributors?: any;
  size?: string;
}

const Profiles = ({ contributors, size }: profilesTypes) => {
  return (
    <div className={classes.images}>
      {contributors?.map((item: any, index: number) => (
        <img
          key={`${item._id} ${index}`}
          alt='pic'
          src={item?.profileImage?.httpPath ?? placeholder}
          style={{ width: size, height: size, objectFit: 'cover', objectPosition: 'top' }}
          crossOrigin='anonymous'
        />
      ))}
    </div>
  );
};

export default Profiles;
