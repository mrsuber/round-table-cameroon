import  { useEffect, useState } from 'react';

import AdminLayout from '../../../layouts/Admin.layout';
import classes from './Transfers.module.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import KanbanLoading from '../../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../../components/loaders/spinner/Spinner';
import NoData from '../../../components/admin/no-data/NoData.component';
import DonationCard from '../../../components/admin/donation-card/DonationCard.component';
import { getDonationsAction } from '../../../store/features/slices/donations/donations.action';

const Transfers = () => {
  const { loading } = useAppSelector((state) => state.loader);
  const { donations } = useAppSelector((state) => state.donations);
  const [allDonations, setAllDonations] = useState<any>(donations?.data);
  const [value, setValue] = useState('');
  const dispatch = useAppDispatch();

  const getAllDonations = () => {
    dispatch(getDonationsAction()).then((res: any) => {
      const { payload } = res;
      setAllDonations(payload?.data);
    });
  };

  useEffect(() => {
    getAllDonations();
  }, []);

  useEffect(() => {
    if (value) {
      const filtered = allDonations?.filter((don: any) =>
        String(don?.amount)?.toLowerCase().includes(value.toLowerCase()),
      );
      setAllDonations(filtered);
    } else {
      getAllDonations();
    }
  }, [value]);

  return (
    <AdminLayout
      title='Transfers'
      showBack
      searchValue={value}
      onChange={(e) => setValue(e.target.value)}
    >
      <div className={classes.transfers}>
        {allDonations?.length > 0 ? (
          allDonations?.map((don: any) => (
            <DonationCard
              key={don._id}
              name={don.donatedBy}
              description={don.description}
              amount={don.amount}
              date={don.createdAt}
              state={don.state}
            />
          ))
        ) : (
          <NoData infoText='No Donations' />
        )}
      </div>
      <KanbanLoading kanbanLoading={loading}>
        <Spinner size='18px' />
      </KanbanLoading>
    </AdminLayout>
  );
};

export default Transfers;
