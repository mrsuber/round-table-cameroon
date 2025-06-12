import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../../layouts/Admin.layout';
import ProjectColumn from '../../../components/admin/project-column/ProjectColumn.component';
import { useAppDispatch, useAppSelector } from '../../../store';
import classes from './ProjectDetails.module.css';
import DetailModal from '../../../components/admin/detail-modal/DetailModal.component';
import {
  deleteProjectAction,
  getProjectDetailsAction,
} from '../../../store/features/slices/projects/projects.action';
import { useNavigate, useParams } from 'react-router-dom';
import NoData from '../../../components/admin/no-data/NoData.component';
import AddColumn from '../../../components/admin/add-column/AddColumn.component';
import {
  addSectionAction,
  deleteSectionAction,
  deleteSubtaskAction,
  deleteTaskAction,
  editSubtaskAction,
  getTaskDetailsAction,
  toggleSubTaskStatusAction,
} from '../../../store/features/slices/tasks/tasks.action';
import Button from '../../../components/admin/button/Button.component';
import { paths } from '../../../routers/paths';
import AddDetailModal from '../../../components/admin/detail-modal/AddDetailModal.component';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import axios from 'axios';
import { backendUrls } from '../../../api/urls';
import KanbanLoading from '../../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../../components/loaders/spinner/Spinner';
import { toast } from 'react-toastify';
import DeleteModal from '../../../components/admin/delete-modal/DeleteModal.component';

const ProjectDetails = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { taskDetail, taskError } = useAppSelector((state) => state.tasks);
  const effectRef = useRef<boolean>(true);
  const dispatch = useAppDispatch();
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>('');
  const navigate = useNavigate();
  const [sectionId, setSectionId] = useState<string>('');
  const [project, setProject] = useState<any>([]);
  const [contributors, setContributors] = useState<any>([]);
  const [columnLoading, setColumnLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [kanbanLoading, setKanbanLoading] = useState<boolean>(false);
  const [shouldDelete, setShouldDelete] = useState<boolean>(false);
  const [deleteSectionLoading, setDeleteSectionLoading] = useState<boolean>(false);
  const [taskDetailLoading, setTaskDetailsLoading] = useState<boolean>(false);
  const [updateTaskDetailLoading, setUpdateTaskDetailLoading] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string>('');
  const [taskDeleteLoading, setTaskDeleteLoading] = useState<boolean>(false);
  const { id } = useParams();

  const projectData = { id, token: user?.accessToken }; // general data for project

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current = false;
      setKanbanLoading(true);
      getProjectDetails();
    }
  }, [id]);

  const getProjectDetails = () => {
    dispatch(getProjectDetailsAction(projectData)).then((res: any) => {
      setContributors(res?.payload?.contributors);
      console.log(res?.payload?.contributors)
      setProject(res?.payload);
      setKanbanLoading(false);
    });
  };

  const handleAddTask = (sectionId: string) => {
    setSectionId(sectionId);
    setShowAddTaskModal(true);
  };

  const handleDeleteSection = (sectionID: string) => {
    setDeleteSectionLoading(true);
    const data = {
      id: sectionID,
      token: user?.accessToken,
      projectId: project?._id,
    };
    dispatch(deleteSectionAction(data)).then(() => getProjectDetails());
  };

  const handleAddColumn = () => {
    setColumnLoading(true);
    const data = {
      content: {
        name: taskName,
        projectId: project?._id,
      },
      token: user?.accessToken,
    };
    dispatch(addSectionAction(data)).then(() => {
      getProjectDetails();
      setShowAdd(false);
      setColumnLoading(false);
    });
  };

  const handleDeleteProject = () => {
    setLoading(true);
    const data = {
      id: project?._id,
      token: user?.accessToken,
    };
    dispatch(deleteProjectAction(data)).then(() => {
      setShouldDelete(false);
      setLoading(false);
      navigate(paths.ADMIN.PROJECTS);
    });
  };

  // delete task
  const handleDeleteTask = () => {
    setTaskDeleteLoading(true);
    setLoading(true);
    const data = {
      id: taskId,
      token: user?.accessToken,
    };
    dispatch(deleteTaskAction(data)).then(() => {
      getProjectDetails();
      setTaskDeleteLoading(false);
      setShowDetailsModal(false);
      toast.success('Task Deleted!');
    });
  };

  const changeTaskStatus = useCallback((item: any, status: any, tasks: any, sections: any) => {
    const allTasks = [];
    for (const section of sections) {
      allTasks.push(...section.tasks);
    }
    const task = allTasks.find((task: any) => task._id === item.id);
    if (task.section._id === status._id) return;
    const data = {
      taskId: task._id,
      newSectionId: status._id,
    };
    setKanbanLoading(true);
    axios
      .patch(backendUrls.tasks.CHANGESECTION, data, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
      .then((res: any) => {
        getProjectDetails();
        setKanbanLoading(false);
      });
  }, []);

  const getTaskDetails = (taskId: string) => {
    setTaskDetailsLoading(true);
    const data = {
      id: taskId,
      token: user?.accessToken,
    };
    dispatch(getTaskDetailsAction(data)).then(() => {
      if (taskError) {
        setTaskDetailsLoading(false);
        return toast.error(taskError);
      }
      setTaskDetailsLoading(false);
    });
  };

  const handleToggleSubtaskStatus = (subtaskId: string) => {
    setUpdateTaskDetailLoading(true);
    const data = {
      id: subtaskId,
      token: user?.accessToken,
    };
    dispatch(toggleSubTaskStatusAction(data)).then(() => {
      getTaskDetails(taskId);
      setUpdateTaskDetailLoading(false);
      toast.success('Subtask status updated!');
    });
  };

  // delete subtask
  const handleDeleteSubtask = (subtaskId: string) => {
    const data = {
      content: {
        subtaskId,
        taskId,
      },
      token: user?.accessToken,
    };
    dispatch(deleteSubtaskAction(data)).then(() => {
      getTaskDetails(taskId);
    });
  };

  // edit subtask
  const handleEditSubtask = (subtaskId: string, description: string) => {
    const data = {
      content: {
        subtaskId,
        description,
      },
      token: user?.accessToken,
    };
    dispatch(editSubtaskAction(data)).then(() => {
      getTaskDetails(taskId);
    });
  };

  return (
    <AdminLayout
      title={project?.title}
      contributors={contributors}
      padding='50px 20px 0'
      actionText='Add Column'
      onClick={() => setShowAdd(true)}
      onDeleteProject={() => setShouldDelete(true)}
      deleteText='Delete Project'
      showDelete
    >
      <DndProvider backend={HTML5Backend}>
        <div className={classes.container}>
          {project?.sections?.length > 0 ? (
            project?.sections?.map((sec: any, index: number) => {
              return (
                <ProjectColumn
                  status={sec}
                  sections={project?.sections}
                  key={`${sec?._id} ${index}`}
                  title={sec?.name}
                  id={sec?._id}
                  numOfItems={sec?.tasks.length}
                  tasks={sec?.tasks}
                  droppableId={sec?._id}
                  showTaskDetails={(taskId) => {
                    setShowDetailsModal(true);
                    getTaskDetails(taskId);
                    setTaskId(taskId);
                    setShowAddTaskModal(false);
                  }}
                  onAdd={() => handleAddTask(sec?._id)}
                  onDeleteColumn={() => handleDeleteSection(sec?._id)}
                  changeTaskStatus={changeTaskStatus}
                  deleteSectionLoading={deleteSectionLoading}
                />
              );
            })
          ) : (
            <NoData
              infoText='Ooops! No Columns made yet'
              text='Add Column'
              onClick={() => setShowAdd(true)}
            />
          )}
        </div>
      </DndProvider>
      <AddColumn
        showModal={showAdd}
        placeholder='Column Title'
        onClick={handleAddColumn}
        onClose={() => setShowAdd(false)}
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        columnLoading={columnLoading}
      />
      <DetailModal
        showModal={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        taskDetailLoading={taskDetailLoading}
        onToggleSubtaskStatus={handleToggleSubtaskStatus}
        onDeleteSubtask={handleDeleteSubtask}
        onEditSubTask={handleEditSubtask}
        updateTaskDetailLoading={updateTaskDetailLoading}
        onDeleteTask={handleDeleteTask}
        taskDeleteLoading={taskDeleteLoading}
        projectId={id}
        getProjectDetails={getProjectDetails}
      />
      <AddDetailModal
        showModal={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        sectionId={sectionId}
        projectId={project?._id}
        project={project}
        getProjectDetails={getProjectDetails}
        onTaskAdd={() => setShowAddTaskModal(false)}
      />
      <KanbanLoading kanbanLoading={kanbanLoading}>
        <Spinner size='20px' />
        {/* <Loader size='40px' /> */}
      </KanbanLoading>
      <KanbanLoading
        kanbanLoading={shouldDelete}
      >
        <DeleteModal
          onDelete={handleDeleteProject}
          onCancel={() => setShouldDelete(false)}
          loading={loading}
        />
      </KanbanLoading>
    </AdminLayout>
  );
};

export default ProjectDetails;
