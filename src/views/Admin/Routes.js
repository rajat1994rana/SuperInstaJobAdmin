import React, { Component, Suspense } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AppLayout from "layout/AppLayout";

const Default = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ "./dashboards/default")
);
const Users = React.lazy(() =>
  import(/* webpackChunkName: "users" */ "./users")
);
const Freelancer = React.lazy(() =>
  import(/* webpackChunkName: "Freelancer" */ "./Freelancer")
);
const AddFreelancer = React.lazy(() =>
  import(/* webpackChunkName: "Add-freelancer" */ "./Freelancer/AddFreelancer")
);
const EditFreelancer = React.lazy(() =>
  import(
    /* webpackChunkName: "edit-freelancer" */ "./Freelancer/EditFreelencer"
  )
);
const FreelancerDetails = React.lazy(() =>
  import(
    /* webpackChunkName: "freelancer-details" */ "./Freelancer/FreelencerDetails"
  )
);
const Push = React.lazy(() =>
  import(/* webpackChunkName: "add class" */ "./push")
);
const UserDetails = React.lazy(() =>
  import(/* webpackChunkName: "user Details" */ "./userDetails")
);
const AppInformation = React.lazy(() =>
  import(/* webpackChunkName: "app-info" */ "./AppInformations")
);
const AddUser = React.lazy(() =>
  import(/* webpackChunkName: "add-users" */ "./Users/AddUser")
);
const EditUser = React.lazy(() =>
  import(/* webpackChunkName: "edit-group" */ "./Users/EditUser")
);
const Profile = React.lazy(() =>
  import(/* webpackChunkName: "admin-profile" */ "./profile")
);

const AppSetting = React.lazy(() =>
  import(/* webpackChunkName: "package" */ "./AppSettings")
);

const Bookings = React.lazy(() =>
  import(/* webpackChunkName: "bookings" */ "./Bookings")
);

const Categories = React.lazy(() =>
  import(/* webpackChunkName: "Category" */ "./Categories")
);
const AddCategory = React.lazy(() =>
  import(/* webpackChunkName: "Add-category" */ "./Categories/AddCategory")
);
const EditCategory = React.lazy(() =>
  import(/* webpackChunkName: "edit-category" */ "./Categories/EditCategory")
);

const Coupons = React.lazy(() =>
  import(/* webpackChunkName: "coupons" */ "./Coupons")
);
const AddCoupon = React.lazy(() =>
  import(/* webpackChunkName: "Add-coupon" */ "./Coupons/AddCoupon")
);
const EditCoupon = React.lazy(() =>
  import(/* webpackChunkName: "edit-coupon" */ "./Coupons/EditCoupon")
);

const SubCategories = React.lazy(() =>
  import(/* webpackChunkName: "sub-categories" */ "./SubCategories")
);
const AddSubCategories = React.lazy(() =>
  import(
    /* webpackChunkName: "add-sub-categories" */ "./SubCategories/AddSubCategory"
  )
);
const EditSubCategory = React.lazy(() =>
  import(
    /* webpackChunkName: "edit-sub-categories" */ "./SubCategories/EditSubCategory"
  )
);

const Tags = React.lazy(() => import(/* webpackChunkName: "tags" */ "./Tags"));
const AddTag = React.lazy(() =>
  import(/* webpackChunkName: "add-tag" */ "./Tags/AddTags")
);
const EditTag = React.lazy(() =>
  import(/* webpackChunkName: "edit-tag" */ "./Tags/EditTags")
);

class App extends Component {
  render() {
    return (
      <AppLayout>
        <div className='dashboard-wrapper animate__animated  animate__zoomIn'>
          <Suspense fallback={<div className='loading' />}>
            <Switch>
              <Redirect exact from={`/`} to={`/dashboards`} />
              <Route
                exact
                path='/dashboards'
                render={(props) => <Default {...props} />}
              />
              <Route
                path='/users/:status?'
                render={(props) => <Users {...props} />}
              />
              <Route path='/push' render={(props) => <Push {...props} />} />
              <Route
                path={`/user-details`}
                render={(props) => <UserDetails {...props} />}
              />
              <Route path='/add-user' component={AddUser} />
              <Route path='/edit-user' component={EditUser} />
              <Route path='/freelancers/:status?' component={Freelancer} />
              <Route path='/edit-freelancer' component={EditFreelancer} />
              <Route path='/add-freelancer' component={AddFreelancer} />
              <Route path='/app-settings' component={AppSetting} />
              <Route path='/freelancer-details' component={FreelancerDetails} />
              <Route path='/edit-user' component={EditUser} />
              <Route path='/profile' component={Profile} />
              <Route path='/categories' component={Categories} />
              <Route path='/edit-category' component={EditCategory} />
              <Route path='/add-category' component={AddCategory} />
              <Route path='/coupons' component={Coupons} />
              <Route path='/edit-coupon' component={EditCoupon} />
              <Route path='/add-coupon' component={AddCoupon} />
              <Route path='/sub-categories' component={SubCategories} />
              <Route path='/add-sub-category' component={AddSubCategories} />
              <Route path='/edit-sub-category' component={EditSubCategory} />
              <Route path='/tags' component={Tags} />
              <Route path='/edit-tag' component={EditTag} />
              <Route path='/add-tag' component={AddTag} />

              <Route path='/bookings/:status?' component={Bookings} />

              <Route
                path='/app-information'
                render={(props) => <AppInformation {...props} />}
              />
              <Redirect to='/error' />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
