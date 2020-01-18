const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, longitude, latitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (dev) return response.json({ error: "User already created" });

    const {
      data: { name = login, avatar_url, bio }
    } = await axios.get(`https://api.github.com/users/${github_username}`);

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    try {
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, "new-dev", dev);

      return response.json(dev);
    } catch (error) {
      return response.json({ error: error.message });
    }
  },

  async update(request, response) {
    const { id: _id } = request.params;

    if (!_id) return response.json({ error: "User not provided" });

    let dev = await Dev.findOne({ _id });

    if (!dev) return response.json({ error: "User not found" });

    const {
      name = dev.name,
      avatar_url = dev.avatar_url,
      bio = dev.bio,
      longitude = dev.location.coordinates[0],
      latitude = dev.location.coordinates[1]
    } = request.body;

    const techs = request.body.techs
      ? parseStringAsArray(request.body.techs)
      : dev.techs;

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    dev = await Dev.findOneAndUpdate(_id, {
      name,
      avatar_url,
      bio,
      location,
      techs
    });

    return response.json(dev);
  },

  async destroy(request, response) {
    const { id: _id } = request.params;

    let dev = await Dev.findOneAndDelete({ _id });

    return response.json(dev);
  }
};
