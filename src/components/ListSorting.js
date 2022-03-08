import { Component } from 'react';
import { connect } from 'react-redux';
import {
  doSortList,
  doOrderList,
  doOrderSortActiveUsersList,
} from '../actions';

export class ListSorting extends Component {
  sortList = (event, index) => {
    this.props.doSortList(event.target.value, index);
    this.props.doOrderList(true);
  };

  orderList = () => {
    const { orderListAscending } = this.props;
    const { activeUsersList, nonActiveUsersList } = this.props;
    this.props.doOrderList(!orderListAscending);
    if (orderListAscending) {
      if (activeUsersList.length > 0 || nonActiveUsersList.length > 0) {
        this.props.doOrderSortActiveUsersList();
      }
    }
  };

  renderSortButtons = () => {
    return this.props.buttons.map((active, index) => {
      const { sortBy } = this.props.sortList;
      const { name, sortIndex, value } = active;
      const activeClass = sortBy === value ? 'bg-dark' : 'stabraq-bg';
      return (
        <button
          key={sortIndex}
          className={`ui primary button ${activeClass} me-3 mt-1`}
          name={name}
          onClick={(e) => {
            this.sortList(e, sortIndex);
          }}
          type='submit'
          value={value}
        >
          {value}
        </button>
      );
    });
  };

  renderSortBar = () => {
    const { orderListAscending } = this.props;
    const orderClass = orderListAscending
      ? 'sort amount down'
      : 'sort amount up';
    const activeClass = !orderListAscending ? 'bg-dark' : '';
    const order = orderListAscending ? 'Ascending' : 'Descending';

    return (
      <div className='ui segment text-center'>
        <div className='text-start fw-bold'>Sort By</div>
        {this.renderSortButtons()}
        <button
          className={`ui primary button ${activeClass} me-3 mt-1`}
          name='ascending'
          onClick={this.orderList}
          type='submit'
          value='ascending'
        >
          <i className={`${orderClass} icon me-1`} />
          {order}
        </button>
      </div>
    );
  };

  render() {
    return <div>{this.renderSortBar()}</div>;
  }
}

const mapStateToProps = (state) => {
  const { sortList, orderListAscending, activeUsersList, nonActiveUsersList } =
    state.user;
  return {
    sortList,
    orderListAscending,
    activeUsersList,
    nonActiveUsersList,
  };
};

export default connect(mapStateToProps, {
  doSortList,
  doOrderList,
  doOrderSortActiveUsersList,
})(ListSorting);
