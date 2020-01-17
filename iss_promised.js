const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://ipvigilante.com/json/${ip}`);
};

const fetchISSFlyOverTimes = function(ip) {
  const data = JSON.parse(ip).data;
  let coords = {
    longitude : data.longitude,
    latitude : data.latitude
  };
  return request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`);
};

const nextISSTimesForMyLocation = function() {

  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(data=>{
      const resp = JSON.parse(data).response;
      return resp;
    })
    .catch(error=>{
      console.log('There was and error: ', error);
    });

};

module.exports = { nextISSTimesForMyLocation };