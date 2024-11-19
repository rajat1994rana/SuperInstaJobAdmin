import React, { Fragment, useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "reactstrap";

import StatusUpdate from "components/UpdateStatus";
import Rating from "components/common/Rating";
import ReactLoading from "components/Loading";
import ImagePreView from "components/PerviewImage/ModalView";
import { getUserProof } from "Apis/admin";
import { documentTypes, tabs } from "./constants";
import ImageView from "components/ImageView";
import { convertDate } from "constants/defaultValues";

const ProviderDetails = (props) => {
  const [userDetails, setUserDetails] = useState({
    ...props.location.state.freelancer,
  });
  const [rating] = useState(0);
  const [imagePath, setImagePath] = useState("");
  const [viewImage, setViewImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [proofList, setProofList] = useState([]);

  useEffect(() => {
    setLoading(true);
    getUserProof(userDetails?.id)
      .then(({ data }) => {
        setLoading(false);
        setProofList(data?.data?.proofList ?? []);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [userDetails?.id]);

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <h1 style={{ paddingTop: "31px" }}> Freelancer Details </h1>
        </CardHeader>
      </Card>
      <ul className='nav nav-tabs mb-5 mt-4'>
        {tabs.map(({ name, key }) => (
          <li className='nav-item' key={key} onClick={() => setActiveTab(key)}>
            <span
              className={`nav-link ${activeTab === key ? "active" : ""}`}
              href='#'
            >
              {name}
            </span>
          </li>
        ))}
      </ul>

      <ReactLoading loading={loading} />
      {activeTab === "usersDetails" && (
        <>
          <Card className='mb-5 pb-5'>
            <CardBody>
              <div>
                <b> Name </b>: {userDetails.name}
              </div>
              <hr />
              <div>
                <b> Email </b>: {userDetails.email}
              </div>
              <hr />
              <div>
                <b> Phone </b>: {userDetails.phone}
              </div>
              <hr />

              <div>
                <b> Location </b>:{" "}
                {`${userDetails.country} ${userDetails.city} ${userDetails.state}`}
              </div>
              <hr />

              <div className='d-flex'>
                <b className='mr-3'> Rating: </b>{" "}
                <Rating interactive={false} total={5} rating={rating} />
              </div>
              <hr />

              <div>
                <b> Document verify </b> : - &nbsp;
                <StatusUpdate
                  statusMessage={{
                    0: "Not Approved (click to Approve)",
                    1: "Approved",
                  }}
                  table='users'
                  onUpdate={(data) =>
                    setUserDetails({ ...userDetails, ...data })
                  }
                  data={userDetails}
                  updateKey='isDocumentVerify'
                  isButton
                />
              </div>

              <hr />
              <div>
                <b> Freelancer Status </b> : - &nbsp;
                <StatusUpdate
                  statusMessage={{
                    0: "Inactive",
                    1: "Active",
                  }}
                  table='users'
                  onUpdate={(data) =>
                    setUserDetails({ ...userDetails, ...data })
                  }
                  data={userDetails}
                  updateKey='status'
                  isButton
                />
              </div>

              <hr />
              <div>
                <b> Profile </b> :{" "}
                <img
                  onClick={() => {
                    setImagePath(userDetails.profile);
                    setViewImage(true);
                  }}
                  alt={userDetails.first_name}
                  src={userDetails.profile}
                  className='list-thumbnail responsive border-0 card-img-left'
                />
              </div>
            </CardBody>
          </Card>
        </>
      )}
      {activeTab === "documents" && (
        <>
          <Card className='mb-5'>
            <CardHeader>
              <div className='d-flex justify-content-between align-items-center'>
                <h3 className='mt-3'>Provider Documents</h3>
                <StatusUpdate
                  statusMessage={{
                    0: "Not Approved (click to Approve)",
                    1: "Approved",
                  }}
                  table='users'
                  onUpdate={(data) =>
                    setUserDetails({ ...userDetails, ...data })
                  }
                  data={userDetails}
                  updateKey='isDocumentVerify'
                  isButton
                />
              </div>
            </CardHeader>
            <CardBody>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Document</th>
                    <th>Expire Date</th>
                    <th>Identify Id</th>
                  </tr>
                </thead>
                <tbody>
                  {proofList?.map((proof, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{documentTypes[proof?.type]}</td>
                      <td>
                        <ImageView
                          onClick={() => {
                            setImagePath(proof.attachment);
                            setViewImage(true);
                          }}
                          name={documentTypes[proof?.type]}
                          imageURL={proof.attachment}
                          className='list-thumbnail responsive border-0 card-img-left'
                        />
                      </td>
                      <td>{convertDate(proof?.expireDate)}</td>
                      <td>{proof?.identifyId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </>
      )}

      <span pb-5 />
      <ImagePreView
        imagePath={imagePath}
        showModel={viewImage}
        onClose={(value) => setViewImage(value)}
      />
    </Fragment>
  );
};

export default ProviderDetails;
