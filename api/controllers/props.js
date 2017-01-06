'use strict';

const resource = {
  create(req, res) {
    res
      .status(201)
      .send({
        body: req.body.body,
      });
  }
}

module.exports = {
  create: resource.create,
};
