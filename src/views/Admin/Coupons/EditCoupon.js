import React, { Fragment, useState, useCallback } from "react";
import { Colxx, Separator } from "components/common/CustomBootstrap";
import { Row, Card, CardBody, CardTitle } from "reactstrap";
import { updateCoupon } from "Apis/admin";
import { NotificationManager } from "components/common/react-notifications";
import CouponForm from "containers/forms/Coupon";

const EditCoupon = ({ history, location }) => {
  const initialState = { ...location.state.coupon };
  const [formValues, setFormValues] = useState(initialState);
  const [loading, setIsLoading] = useState(false);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    updateCoupon(formValues)
      .then(() => {
        history.push("/coupons");
        NotificationManager.success(
          "Coupon Edit successfully",
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

  const handleInput = useCallback(({ target: { name, value, files } }) => {
    setFormValues((currState) => ({
      ...currState,
      [name]: files?.[0] ?? value,
    }));
  }, []);

  return (
    <Fragment>
      <Row>
        <Colxx xxs='12'>
          <h1>Edit Coupon ({formValues.title})</h1>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row className='mb-4'>
        <Colxx xxs='12'>
          <Card>
            <CardBody>
              <CardTitle>Edit Coupon</CardTitle>
              <CouponForm
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

export default EditCoupon;
