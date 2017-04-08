import React, { Component } from 'react';
import cookie from 'react-cookie';
import './style.css';

const $ = window.jQuery || {};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: false,
      action: 'http://localhost:9000/api/login',
      method: 'POST',
      user: cookie.load('user') || { loggedin: false }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    $.ajax({
      url: this.state.action,
      method: 'POST',
      data: $('#loginForm').serialize()
    }).done(function(data) {
      if (data.error) {
        $('.new-user').append('<p class="error" style="color:red;">' + data.error + '</p>');
        cookie.save('user', {loggedin: false});
      } else {
        cookie.save('user', data);
        window.location = '/map';
      }
    }).fail(function(data) {
      console.log(data);
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (this.state.isNew) {
      this.setState({action: 'http://localhost:9000/api/login'});
    } else {
      this.setState({action: 'http://localhost:9000/api/create'});
    }
    this.setState({
      [name]: value
    });

  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row vertical-offset-100">
            <div className="col-md-4 col-md-offset-4">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">Please sign in or create account</h3>
                </div>
                <div className="panel-body">
                  <form action={this.state.action} method={this.state.method} onSubmit={this.handleSubmit} id="loginForm">
                    <fieldset>
                      <div className="form-group">
                        <input className="form-control" placeholder="e-mail" name="email" type="text" />
                      </div>
                      <div className="form-group">
                        <input className="form-control" placeholder="password" name="password" type="password" />
                      </div>
                      <input className="btn btn-lg btn-success btn-block" type="submit" value="Login" />
                    </fieldset>
                    <fieldset className="new-user">
                      <label htmlFor="isNew">
                        New User
                        <input type="checkbox" id="isNew" name="isNew" checked={this.state.isNew} onChange={this.handleInputChange} />
                      </label>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
