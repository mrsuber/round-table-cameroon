import React from 'react'

// styles import
import styles from './projectdetails.module.css'
import ProjectDetailsNav from '../../components/atom/project-details-nav/ProjectDetailsNav.atom'
import NavBar from '../../components/shared/navbar/NavBar'
import Hero from '../../components/block/project-details/hero/Hero'
import Contributors from '../../components/block/project-details/contributors/Contributors'
import Budgeting from '../../components/block/project-details/budgeting/Budgeting'
import Footer from '../../components/shared/footer/Footer'
import PlaceLocation from '../../components/block/project-details/location/Location'

type Props = {
  title: string
}

const ProjectDetails = () => {
  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <ProjectDetailsNav title='925 Mission St Suite 54-87' />
        <Hero
          img='/project-details.png'
          type='owner'
          title='925 Mission St Suite 54-87'
          user='/owner.png'
          name='Dianne Russell'
          description='Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet '
        />
        <div className={styles.project__details}>
          <h3>Project Overview</h3>
          <p>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.. Amet
            minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet
            minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet..Amet
            minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
          </p>
        </div>
        <div className={styles.contributors}>
          <h1 className={styles.contributors__title}>Contributors</h1>
          <Contributors
            data={[
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
              {
                img: '/baby.jpeg',
                name: 'Dianne Russell',
                descr: 'IDianne Russell Aims at n a laoreet purus. Integer ',
                position: 'CEO Silvertron',
              },
            ]}
          />
        </div>
        <div className={styles.duration}>
          <h2>Duration</h2>
          <h3 className={styles.estimated__time} style={{ marginBottom: '20px' }}>
            Estimated: <span>8 months</span>
          </h3>
          <h3 className={styles.estimated__time}>
            Max-Duration: <span>1 year</span>
          </h3>
        </div>
        <div>
          <Budgeting descr='Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet ' />
        </div>
      </div>
      <PlaceLocation place={['South Africa,', 'Johannesburg']} />
      <Footer />
    </div>
  )
}

export default ProjectDetails
