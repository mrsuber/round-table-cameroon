import React, { useEffect, useState } from 'react';
import ProjectCard from '../../../shared/our-projects-card/ProjectCard';
import SectionTitle from '../../../shared/section-title/SectionTitle';

// styles import
import { useAppDispatch, useAppSelector } from '../../../../store';
import { getProjectsAction } from '../../../../store/features/slices/projects/projects.action';
import styles from './projects.module.css';
import { getPartnersAction } from '../../../../store/features/slices/contacts/contacts.action';
import { getJWT, getLocalRole, getLocalUser } from '../../../../utils/localStorage';
import { partnersData } from '../../../../assets/data/partners';
import { useNavigate } from 'react-router-dom';
import Button from '../../../admin/button/Button.component';
import { ArrowRightIcon } from '../../../../assets/svg';
import { paths } from '../../../../routers/paths';
import { endpoint } from '../../../../api/config';

const Projects = () => {
  const { partners } = useAppSelector((state) => state.contacts);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [projectList, setProjectList] = useState([]);
  const [donations, setDonations] = useState(0);
  const localUser = getLocalUser();
  const userRole = getLocalRole();
  const jwt = getJWT();
  const role = userRole ?? localUser?.role ?? user?.user?.role;
  const token = jwt ?? localUser?.token ?? user?.accessToken;
  const navigate = useNavigate();

  const getPublicProjects = () => {
    const data = {
      role: '',
      token: '',
    };
    dispatch(getProjectsAction(data)).then((res: any) => {
      const { payload } = res;
      console.log(res);
      setProjectList(payload?.data);
    });
  };
  const getAllProjects = () => {
    const data = {
      role,
      token,
    };
    dispatch(getProjectsAction(data)).then((res: any) => {
      if (res.payload.data) {
        const copiedData: any = [...res.payload.data];
        setProjectList(copiedData);
      }
      return;
    });
  };

  useEffect(() => {
    if (role !== 'superAdmin' || !user?.user?.isMember) {
      getPublicProjects();
    } else {
      getAllProjects();
    }
    dispatch(getPartnersAction());
  }, []);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(endpoint + '/donations/balance');
        const result = await response.json();
        setDonations(result.balance);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchDonations();

    // Fetch data every minute
    const intervalId = setInterval(fetchDonations, 60000);  // 60000 milliseconds = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div>
      <SectionTitle title='Our Projects' height='80px' />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.partners}>
            <h3>Partners</h3>
            {partners?.data > 0 ? (
              <div className={styles.logos}>
                {partners?.data.map((item: any, index: any) => (
                  <img
                    key={item.id}
                    alt='pic'
                    src={item.image}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.logos}>
                {partnersData.map((item, index) => (
                  <img
                    key={item.id}
                    alt='pic'
                    id='link'
                    src={item.logo}
                    onClick={() => window?.open(item.url, '_blank')}
                  />
                ))}
              </div>
            )}
          </div>
          <div className={styles.headline}>
            <h3>Ongoing Projects</h3>
          </div>
          <div className={styles.content__wrapper}>
            {projectList?.map(
              (project: any) =>
                project?.ongoing && (
                  <ProjectCard
                    key={project._id}
                    img={project.projectImage?.httpPath}
                    title={project.title}
                    contributors={project?.contributors}
                    style={{ marginBottom: '10px' }}
                  />
                ),
            )}
          </div>
          <div className={styles.donations__wrapper}>
            <Button
              text='Donate Now!'
              width='18%'
              margin='3rem 0 0'
              bgColor='#fff'
              color='#003136'
              iconAfter
              renderIcon={() => <ArrowRightIcon color='#003136' style={{ marginLeft: '4px' }} />}
              onClick={() => navigate(paths.DONATIONS)}
              padding='12px'
              borderRadius='60px'
            />
            <div className={styles.donations__text_div}>
              <h1>Donations:</h1>
              <h2>{donations} FCFA</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
