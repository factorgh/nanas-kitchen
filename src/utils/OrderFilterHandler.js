const orderFilterHandler = (orders, filter) => {
  if (filter.status && filter.status.length > 0) {
    return orders.filter((order) => filter.status.includes(order.status));
  }

  return orders;
};
