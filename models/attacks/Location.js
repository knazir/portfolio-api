const ipLocation = require("iplocation");

const propsToKeep = {
  city: "city",
  region: "region",
  region_code: "regionCode",
  country: "country",
  country_name: "countryName",
  continent_code: "continentCode",
  latitude: "latitude",
  longitude: "longitude",
};

class Location {
  constructor(ip) {
    this.ip = ip;
    this._setLocation(ip);
  }

  async _setLocation(ip) {
    const location = await ipLocation(ip);
    Object.entries(location).forEach(([key, value]) => {
      delete location[key];
      if (key in propsToKeep) location[propsToKeep[key]] = value;
    });
    Object.assign(this, location);
  }
}

module.exports = Location;
