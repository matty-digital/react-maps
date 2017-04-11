const flat    = require('node-flat-db');
const storage = require('node-flat-db/file-async');
const path    = require('path');
const db      = flat(path.resolve(__dirname, 'db.json'), { storage: storage });

let user = {
  email: '',
  password: '',
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
    user.coords   = { lat: '40.440624', lng: '-79.995888' }

    if (email.length && password.length) {
      if (db('users').find({ email: email })) {
        res.send({error: 'email already exists'});
      } else {
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
    let userToGet = db('users').find({ email: email });

    if (userToGet) {
      user.email = userToGet.email;
      user.password = userToGet.password;
      user.loggedin = userToGet.loggedin;
      user.coords = userToGet.coords;
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
        coords: {
          lat: lat,
          lng: lng
        }
      })
      .value()
    res.send(user);
  }
}
