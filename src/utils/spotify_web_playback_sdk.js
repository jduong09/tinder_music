export const createListeners = (player) => {
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });

  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device Id has gone offline', device_id);
  });

  player.addListener('initialization_error', ({ message }) => {
    console.log(message);
  });

  player.addListener('authentication_error', ({ message }) => {
    console.log(message);
  });

  player.addListener('account_error', ({ message }) => {
    console.log(message);
  });

  document.getElementById('togglePlay').onclick = function() {
    player.togglePlay();
  };

  player.connect();
}