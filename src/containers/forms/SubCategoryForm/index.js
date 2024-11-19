import React, { useEffect, useState } from "react";
import propTypes from "prop-types";

import PerviewImage from "components/PerviewImage";
import { Colxx } from "components/common/CustomBootstrap";
import Loading from "components/Loading";
import "react-quill/dist/quill.snow.css";
import { Input, FormGroup, Label, Button, Form } from "reactstrap";
import { getCategory } from "Apis/admin";

const AddSubCategory = ({
  onSubmit,
  handleInput,
  isEdit = false,
  loading,
  CategoryForm,
}) => {
  const [viewImage, setViewImage] = useState(isEdit ? CategoryForm.image : "");

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
                value={CategoryForm.name}
                onChange={({ target }) => handleInput("name", target.value)}
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
                onChange={({ target }) =>
                  handleInput("categoryId", target.value)
                }
                required
                value={CategoryForm.categoryId}
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

          <Colxx sm={6}>
            <FormGroup>
              <Label for='examplePasswordGrid'>Image</Label>
              <Input
                type='file'
                onChange={({ target }) => {
                  handleInput("image", target.files[0]);
                  setViewImage(URL.createObjectURL(target.files[0]));
                }}
                name='image'
                placeholder=''
                className='form-control'
              />
            </FormGroup>
          </Colxx>
          <Colxx sm={6}>
            <PerviewImage imageUrl={viewImage} />
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

AddSubCategory.prototype = {
  onSubmit: propTypes.func.isRequired,
  CategoryForm: propTypes.object.isRequired,
  handleInput: propTypes.func.isRequired,
  loading: propTypes.bool.isRequired,
  isEdit: propTypes.bool,
};

export default AddSubCategory;
