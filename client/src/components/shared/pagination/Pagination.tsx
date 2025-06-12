import React, { useState } from 'react';
import styles from './pagination.module.css'

interface PaginationProps {
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
            onPageChange(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={styles.paginationContainer}>
            {currentPage > 1 && (
                <button onClick={goToPreviousPage} className={styles.paginationButton}>Previous</button>
            )}
            <span className={styles.paginationText}>Page {currentPage} of {totalPages}</span>
            {currentPage < totalPages && (
                <button onClick={goToNextPage} className={styles.paginationButton}>Next</button>
            )}
        </div>
    );
};

export default Pagination;