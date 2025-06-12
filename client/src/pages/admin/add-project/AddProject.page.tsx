import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AddDottedIcon,
  AddPersonIcon,
  AddPersonOutlinedIcon,
  AttachFileIcon,
  AttachmentIcon,
  CloseIcon,
  MoreVerticalIcon,
  UnCheckedIcon,
  CheckedIcon,
} from '../../../assets/svg';
import Input from '../../../components/admin/input/Input.component';
import AdminLayout from '../../../layouts/Admin.layout';
import { projectTypes } from '../../../assets/data/projectTypes';
import Avatar from '../../../components/admin/avatar/Avatar.component';
import TextArea from '../../../components/admin/input/TextArea.component';
import Button from '../../../components/admin/button/Button.component';
import AttachmentsPreview from '../../../components/admin/attchments-preview/AttachmentsPreview.component';
// import { attachments as attachmentData } from '../../../assets/data/attachments';
import AddDropdown from '../../../components/admin/add-dropdown/AddDropdown.component';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getMembersAction } from '../../../store/features/slices/members/members.action';
import classes from './AddProject.module.css';
import { removeArrItem } from '../../../utils/removeArrItem';
import placeholder from '../../../assets/images/p-placeholder.jpg';
import { addProjectAction } from '../../../store/features/slices/projects/projects.action';
import { toast } from 'react-toastify';
import { stopLoading } from '../../../store/features/slices/loader/loader.slice';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../routers/paths';

const AddProject = () => {
  const { members } = useAppSelector((state) => state.members);
  const { user } = useAppSelector((state) => state.auth);
  const { projectError: error, successMessage } = useAppSelector((state) => state.projects);
  const { loading } = useAppSelector((state) => state.loader);
  const dispatch = useAppDispatch();

  const effectRef = useRef(true);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [projectImage, setProjectImage] = useState<any>();
  const [date, setDate] = useState<string>('');
  const [projectManager, setProjectManager] = useState<any>([]);
  const [projectMemberIds, setProjectMemberIds] = useState<any>([]);
  const [projectManagerIds, setProjectManagerIds] = useState<any>([]);
  const [projectMembers, setProjectMembers] = useState<any>([]);
  const [assigneeIds, setAssigneeIds] = useState<any[]>(projectMemberIds);
  const [projectLabel, setProjectLabel] = useState<any>([]);
  const [tasks, setTasks] = useState<any>([]);
  const [taskName, setTaskName] = useState<string>('');
  const [taskDate, setTaskDate] = useState<string>('');
  const [attachments, setAttachments] = useState<any>([]);
  const [publicProject, setPublicProject] = useState<boolean>(false);
  const [focusTitle, setFocusTitle] = useState(false);
  const [focusTaskName, setFocusTaskName] = useState(false);
  const [ongoing, setOngoing] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current = false;
      dispatch(getMembersAction({ pageNumber: 0, limit: 1000 }));
    }
  }, []);

  const projectInfo = {
    title,
    publicProject,
    date,
    ongoing,
  };

  const [errorText, setErrorText] = useState<string>('');
  const [assignees, setAssignees] = useState<any[]>(projectMembers);
  const [memberHeader, setMemberHeader] = useState<string>('Add Member');
  const [assigneeHeader, setAssigneeHeader] = useState<string>('Add Assignees');
  const [selectedLabel, setSelectedLabel] = useState<any>();
  const [taskDescription, setTaskDescription] = useState<string>();
  const [coverPreview, setCoverPreview] = useState<any>();
  const memberHeaderRef = useRef<any>();

  const handleAddProject = () => {
    const formData = new FormData();
    formData.append('projectInfo', JSON.stringify(projectInfo));
    formData.append('projectImage', projectImage);
    for (let i = 0; i < projectManagerIds.length; i++) {
      formData.append('projectManager', projectManagerIds[i]);
    }
    for (let i = 0; i < projectMemberIds.length; i++) {
      formData.append('projectMembers', projectMemberIds[i]);
    }
    for (let i = 0; i < projectLabel.length; i++) {
      formData.append('labels', projectLabel[i]);
    }
    formData.append('description', description);
    for (let i = 0; i < attachments.length; i++) {
      formData.append('attachments', attachments[i]);
    }
    for (let i = 0; i < tasks.length; i++) {
      formData.append('tasks', JSON.stringify(tasks[i]));
    }
    const data = {
      formData,
      token: user?.accessToken,
    };
    dispatch(addProjectAction(data)).then((res: any) => {
      const { payload } = res;
      if (error) {
        toast.error(error?.error?.message);
        dispatch(stopLoading());
        return;
      } else if (payload?.status === 500 || payload?.status === 400) {
        toast.error(payload?.message);
        dispatch(stopLoading());
        return;
      } else {
        toast.success(successMessage);
        clearAllData();
        navigate(paths.ADMIN.PROJECTS);
      }
    });
  };

  const clearAllData = () => {
    setTitle('');
    setDescription('');
    setProjectImage('');
    setDate('');
    setProjectManager([]);
    setProjectMemberIds([]);
    setProjectMembers([]);
    setAssigneeIds([]);
    setProjectLabel([]);
    setTasks([]);
    setAttachments([]);
    setPublicProject(false);
    setAssignees([]);
    setMemberHeader('Add Member');
    setAssigneeHeader('Add Assignees');
    setSelectedLabel(null);
    setTaskDescription('');
    setCoverPreview('');
  };

  const handleMembersSelect = (item: any) => {
    setErrorText('');
    if (projectMembers.includes(item) || projectMemberIds.includes(item._id)) {
      return;
    }
    setProjectMemberIds((prev: any) => [...prev, item._id]);
    setProjectMembers((prev: any) => [...prev, item]);
    setMemberHeader('Add Member');
  };

  const handleAssigneeHeader = () => {
    if (projectMembers.length === 0) {
      setErrorText('Select at least one member');
      memberHeaderRef.current.focus();
      return;
    }
  };
  const handleAssigneeSelect = (item: any) => {
    if (assignees.includes(item) || assigneeIds.includes(item._id)) {
      return;
    }
    setAssignees((prev: any) => [...prev, item]);
    setAssigneeIds((prev: any) => [...prev, item._id]);
    setAssigneeHeader('Add Assignees');
  };
  const handleManagerSelect = (item: any) => {
    setProjectManagerIds((prev: any) => [...prev, item._id]);
    setProjectManager((prev: any) => [...prev, item]);
  };

  const handleRemoveMember = (item: any) => {
    const removedMember = removeArrItem(projectMembers, item);
    setProjectMembers(removedMember);
    const removedMemberId = removeArrItem(projectMemberIds, item._id);
    setProjectMemberIds(removedMemberId);
  };
  const handleRemoveManager = (item: any) => {
    const removedMember = removeArrItem(projectManager, item);
    setProjectManager(removedMember);
    const removedMemberId = removeArrItem(projectManagerIds, item._id);
    setProjectManagerIds(removedMemberId);
  };
  const handleRemoveTask = (item: any) => {
    const removedMember = removeArrItem(tasks, item);
    setTasks(removedMember);
  };

  const handleRemoveAssignee = (item: any) => {
    const removedMember = removeArrItem(assignees, item);
    setAssignees(removedMember);
    const removedMemberId = removeArrItem(assigneeIds, item._id);
    setAssigneeIds(removedMemberId);
  };

  const handleDeleteAttachment = (item: any) => {
    const removedAttachment = removeArrItem(attachments, item);
    setAttachments(removedAttachment);
  };
  const handleDeleteCover = (item: any) => {
    setCoverPreview(null);
    setProjectImage(null);
  };

  const handleLabelSelect = (item: any) => {
    const labelsCopy = [...projectLabel];
    if (projectLabel.includes(item.type)) {
      const index = labelsCopy.indexOf(item);
      labelsCopy.splice(index, 1);
      setProjectLabel(labelsCopy);
      setSelectedLabel(null);
    } else {
      setSelectedLabel(item.id);
      setProjectLabel((prev: any) => [...prev, item.type]);
    }
  };

  const handleCreateTask = () => {
    setTasks((prev: any) => [
      ...prev,
      { name: taskName, date: taskDate, description: taskDescription, assignees: assigneeIds },
    ]);
    setTaskDescription('');
    setAssignees([]);
    setAssigneeIds([]);
    setTaskName('');
  };

  const handleCoverChange = (e: any) => {
    if (e.target.files) {
      const preview = URL.createObjectURL(e.target.files[0]);
      setCoverPreview(preview);
      setProjectImage(e.target.files[0]);
    }
  };

  const handleFileChange = (file: any) => {
    if (attachments.includes(file)) return;
    setAttachments((prev: any) => [...prev, file]);
  };
  const handleDropChange = useCallback(
    () => (file: any) => {
      if (attachments.find((item: any) => item.name === file.name)) return;
      setAttachments((prev: any) => [...prev, file]);
    },
    [attachments],
  );

  const handleDownload = (fileName: any) => {
    const link = document.createElement('a');
    link.download = fileName;

    // 👇️ set to relative path
    link.href = '/downloaded-files.pdf';

    link.click();
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          text='Add Project'
          style={{ alignSelf: 'right', marginBottom: '25px' }}
          width='12%'
          onClick={handleAddProject}
          loading={loading}
          spinnerSize='13px'
          disabled={false}
        />
      </div>
      <div className={classes.container}>
        <div className={classes.column}>
          <div className={classes.content} style={{ padding: '8px 14px' }}>
            <Input
              placeholder='Project Title'
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              border={focusTitle ? '0.8px solid rgba(0, 101, 87, 0.5)' : 'none'}
              onFocus={() => setFocusTitle(true)}
              onBlur={() => setFocusTitle(false)}
            />
            <TextArea
              placeholder='Description...'
              style={{ marginBottom: '14px', boxShadow: 'none' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              width='100%'
            />
            <div className={classes.coverPreview}>
              <AttachFileIcon size='16px' color='#868686' style={{ margin: '6px 10px' }} />
              <input
                id='cover'
                onChange={handleCoverChange}
                type='file'
                className={classes.fileInput}
              />
              <label htmlFor='cover' className={classes.projectImage}>
                <img
                  src={coverPreview ?? placeholder}
                  alt='project-image'
                />
              </label>
            </div>
            <div className={classes.type}>
              <div style={{ marginRight: '14px' }} className={classes.managerText}>
                Public Project :
              </div>{' '}
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => setPublicProject(!publicProject)}
              >
                <span className={classes.managerText}>Yes</span>
                {publicProject ? (
                  <CheckedIcon size='10' style={{ marginLeft: '10px' }} />
                ) : (
                  <UnCheckedIcon
                    size='11'
                    style={{ marginLeft: '10px' }}
                    color=''
                    borderColor='#B0E4DD'
                  />
                )}
              </div>
            </div>
            <div className={classes.type} style={{ margin: '16px 0' }}>
              <div style={{ marginRight: '14px' }} className={classes.managerText}>
                Ongoing Project :
              </div>{' '}
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => setOngoing(!ongoing)}
              >
                <span className={classes.managerText}>Yes</span>
                {ongoing ? (
                  <CheckedIcon size='10' style={{ marginLeft: '10px' }} />
                ) : (
                  <UnCheckedIcon
                    size='11'
                    style={{ marginLeft: '10px' }}
                    color=''
                    borderColor='#B0E4DD'
                  />
                )}
              </div>
            </div>
            <div className={classes.type}>
              <span style={{ marginRight: '3px' }} className={classes.managerText}>
                Due Date:
              </span>
              <Input
                border=''
                style={{ cursor: 'pointer' }}
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className={classes.content}>
            <h3 className={classes.membersText}>Project Manager(s)</h3>
            <div className={classes.selectedMembers}>
              {projectManager?.map((mem: any) => (
                <div
                  key={mem._id}
                  className={classes.ownerMini}
                  style={{ margin: '10px 10px 0px 0' }}
                >
                  <Avatar size='18px' src={mem.profileImage} />
                  <span
                    style={{ margin: '0 10px', fontSize: '11px' }}
                  >{`${mem.firstName} ${mem.lastName}`}</span>
                  <CloseIcon size='8' onClick={() => handleRemoveManager(mem)} />
                </div>
              ))}
            </div>
            <AddDropdown
              text='Add Project Manager'
              renderIconLeft={() => <AddPersonIcon />}
              renderIconRight={() => <AddDottedIcon />}
              options={members?.data}
              id='firstName'
              id2='lastName'
              headerStyle={{ padding: '14px' }}
              handleOption={(item) => handleManagerSelect(item)}
            />
          </div>
          <div className={classes.content}>
            <h3 className={classes.membersText}>Project Members</h3>
            <div className={classes.selectedMembers}>
              {projectMembers?.map((mem: any) => (
                <div
                  key={mem._id}
                  className={classes.ownerMini}
                  style={{ margin: '10px 10px 0px 0' }}
                >
                  <Avatar size='18px' src={mem.profileImage} />
                  <span
                    style={{ margin: '0 10px', fontSize: '11px' }}
                  >{`${mem.firstName} ${mem.lastName}`}</span>
                  <CloseIcon size='8' onClick={() => handleRemoveMember(mem)} />
                </div>
              ))}
            </div>
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
              headerRef={memberHeaderRef}
            />
          </div>
          <div className={classes.content}>
            <div className={classes.labelHeader}>
              <h3 className={classes.membersText}>Label</h3>
              {/* <MoreVerticalIcon size='18px' color='#868686' style={{ transform: 'rotate(90)' }} /> */}
            </div>
            {projectTypes.map((t) => (
              <div key={t.id} className={classes.projectType} onClick={() => handleLabelSelect(t)}>
                <span className={classes.typeText}>{t.type}</span>
                <UnCheckedIcon
                  color={
                    (selectedLabel === t.id || projectLabel.includes(t.type)) &&
                    projectLabel.length > 0
                      ? '#003B33'
                      : ''
                  }
                  style={{ border: '1px solid #BDBDBD', borderRadius: '50%' }}
                  size='14'
                />
              </div>
            ))}
          </div>
        </div>
        {/* column2  */}
        <div className={classes.column}>
          <div className={classes.content}>
            {/* <CloseIcon style={{ marginBottom: '18px' }} onClick={handleAddProject} /> */}
            <div className={classes.membersText}>Create New Task</div> {/* <span>For</span> */}
            <Input
              placeholder='Task Title'
              onChange={(e) => setTaskName(e.target.value)}
              value={taskName}
              border={focusTaskName ? '0.8px solid rgba(0, 101, 87, 0.5)' : 'none'}
              onFocus={() => setFocusTaskName(true)}
              onBlur={() => setFocusTaskName(false)}
            />
            <TextArea
              placeholder='Describe Task'
              style={{ marginBottom: '14px' }}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <span style={{ marginRight: '3px' }} className={classes.managerText}>
              Due Date:
            </span>
            <Input
              type='date'
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              border=''
            />
            <div className={classes.selectedMembers}>
              {assignees?.map((mem: any) => (
                <div
                  key={mem._id}
                  className={classes.ownerMini}
                  style={{ margin: '10px 10px 0px 0' }}
                >
                  <Avatar size='18px' src={mem.profileImage} />
                  <span
                    style={{ margin: '0 10px', fontSize: '11px' }}
                  >{`${mem.firstName} ${mem.lastName}`}</span>
                  <CloseIcon size='8' onClick={() => handleRemoveAssignee(mem)} />
                </div>
              ))}
            </div>
            <AddDropdown
              text={assigneeHeader}
              renderIconLeft={() => <AddPersonOutlinedIcon />}
              options={projectMembers}
              id='firstName'
              id2='lastName'
              headerStyle={{
                padding: '14px 0',
                justifyContent: 'flex-start',
                boxShadow: 'none',
                marginTop: '5px',
                marginBottom: '10px',
              }}
              textStyle={{ marginLeft: '20px' }}
              dropdownItemsStyle={{ marginTop: '0px' }}
              handleOption={(item) => handleAssigneeSelect(item)}
              nullCheckValue={false}
              errorText={errorText}
              onHeaderClick={handleAssigneeHeader}
            />
            <Button text='Create Task' bgColor='#006557' onClick={handleCreateTask} />
          </div>
          <div className={classes.content}>
            <h3 className={classes.membersText}>All Tasks</h3>
            <div className={classes.allTasks}>
              {tasks?.map((task: any) => {
                return (
                  <div className={classes.task} key={task.description}>
                    <div className={classes.assigneeName}>{task.name}</div>
                    <div className={classes.assigneeName}>{task.date}</div>
                    <div className={classes.deleteTask} onClick={handleRemoveTask}>
                      Delete
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* comment snippet */}
        </div>
        {/* column3 */}
        <div className={classes.column}>
          <div className={classes.content}>
            <div className={`${classes.membersText} ${classes.attachText}`}>File Attachment</div>
            <AttachmentsPreview
              attachments={attachments}
              onChange={handleFileChange}
              onDrop={handleDropChange}
              onDownload={handleDownload}
              coverImage={projectImage}
              onDeleteAttachment={handleDeleteAttachment}
              onDeleteCover={handleDeleteCover}
              showDownload={false}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProject;
