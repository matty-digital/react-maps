const flat    = require('node-flat-db');
const storage = require('node-flat-db/file-async');
const path    = require('path');
const db      = flat(path.resolve(__dirname, 'db.json'), { storage: storage });
const _       = require('lodash');

let user = {
  email: '',
  password: '',
  loggedin: false,
  coords: {
    lat: '',
    lng: ''
  }
};

module.exports = {
  createDo: (req, res) => {
    let email     = req.body.email;
    let password  = req.body.password;
    user.email    = email;
    user.password = password;
    user.coords   = { lat: 40.440624, lng: -79.995888 }

    res.cookie('user', user);

    if (email && email.length && password && password.length) {
      if (db('users').find({ email: email })) {
        user.loggedin = false;
        res.send({error: 'email already exists'});
      } else {
        user.loggedin = true;
        db('users')
          .push(user)
          .then(post => res.send(user));
      }
    } else {
      res.send({error: 'must provide email and or password'});
    }
  },
  loginDo: (req, res) => {
    let email     = req.body.email;
    let password  = req.body.password;
    let userToGet = db('users').find({ email: email, password: password });
    db('users')
      .chain()
      .find({ email: email })
      .assign({ loggedin: true})
      .value()

    if (userToGet) {
      user.email = userToGet.email;
      user.password = userToGet.password;
      user.loggedin = userToGet.loggedin;
      user.coords = userToGet.coords;
      res.cookie('user', user);
    } else {
      user = { error: 'this user does not exist' };
    }

    res.send(user);
  },
  logoutDo: (req, res) => {
    let email = user.email;
    let lat = req.query.lat;
    let lng = req.query.lng;
    db('users')
      .chain()
      .find({ email: email })
      .assign({
        loggedin: false,
        coords: {
          lat: lat,
          lng: lng
        }
      })
      .value()
    res.send(user);
  }
}
