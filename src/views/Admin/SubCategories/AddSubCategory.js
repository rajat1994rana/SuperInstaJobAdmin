import React, { Fragment, useState, useReducer } from "react";
import { Colxx, Separator } from "components/common/CustomBootstrap";
import { Row, Card, CardBody, CardTitle } from "reactstrap";

import { addSubCategory as AddNewSubCategory } from "Apis/admin";
import { initialState } from "./constants";
import SubCategoryForm from "containers/forms/SubCategoryForm";
import { NotificationManager } from "components/common/react-notifications";

const AddSubCategory = ({ history }) => {
  const reducer = (form, action) => {
    switch (action.key) {
      case action.key:
        return { ...form, [action.key]: action.value };
      default:
        throw new Error("Unexpected action");
    }
  };

  const [categoryForm, dispatch] = useReducer(reducer, initialState);
  const [loading, setIsLoading] = useState(false);

  const addCategory = (event) => {
    event.preventDefault();
    setIsLoading(true);
    AddNewSubCategory(categoryForm)
      .then(() => {
        history.push("/sub-categories");
        NotificationManager.success(
          "Sub Category added successfully",
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
            data.errorMessage,
            "Something went wrong",
            3000,
            null,
            null,
            ""
          );
        }
      });
  };

  const handleInput = (key, value) => {
    dispatch({ key, value });
  };

  return (
    <Fragment>
      <Row>
        <Colxx xxs='12'>
          <h1>Add Sub Category</h1>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row className='mb-4'>
        <Colxx xxs='12'>
          <Card>
            <CardBody>
              <CardTitle>Add Sub Category</CardTitle>
              <SubCategoryForm
                onSubmit={addCategory}
                loading={loading}
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

export default AddSubCategory;
