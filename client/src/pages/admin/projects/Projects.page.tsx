import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminHeader from '../../../components/admin/admin-header/AdminHeader';
import ProjectCard from '../../../components/admin/project-card/ProjectCard';
import AdminLayout from '../../../layouts/Admin.layout';
import AdminSection from '../../../components/admin/admin-section/AdminSection.component';
import classes from './Projects.module.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  getProjectsAction,
  toggleProjectVisibilityAction,
} from '../../../store/features/slices/projects/projects.action';
import { contributors } from '../../../assets/data/contributors';
import Button from '../../../components/admin/button/Button.component';
import { paths } from '../../../routers/paths';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import KanbanLoading from '../../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../../components/loaders/spinner/Spinner';
import NoData from '../../../components/admin/no-data/NoData.component';

const Projects = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { projectError, projects } = useAppSelector((state) => state.projects);
  const [value, setValue] = useState<string>('');
  const [allProjectsDashboard, setAllDashboardProjects] = useState<any>(projects?.data);
  const effectRef = useRef<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleLoading, setVisibleLoading] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getAllProjects = () => {
    const data = {
      role: user?.user?.role,
      token: user?.accessToken,
    };
    dispatch(getProjectsAction(data)).then((res: any) => {
      if (projectError) {
        setLoading(false);
        return toast.error(projectError);
      }
      const { payload } = res;
      setAllDashboardProjects(payload?.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current = false;
      setLoading(true);
      getAllProjects();
    }
  }, []);

  useEffect(() => {
    if (value) {
      const filtered = allProjectsDashboard?.filter((project: any) =>
        project?.title?.toLowerCase().includes(value.toLowerCase()),
      );
      setAllDashboardProjects(filtered);
    } else {
      getAllProjects();
    }
  }, [value]);

  const handleMakeVisible = (projectId: string) => {
    if (user?.user?.role !== 'superAdmin')
      return toast.error('You are not authorized to change project visibility');
    setVisibleLoading(projectId);
    const data = {
      id: projectId,
      token: user?.accessToken,
    };
    const projectData = {
      role: user?.user?.role,
      token: user?.accessToken,
    };
    dispatch(toggleProjectVisibilityAction(data)).then(() => {
      dispatch(getProjectsAction(projectData)).then((res: any) => {
        const { payload } = res;
        setAllDashboardProjects(payload?.data);
        setLoading(false);
        toast.success('Project Visibility Changed!');
        setVisibleLoading('');
      });
    });
  };

  const handleAddNavigate = () => {
    if (user?.user?.role !== 'superAdmin')
      return toast.error('You are not authorized to add a project');
    navigate(paths.ADMIN.ADDPROJECT);
  };

  const handleViewProjectDetails = (projectId: string) => {
    navigate(`/admin/details/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/admin/edit/${projectId}`);
  };

  return (
    <AdminLayout
      title='Round Table  Projects'
      contributors={allProjectsDashboard?.contributors}
      searchValue={value}
      onChange={(e) => setValue(e.target.value)}
      showBack={false}
      onClick={handleAddNavigate}
      actionText='Add New Project'
    >
      <div className={classes.projectCards}>
        {allProjectsDashboard?.length > 0 ? (
          allProjectsDashboard?.map((pro: any) => (
            <>
              <ProjectCard
                key={`${pro._id} ${pro?.title}`}
                title={pro?.title}
                image={pro?.projectImage?.httpPath}
                contributors={pro?.contributors}
                labels={pro?.labels}
                fileNum={pro?.attachments.length}
                percentage={pro?.percentage}
                date={pro?.date}
                size='23px'
                onClick={() => handleViewProjectDetails(pro._id)}
                projectId={pro._id}
                width='250px'
                style={{ marginBottom: '20px', paddingBottom: '10px' }}
                makeVisible={() => handleMakeVisible(pro._id)}
                onEdit={() => handleEditProject(pro._id)}
                visibleLoading={visibleLoading === pro._id}
                publicProject={pro?.publicProject}
                isEditable={
                  user?.user?.role === 'superAdmin' ||
                  user?.user?.projects.includes(pro?._id) ||
                  user?.user?.managedProjects.includes(pro?._id)
                }
              />
            </>
          ))
        ) : (
          <NoData
            infoText='No Projects Yet'
            onClick={() => navigate(paths.ADMIN.ADDPROJECT)}
            text='Add New Project'
          />
        )}
      </div>
      <KanbanLoading kanbanLoading={loading}>
        <Spinner size='18px' />
      </KanbanLoading>
    </AdminLayout>
  );
};

export default Projects;
