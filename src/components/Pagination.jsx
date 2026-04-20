import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Pagination = ({
  clientsPerPage,
  totalClients,
  paginate,
  currentPage,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalClients / clientsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    setActiveIndex(currentPage - 1);
  }, [currentPage]);

  const handlePageClick = (number, index) => {
    paginate(number);
    setActiveIndex(index);
  };

  return (
    <nav aria-label='Clients list pagination'>
      <ul className='pagination justify-content-center flex-wrap'>
        <li className={`page-item ${activeIndex === 0 ? 'disabled' : ''}`}>
          <Link
            to='/preferences/main/clients-list'
            className='page-link'
            onClick={() => {
              if (activeIndex > 0) handlePageClick(pageNumbers[activeIndex - 1], activeIndex - 1);
            }}
            aria-label='Previous page'
          >
            &laquo;
          </Link>
        </li>

        {pageNumbers.map((number, index) => {
          const isActive = activeIndex === index;
          return (
            <li key={number} className={`page-item ${isActive ? 'active' : ''}`}>
              <Link
                to='/preferences/main/clients-list'
                onClick={() => handlePageClick(number, index)}
                className='page-link'
                {...(isActive ? { 'aria-current': 'page' } : {})}
              >
                {number}
              </Link>
            </li>
          );
        })}

        <li className={`page-item ${activeIndex === pageNumbers.length - 1 ? 'disabled' : ''}`}>
          <Link
            to='/preferences/main/clients-list'
            className='page-link'
            onClick={() => {
              if (activeIndex < pageNumbers.length - 1) handlePageClick(pageNumbers[activeIndex + 1], activeIndex + 1);
            }}
            aria-label='Next page'
          >
            &raquo;
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
