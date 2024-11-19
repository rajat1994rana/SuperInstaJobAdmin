import React, { Fragment, useState } from "react";
import { Card, CardHeader, CardBody } from "reactstrap";

import StatusUpdate from "components/UpdateStatus";
import ImagePreView from "components/PerviewImage/ModalView";

const UserDetails = (props) => {
  const [userDetails, setUserDetails] = useState({
    ...props.location.state.user,
  });

  const [viewImage, setViewImage] = useState(false);
  const [imagePath, setImagePath] = useState("");

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <h1 style={{ paddingTop: "31px" }}> User Details </h1>
        </CardHeader>
      </Card>

      <CardBody>
        <div>
          <b> Name </b> : {userDetails.name}
        </div>
        <hr />
        <div>
          <b> Email </b> : {userDetails.email}
        </div>
        <hr />
        <div>
          <b> Phone </b> : {userDetails.phone}
        </div>
        <hr />

        <div>
          <b> Address </b> :{" "}
          {`${userDetails.country} ${userDetails.city} ${userDetails.state}`}
        </div>
        <hr />

        <div>
          <b> Profile </b> :{" "}
          <img
            onClick={() => {
              setImagePath(userDetails.profile);
              setViewImage(true);
            }}
            alt={userDetails.name}
            src={userDetails.profile}
            className='list-thumbnail responsive border-0 card-img-left'
          />
        </div>
        <hr />
        <div>
          <b> Status </b> : - &nbsp;
          <StatusUpdate
            table='users'
            onUpdate={(data) => setUserDetails({ ...userDetails, ...data })}
            data={userDetails}
            updateKey='status'
            isButton
          />
        </div>
      </CardBody>

      <hr className='pb-5' />

      <ImagePreView
        imagePath={imagePath}
        showModel={viewImage}
        onClose={(value) => setViewImage(value)}
      />
    </Fragment>
  );
};

export default UserDetails;
