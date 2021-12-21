export default socket => {
  socket.on('editing-page-details', user =>
    socket.broadcast.emit('editing-page-details', user)
  );
  socket.on('who-page-details', eventData =>
    socket.broadcast.emit('who-page-details', eventData)
  );
  socket.on('left-page-details', eventData =>
    socket.broadcast.emit('left-page-details', eventData)
  );
  socket.on('update-page-structure', version =>
    socket.broadcast.emit('update-page-structure', version)
  );
};
