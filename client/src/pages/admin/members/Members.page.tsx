import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminHeader from '../../../components/admin/admin-header/AdminHeader';
import AdminSection from '../../../components/admin/admin-section/AdminSection.component';
import MemberCard from '../../../components/admin/member-card/MemberCard.component';
import AdminLayout from '../../../layouts/Admin.layout';
import classes from './Members.module.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  approveMemberAction,
  getMembersAction,
  getUsersAction,
} from '../../../store/features/slices/members/members.action';
import KanbanLoading from '../../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../../components/loaders/spinner/Spinner';
import NoData from '../../../components/admin/no-data/NoData.component';
import { toast } from 'react-toastify';

const Members = () => {
  const { members } = useAppSelector((state) => state.members);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [allMembers, setAllMembers] = useState<any>(members?.data);
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [approveActive, setApproveActive] = useState<string>('');
  const [recentMembers, setRecentMebmers] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allMembers?.length / 6);

  const startIndex = (currentPage - 1) * 6;
  const endIndex = startIndex + 6;
  const currentData = allMembers?.slice(startIndex, endIndex);

  const gettingMembers = () => {
    dispatch(getMembersAction({ limit: 1000 })).then((res: any) => {
      const copiedData: any = [...res.payload.data];
      if (user?.user?.role === 'superAdmin') {
        dispatch(getUsersAction({ limit: 1000 })).then((res: any) => {
          const anotherCopiedData = [...copiedData, ...res.payload.data];
          console.log('anothecopied', copiedData);
          setAllMembers(anotherCopiedData);
          setLoading(false);
          return;
        });
      } else {
        setAllMembers(copiedData);
      }
    });
  };

  useEffect(() => {
    gettingMembers();
  }, []);

  useEffect(() => {
    setRecentMebmers(
      allMembers?.filter((mem: any) => {
        const memberDate = new Date(mem.createdAt);
        const memberWeek = memberDate.getDay();
        return 7 - memberWeek > 0;
      }),
    );
  }, []);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const filtered = allMembers?.data?.filter(
      (project: any) =>
        project.firstName.toLowerCase().includes(value.toLowerCase()) ||
        project.lastName.toLowerCase().includes(value.toLowerCase()),
    );
    setAllMembers(filtered);
  }, [value]);

  const handleApproveMember = (email: string) => {
    setApproveActive(email);
    setApprovalLoading(true);
    const data = {
      email: email,
      token: user?.accessToken,
    };
    dispatch(approveMemberAction(data)).then((res: any) => {
      const { payload } = res;
      if (payload?.status === 400) {
        toast.success(`${payload?.message}`);
        setApprovalLoading(false);
        return;
      } else {
        setApprovalLoading(false);
        toast.success('Member Approved Successfully ❤️');
        gettingMembers();
      }
    });
  };

  return (
    <AdminLayout searchValue={value} onChange={(e) => setValue(e.target.value)} title='All Members'>
      <div className={classes.container}>
        <AdminSection title='Recent Members' showNavigation={false}>
          <div className={classes.memberCards}>
            {recentMembers?.length > 0 ? (
              recentMembers
                ?.filter((mem: any, index: number) => index < 6)
                .map((mem: any) => (
                  <MemberCard
                    key={mem._id}
                    name={`${mem.firstName}` + ` ${mem.lastName}`}
                    description={mem.about}
                    profile={mem?.profileImage?.httpPath}
                    projectNo={mem.numberOfProjects}
                    onApprove={() => handleApproveMember(mem?.email)}
                    loading={approvalLoading && approveActive === mem.email}
                    isMember={mem?.isMember}
                  />
                ))
            ) : (
              <NoData
                infoText='Oops! No Recent Members, See All Members Below!'
                height='130px'
                imageWidth='40px'
              />
            )}
          </div>
        </AdminSection>
        <AdminSection
          title='Members'
          previousDisabled={currentPage === 1}
          nextDisabled={currentPage === totalPages}
          onNext={currentPage === totalPages ? () => null : handleNext}
          onPrevious={currentPage === 1 ? () => null : handlePrevious}
        >
          <div className={classes.members}>
            {currentData?.length > 0 ? (
              currentData
                ?.filter((mem: any, index: number) => index < 6)
                .map((mem: any) => (
                  <MemberCard
                    key={mem._id}
                    name={`${mem.firstName}` + ` ${mem.lastName}`}
                    description={mem.about}
                    profile={mem?.profileImage?.httpPath}
                    projectNo={mem.numberOfProjects}
                    onApprove={() => handleApproveMember(mem?.email)}
                    loading={approvalLoading && approveActive === mem?.email}
                    isMember={mem?.isMember}
                  />
                ))
            ) : (
              <NoData infoText='Oops! No Recent Member' />
            )}
          </div>
        </AdminSection>
      </div>
      <KanbanLoading kanbanLoading={loading}>
        <Spinner />
      </KanbanLoading>
    </AdminLayout>
  );
};

export default Members;
