import React, { useEffect, useState } from 'react';
import { CardFacebookIcon, CardLinkedinIcon, TwitterIcon } from '../../../../icons';
import MemberCard from '../../../shared/member-card/MemberCard';
import SectionTitle from '../../../shared/section-title/SectionTitle';

// styles import
import useWindowSize from '../../../../lib/hooks/useWindowSize';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { getMembersAction } from '../../../../store/features/slices/members/members.action';
import styles from './memberssection.module.css';

const MembersSection = () => {
  const { width } = useWindowSize();
  const dispatch = useAppDispatch();

  const [membersList, setMembersList] = useState([]);

  useEffect(() => {
    dispatch(getMembersAction({ pageNumber: null, limit: 4 })).then((res: any) => {
      setMembersList(res?.payload?.data);
    });
  }, []);

  const handleFacebookClick = (link: string) => {
    if (link?.includes('facebook.com')) {
      window.open(link, '_blank');
    } else {
      window.open(`https://www.facebook.com/${link}`, '_blank');
    }
  };
  const handleLinkedinClick = (link: string) => {
    if (link?.includes('linkedin.com')) {
      window.open(link, '_blank');
    } else {
      window.open(`https://www.linkedin.com/in/${link}`, '_blank');
    }
  };
  const handleTwitterClick = (link: string) => {
    if (link?.includes('twitter.com')) {
      window.open(link, '_blank');
    } else {
      window.open(`https://www.twitter.com/${link}`, '_blank');
    }
  };

  return (
    <>
      <SectionTitle title='Meet Our Members' height='80px' />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {membersList?.length > 0 &&
            membersList
              ?.filter((data) => membersList.indexOf(data) < 4)
              .map((member: any, index) => {
                return (
                  <div
                    style={{ marginBottom: width < 600 ? '32px' : '64px' }}
                    key={index}
                    className={styles.card}
                  >
                    <MemberCard
                      key={member?._id}
                      img={member?.profileImage?.httpPath}
                      name={member?.username ?? `${member?.firstName} ${member?.lastName}`}
                      description={[
                        member?.profession ??
                          'Member of the Round Table passionate in making investments work. ',
                        member?.about,
                      ]}
                      icons={[
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleFacebookClick(member?.facebook)}
                          key={0}
                        >
                          <CardFacebookIcon />
                        </div>,
                        <div
                          onClick={() => handleLinkedinClick(member?.linkedIn)}
                          key={1}
                          style={{ cursor: 'pointer' }}
                        >
                          <CardLinkedinIcon />
                        </div>,
                        <div
                          onClick={() => handleTwitterClick(member?.twitter)}
                          key={2}
                          style={{ cursor: 'pointer' }}
                        >
                          <TwitterIcon />
                        </div>,
                      ]}
                    />
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default MembersSection;
