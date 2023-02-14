import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAngleLeft, faAngleRight, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Page.module.scss';

const cx = classNames.bind(styles);

function Page({ totalRecords, setStart, setLimit }) {
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [perpage, setPerpage] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setTotalPages(totalRecords);
    }, [totalRecords]);

    const setFirstPage = () => {
        setStart(0);
        setCurrentPage(1);
    };

    const setPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setStart((currentPage - 2) * perpage);
        } else {
            setStart(0);
            setCurrentPage(1);
        }
    };

    const inputPage = (value) => {
        if (value.length === 0) {
            setCurrentPage('');
        } else {
            value = Number.parseInt(value);
            if (value <= totalPages) {
                setCurrentPage(value);
                setStart((value - 1) * perpage);
            } else if (value > totalPages) {
                setCurrentPage(totalPages);
                setStart((totalPages - 1) * perpage);
            } else if (value.length === 0 || value < 1) {
                setCurrentPage(1);
                setStart(0);
            }
        }
    };

    const setNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setStart(currentPage * perpage);
        } else {
            setStart(0);
            setCurrentPage(1);
        }
    };

    const setLastPage = () => {
        setCurrentPage(totalPages);
        setStart((totalPages - 1) * perpage);
    };

    const setChangePerPage = (e) => {
        const perpage = e.target.value;
        let allPages = 0;
        if (totalRecords % perpage === 0) allPages = totalRecords / perpage;
        else allPages = Math.floor(totalRecords / perpage) + 1;
        if (currentPage > allPages) {
            setCurrentPage(allPages);
            setStart((allPages - 1) * perpage);
        }
        setPerpage(e.target.value);
        setLimit(e.target.value);
        setTotalPages(allPages);
    };

    return (
        <div className={cx('wrapper')}>
            <button className={cx('page-btn')} onClick={setFirstPage}>
                <FontAwesomeIcon icon={faAnglesLeft} />
            </button>
            <button className={cx('page-btn')} onClick={setPreviousPage}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <p>Trang</p>
            <input className={cx('page-no')} value={currentPage} onChange={(e) => inputPage(e.target.value)} />
            <p>{'/' + totalPages}</p>
            <button className={cx('page-btn')} onClick={setNextPage}>
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button className={cx('page-btn')} onClick={setLastPage}>
                <FontAwesomeIcon icon={faAnglesRight} />
            </button>
            <select className={cx('content-per-page')} onChange={(e) => setChangePerPage(e)}>
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
            </select>
        </div>
    );
}

export default Page;
