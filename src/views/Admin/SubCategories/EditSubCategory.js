import React, { Fragment, useState, useReducer } from "react";
import { Colxx, Separator } from "components/common/CustomBootstrap";
import { Row, Card, CardBody, CardTitle } from "reactstrap";

import { editSubCategory } from "Apis/admin";
import SubCategoryForm from "containers/forms/SubCategoryForm";
import { NotificationManager } from "components/common/react-notifications";

const EditSubCategory = ({ history, location }) => {
  const reducer = (form, action) => {
    switch (action.key) {
      case action.key:
        return { ...form, [action.key]: action.value };
      default:
        throw new Error("Unexpected action");
    }
  };

  const initialState = { ...location.state.category };
  const [categoryForm, dispatch] = useReducer(reducer, initialState);
  const [loading, setIsLoading] = useState(false);

  const updateCategory = (event) => {
    event.preventDefault();
    setIsLoading(true);
    editSubCategory(categoryForm)
      .then(() => {
        history.push("/sub-categories");
        NotificationManager.success(
          "Sub Category Edit successfully",
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

  return (
    <Fragment>
      <Row>
        <Colxx xxs='12'>
          <h1>Edit Sub Category ({categoryForm.name})</h1>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row className='mb-4'>
        <Colxx xxs='12'>
          <Card>
            <CardBody>
              <CardTitle>Edit Sub Category</CardTitle>
              <SubCategoryForm
                onSubmit={updateCategory}
                loading={loading}
                isEdit
                CategoryForm={categoryForm}
                handleInput={handleInput}
              />
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </Fragment>
  );
};

export default EditSubCategory;
