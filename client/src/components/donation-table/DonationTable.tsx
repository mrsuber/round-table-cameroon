import React from 'react';
import styles from './donation-table.module.css'

interface Donation {
    donatedBy: string;
    donatedAmount: number;
    receivedAmount: number;
    purpose: string;
    isTransaction: boolean;
    engagedAmount: number;
}

interface DonationTableProps {
    donations: Donation[];
    allDonations: Donation[];
}

const DonationTable: React.FC<DonationTableProps> = ({ donations, allDonations }) => {
    return (
        <table className={styles.table} >
            <thead>
                <tr>
                    <th style={{ width: '15%' }}>Donated By</th>
                    <th style={{ width: '15%' }}>Donated Amount</th>
                    <th style={{ width: '15%' }}>Authorized Amount</th>
                    <th style={{ width: '15%' }}>Engaged Amount</th>
                    <th style={{ width: '40%' }}>Purpose</th>
                </tr>
            </thead>
            <tbody>
                {donations && donations.map((donation, index) => (
                    <tr key={index} style={donation.isTransaction ? { borderBottom: '1px solid #ccc', color: 'red' } : { borderBottom: '1px solid #ccc' }}>
                        <td style={{ width: '15%' }}>{donation.donatedBy}</td>
                        <td style={{ width: '15%' }}>{donation.isTransaction ? '' : `${donation.donatedAmount} FCFA`}</td>
                        <td style={{ width: '15%' }}>{donation.isTransaction ? '' : `${donation.receivedAmount} FCFA`}</td>
                        <td style={{ width: '15%' }}>{donation.isTransaction ? `${donation.engagedAmount} FCFA` : ''}</td>
                        <td style={{ width: '40%' }}>{donation.purpose}</td>
                    </tr>
                ))}
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ width: '15%' }}>Total</td>
                    <td style={{ width: '15%' }}>{allDonations && allDonations.reduce((total, donation) => total + donation.donatedAmount, 0)} FCFA</td>
                    <td style={{ width: '15%' }}>{allDonations && allDonations.reduce((total, donation) => total + donation.receivedAmount, 0)} FCFA</td>
                    <td style={{ width: '15%' }}>{allDonations && allDonations.reduce((total, donation) => total + donation.engagedAmount, 0)} FCFA</td>
                    <td style={{ width: '40%' }}></td>
                </tr>
            </tbody>
        </table>
    );
};

export default DonationTable;