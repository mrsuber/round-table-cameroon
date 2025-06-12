import Arrow from '../../../../icons/Arrow';
import { flag } from '../../../../static/assets/images';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../../../../assets/svg';
import Button from '../../../admin/button/Button.component';
import styles from './hero.module.css';
import Logo from '../../../../icons/Logo';
import hero from '../../../../static/assets/images/RT/monument.jpeg';

interface IProps {
  logoImage?: string;
  logoBgColor?: string;
  heroImage?: string;
  buttonColor?: string | any;
  headingWidth?: string;
}

const Hero = ({ logoBgColor = '', headingWidth }: IProps) => {
  return (
    <div
      className={styles.hero__container}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 38, 42,0.8), rgba(0, 38, 42,0.8)),
      url(${hero})`,
      }}
    >
      <div className={styles.logo} style={{ backgroundColor: logoBgColor }}>
        <Logo width='100%' height='100%' />
      </div>
      <h1 className={styles.hero__heading} style={{ width: headingWidth ?? '40%' }}>
        Welcome to round table cameroon
      </h1>
      <p className={styles.hero__p}>a social platform for private investment</p>
      <div className={styles.flag}>
        <img src={flag} alt='Flag' crossOrigin='anonymous' />
      </div>
      <Link to='/auth?tab=signup' style={{ textDecoration: 'none' }}>
        <Button
          text='Join Our Community'
          style={{ marginRight: '15px' }}
          renderIcon={() => (
            <ArrowRightIcon style={{ width: '14', height: '12', marginLeft: '5px' }} />
          )}
          iconAfter
          padding='13px 20px'
          bgColor='#003B33'
        />
      </Link>
    </div>
  );
};

export default Hero;
