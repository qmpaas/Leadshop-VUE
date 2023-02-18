const PAGE_HEADERS = [
  'X-PAGINATION-TOTAL-COUNT',
  'X-PAGINATION-PER-PAGE',
  'X-PAGINATION-PAGE-COUNT',
  'X-PAGINATION-CURRENT-PAGE'
];

export function transformPageHeaders(response) {
  Object.keys(response.headers).forEach(item => {
    response.headers[item.toUpperCase()] = response.headers[item];
    delete response.headers[item];
  });
  const pagination = {
    current: 1,
    pageCount: 1,
    totalCount: 1
  };
  PAGE_HEADERS.forEach(key => {
    Object.keys(response.headers).map(item => {
      if (key === item) {
        response.headers[item] = parseInt(response.headers[item]);
      }
    });
  });
  pagination.current = response.headers['X-PAGINATION-CURRENT-PAGE'];
  pagination.pageCount = response.headers['X-PAGINATION-PAGE-COUNT'];
  pagination.totalCount = response.headers['X-PAGINATION-TOTAL-COUNT'];
  response.pagination = pagination;
}
