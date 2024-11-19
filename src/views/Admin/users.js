import React, { Fragment, useState, useEffect, useRef } from "react";
import { Row, Col } from "reactstrap";
import ListPageHeading from "containers/pages/ListPageHeading";
import { CSVLink } from "react-csv";
import Pagination from "containers/pages/Pagination";
import ImagePreView from "components/PerviewImage/ModalView";
import StatusUpdate from "components/UpdateStatus";
import { users } from "Apis/admin";
import { NotificationManager } from "components/common/react-notifications";
import { Link } from "react-router-dom";
import ReactLoading from "components/Loading";
import DeleteData from "components/DeleteData";
import { convertDate } from "constants/defaultValues";
import useDebouncedCallback from "hooks/usedebouncedcallback";
import ImageView from "components/ImageView";

const additional = {
  currentPage: 1,
  totalItemCount: 0,
  totalPage: 1,
  search: "",
  pageSizes: [10, 20, 50, 100],
};

const Users = React.memo((props) => {
  const CsvRef = useRef(null);

  const [pageInfo, setPageInfo] = useState(additional);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(undefined);
  const [viewImage, setViewImage] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    users({
      search: searchText,
      status: props.match?.params?.status ?? "0,1",
      userType: 0,
      limit: selectedPageSize,
      page: currentPage,
    })
      .then(({ data }) => {
        const { pagination } = data.data;
        setUserList(data.data?.data);
        additional.totalItemCount = pagination.totalRecord;
        additional.selectedPageSize = pagination.limit;
        additional.totalPage = pagination.totalPage;
        setPageInfo({ ...additional });
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
        setLoading(false);
      });
  }, [selectedPageSize, currentPage, searchText, props.match?.params?.status]);

  const onSearchKey = useDebouncedCallback(({ target: { value } }) => {
    setSearchText(value);
  });

  const changePageSize = (value) => {
    setIsLoading(true);
    setSelectedPageSize(value);
  };

  const onChangePage = (value) => {
    setCurrentPage(value);
  };

  const DeleteDataLocal = (key) => {
    userList.splice(key, 1);
    setUserList([...userList]);
  };

  const updateLocal = (value, key) => {
    userList[key] = value;
    setUserList([...userList]);
  };

  const handleClick = () => {
    setLoading(true);
    users(1, 1000, "", props.match?.params?.status || "")
      .then((res) => {
        const { data } = res;
        const { result } = data.data;
        setLoading(false);
        const final = result.map((value) => {
          return {
            "User Name": value.name,
            "User Email": value.email,
            "User Phone": value.phone,
            "User status": { 0: "Inactive", 1: "Active" }[value.status],
            "Profile Created": convertDate(value.created),
          };
        });
        setCsvData(final);
        CsvRef.current.link.click();
      })
      .catch((err) => {
        setLoading(false);
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
      });
  };
  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;
  return isLoading ? (
    <div className='loading' />
  ) : (
    <Fragment>
      <CSVLink
        data={csvData}
        filename={`users-record.csv`}
        style={{ display: "none" }}
        ref={CsvRef}
      >
        Download
      </CSVLink>

      <ListPageHeading
        onClick={() => props.history.push("/add-user")}
        addShow
        Addname='+ Add New User'
        match={props.match}
        heading='Users'
        changePageSize={changePageSize}
        selectedPageSize={selectedPageSize}
        totalItemCount={pageInfo.totalItemCount}
        startIndex={startIndex}
        endIndex={endIndex}
        onSearchKey={onSearchKey}
        orderOptions={pageInfo.orderOptions}
        pageSizes={pageInfo.pageSizes}
      />
      <ReactLoading loading={loading} />
      <Row className='mb-4'>
        <Col md='9'></Col>
        <Col md='3'>
          <button className='btn btn-info ml-5 mt-4' onClick={handleClick}>
            <i className='simple-icon-arrow-down-circle mr-2'></i>Download CSV
          </button>
        </Col>
      </Row>
      <table className='table table-striped animate__animated  animate__zoomIn animate__fadeInDown mb-5'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Profile</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Joining Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>
                <Link
                  to={{
                    pathname: "/user-details",
                    state: { user },
                  }}
                  className='d-flex'
                >
                  {" "}
                  {user.name}
                </Link>
              </td>
              <td>
                <ImageView
                  onClick={() => {
                    setImagePath(user.profile);
                    setViewImage(true);
                  }}
                  name={user.name}
                  imageURL={user.profile}
                  className='list-thumbnail responsive border-0 card-img-left'
                />
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <StatusUpdate
                  data={user}
                  table='users'
                  statusMessage={{
                    0: "Inactive",
                    1: "Active",
                  }}
                  updateKey='status'
                  onUpdate={() => updateLocal(key)}
                  isButton
                />
              </td>
              <td>{convertDate(user.created)}</td>
              <td>
                <Link
                  to={{
                    pathname: "/user-details",
                    state: { user },
                  }}
                  className='btn btn-primary btn-sm'
                >
                  View
                </Link>{" "}
                <Link
                  to={{
                    pathname: "/edit-user",
                    state: { user },
                  }}
                  className='btn btn-info btn-sm'
                >
                  Edit
                </Link>{" "}
                <DeleteData
                  classes='btn-sm'
                  table='users'
                  data={user.id}
                  ondelete={() => DeleteDataLocal(key)}
                >
                  Delete
                </DeleteData>
              </td>
            </tr>
          ))}
          {userList.length === 0 && (
            <tr className='no-record-tr'>
              <td colSpan='8'>
                <h2 className='no-record'>No record Found</h2>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ImagePreView
        imagePath={imagePath}
        showModel={viewImage}
        onClose={(value) => setViewImage(value)}
      />
      <Pagination
        currentPage={currentPage}
        totalPage={pageInfo.totalPage}
        onChangePage={(i) => onChangePage(i)}
      />
    </Fragment>
  );
});

export default Users;
