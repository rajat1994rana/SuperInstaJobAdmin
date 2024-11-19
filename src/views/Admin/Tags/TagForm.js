import React, { useEffect, useState } from "react";
import propTypes from "prop-types";

import { Colxx } from "components/common/CustomBootstrap";
import Loading from "components/Loading";
import "react-quill/dist/quill.snow.css";
import { Input, FormGroup, Label, Button, Form } from "reactstrap";
import { getCategory } from "Apis/admin";

const TagForm = ({
  onSubmit,
  handleInput,
  isEdit = false,
  loading,
  values,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategory({ limit: 1000, page: 1 })
      .then(({ data }) => {
        setCategories(data?.data?.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <Form onSubmit={onSubmit}>
        <FormGroup row>
          <Colxx sm={6}>
            <FormGroup>
              <Label for='exampleEmailGrid'>Name</Label>
              <Input
                type='text'
                required={true}
                value={values.name}
                onChange={handleInput}
                name='name'
                placeholder='Name'
              />
            </FormGroup>
          </Colxx>

          <Colxx sm={6}>
            <FormGroup>
              <Label for='exampleEmailGrid'>Select Category</Label>
              <select
                className='form-control'
                name='categoryId'
                onChange={handleInput}
                required
                value={values.categoryId}
              >
                <option value='null'>--Select Category--</option>
                {categories?.map(({ id, name }) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </select>
            </FormGroup>
          </Colxx>
        </FormGroup>

        <Button
          disabled={loading}
          type='submit'
          className={`btn-shadow btn-multiple-state ${
            loading ? "show-spinner" : ""
          }`}
          color='primary'
        >
          {isEdit ? "Update" : "Save"}
        </Button>
      </Form>
    </>
  );
};

TagForm.prototype = {
  onSubmit: propTypes.func.isRequired,
  values: propTypes.object.isRequired,
  handleInput: propTypes.func.isRequired,
  loading: propTypes.bool.isRequired,
  isEdit: propTypes.bool,
};

export default TagForm;
