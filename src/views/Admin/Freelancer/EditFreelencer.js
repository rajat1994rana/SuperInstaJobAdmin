import React, { Fragment, useState, useReducer, useMemo } from "react";
import { Colxx, Separator } from "components/common/CustomBootstrap";
import { Row, Card, CardBody, CardTitle } from "reactstrap";
import { Redirect } from "react-router-dom";
import { editUserData } from "Apis/admin";
import UserForm from "containers/Users";
import Loading from "components/Loading";
import { NotificationManager } from "components/common/react-notifications";

const EditFreelencer = (props) => {
  const reducer = (form, action) => {
    switch (action.key) {
      case action.key:
        return { ...form, [action.key]: action.value };
      default:
        throw new Error("Unexpected action");
    }
  };

  const editUser = useMemo(() => {
    const userInfo = { ...props.location.state.freelancer };
    delete userInfo.password;
    return userInfo;
  }, [props.location.state.freelancer]);

  const [userForm, dispatch] = useReducer(reducer, editUser);
  const [loading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const addUserForm = (event) => {
    event.preventDefault();
    setIsLoading(true);
    editUserData(userForm)
      .then(() => {
        setRedirect(true);
        NotificationManager.success(
          "Freelancer Edit successfully",
          "Success",
          3000,
          null,
          null,
          ""
        );
      })
      .catch((err) => {
        if (err.response) {
          const { data } = err.response;
          NotificationManager.warning(
            data.error_message,
            "Something went wrong",
            3000,
            null,
            null,
            ""
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInput = (key, value) => {
    dispatch({ key, value });
  };

  if (redirect) {
    return <Redirect to='/freelancers' />;
  }
  return (
    <Fragment>
      <Row>
        <Colxx xxs='12'>
          <h1>Edit Freelancer ({userForm?.name})</h1>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row className='mb-4'>
        <Colxx xxs='12'>
          <Card>
            <CardBody>
              <CardTitle>Edit Freelancer</CardTitle>
              <Loading loading={loading} />
              <UserForm
                onSubmit={addUserForm}
                loading={loading}
                userForm={userForm}
                isEdit
                handleInput={handleInput}
              />
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </Fragment>
  );
};

export default EditFreelencer;
