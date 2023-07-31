import { useDispatch, useSelector } from 'react-redux';
import {
  doSortList,
  doOrderList,
  doOrderSortActiveUsersList,
  doSortClientsList,
  doOrderSortClientsList,
  doSortActiveUsersList,
} from '../actions';

const ListSorting = (props) => {
  const dispatch = useDispatch();
  const {
    sortList,
    orderListAscending,
    activeUsersList,
    nonActiveUsersList,
    clientsList,
  } = useSelector((state) => state.user);
  const onClickSortList = (event, index) => {
    dispatch(doSortList(event.target.value, index));
    dispatch(doOrderList(true));
    if (clientsList.length > 0) {
      dispatch(doSortClientsList(index));
    }
    if (activeUsersList.length > 0 || nonActiveUsersList.length > 0) {
      dispatch(doSortActiveUsersList(index));
    }
  };

  const orderList = () => {
    dispatch(doOrderList(!orderListAscending));

    if (activeUsersList.length > 0 || nonActiveUsersList.length > 0) {
      dispatch(doOrderSortActiveUsersList());
    }
    if (clientsList.length > 0) {
      dispatch(doOrderSortClientsList());
    }
  };

  const renderSortButtons = () => {
    return props.buttons.map((active, index) => {
      const { sortBy } = sortList;
      const { name, sortIndex, value } = active;
      const activeClass = sortBy === value ? 'bg-dark' : 'stabraq-bg';
      return (
        <button
          key={sortIndex}
          className={`ui primary button ${activeClass} me-3 mt-1`}
          name={name}
          onClick={(e) => {
            onClickSortList(e, sortIndex);
          }}
          type='submit'
          value={value}
        >
          {value}
        </button>
      );
    });
  };

  const renderSortBar = () => {
    const orderClass = orderListAscending
      ? 'sort amount down'
      : 'sort amount up';
    const activeClass = !orderListAscending ? 'bg-dark' : '';
    const order = orderListAscending ? 'Ascending' : 'Descending';

    return (
      <div className='ui segment text-center'>
        <div className='text-start fw-bold'>Sort By</div>
        {renderSortButtons()}
        <button
          className={`ui primary button ${activeClass} me-3 mt-1`}
          name='ascending'
          onClick={orderList}
          type='submit'
          value='ascending'
        >
          <i className={`${orderClass} icon me-1`} />
          {order}
        </button>
      </div>
    );
  };

  return <div>{renderSortBar()}</div>;
};

export default ListSorting;
