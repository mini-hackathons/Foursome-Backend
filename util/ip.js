const axios = require('axios');

module.exports = {
    geolocate: async(ip) => {
        try {
            const { data } = await axios.get(`http://ip-api.com/json/${ip}`)
            
            return data;
        }catch(err) {
            console.log('IP Geolocation error');
            console.log(err);
            return;
        }
    }
}