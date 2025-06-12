import ProjectCard from '../../../components/admin/project-card/ProjectCard';
import AdminLayout from '../../../layouts/Admin.layout';
import Notification from '../../../components/admin/notification/Notification';
import Avatar from '../../../components/admin/avatar/Avatar.component';
// import { Calendar } from 'react-calendar'
import ProgressCard from '../../../components/admin/progress-card/ProgressCard.component';
import AdminSection from '../../../components/admin/admin-section/AdminSection.component';
import MemberCard from '../../../components/admin/member-card/MemberCard.component';
import Button from '../../../components/admin/button/Button.component';
import Chart from '../../../components/admin/chart/Chart.component';
import { MoreVerticalIcon } from '../../../assets/svg';
import { useAppDispatch, useAppSelector } from '../../../store';
import {  useEffect, useRef, useState } from 'react';
import { getProjectsAction } from '../../../store/features/slices/projects/projects.action';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routers/paths';
import HeaderDropdown from '../../../components/admin/header-dropdown/HeaderDropdown.component';
import classes from './Dashboard.module.css';
import { getMembersAction } from '../../../store/features/slices/members/members.action';
import NoData from '../../../components/admin/no-data/NoData.component';

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.members);
  const { projects } = useAppSelector((state) => state.projects);
  const { members } = useAppSelector((state) => state.members);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const effectRef = useRef<boolean>(true);
  const [ongoing, setOngoing] = useState<any>([]);
  const [allMembers, setAllMembers] = useState<any>([])

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current = false;
      const data = {
        role: user?.user?.role,
        token: user?.accessToken,
      };
      dispatch(getProjectsAction(data));
      dispatch(getMembersAction({ pageNumber: null, limit: 1000 }));
    }
  }, []);

  useEffect(() => {
    const filtered = projects?.data.filter((pro: any) => pro?.ongoing);
    setOngoing(filtered);
  }, []);

  return (
    <AdminLayout showNavbar={false} padding='0' bgColor='#fff' adminMarginTop='0px'>
      <div className={classes.container}>
        <div className={classes.left}>
          <div className={classes.headerTop}>
            <div className={classes.header}>
              <h2 className={classes.head}>
                Hi, {user?.user?.firstName} {user?.user?.lastName}
              </h2>
              <div className={classes.notification}>
                <Notification />
                <Avatar
                  style={{ marginLeft: '20px' }}
                  size='32px'
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                  }}
                  src={profile?.profileImage?.httpPath}
                />
                <HeaderDropdown
                  showDropdown={showDropdown}
                  style={{ top: '4rem', right: '0rem' }}
                />
              </div>
            </div>
            <div className={classes.finishText}>Let us finish your task today !</div>
          </div>
          <div className={classes.upperSection}>
            <div style={{ width: '100%' }}>
              <ProgressCard
                total={projects?.data?.length}
                amount={ongoing?.length}
                percentage={
                  Math.floor((100 * ongoing?.length) / projects?.data?.length) < 100
                    ? Math.floor((100 * ongoing?.length) / projects?.data?.length)
                    : 100
                }
              />
            </div>
            <div className={classes.chartContainer}>
              <div className={classes.chartHead}>
                <span style={{ fontSize: '13px' }}>Activity</span>
              </div>
              <div className={classes.chart}>
                <Chart />
              </div>
              <div className={classes.chartMobile}>
                <Chart width={330} />
              </div>
            </div>
          </div>
          <AdminSection title='Members' style={{ margin: '20px 0' }}>
            <div className={classes.members}>
              {members?.data.length > 0 ? (
                members?.data
                  ?.filter((item: any, index: number) => index < 2)
                  .map((mem: any) => (
                    <MemberCard
                      key={mem._id}
                      name={`${mem.firstName} ${mem.lastName}`}
                      description={mem.description}
                      projectNo={mem?.numberOfProjects}
                      profile={mem?.profileImage?.httpPath}
                      isMember={mem?.isMember}
                    />
                  ))
              ) : (
                <NoData
                  infoText='No Projects Yet'
                  onClick={() => navigate(paths.ADMIN.ADDPROJECT)}
                  text='Add New Project'
                />
              )}
            </div>
          </AdminSection>
          <AdminSection title='Upcoming Projects'>
            <div className={classes.members}>
              {projects?.data?.length > 0 ? (
                projects?.data
                  ?.filter((item: any, index: number) => index < 3)
                  .map((pro: any) => (
                    <ProjectCard
                      key={pro._id}
                      title={pro.title}
                      image={pro?.projectImage?.httpPath}
                      width='221px'
                      onClick={() => {
                        navigate(`/admin/details/${pro._id}`);
                      }}
                      onEdit={() => navigate(`/admin/edit/${pro._id}`)}
                      isEditable={
                        user?.user?.role === 'superAdmin' ||
                        user?.user?.projects.includes(pro._id) ||
                        user?.user?.managedProjects.includes(pro._id)
                      }
                    />
                  ))
              ) : (
                <NoData
                  infoText='No Projects Yet'
                  onClick={() => navigate(paths.ADMIN.ADDPROJECT)}
                  text='Add New Project'
                />
              )}
            </div>
          </AdminSection>
        </div>
        <div className={classes.right}>
          <div
            style={{
              width: '100%',
              minHeight: '120px',
              background: '#fff',
              borderRadius: '10px',
              border: '1px solid rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Calender
          </div>
          <div className={classes.subContent}>
            <div className={classes.todaysProjects}>
              <span className={classes.todaysText}>{'Todays Project'}</span>
              <MoreVerticalIcon />
            </div>
            {projects?.data?.length > 0 ? (
              projects?.data
                ?.filter((pro: any, index: number) => index === 0)
                .map((pro: any) => (
                  <ProjectCard
                    key={pro._id}
                    title={pro.title}
                    image={pro.projectImage?.httpPath}
                    onClick={() => navigate(`/admin/details/${pro._id}`)}
                    onEdit={() => navigate(`/admin/edit/${pro._id}`)}
                    isEditable={
                      user?.user?.role === 'superAdmin' ||
                      user?.user?.projects.includes(pro._id) ||
                      user?.user?.managedProjects.includes(pro._id)
                    }
                  />
                ))
            ) : (
              <h1>Oops! No Projects yet</h1>
            )}
            <hr
              style={{
                backgroundColor: 'rgba(0,0,0,0.01)',
                opacity: 0.2,
                margin: '20px 0',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
              <div className={classes.detailHead}>
                <div className={classes.text}>Detail Task</div>
                <div>Community</div>
              </div>
            </div>
            <div className={classes.tasks}>
              <div className={classes.task}>
                <div className={classes.number}>1</div>
                <div>Educating the Community about the dangers of dirty environment.</div>
              </div>
              <div className={classes.task}>
                <div className={classes.number}>2</div>
                <div>Gathering of plastics for recycling</div>
              </div>
              <div className={classes.task}>
                <div className={classes.number}>3</div>
                <div>Gathering of waste Materials on the streets of Buea town</div>
              </div>
            </div>
            <div className={classes.detailBtn}>
              <Button text='Go To Detail' width='90%' margin='20px 0' />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
