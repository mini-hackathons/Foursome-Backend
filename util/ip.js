const axios = require('axios');

module.exports = {
    geolocate: async(ip) => {
        try {
            const geo = await axios.get(`https://api.ipgeolocationapi.com/geolocate/${ip}`)
            console.log(geo);
            
            return geo;
        }catch(err) {
            console.log('IP Geolocation error');
            console.log(err);
            return;
        }
    }
}