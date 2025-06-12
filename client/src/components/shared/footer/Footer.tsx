import React from 'react';
import NewsLetter from './NewsLetter';
import { Link } from 'react-router-dom';

// styles import
import {
  FaceBookBlue,
  InstagramIcon,
  LinkedinBlueIcon,
  TwitterBlue,
  YoutubeIcon,
} from '../../../icons';
import ArrowUpIcon from '../../../icons/ArrowUpIcon';
import useWindowSize from '../../../lib/hooks/useWindowSize';
import { footerLinks } from '../../../assets/data/footerLinks';
import styles from './footer.module.css';

const Footer = () => {
  const { width } = useWindowSize();

  return (
    <div className={styles.container}>
      <div className={styles.icons__wrapper}>
        <div className={styles.left__icons}>
          <div>
            <FaceBookBlue />
          </div>
          <div>
            <InstagramIcon />
          </div>
          <div>
            <YoutubeIcon />
          </div>
          <div>
            <TwitterBlue />
          </div>
          <div>
            <LinkedinBlueIcon />
          </div>
        </div>
        <div className={styles.icon__right} onClick={() => window.scrollTo(0, 0)}>
          <ArrowUpIcon width={width < 700 ? '40' : '101'} />
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.linksWrapper}>
          <div
            style={{
              display: 'flex',
            }}
            className={styles.www}
          >
            <div className={styles.newsletter}>
              <NewsLetter />
            </div>
            <div className={styles.content__wrapper}>
              <h3>Resources</h3>
              {footerLinks.resources.map((link) => (
                <Link key={link.id} to={link.path}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.content__wrapper}>
            <h3>Company</h3>
            {footerLinks.company.map((link) => (
              <Link key={link.id} to={link.path}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className={styles.content__wrapper}>
            <h3>Socials</h3>
            {footerLinks.socials.map((link) => (
              <Link key={link.id} to={link.path}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
