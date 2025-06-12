import React from 'react'

// styles import
import styles from './budgeting.module.css'

type Props = {
  descr: string
}

const Budgeting: React.FC<Props> = ({ descr }) => {
  const tableData = [
    {
      assets: 'Fabrics',
      quantity: '10 tons',
      budeget: '10,000',
      weeks: '3 weeks',
    },
    {
      assets: 'Zinks',
      quantity: '1000 tons',
      budeget: '10,000',
      weeks: '3 weeks',
    },
    {
      assets: 'Nails',
      quantity: '5 kg',
      budeget: '10,000',
      weeks: 'lifetime',
    },
    {
      assets: 'Fabrics',
      quantity: '10 000',
      budeget: '10,000',
      weeks: '3 weeks',
    },
  ]
  return (
    <div className={styles.container}>
      <h1>Budgeting</h1>
      <p>{descr}</p>
      <div className={styles.table__wrapper}>
        <table className={styles.tables}>
          <thead>
            <tr>
              <th>Assets</th>
              <th>Quantity</th>
              <th>Budeget ($)</th>
              <th>Usage period</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr key={index}>
                <td>{data.assets}</td>
                <td>{data.quantity}</td>
                <td>{data.budeget}</td>
                <td>{data.weeks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Budgeting
