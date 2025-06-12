import React from 'react';
import ContactLocation from '../../components/block/home/contact-location/ContactLocation';
import Hero from '../../components/block/home/hero/Hero';
import MembersSection from '../../components/block/home/members-section/MembersSection';
import Projects from '../../components/block/home/our-projects/Projects';
import Footer from '../../components/shared/footer/Footer';
import NavBar from '../../components/shared/navbar/NavBar';
import { useAppSelector } from '../../store';

const Home = () => {
  const { user } = useAppSelector(state => state.auth);
  return (
    <div style={{ boxSizing: 'border-box', overflowX: 'hidden' }}>
      <NavBar />
      <Hero />
      <MembersSection />
      <Projects />
      <ContactLocation />
      <Footer />
    </div>
  );
};

export default Home;
