import  { useEffect, useState } from 'react';
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

  const renderPaginate = () => {
    return pageNumbers.map((number, index) => {
      const activeClass = activeIndex === index ? 'active' : '';
      return (
        <li key={number} className={`page-item ${activeClass}`}>
          <Link
            to={`/preferences/main/clients-list`}
            onClick={() => {
              paginate(number);
              activeIndex === index ? setActiveIndex(0) : setActiveIndex(index);
            }}
            className='page-link'
          >
            {number}
          </Link>
        </li>
      );
    });
  };

  return (
    <nav>
      <ul className='pagination justify-content-center flex-wrap'>
        {renderPaginate()}
      </ul>
    </nav>
  );
};

export default Pagination;
