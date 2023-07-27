import { connect } from 'react-redux';
import {
  doSortList,
  doOrderList,
  doOrderSortActiveUsersList,
  doSortClientsList,
  doOrderSortClientsList,
} from '../actions';

const ListSorting = (props) => {
  const sortList = (event, index) => {
    const { clientsList } = props;
    props.doSortList(event.target.value, index);
    props.doOrderList(true);
    if (clientsList.length > 0) {
      props.doSortClientsList(index);
    }
  };

  const orderList = () => {
    const {
      orderListAscending,
      activeUsersList,
      nonActiveUsersList,
      clientsList,
    } = props;

    props.doOrderList(!orderListAscending);

    if (orderListAscending) {
      if (activeUsersList.length > 0 || nonActiveUsersList.length > 0) {
        props.doOrderSortActiveUsersList();
      }
    }
    if (clientsList.length > 0) {
      props.doOrderSortClientsList();
    }
  };

  const renderSortButtons = () => {
    return props.buttons.map((active, index) => {
      const { sortBy } = props.sortList;
      const { name, sortIndex, value } = active;
      const activeClass = sortBy === value ? 'bg-dark' : 'stabraq-bg';
      return (
        <button
          key={sortIndex}
          className={`ui primary button ${activeClass} me-3 mt-1`}
          name={name}
          onClick={(e) => {
            sortList(e, sortIndex);
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
    const { orderListAscending } = props;
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

const mapStateToProps = (state) => {
  const {
    sortList,
    orderListAscending,
    activeUsersList,
    nonActiveUsersList,
    clientsList,
  } = state.user;
  return {
    sortList,
    orderListAscending,
    activeUsersList,
    nonActiveUsersList,
    clientsList,
  };
};

export default connect(mapStateToProps, {
  doSortList,
  doOrderList,
  doOrderSortActiveUsersList,
  doSortClientsList,
  doOrderSortClientsList,
})(ListSorting);
