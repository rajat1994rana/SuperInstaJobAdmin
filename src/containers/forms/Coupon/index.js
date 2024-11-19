import React, { useState } from "react";
import propTypes from "prop-types";
import PreviewImage from "components/PerviewImage";
import { Colxx } from "components/common/CustomBootstrap";
import Loading from "components/Loading";
import "react-quill/dist/quill.snow.css";
import { Input, FormGroup, Label, Button, Form } from "reactstrap";

const CouponForm = ({
  onSubmit,
  handleInput,
  isEdit = false,
  loading,
  values,
}) => {
  const [viweImage, setViewImage] = useState(isEdit ? values.image : "");
  return (
    <>
      <Loading loading={loading} />
      <Form onSubmit={onSubmit}>
        <FormGroup row>
          <Colxx sm={6}>
            <FormGroup>
              <Label for='exampleEmailGrid'>Coupon Title</Label>
              <Input
                type='text'
                required={true}
                value={values.title}
                onChange={handleInput}
                name='title'
                placeholder='Coupon Title'
              />
            </FormGroup>
          </Colxx>

          <Colxx sm={6}>
            <FormGroup>
              <Label for='exampleEmailGrid'>Coupon Percentage</Label>
              <Input
                type='number'
                required={true}
                value={values.percentage}
                onChange={handleInput}
                name='percentage'
                placeholder='Percentage'
                min={1}
                max={100}
              />
            </FormGroup>
          </Colxx>

          <Colxx sm={6}>
            <FormGroup>
              <Label for='exampleEmailGrid'>Coupon code</Label>
              <Input
                type='test'
                required={true}
                value={values.code}
                onChange={handleInput}
                name='code'
                placeholder='Coupon code'
              />
            </FormGroup>
          </Colxx>

          <Colxx sm={6}>
            <FormGroup>
              <Label for='exampleEmailGrid'>Coupon Limit</Label>
              <Input
                type='number'
                required={true}
                value={values.couponUseLimit}
                onChange={handleInput}
                name='couponUseLimit'
                placeholder='Coupon Limit'
                min={1}
                max={100000}
              />
            </FormGroup>
          </Colxx>

          <Colxx sm={6}>
            <FormGroup>
              <Label for='examplePasswordGrid'>Image</Label>
              <Input
                type='file'
                onChange={(event) => {
                  handleInput(event);
                  setViewImage(URL.createObjectURL(event.target.files[0]));
                }}
                name='image'
                placeholder=''
                className='form-control'
              />
            </FormGroup>
          </Colxx>
          <Colxx sm={6}>
            <PreviewImage imageUrl={viweImage} />
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

CouponForm.prototype = {
  onSubmit: propTypes.func.isRequired,
  values: propTypes.object.isRequired,
  handleInput: propTypes.func.isRequired,
  loading: propTypes.bool.isRequired,
  isEdit: propTypes.bool,
};

export default CouponForm;
