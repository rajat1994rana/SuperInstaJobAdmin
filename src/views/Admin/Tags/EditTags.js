import React, { Fragment, useCallback, useMemo, useState } from "react";

import { Colxx, Separator } from "components/common/CustomBootstrap";
import { Row, Card, CardBody, CardTitle } from "reactstrap";
import { updateTag } from "Apis/admin";
import { NotificationManager } from "components/common/react-notifications";
import TagForm from "./TagForm";

const EditTags = ({ history, location }) => {
  const initialState = useMemo(
    () => ({ ...location.state.tag }),
    [location.state.tag]
  );

  const [formValues, setFormValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    updateTag(formValues)
      .then(() => {
        history.push("/tags");
        NotificationManager.success(
          "Tag updated successfully",
          "Success",
          3000
        );
      })
      .catch((err) => {
        if (err.response) {
          const { data } = err.response;
          NotificationManager.warning(
            data.error_message,
            "Something went wrong",
            3000
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInput = useCallback(({ target: { name, value } }) => {
    setFormValues((currState) => ({
      ...currState,
      [name]: value,
    }));
  }, []);

  return (
    <Fragment>
      <Row>
        <Colxx xxs='12'>
          <h1>Edit Tag</h1>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row className='mb-4'>
        <Colxx xxs='12'>
          <Card>
            <CardBody>
              <CardTitle>Edit Tag ({formValues.name})</CardTitle>
              <TagForm
                onSubmit={handleOnSubmit}
                loading={loading}
                values={formValues}
                handleInput={handleInput}
                isEdit
              />
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </Fragment>
  );
};

export default EditTags;
