const fetch = require("node-fetch");

const propsToKeep = {
  city: "city",
  region: "region",
  region_code: "regionCode",
  country: "country",
  country_name: "countryName",
  continent_code: "continentCode",
  zip: "zip",
  latitude: "latitude",
  longitude: "longitude",
};

class Location {
  constructor(ip) {
    this.ip = ip;
    this._setLocation(ip);
  }

  async _fetchLocation(ip) {
    const response = await fetch(`http://api.ipstack.com/${ip}?access_key=${process.env.ipLookupApiKey}&format=1`);
    return await response.json();
  }

  async _setLocation(ip) {
    const location = await this._fetchLocation(ip);
    Object.entries(location).forEach(([key, value]) => {
      delete location[key];
      if (key in propsToKeep) location[propsToKeep[key]] = value;
    });
    Object.assign(this, location);
  }
}

module.exports = Location;
