import React, { Fragment, useState, useReducer, useCallback } from "react";
import {
  Row,
  Card,
  CardBody,
  Nav,
  NavItem,
  TabPane,
  CardTitle,
} from "reactstrap";
import swal from "sweetalert";
import { NavLink, Redirect } from "react-router-dom";
import classnames from "classnames";
import StatusUpdate from "components/UpdateStatus";
import { Colxx } from "components/common/CustomBootstrap";
import SingleLightbox from "components/pages/SingleLightbox";
import WebNav from "containers/navs/WebNav";
import axios from "axios";

const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [PerviewImage] = useState(userInfo.profile || "/assets/img/logo.png");
  const [redirect, setRedirect] = useState(false);

  const reducer = (form, action) => {
    switch (action.key) {
      case action.key:
        return { ...form, [action.key]: action.value };
      default:
        throw new Error("Unexpected action");
    }
  };
  userInfo.password = "empty";
  userInfo.image = "";

  const [adminDetails] = useReducer(reducer, userInfo);

  const handleAccountRemove = useCallback(() => {
    swal({
      title: `Are you sure you want to remove your account?`,
      icon: "warning",
      dangerMode: true,
      buttons: ["No", "Yes"],
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${window.location.origin}/apis/v1/user/user-account-delete`,
            {
              headers: {
                Authorization: userInfo?.authorizationKey,
              },
            }
          )
          .then(() => {
            swal("Account have been deleted", {
              icon: "success",
            });
            window.localStorage.clear();
            setRedirect(true);
          })
          .catch((err) => {
            swal("Something went wrong", {
              icon: "error",
            });
          });
      } else {
        swal("Process Cancel");
      }
    });
  }, [userInfo?.authorizationKey]);

  if (redirect) {
    return <Redirect to='/login' />;
  }

  return (
    <Fragment>
      <Row className='container ml-5  mr-5 '>
        <WebNav />
        <div className='mt-5' />

        <Colxx xxs='12 mt-5'>
          <Nav tabs className='separator-tabs ml-0 mb-5'>
            <NavItem>
              <NavLink
                className={classnames({
                  active: 1,
                  "nav-link": true,
                })}
                location={{}}
                to='#'
              ></NavLink>
            </NavItem>
          </Nav>

          <TabPane tabId='1'>
            <h1 className='mt-3'>Hey {userInfo.name} </h1>
            <Row>
              <Colxx xxs='12' lg='4' className='mb-4 col-left'>
                <Card className='mb-4'>
                  <div className='position-absolute card-top-buttons'></div>
                  <SingleLightbox
                    thumb={PerviewImage}
                    large={PerviewImage}
                    className='card-img-top'
                  />

                  <CardBody>
                    <p className='text-muted text-small mb-2'>
                      {adminDetails.name}
                    </p>
                    <p className='mb-3'>User Profile</p>
                  </CardBody>
                </Card>
              </Colxx>
              <Colxx xxs='12' lg='8' className='mb-4 col-right'>
                <Row>
                  {
                    <Colxx xxs='12' lg='12' xl='12' className='mb-12'>
                      <Card>
                        <CardBody>
                          <CardTitle>Profile</CardTitle>
                          <Row className='mb-4'>
                            <Colxx xxs='12'>
                              <Card>
                                <CardBody>
                                  <CardTitle>User Details</CardTitle>

                                  <div className='remove-last-border remove-last-margin remove-last-padding'>
                                    <div>
                                      <b> Name </b> : {adminDetails.name}{" "}
                                    </div>
                                    <hr />
                                    <div>
                                      <b> Email </b> : {adminDetails.email}
                                    </div>
                                    <hr />
                                    <div>
                                      <b> Phone </b> : {adminDetails.phone}
                                    </div>
                                    <hr />

                                    <div>
                                      <b> Status </b> :{" "}
                                      <StatusUpdate
                                        table='users'
                                        onUpdate={(data) =>
                                          (adminDetails.status =
                                            adminDetails.status === 1 ? 0 : 1)
                                        }
                                        data={adminDetails}
                                      />
                                    </div>
                                    <hr />
                                  </div>
                                </CardBody>
                              </Card>
                              <div className='d-flex justify-content-end'>
                                <button
                                  onClick={handleAccountRemove}
                                  className='btn btn-primary mt-4 flex-end'
                                >
                                  {" "}
                                  Remove Account
                                </button>
                              </div>
                            </Colxx>
                          </Row>
                        </CardBody>
                      </Card>
                    </Colxx>
                  }
                </Row>
              </Colxx>
            </Row>
          </TabPane>
        </Colxx>
      </Row>
    </Fragment>
  );
};

export default Profile;
