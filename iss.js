const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', function(error,response,body) {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body);
    callback(error, ip.ip);

  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/json/${ip}`, function(error,response,body) {

    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }
    
    const data = JSON.parse(body).data;
    let coords = {
      longitude : data.longitude,
      latitude : data.latitude
    };
    callback(null, coords);
  });

};

const fetchISSFlyOverTimes = function(coords, callback) {

  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, function(error, response, body) {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);

  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) =>{
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) =>{
      if (error) {
        return callback(error,null);
      }
      fetchISSFlyOverTimes(coords,(error, obj) => {
        if (error) {
          return callback(error,null);
        }
        callback(null, obj);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
