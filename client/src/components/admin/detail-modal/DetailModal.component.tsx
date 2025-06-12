import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  AddPersonOutlinedIcon,
  ClockIcon,
  CloseIcon,
  TickIcon,
  TwoStrokesIcon,
} from '../../../assets/svg';
import { useAppDispatch, useAppSelector } from '../../../store';
import classes from './DetailModal.module.css';
import Avatar from '../avatar/Avatar.component';
import placeholder from '../../../assets/images/p-placeholder.jpg';
import Input from '../input/Input.component';
import AddDropdown from '../add-dropdown/AddDropdown.component';
import Button from '../button/Button.component';
import {
  addTaskAction,
  deleteAssigneeAction,
  deleteTaskFileAction,
  editTaskAction,
  getTaskDetailsAction,
} from '../../../store/features/slices/tasks/tasks.action';
import { toast } from 'react-toastify';
import Dropdown from '../dropdown/Dropdown.component';
import { priorities } from '../../../assets/data/priorities';
import { getProjectDetailsAction } from '../../../store/features/slices/projects/projects.action';
import Spinner from '../../loaders/spinner/Spinner';

interface DetailModalProps {
  showModal?: boolean;
  onClose?: () => void;
  // priority?: 'high' | 'medium' | 'low';
  taskDetailLoading?: boolean;
  onToggleSubtaskStatus?: (subtaskId: string) => void;
  onDeleteTask?: (subtaskId: string) => void;
  onDeleteSubtask?: (subtaskId: string) => void;
  onEditSubTask?: (subtaskId: string, description: string) => void;
  updateTaskDetailLoading?: boolean;
  taskDeleteLoading?: boolean;
  projectId?: string;
  getProjectDetails?: () => void;
}

const DetailModal = ({
  showModal,
  onClose,
  taskDetailLoading,
  taskDeleteLoading,
  onToggleSubtaskStatus,
  onDeleteSubtask,
  onEditSubTask,
  onDeleteTask,
  updateTaskDetailLoading,
  getProjectDetails,
  projectId,
}: DetailModalProps) => {
  const { members } = useAppSelector((state) => state.members);
  const { taskDetail, taskError } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);
  const [memberHeader, setMemberHeader] = useState<string>('Add Assignees');
  const [projectMemberIds, setProjectMemberIds] = useState<any>([]);
  const [projectMembers, setProjectMembers] = useState<any>([]);
  const [subTasksList, setSubTasksList] = useState<any>([]);
  const [subTask, setSubTask] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string>('');

  const [date, setDate] = React.useState<string>('');
  const [focused, setFocused] = React.useState<boolean>(false);
  const [nameFocused, setNameFocused] = React.useState<boolean>(false);
  const [attachments, setAttachments] = useState<any>([]);
  const [previews, setPreviews] = useState<any>([]);
  const [subtaskFocused, setSubtaskFocused] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [taskFiles, setTaskFiles] = useState<any>([]);
  const [addedContributors, setAddedContributors] = useState<any>([]);

  const [showDelete, setShowDelete] = useState<string>('');
  const [fileDelete, showFileDelete] = useState<string>('');
  const [loadingAction, setLoadingAction] = useState<boolean>(false);

  useEffect(() => {
    setName(taskDetail?.name);
    setDescription(taskDetail?.description);
    setProjectMembers(taskDetail?.assignees);
    setProjectMemberIds(taskDetail?.assignees?.map((mem: any) => mem._id));
    setPriority(taskDetail?.priority);
    setTaskFiles(taskDetail?.files);
    setSubTasksList(taskDetail?.subTasks);
    setDate(taskDetail?.date);
    setTaskId(taskDetail?._id);
  }, [taskDetail]);

  // get task details
  const getTaskDetails = () => {
    setLoadingAction(true);
    const data = {
      id: taskId,
      token: user?.accessToken,
    };
    dispatch(getTaskDetailsAction(data)).then(() => {
      setLoadingAction(false);
    });
  };

  // select members
  const handleMembersSelect = (item: any) => {
    if (projectMembers.includes(item) || projectMemberIds.includes(item.id)) {
      return;
    }
    setProjectMemberIds((prev: any) => [...prev, item._id]);
    setProjectMembers((prev: any) => [...prev, item]);
    setMemberHeader('Add Assignees');
  };

  // edit task
  const editTask = () => {
    if (name === '') {
      setNameError('Project Title Required!');
      return;
    }
    const formData = new FormData();
    const taskInfo = {
      name,
      description,
      date,
      priority,
    };
    formData.append('taskInfo', JSON.stringify(taskInfo));

    for (let i = 0; i < projectMemberIds.length; i++) {
      formData.append('assignees', projectMemberIds[i]);
    }
    for (let i = 0; i < subTasksList.length; i++) {
      formData.append('subtasks', JSON.stringify(subTasksList[i]));
    }
    for (let i = 0; i < attachments.length; i++) {
      formData.append('files', attachments[i]);
    }
    const data = {
      formData,
      token: user?.accessToken,
      id: taskDetail?._id ?? taskId,
    };
    setLoading(true);
    dispatch(editTaskAction(data)).then((res: any) => {
      const { payload } = res;
      if (payload?.status === 500 || payload?.status === 400) {
        toast.error(payload?.message);
        setLoading(false);
        return;
      } else {
        getProjectDetails?.();
        getTaskDetails();
        setLoading(false);
        // clearData();
        toast.success('Task Edited!');
      }
    });
  };
  // clear data
  const clearData = () => {
    setName('');
    setDescription('');
    setProjectMemberIds([]);
    setProjectMembers([]);
    setSubTasksList([]);
    setSubTask('');
    setName('');
    setPriority('');
    setNameError('');
    setDate('');
  };

  // select priority
  const handlePrioritySelect = (item: any) => {
    setPriority(item);
  };

  // select attachments
  const handleFileChange = (e: any) => {
    if (!e.target.files || attachments?.includes(e.target.files)) return;
    setAttachments((prev: any) => [...prev, e.target.files[0]]);
    const preview = URL.createObjectURL(e.target.files[0]);
    setPreviews((prev: any) => [...prev, preview]);
  };

  // delete assignee
  const deleteAssignee = (id: string) => {
    const data = {
      content: {
        assigneeId: id,
        taskId: taskDetail._id ?? taskId,
      },
      token: user?.accessToken,
    };
    dispatch(deleteAssigneeAction(data)).then(() => getTaskDetails());
  };

  const handleDeleteTaskAttachment = (path: string) => {
    const data = {
      content: {
        taskId: taskDetail._id ?? taskId,
        filePath: path,
      },
      token: user?.accessToken,
    };
    dispatch(deleteTaskFileAction(data)).then((res: any) => {
      const { payload } = res;
      if (payload?.status === 500 || payload?.status === 400) {
        toast.error(payload?.message);
        setLoading(false);
        return;
      }
      getTaskDetails();
      toast.success('Task File Deleted!');
    });
  };

  // add subtask to list
  const handleAddSubTask = () => {
    if (subTask === '') return;
    setSubTasksList((prev: any) => [...prev, { description: subTask }]);
    setSubTask('');
  };

  return (
    <>
      {showModal && (
        <div className={classes.container}>
          {(taskDetailLoading || updateTaskDetailLoading || loadingAction) && (
            <div className={classes.loaderContainer}>
              <Spinner size='26px' />
            </div>
          )}
          <div className={classes.heading}>
            <CloseIcon onClick={onClose} />
          </div>
          <div className={classes.contentContainer}>
            <div className={classes.content}>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError('');
                }}
                placeholder='Add Task Title'
                border={nameFocused ? '1px solid rgba(0,0,0,0.2)' : 'none'}
                fontWeight='bold'
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                errorMessage={nameError}
              />
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Task Description'
                border={focused ? '1px solid rgba(0,0,0,0.2)' : 'none'}
                fontWeight='bold'
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              <div
                className={classes.block}
                style={{ alignItems: 'flex-start', flexDirection: 'column', margin: '20px 0' }}
              >
                <p className={classes.label} style={{ marginBottom: '8px' }}>
                  Contributors
                </p>
                <AddDropdown
                  text={memberHeader}
                  renderIconLeft={() => <AddPersonOutlinedIcon />}
                  options={members?.data}
                  id='firstName'
                  id2='lastName'
                  headerStyle={{
                    padding: '14px 0',
                    justifyContent: 'flex-start',
                    boxShadow: 'none',
                    marginTop: '10px',
                  }}
                  textStyle={{ marginLeft: '20px' }}
                  handleOption={(item) => handleMembersSelect(item)}
                  nullCheckValue={false}
                />
                <div className={classes.contibutors}>
                  {projectMembers?.map((cont: any, index: any) => {
                    console.log('cont', cont)
                    return (
                      <div
                        key={`${cont._id} ${index}`}
                        className={classes.ownerMini}
                        style={{
                          margin: '0px 10px 20px 0',
                          cursor: 'pointer',
                          padding: '5px',
                          flexDirection: 'column',
                        }}
                        onMouseOver={() => setShowDelete(cont._id)}
                        onMouseLeave={() => setShowDelete('')}
                      >
                        <div style={{ display: 'flex' }}>
                          <Avatar size='18px' src={cont?.profileImage?.httpPath} />
                          <span
                            style={{ margin: '0 10px', fontSize: '12px' }}
                          >{`${cont.firstName} ${cont.lastName}`}</span>
                        </div>
                        {showDelete === cont._id && (
                          <Button
                            onClick={() => deleteAssignee(cont._id)}
                            text='Delete'
                            border=''
                            bgColor=''
                            color='red'
                            fillColor='red'
                            strokeColor='#fff'
                            spinnerSize='10px'
                            padding='0px 0px 0px'
                            margin='6px 0 0'
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={classes.block}>
                <p className={classes.label}>Priority</p>
                <div className={classes.blockRight}>
                  <Dropdown
                    options={priorities}
                    id='label'
                    handleOption={handlePrioritySelect}
                    style={{
                      marginBottom: '0',
                      boxShadow: 'none',
                      top: '5px',
                      position: 'relative',
                    }}
                    initialValue={priority}
                  />
                  <div
                    className={classes.label}
                    style={{
                      marginLeft: '8px',
                      textTransform: 'capitalize',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  ></div>
                </div>
              </div>
              <div className={classes.block}>
                <p className={classes.label}>Due Date</p>
                <div className={classes.blockRight}>
                  <ClockIcon size='14' style={{ marginLeft: '21px' }} />
                  <span className={classes.label} style={{ marginLeft: '8px' }}>
                    <Input
                      border=''
                      type='date'
                      value={date}
                      style={{ cursor: 'pointer' }}
                      onChange={(e) => setDate(e.target.value)}
                    />{' '}
                  </span>
                </div>
              </div>
              <div
                className={classes.block}
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <p className={classes.label}>Files</p>
                {taskFiles?.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                    <p className={classes.label} style={{ fontSize: '10px', marginTop: '10px' }}>
                      All Files
                    </p>
                    <div className={classes.coverPreviews}>
                      {taskFiles?.map((taskFile: any, idx: number) => {
                        return (
                          <div
                            className={classes.uploadBtn}
                            key={`${taskFile} ${idx}`}
                            onMouseOver={() => showFileDelete(taskFile._id)}
                            onMouseLeave={() => showFileDelete('')}
                          >
                            {fileDelete === taskFile?._id ? (
                              <div
                                className={classes.deleteHover}
                                onClick={() => handleDeleteTaskAttachment(taskFile?.httpPath)}
                              >
                                <span style={{ width: '70%' }}>Delete File</span>
                              </div>
                            ) : (
                              <img
                                src={taskFile?.httpPath}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  objectPosition: 'center',
                                }}
                                alt='image_tag'
                                crossOrigin='anonymous'
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                  <p className={classes.label} style={{ fontSize: '10px', marginTop: '10px' }}>
                    Add New Files
                  </p>
                  <div className={classes.coverPreviews}>
                    {previews?.length > 0
                      ? previews?.map((pre: any, idx: number) => {
                          return (
                            <label htmlFor='upload' key={`${pre} ${idx}`}>
                              <div className={classes.uploadBtn}>
                                <img
                                  src={pre}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    objectPosition: 'center',
                                  }}
                                  alt='image_tag'
                                  crossOrigin='anonymous'
                                />
                              </div>
                            </label>
                          );
                        })
                      : null}
                    <label htmlFor='upload'>
                      <div className={classes.uploadBtn}>+</div>
                    </label>
                  </div>
                </div>
                <input
                  id='upload'
                  type='file'
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
              <div
                className={classes.block}
                style={{ alignItems: 'flex-start', flexDirection: 'column' }}
              >
                <p className={classes.label}>Sub Tasks</p>
                <Input
                  value={subTask}
                  placeholder='Description'
                  style={{ borderRadius: '10px', padding: '6px' }}
                  margin='10px 0 0'
                  onChange={(e) => setSubTask(e.target.value)}
                />
                <Button
                  text='Add Subtask'
                  onClick={handleAddSubTask}
                  bgColor=''
                  color='#868686'
                  padding='14px 0'
                />
                <div
                  className={classes.contibutors}
                  style={{ paddingLeft: '0', marginTop: '10px' }}
                >
                  {subTasksList?.length > 0
                    ? subTasksList?.map((task: any, index: any) =>
                        subtaskFocused === task._id ? (
                          <Input
                            key={`${task._id} ${index}`}
                            placeholder={task.description}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            renderIcon={() => (
                              <Button
                                text='Edit'
                                bgColor=''
                                border=''
                                color='#003B33'
                                padding='0px'
                                onClick={() => {
                                  onEditSubTask?.(task._id, editDescription);
                                  setSubtaskFocused('');
                                }}
                              />
                            )}
                          />
                        ) : (
                          <div
                            style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                            key={`${task._id} ${index}`}
                            className={classes.subTask}
                          >
                            <div
                              style={{
                                background: task?.completed ? '#F5F9FF' : '#fff',
                                width: '100%',
                                marginRight: '16px',
                                padding: '8px',
                                borderRadius: '16px',
                              }}
                              onClick={() => setSubtaskFocused(task._id)}
                            >
                              <span>{task.description}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <TickIcon
                                color={task?.completed && '#009883'}
                                borderColor={task?.completed ? '#009883' : '#868686'}
                                onClick={() => {
                                  onToggleSubtaskStatus?.(task._id);
                                }}
                              />
                              <CloseIcon
                                size='9'
                                style={{ marginLeft: '12px' }}
                                onClick={() => onDeleteSubtask?.(task._id)}
                              />
                            </div>
                          </div>
                        ),
                      )
                    : null}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
              <Button text='Edit Task' onClick={editTask} loading={loading} spinnerSize='12px' />
              <Button
                text='Delete Task'
                onClick={onDeleteTask}
                loading={taskDeleteLoading}
                spinnerSize='12px'
                bgColor='#FE4329'
                strokeColor='#FE4329'
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailModal;
