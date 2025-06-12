import React, { useEffect, useState } from 'react';

import AdminLayout from '../../../layouts/Admin.layout';
import styles from './donations.module.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import KanbanLoading from '../../../components/admin/KandbanLoading/KanbanLoading.component';
import Spinner from '../../../components/loaders/spinner/Spinner';
import NoData from '../../../components/admin/no-data/NoData.component';
import DonationCard from '../../../components/admin/donation-card/DonationCard.component';
import DonationTable from '../../../components/donation-table/DonationTable';
import { getDonationsAction } from '../../../store/features/slices/donations/donations.action';
import { paths } from '../../../routers/paths';
import { useNavigate } from 'react-router-dom';
import { endpoint } from '../../../api/config';
import Pagination from '../../../components/shared/pagination/Pagination';

const Donations = () => {
  const { loading } = useAppSelector((state) => state.loader);
  const { donations } = useAppSelector((state) => state.donations);
  const [allDonations, setAllDonations] = useState<any>(donations?.data);
  const [activeDonations, setActiveDonations] = useState<any>();
  const [page, setPage] = useState(1);
  const [value, setValue] = useState('');
  const [balance, setBalance] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const REFILL_FRACTION = 100 / 104;
  const ELEMENTS_PER_PAGE = 10;

  const getAllDonations = () => {
    dispatch(getDonationsAction()).then((res: any) => {
      const { payload } = res;
      if (payload) {
        const fetchedDonations = payload?.data.map((donation: { donatedBy: string; amount: number; purpose: string; isTransaction: boolean; engagedAmount: number }) => {
          return {
            donatedBy: donation.donatedBy,
            donatedAmount: donation.amount,
            receivedAmount: Math.floor(REFILL_FRACTION * donation.amount),
            purpose: donation.purpose,
            isTransaction: donation.isTransaction,
            engagedAmount: donation.isTransaction ? donation.engagedAmount : 0
          };
        });
        setAllDonations(fetchedDonations);
        setActiveDonations(fetchedDonations.slice(0, ELEMENTS_PER_PAGE));
      }
    });
  };

  const updateDonations = (currentPage: number) => {
    const start = (currentPage - 1) * ELEMENTS_PER_PAGE;
    const end = start + ELEMENTS_PER_PAGE;
    setActiveDonations(allDonations.slice(start, end));
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

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(endpoint + '/donations/vallet-pay-balance');
        const result = await response.json();
        setBalance(result.balance);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchBalance();

    // Fetch data every minute
    const intervalId = setInterval(fetchBalance, 60000);  // 60000 milliseconds = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);


  return (
    <AdminLayout
      title='Donations'
      showBack
      actionText='Donate'
      onClick={() => navigate(paths.DONATIONS)}
      searchValue={value}
      onChange={(e) => setValue(e.target.value)}
    >
      <DonationTable donations={activeDonations} allDonations={allDonations} />

      <div style={{
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div><h1>Current balance in wallet: {balance} FCFA</h1></div>
        <div><Pagination totalPages={Math.ceil(allDonations.length / ELEMENTS_PER_PAGE)} onPageChange={updateDonations} /></div>
      </div>
      <KanbanLoading kanbanLoading={loading}>
        <Spinner size='18px' />
      </KanbanLoading>
    </AdminLayout>
  );
};

export default Donations;
