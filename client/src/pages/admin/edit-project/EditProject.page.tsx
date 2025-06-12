import React, { useEffect, useRef, useState } from 'react';
import {
  AddDottedIcon,
  AddPersonIcon,
  AddPersonOutlinedIcon,
  AttachFileIcon,
  CloseIcon,
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
import AddDropdown from '../../../components/admin/add-dropdown/AddDropdown.component';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getMembersAction } from '../../../store/features/slices/members/members.action';
import { removeArrItem } from '../../../utils/removeArrItem';
import placeholder from '../../../assets/images/p-placeholder.jpg';
import {
  addProjectAttachment,
  addProjectContributorsAction,
  addProjectManagerAction,
  deleteProjectAttachmentAction,
  deleteProjectContributorAction,
  deleteProjectManagerAction,
  editProjectAction,
  getProjectDetailsAction,
  updateProjectImageAction,
} from '../../../store/features/slices/projects/projects.action';
import { useNavigate, useParams } from 'react-router-dom';
import KanbanLoading from '../../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../../components/loaders/spinner/Spinner';
import classes from '../add-project/AddProject.module.css';
import { toast } from 'react-toastify';

const EditProject = () => {
  const { members } = useAppSelector((state) => state.members);
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.loader);
  const dispatch = useAppDispatch();

  const effectRef = useRef(true);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [projectImage, setProjectImage] = useState<any>();
  const [date, setDate] = useState<string>('');
  const [projectManager, setProjectManager] = useState<any>([]);
  const [projectMemberIds, setProjectMemberIds] = useState<any>([]);
  const [projectMembers, setProjectMembers] = useState<any>([]);
  const [assigneeIds, setAssigneeIds] = useState<any[]>(projectMemberIds);
  const [projectLabel, setProjectLabel] = useState<any>([]);
  const [tasks, setTasks] = useState<any>([]);
  const [attachments, setAttachments] = useState<any>([]);
  const [publicProject, setPublicProject] = useState<boolean>(false);
  const [focusTitle, setFocusTitle] = useState(false);
  const [ongoing, setOngoing] = useState<boolean>(false);
  const [dateFocused, setDateFocused] = useState<boolean>(false);
  const [membersToAddList, setMembersToAddList] = useState<any>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [errorText, setErrorText] = useState<string>('');
  const [assignees, setAssignees] = useState<any[]>(projectMembers);
  const [memberHeader, setMemberHeader] = useState<string>('Add Contributor');
  const [assigneeHeader, setAssigneeHeader] = useState<string>('Add Assignees');
  const [selectedLabel, setSelectedLabel] = useState<any>();
  const [taskDescription, setTaskDescription] = useState<string>();
  const [coverPreview, setCoverPreview] = useState<any>();
  const memberHeaderRef = useRef<any>();
  const [attachmentsUploadLoading, setAttachmentsUploadLoading] = useState<boolean>(false);
  const [attachmentDeleteLoading, setAttachmentDeleteLoading] = useState<boolean>(false);
  const [managerHeader, setManagerHeader] = useState<string>('Add Project Manager');

  const getProjectDetails = () => {
    const data = { id: id, token: user?.accessToken };
    dispatch(getProjectDetailsAction(data)).then((res: any) => {
      setTitle(res?.payload?.title);
      setDescription(res?.payload?.description);
      setCoverPreview(res?.payload?.projectImage?.httpPath);
      setPublicProject(res?.payload?.publicProject);
      setProjectLabel(res?.payload?.labels);
      setOngoing(res?.payload?.ongoing);
      setProjectManager(res?.payload?.projectManager);
      setProjectMembers(res?.payload?.contributors);
      setDate(res?.payload?.createdAt);
      const date = new Date(res?.payload?.createdAt);
      setDate(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
      setAttachments(res?.payload?.attachments);
    });
  };

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current = false;
      getProjectDetails();
    }
  }, []);

  const handleEditProject = () => {
    const content = {
      projectId: id,
      title,
      description,
      projectImage,
      publicProject,
      ongoing,
      date,
      projectManager,
      projectMembers: projectMemberIds,
      labels: projectLabel,
      attachments,
    };

    const data = {
      content,
      token: user?.accessToken,
    };
    dispatch(editProjectAction(data)).then((res: any) => {
      const { payload } = res;
      if (Array.isArray(payload?.errors)) {
        payload?.errors.forEach((err: any) => toast.error(err));
      } else {
        toast.success('Project Updated Successfully');
        navigate(-1);
      }
      clearAllData();
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
    setMemberHeader('Add Contributor');
    setAssigneeHeader('Add Assignees');
    setSelectedLabel(null);
    setTaskDescription('');
    setCoverPreview('');
  };

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current = false;
      dispatch(getMembersAction({ pageNumber: 0, limit: 1000 }));
    }
  }, [id]);

  const handleManagerAdd = (item: any) => {
    if (projectManager.includes(item) || projectManager.includes(item._id)) return;
    const data = {
      content: {
        projectId: id,
        managerId: item?._id,
      },
      token: user?.accessToken,
    };
    dispatch(addProjectManagerAction(data)).then(() => {
      getProjectDetails();
      toast.success('Manager Sucessfully Added!');
      setManagerHeader('Add Project Manager');
    });
    // setProjectManager((prev: any) => [...projectManager, item]);
  };

  const handleDeleteManager = (item: any) => {
    const data = {
      content: {
        projectId: id,
        managerId: item?._id,
      },
      token: user?.accessToken,
    };
    dispatch(deleteProjectManagerAction(data)).then((res: any) => {
      const { payload } = res;
      if (payload?.status && payload?.status === 400) {
        toast.error(payload?.message);
        return;
      }
      console.log(payload);
      getProjectDetails();
      toast.success('Manager Sucessfully Deleted!');
      setManagerHeader('Add Project Manager');
    });
  };

  const handleMembersSelect = (item: any) => {
    setErrorText('');
    if (projectMembers.includes(item) || projectMemberIds.includes(item._id)) return;
    setProjectMemberIds((prev: any) => [...prev, item._id]);
    setMembersToAddList((prev: any) => [...prev, item]);
    setMemberHeader('Add Contributor');
  };

  const handleAddContributor = () => {
    const data = {
      content: {
        projectId: id,
        contributorId: projectMemberIds,
      },
      token: user?.accessToken,
    };
    dispatch(addProjectContributorsAction(data)).then(() => {
      getProjectDetails();
      toast.success('Contributors Sucessfully Added!');
      setManagerHeader('Add Project Manager');
    });
  };

  const handleRemoveContributor = (item: any) => {
    const data = {
      content: {
        projectId: id,
        contributorId: item?._id,
      },
      token: user?.accessToken,
    };
    dispatch(deleteProjectContributorAction(data)).then((res: any) => {
      const { payload } = res;
      if (payload?.status && payload?.status === 400) return toast.error(payload?.message);
      getProjectDetails();
      toast.success('Contributor Sucessfully Deleted!');
      setMemberHeader('Add Contributor');
    });
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

  const handleCoverChange = (e: any) => {
    if (e.target.files) {
      const preview = URL.createObjectURL(e.target.files[0]);
      setCoverPreview(preview);
      setProjectImage(e.target.files[0]);
      setAttachments((prev: any) => [...prev, e.target.files[0]]);
      handleProjectImageChange(e.target.files[0]);
    }
  };

  const handleProjectImageChange = (file: any) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('projectId', String(id));
    const data = {
      formData,
      token: user?.accessToken,
    };
    dispatch(updateProjectImageAction(data)).then((res: any) => {
      getProjectDetails();
      toast.success('project image updated successfully');
    });
  };

  const handleFileChange = (file: any) => {
    setAttachments((prev: any) => [...prev, file]);
  };
  const handleAddAttachments = () => {
    setAttachmentsUploadLoading(true);
    const content = new FormData();
    for (let i = 0; i < attachments.length; i++) {
      content.append('attachments', attachments[i]);
    }
    const data = {
      content,
      id,
      token: user?.accessToken,
    };
    dispatch(addProjectAttachment(data)).then(() => {
      getProjectDetails();
      setAttachmentsUploadLoading(false);
    });
  };

  const handleDeleteAttachment = (item: any) => {
    setAttachmentDeleteLoading(true);
    if (item?.httpPath) {
      handleDeleteProjectAttachment(item.httpPath);
      return;
    }
    const removedAttachment = removeArrItem(attachments, item);
    setAttachments(removedAttachment);
    setAttachmentDeleteLoading(false);
  };

  const handleDeleteProjectAttachment = (path: string) => {
    const data = {
      content: {
        projectId: id,
        filepath: path,
      },
      token: user?.accessToken,
    };
    dispatch(deleteProjectAttachmentAction(data)).then(() => {
      getProjectDetails();
      toast.success('Attachment Deleted!');
      setAttachmentDeleteLoading(false);
    });
  };

  const handleDeselectContributor = (item: any) => {
    const removedMember = removeArrItem(membersToAddList, item);
    setMembersToAddList(removedMember);
    const removedMemberId = removeArrItem(membersToAddList, item._id);
    setProjectMemberIds(removedMemberId);
  };

  const handleDownload = (file: any) => {
    const link = document.createElement('a');
    link.download = file?.httpPath;
    link.href = file?.httpPath;
    link.target = '_blank';
    link.click();
  };

  return (
    <AdminLayout onClick={handleEditProject} actionText='Edit Project' title={title}>
      <div className={classes.container}>
        <div className={classes.column}>
          <div className={classes.content} style={{ padding: '8px 14px' }}>
            <Input
              placeholder='Project Title'
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              border={
                focusTitle
                  ? '0.8px solid rgba(0, 101, 87, 0.5)'
                  : '0.8px solid rgba(0, 101, 87, 0.2)'
              }
              onFocus={() => setFocusTitle(true)}
              onBlur={() => setFocusTitle(false)}
            />
            <TextArea
              placeholder='Description...'
              style={{
                marginBottom: '14px',
                boxShadow: 'none',
                border: '0.8px solid rgba(0, 101, 87, 0.2)',
              }}
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
                  crossOrigin='anonymous'
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
              <span style={{ marginRight: '40px' }} className={classes.managerText}>
                Due Date:
              </span>
              {dateFocused ? (
                <Input
                  border=''
                  type='date'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <div
                  style={{ cursor: 'pointer' }}
                  className={classes.managerText}
                  onClick={() => setDateFocused(true)}
                >
                  {date}
                </div>
              )}
            </div>
          </div>
          <div className={classes.content}>
            <h3 className={classes.membersText}>Project Managers</h3>
            <div className={classes.selectedMembers} style={{ marginBottom: '16px' }}>
              {projectManager?.map((mem: any) => (
                <div
                  key={mem._id}
                  className={classes.ownerMini}
                  style={{ margin: '10px 10px 0px 0' }}
                >
                  <Avatar size='18px' src={mem?.profileImage?.httpPath} />
                  <span
                    style={{ margin: '0 10px', fontSize: '11px' }}
                  >{`${mem.firstName} ${mem.lastName}`}</span>
                  <CloseIcon size='8' onClick={() => handleDeleteManager(mem)} />
                </div>
              ))}
            </div>
            <AddDropdown
              text={managerHeader}
              renderIconLeft={() => <AddPersonIcon />}
              renderIconRight={() => <AddDottedIcon />}
              options={members?.data}
              id='firstName'
              id2='lastName'
              headerStyle={{ padding: '14px' }}
              handleOption={(item) => handleManagerAdd(item)}
              nullCheckValue={false}
            />
          </div>
          <div className={classes.content}>
            <h3 className={classes.membersText}>Project Contibutors</h3>
            <div className={classes.selectedMembers}>
              {projectMembers?.map((mem: any) => (
                <div
                  key={mem._id}
                  className={classes.ownerMini}
                  style={{ margin: '10px 10px 0px 0' }}
                >
                  <Avatar size='18px' src={mem?.profileImage?.httpPath} />
                  <span
                    style={{ margin: '0 10px', fontSize: '11px' }}
                  >{`${mem.firstName} ${mem.lastName}`}</span>
                  <CloseIcon size='8' onClick={() => handleRemoveContributor(mem)} />
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
                padding: '14px 7px',
                justifyContent: 'flex-start',
                // boxShadow: 'none',
                marginTop: '20px',
              }}
              textStyle={{ marginLeft: '20px' }}
              handleOption={(item) => handleMembersSelect(item)}
              nullCheckValue={false}
              headerRef={memberHeaderRef}
            />
            {membersToAddList?.length > 0 && (
              <>
                <div style={{ fontSize: '13px', marginTop: '16px' }}>Members to Add</div>
                <div className={classes.selectedMembers}>
                  {membersToAddList?.map((mem: any) => (
                    <div
                      key={mem._id}
                      className={classes.ownerMini}
                      style={{
                        margin: '10px 10px 0px 0',
                        backgroundColor: '#f0f0f0',
                        opacity: 0.8,
                        borderRadius: '8px',
                      }}
                    >
                      <Avatar size='18px' src={mem?.profileImage?.httpPath} />
                      <span
                        style={{ margin: '0 10px', fontSize: '11px' }}
                      >{`${mem.firstName} ${mem.lastName}`}</span>
                      <CloseIcon size='8' onClick={() => handleDeselectContributor(mem)} />
                    </div>
                  ))}
                </div>
              </>
            )}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Button
                text='Save Contibutors'
                width='50%'
                margin='20px 0 0'
                onClick={handleAddContributor}
                loading={loading}
                spinnerSize='13px'
              />
            </div>
          </div>
        </div>
        {/* column2  */}
        <div
          className={classes.content}
          style={{ height: '260px', flex: '40%', minHeight: 'auto' }}
        >
          <div className={classes.labelHeader}>
            <h3 className={classes.membersText}>Label</h3>
            {/* <MoreVerticalIcon size='18px' color='#868686' style={{ transform: 'rotate(90)' }} /> */}
          </div>
          {projectTypes.map((t) => (
            <div key={t.id} className={classes.projectType} onClick={() => handleLabelSelect(t)}>
              <span className={classes.typeText}>{t.type}</span>
              <UnCheckedIcon
                color={
                  (selectedLabel === t.id || projectLabel?.includes(t.type)) &&
                  projectLabel?.length > 0
                    ? '#003B33'
                    : ''
                }
                style={{ border: '1px solid #BDBDBD', borderRadius: '50%' }}
                size='14'
              />
            </div>
          ))}
        </div>
        {/* column3 */}
        <div className={classes.column}>
          <div className={classes.content}>
            <div className={`${classes.membersText} ${classes.attachText}`}>File Attachment</div>
            <AttachmentsPreview
              attachments={attachments}
              onChange={handleFileChange}
              onDownload={handleDownload}
              onDeleteAttachment={handleDeleteAttachment}
            />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Button
                text='Upload Attchments'
                width='50%'
                margin='20px 0 0'
                onClick={handleAddAttachments}
                loading={attachmentsUploadLoading}
                spinnerSize='13px'
              />
            </div>
          </div>
        </div>
      </div>
      <KanbanLoading kanbanLoading={loading}>
        <Spinner size='20px' />
        {/* <Loader size='40px' /> */}
      </KanbanLoading>
    </AdminLayout>
  );
};

export default EditProject;
