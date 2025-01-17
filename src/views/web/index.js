import React, { memo } from "react";
import {
  Redirect,
  Route,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";
import { checkAuth } from "utils/helper";
import Error from "views/error";

const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        checkAuth("userInfo") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

const WebView = React.lazy(() =>
  import(/* webpackChunkName: "profile" */ "./Profile")
);
const Login = React.lazy(() =>
  import(/* webpackChunkName: "login" */ "./Login")
);

const Admin = () => {
  return (
    <Router>
      <Switch>
        <Route expect path='/login' component={Login} />
        <Route path='/error' component={Error} />
        <AuthRoute path='/' component={WebView} />
      </Switch>
    </Router>
  );
};

export default memo(Admin);
