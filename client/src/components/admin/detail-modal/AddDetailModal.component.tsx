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
  getTaskDetailsAction,
} from '../../../store/features/slices/tasks/tasks.action';
import { toast } from 'react-toastify';
import Dropdown from '../dropdown/Dropdown.component';
import { priorities } from '../../../assets/data/priorities';
import { getProjectDetailsAction } from '../../../store/features/slices/projects/projects.action';
import pdfPlaceholder from '../../../assets/images/pdf-preview.png';

interface DetailModalProps {
  showModal?: boolean;
  onClose?: () => void;
  // priority?: 'high' | 'medium' | 'low';
  sectionId?: string;
  projectId?: string;
  project?: any;
  getProjectDetails?: () => void;
  onTaskAdd?: () => void;
}

const AddDetailModal = ({
  showModal,
  onClose,
  sectionId,
  projectId,
  project,
  onTaskAdd,
  getProjectDetails,
}: DetailModalProps) => {
  const { members } = useAppSelector((state) => state.members);
  const { user } = useAppSelector((state) => state.auth);
  const { taskDetail } = useAppSelector((state) => state.tasks);
  const [memberHeader, setMemberHeader] = useState<string>('Add Assignees');
  const [projectMemberIds, setProjectMemberIds] = useState<any>([]);
  const [projectMembers, setProjectMembers] = useState<any>([]);
  const [subTasksList, setSubTasksList] = useState<any>([]);
  const [subTask, setSubTask] = useState<string>();
  const [description, setDescription] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [priority, setPriority] = useState<string>('Medium');
  const [nameError, setNameError] = useState<string>('');
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const nowDate = new Date().toLocaleDateString('en-GB');
  const [date, setDate] = React.useState<string>(nowDate ?? '');
  const [focused, setFocused] = React.useState<boolean>(false);
  const [nameFocused, setNameFocused] = React.useState<boolean>(false);
  const [attachments, setAttachments] = useState<any>([]);
  const [previews, setPreviews] = useState<any>([]);

  const handleMembersSelect = (item: any) => {
    if (projectMembers.includes(item) || projectMemberIds.includes(item._id)) {
      return;
    }
    setProjectMemberIds((prev: any) => [...prev, item._id]);
    setProjectMembers((prev: any) => [...prev, item]);
    setMemberHeader('Add Assignees');
  };
  const handleAdd = () => {
    if (subTask === '') return;
    setSubTasksList((prev: any) => [...prev, { description: subTask }]);
    setSubTask('');
  };
  const deleteSubTask = (description: string) => {
    const filtered = subTasksList?.filter((task: any) => task.description !== description);
    setSubTasksList(filtered);
  };

  const addTask = () => {
    if (name === '') {
      setNameError('Project Title Required!');
      return;
    }
    const formData = new FormData();
    const taskInfo = {
      name,
      description,
      sectionId,
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
    };
    setLoading(true);
    dispatch(addTaskAction(data)).then((res: any) => {
      const { payload } = res;
      if (payload?.status === 500 || payload?.status === 400) {
        toast.error(payload?.message);
        setLoading(false);
        return;
      } else {
        getProjectDetails?.();
        clearData();
        setLoading(false);
        toast.success('Task Added!');
        onTaskAdd?.()
      }
    });
  };
  const clearData = () => {
    setName('');
    setDescription('');
    setPriority('');
    setDate('');
    setProjectMemberIds([]);
    setProjectMembers([]);
    setSubTasksList([]);
    setSubTask('');
    setNameError('');
    setAttachments([]);
    setPreviews([])
  };

  const handlePrioritySelect = (item: any) => {
    setPriority(item);
  };

  const handleFileChange = (e: any) => {
    if (!e.target.files) return;
    setAttachments((prev: any) => [...prev, e.target.files[0]]);
    const preview = URL.createObjectURL(e.target.files[0]);
    setPreviews((prev: any) => [...prev, preview]);
  };

  return (
    <>
      {showModal && (
        <div className={classes.container}>
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
                  {projectMembers?.map((cont: any, index: any) => (
                    <div
                      key={`${cont.id} ${index}`}
                      className={classes.ownerMini}
                      style={{ margin: '0px 10px 20px 0' }}
                    >
                      <Avatar size='18px' src={cont.profileImage?.httpPath} />
                      <span
                        style={{ margin: '0 10px', fontSize: '12px' }}
                      >{`${cont.firstName} ${cont.lastName}`}</span>
                    </div>
                  ))}
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
                <p className={classes.label}>Date</p>
                <div className={classes.blockRight}>
                  <ClockIcon size='14' style={{ marginLeft: '21px' }} />
                  <span className={classes.label} style={{ marginLeft: '8px' }}>
                    <Input
                      border=''
                      type='date'
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                  </span>
                </div>
              </div>
              <div
                className={classes.block}
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <p className={classes.label}>Files</p>
                <div className={classes.coverPreviews}>
                  {previews.length > 0
                    ? previews.map((pre: any, idx: number) => {
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
                                alt='Pdf File'
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
                  onClick={handleAdd}
                  bgColor=''
                  color='#868686'
                  padding='14px 0'
                />
                <div
                  className={classes.contibutors}
                  style={{ paddingLeft: '0', marginTop: '10px' }}
                >
                  {subTasksList.length > 0
                    ? subTasksList?.map((task: any, index: any) => (
                        <>
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
                              // onClick={() => setSubtaskFocused(task._id)}
                            >
                              <span>{task.description}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <CloseIcon
                                size='9px'
                                style={{ marginLeft: '12px' }}
                                onClick={() => deleteSubTask(task.description)}
                              />
                            </div>
                          </div>
                        </>
                      ))
                    : null}
                </div>
              </div>
            </div>
            <Button text='Add Task' onClick={addTask} loading={loading} spinnerSize='12px' />
          </div>
        </div>
      )}
    </>
  );
};

export default AddDetailModal;
