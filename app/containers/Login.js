import React, { Component, PropTypes } from 'react'
import { View, WebView, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Actions, ActionConst } from 'react-native-router-flux'
import { userActionCreators } from '../redux'

import Storage from '../api/Storage'

const mapStateToProps = (state) => ({
  // take your state and put it into the props for this component
  isAuthenticating: state.user.isAuthenticating,
  accessToken: state.user.accessToken,
})

class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticating: PropTypes.bool,
    accessToken: PropTypes.string
  }

  constructor(props){
    super(props);
  }

  componentDidMount() {
    // start the auth process
    this.props.dispatch(userActionCreators.startAuthentication());
  }

  componentDidUpdate() {
    if(this.props.accessToken) {
      Actions.pop();
    }
  }

  // We watch for changes in navigation, because we asked Reddit to redirect us
  // to an arbitrary URL callback://login when the login has been completed.
  onNavigationStateChange = (navState) => {
    if (this.props.isAuthenticating && navState.url.indexOf('about://callback/login#') === 0) {
      // Regex shortcut to grab the access_token if the URL matches this format.
      const regex = /^about:\/\/callback\/login#access_token=(.+)&token/
      let accessToken = navState.url.match(regex)[1]
      // dispatch to store the token
      this.props.dispatch(userActionCreators.authSuccess(accessToken));

    }
  }

  render() {
    const REDDIT_APP_ID = 'Mcnxsc2BLOXi8w'
    const LOGIN_URL = `https://www.reddit.com/api/v1/authorize.compact?client_id=${REDDIT_APP_ID}&response_type=token&state=RANDOM_STRING&redirect_uri=about://callback/login&scope=read`
    return (
      <WebView
        source={{uri: LOGIN_URL}}
        onNavigationStateChange={this.onNavigationStateChange}
      />
    )
  }
}

export default connect(mapStateToProps)(Login)
