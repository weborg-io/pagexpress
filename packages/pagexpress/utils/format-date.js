/**
 *
 * @param {Date} dateObject
 * @returns {string}
 */
export const formatDate = dateObject =>
  dateObject
    .toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .split(' ')
    .join('-');
