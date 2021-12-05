const unlockViewEvents = {
  pageDetailsId: 'left-page-details',
};

export default function ({ store, from, $socket }) {
  const { params } = from;

  for (const paramKey of Object.keys(params)) {
    if (unlockViewEvents[paramKey]) {
      $socket.emit(unlockViewEvents[paramKey], {
        [paramKey]: params[paramKey],
        user: store.getters.loggedInUser,
      });

      break;
    }
  }
}
