import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import cookie from 'react-cookie';

const $ = window.jQuery || {};

const GoogleMapElement = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapMounted}
    zoom={props.zoom}
    center={props.center}
    onCenterChanged={props.onCenterChanged}
    onClick={props.onMapClick}
  >
    <Marker
      defaultPosition={props.center}
      title="Click to zoom"
      onClick={props.onMarkerClick}
    />
  </GoogleMap>
));

const INITIAL_CENTER = { lat: 40.440624, lng: -79.995888 };

class GoogleMapHandling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 10,
      center: INITIAL_CENTER,
      user: cookie.load('user') || { loggedin: false },
      coords: { INITIAL_CENTER }
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleMapMounted = this.handleMapMounted.bind(this);
    this.handleCenterChanged = this.handleCenterChanged.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  handleMapMounted(map) {
    this._map = map;
  }

  handleMapClick() {
    let lat = this._map.getCenter().lat();
    let lng = this._map.getCenter().lng();
    this.setState({
      user: {
        email: this.state.user.email,
        password: this.state.user.password,
        loggedin: true,
        coords: {
          lat: lat,
          lng: lng
        }
      },
      coords: {
        lat: lat,
        lng: lng
      }
    });
    cookie.save('user', this.state.user);
  }

  handleMarkerClick() {
    this.setState({
      zoom: 18,
    });
  }

  handleLogout(event) {
    event.preventDefault();
    $.ajax({
      url: 'http://localhost:9000/api/logout?lat=' + this.state.user.coords.lat + '&lng=' + this.state.user.coords.lng,
      method: 'POST'
    }).done(function(data) {
      cookie.save('user', {loggedin: false});
      window.location = '/';
    }).fail(function(data) {
      console.log(data);
    });
  }

  handleCenterChanged() {
    const nextCenter = this._map.getCenter();
    if (nextCenter.equals(new window.google.maps.LatLng(INITIAL_CENTER))) {
      return;
    }
    this.setState({
      center: nextCenter,
    });
  }

  render() {
    if (this.state.user.loggedin === true) {
      return (
        <div className="container">
          <div className="row vertical-offset-100">
            <div className="col-md-4 col-md-offset-4">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">click to change location, then log out to save</h3>
                </div>
                <div className="panel-body">
                  <h2>LOCATION</h2>
                  <p>{this.state.coords.lat} {this.state.coords.lng}</p>
                  <GoogleMapElement
                    containerElement={
                      <div style={{ height: `300px` }}></div>
                    }
                    mapElement={
                      <div style={{ height: `300px` }}></div>
                    }
                    zoom={this.state.zoom}
                    center={this.state.center}
                    onMapMounted={this.handleMapMounted}
                    onCenterChanged={this.handleCenterChanged}
                    onMarkerClick={this.handleMarkerClick}
                    onMapClick={this.handleMapClick}
                  />
                </div>
              </div>
            </div>
          </div>
          <fieldset>
            <form id="logoutform" action="http://localhost:9000/api/logout" onSubmit={this.handleLogout} method="POST">
              <input type="submit" value="Log Out" />
            </form>
          </fieldset>
        </div>
      );
    } else {
      return(
        <div className="container">
          <div className="row vertical-offset-100">
            <div className="col-md-4 col-md-offset-4">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">log in to change location</h3>
                </div>
                <div className="panel-body">
                  <h2>LOCATION</h2>
                  <p>Please Login <a href="/">Here</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default GoogleMapHandling;
