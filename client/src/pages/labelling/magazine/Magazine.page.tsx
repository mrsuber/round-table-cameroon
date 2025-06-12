import React, { useState } from 'react';
import LabellingLayout from '../../../layouts/LabellingLayout.layout';
import classes from './Magazine.module.css';
import SubscribeSection from '../../../components/labelling/subscribe-section/SubscribeSection.component';
import dots from '../../../assets/images/dots.png';
// import { labellingMagazinelinks } from '../../../routers/paths';
import MagazineCard from '../../../components/labelling/magazine-card/MagazineCard.component';
import { generateRandomItems } from '../../../utils/randomItems';
import Button from '../../../components/admin/button/Button.component';
import { ArrowRightIcon } from '../../../assets/svg';

const Magazine = () => {
  const [active, setActive] = useState<number>(0);
  const randomItems = generateRandomItems(4);
  return (
    <LabellingLayout>
      <SubscribeSection
        title={
          <div className={classes.heading}>
            <h1 id='camsolText'>Camsol</h1>
            <h1 id={classes.magazineText}>Magazine</h1>
          </div>
        }
        caption='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        style={{ marginTop: '6rem' }}
      />
      <section className={classes.section}>
        <h3 className={classes.subHeading}>Our latest news and projects</h3>
        <div className={classes.heading} style={{ fontSize: '22px' }}>
          <h1 id='camsolText'>Camsol</h1>
          <h1 id={classes.magazineText} style={{ color: '#000', fontWeight: 'normal' }}>
            Magazine
          </h1>
        </div>
        <div className={classes.magLinks}>
          <div className={`${classes.magLink} ${classes.allBtn}`}>All</div>
          {/* {labellingMagazinelinks.map((link: any) => (
            <div
              className={classes.magLink}
              style={{ backgroundColor: link.id === active ? '#C5C5C5' : '#EFEFEF' }}
              key={link.id}
              onClick={() => setActive(link.id)}
            >
              {link.label}
            </div>
          ))} */}
        </div>
        <div className={classes.magazineCards}>
          {randomItems.map((item, index) => (
            <MagazineCard
              key={index}
              title={item.title}
              caption={item.caption}
              buttonText={item.buttonText}
              image={item.image}
            />
          ))}
        </div>
        <Button
          text='View Investment Opportunities'
          renderIcon={() => <ArrowRightIcon style={{ marginLeft: '6px' }} />}
          bgColor='rgb(3, 110, 103)'
          style={{ marginTop: '26px' }}
          width='18%'
          iconAfter
          padding='12px'
        />
      </section>
      <section className={classes.section} style={{ backgroundColor: 'rgb(3, 110, 103' }}>
        <img src={dots} alt='dots-img' style={{ width: '100%' }} />
      </section>
    </LabellingLayout>
  );
};

export default Magazine;
