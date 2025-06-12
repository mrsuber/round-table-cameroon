import { useEffect, useState } from 'react';
import Footer from '../../components/shared/footer/Footer';
import MemberCardTwo from '../../components/shared/member-card-2/MemberCardTwo';
import NavBar from '../../components/shared/navbar/NavBar';
import { ChevronIcon } from '../../icons';
// import { cardData } from '../../static/data'

import { useAppDispatch } from '../../store';
import {
  getMembersAction,
  getUsersAction,
} from '../../store/features/slices/members/members.action';
import styles from './members.module.css';
import NoData from '../../components/admin/no-data/NoData.component';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routers/paths';
import KanbanLoading from '../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../components/loaders/spinner/Spinner';

const Members = () => {
  const [chevronClicked, setChevronClicked] = useState(false);
  const [numberShown, setNumberShown] = useState(6);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [membersList, setMembersList] = useState<any>([]);

  useEffect(() => {
    setLoading(true);
    dispatch(getMembersAction({ pageNumber: null, limit: 1000 })).then((res: any) => {
      const copiedData: any = [...res.payload.data];
      dispatch(getUsersAction({ limit: 1000 })).then((res: any) => {
        const anotherCopiedData = [...copiedData, ...res.payload.data];
        setMembersList(anotherCopiedData);
        setLoading(false);
      });
    });
  }, []);

  return (
    <div>
      <NavBar />
      <div style={{ marginBottom: '113px' }}>
        <div className={styles.heading__styles}>
          <h2 className={styles.heading}>
            Meet Our <span style={{ color: '#00242A' }}> Members</span>
          </h2>
          <p className={styles.descr}>Discover Roundtable’s members</p>
        </div>
        <div className={styles.card__wrapper}>
          <div className={styles.card__content}>
            {membersList?.length > 0 ? (
              membersList?.slice(0, numberShown).map((data: any, index: any) => {
                return (
                  <MemberCardTwo
                    key={index}
                    name={`${data.firstName} ${data.lastName}`}
                    image={data.profileImage?.httpPath}
                  />
                );
              })
            ) : (
              <NoData
                infoText='No Members Yet, Sign up, Get Approved, and become a member!'
                onClick={() => navigate(paths.AUTH)}
                text='Sign up for Memberbhip'
                height='50vh'
              />
            )}
          </div>
        </div>
        <span className={styles.all__memebers}>
          <p>{numberShown === 6 ? 'See all Members' : 'See less Members'}</p>
          <span
            style={{ cursor: 'pointer', transition: '0.2s ease-in-out' }}
            onClick={() => {
              setChevronClicked(!chevronClicked);
              setNumberShown(numberShown === 6 ? membersList.length : 6);
            }}
            className={chevronClicked && styles.chevron__down}
          >
            <ChevronIcon />
          </span>
        </span>
      </div>
      <KanbanLoading kanbanLoading={loading}>
        <Spinner />
      </KanbanLoading>
      <Footer />
    </div>
  );
};

export default Members;
