import React, { useCallback, useEffect, useState } from 'react';
import NavBar from '../../../components/labelling/navbar/NavBar.component';
import LabellingLayout from '../../../layouts/LabellingLayout.layout';
import LogoSelect from '../../../components/labelling/logo-select/LogoSelect.component';
import Hero from '../../../components/block/home/hero/Hero';
import PreviewNavBar from '../../../components/labelling/navbar/PreviewNavbar.component';
import Button from '../../../components/admin/button/Button.component';
import { HexColorPicker, RgbaColorPicker } from 'react-colorful';
import './color.css';
import classes from './Home.module.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setTheming } from '../../../store/features/slices/theming/theming.slice';
import BgSelect from '../../../components/labelling/logo-select/BgSelect.component';

const switchLinks = [
  {
    id: 0,
    label: 'Home',
  },
  {
    id: 1,
    label: 'Edit',
  },
];

const Home = () => {
  const { theming } = useAppSelector((state) => state.theming);

  const [active, setActive] = useState<number>(0);
  const [previews, setPreviews] = useState<any[]>([]);
  const [logoImage, setLogoImage] = useState<string>(theming.logo);
  const [bgPreviews, setBgPreviews] = useState<any[]>([]);
  const [bgImage, setBgImage] = useState<any>(theming.bgImage);
  const dispatch = useAppDispatch();
  const handleChange = (e: any) => {
    if (!e.target.files) return;
    const preview = URL.createObjectURL(e.target.files[0]);
    setPreviews((prev: any) => [...prev, preview]);
  };
  const handleLogoSelect = (item: any) => {
    setLogoImage(item);
  };
  const handleBgChange = (e: any) => {
    if (!e.target.files) return;
    const preview = URL.createObjectURL(e.target.files[0]);
    setBgPreviews((prev: any) => [...prev, preview]);
  };
  const handleBgSelect = (item: any) => {
    setBgImage(item);
  };
  const handleDeleteLogo = (item: any) => {
    if (item === logoImage) {
      setLogoImage('');
    }
    const prevCopy = [...previews];
    const index = prevCopy.indexOf(item);
    prevCopy.splice(index, 1);
    setPreviews(prevCopy);
    console.log(item);
  };

  const handleActiveTab = useCallback(
    (id: number) => {
      setActive(id);
    },
    [active],
  );

  const handleTheming = () => {
    const rgbString = `${color?.r},${color?.g},${color?.b}`;
    const theming = {
      logo: logoImage,
      bgImage,
      color: rgbString,
    };
    dispatch(setTheming(theming));
  };

  const [color, setColor] = useState({ r: 0, g: 59, b: 51, a: 0.8 });

  return (
    <LabellingLayout childrenPadding={active === 0 ? '0' : '14px 25px'}>
      <div className={classes.navSwitchContainer}>
        <div className={classes.navSwitch}>
          {switchLinks.map((link: any) => (
            <div
              className={
                link.id === active
                  ? `${classes.switchItem} ${classes.switchItemActive}`
                  : classes.switchItem
              }
              key={link.id}
              onClick={() => handleActiveTab(link.id)}
            >
              {link.label}
            </div>
          ))}
        </div>
      </div>
      <div className={classes.container}>
        {active === 0 && (
          <div className={classes.homeView}>
            <PreviewNavBar
              style={{ position: 'relative', zIndex: 0 }}
              logoImage={logoImage}
              themeColor={`rgb(${color?.r},${color?.g},${color?.b})`}
            />
            <Hero
              logoImage={logoImage}
              heroImage={bgImage}
              headingWidth='50%'
              buttonColor={`${color?.r},${color?.g},${color?.b}`}
            />
          </div>
        )}
        {active === 1 && (
          <div className={classes.editView}>
            <div className={classes.editViewLeft}>
              <LogoSelect
                onChange={handleChange}
                onClick={(item) => handleLogoSelect(item)}
                onDeleteLogo={(item) => handleDeleteLogo(item)}
                images={previews}
              />
              <BgSelect
                onChange={handleBgChange}
                onClick={(item) => handleBgSelect(item)}
                images={bgPreviews}
                title='Choose Background'
              />
              <div className={classes.editViewLeftBottom}>
                <div className={classes.chooseBottom}>
                  <h2 className={classes.chooseBgText}>Background Colors</h2>
                  <span className={classes.label}></span>
                  <Button text='Add Colors' bgColor='' color='#000' />
                </div>
                <section className='small'>
                  <RgbaColorPicker color={color} onChange={setColor} />
                </section>
              </div>
            </div>
            <div className={classes.editViewRight}>
              <PreviewNavBar
                style={{ position: 'relative', zIndex: 0 }}
                logoImage={logoImage}
                themeColor={`rgb(${color?.r},${color?.g},${color?.b})`}
              />
              <Hero
                logoImage={logoImage}
                heroImage={bgImage}
                headingWidth='50%'
                buttonColor={`${color?.r},${color?.g},${color?.b}`}
              />
              <div className={classes.actionButtons}>
                <Button
                  text='Preview'
                  bgColor='#fff'
                  border='1px solid #003B33'
                  color='#003B33'
                  width='16%'
                  onClick={() => setActive(0)}
                />
                <Button text='Done' width='16%' onClick={handleTheming} />
              </div>
            </div>
          </div>
        )}
      </div>
    </LabellingLayout>
  );
};

export default Home;
