import React, { Fragment, useCallback, useState } from "react";
import { Colxx, Separator } from "components/common/CustomBootstrap";
import { Row, Card, CardBody, CardTitle } from "reactstrap";
import { addNewTag } from "Apis/admin";
import { NotificationManager } from "components/common/react-notifications";
import TagForm from "./TagForm";

const initialState = {
  name: "",
  categoryId: "",
};

const AddTags = ({ history }) => {
  const [formValues, setFormValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    addNewTag(formValues)
      .then(() => {
        history.push("/tags");
        NotificationManager.success("Tag added successfully", "Success", 3000);
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
          <h1>Add Tag</h1>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row className='mb-4'>
        <Colxx xxs='12'>
          <Card>
            <CardBody>
              <CardTitle>Add New Tag</CardTitle>
              <TagForm
                onSubmit={handleOnSubmit}
                loading={loading}
                values={formValues}
                handleInput={handleInput}
              />
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </Fragment>
  );
};

export default AddTags;
