import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Row, Col } from "reactstrap";
import ListPageHeading from "containers/pages/ListPageHeading";
import Pagination from "containers/pages/Pagination";
import { CSVLink } from "react-csv";
import ImagePreView from "components/PerviewImage/ModalView";
import { users } from "Apis/admin";
import { NotificationManager } from "components/common/react-notifications";
import { Link } from "react-router-dom";
import ReactLoading from "components/Loading";
import DeleteData from "components/DeleteData";
import { convertDate } from "constants/defaultValues";
import StatusUpdate from "components/UpdateStatus";
import { additional, gender } from "./constants";
import ImageView from "components/ImageView";

const Freelancer = (props) => {
  const CsvRef = useRef(null);
  const [pageInfo, setPageInfo] = useState(additional);
  const [userLists, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchtext] = useState(undefined);
  const [viewImage, setViewImage] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    users({
      search: searchText,
      status: props.match?.params?.status ?? "0,1",
      userType: 1,
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

  const onSearchKey = (event) => {
    setSearchtext(event.target.value);
  };

  const changePageSize = (value) => {
    setIsLoading(true);
    setSelectedPageSize(value);
  };

  const onChangePage = (value) => {
    setCurrentPage(value);
  };

  const deleteDataLocal = useCallback((key) => {
    setUserList((currState) => {
      const userCopy = JSON.parse(JSON.stringify(currState));
      userCopy.splice(key, 1);
      return userCopy;
    });
  }, []);

  const updateLocal = (value, key) => {
    setUserList((currState) => {
      const userCopy = JSON.parse(JSON.stringify(currState));
      userCopy[key] = value;
      return userCopy;
    });
  };

  const handleClick = () => {
    setLoading(true);
    users({
      search: searchText,
      status: props.match?.params?.status ?? "0,1",
      userType: 1,
      limit: 1000,
      page: 1,
    })
      .then((res) => {
        const { data } = res;
        const { result } = data.data;
        setLoading(false);
        const final = result.map((value) => {
          return {
            "Freelancer Name": value.name,
            "Freelancer Email": value.email,
            "Freelancer Phone": value.phone,
            "Freelancer gender": gender[value.gender],
            "Freelancer status": { 0: "Inactive", 1: "Active" }[value.status],
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
        filename={`freelancer-record.csv`}
        style={{ display: "none" }}
        ref={CsvRef}
      >
        Download
      </CSVLink>
      <ListPageHeading
        onClick={() => props.history.push("/add-freelancer")}
        addShow
        Addname='+ Add New Freelancer'
        match={props.match}
        heading='Freelancers'
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
      <table className='table table-striped animate__animated  animate__zoomIn animate__fadeInDown'>
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
          {userLists.map((freelancer, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>
                <Link
                  to={{
                    pathname: "/freelancer-details",
                    state: { freelancer },
                  }}
                  className='d-flex'
                >
                  {" "}
                  {freelancer.name}
                </Link>
              </td>
              <td>
                <ImageView
                  onClick={() => {
                    setImagePath(freelancer.profile);
                    setViewImage(true);
                  }}
                  name={freelancer.name}
                  imageURL={freelancer.profile}
                  className='list-thumbnail responsive border-0 card-img-left'
                />
              </td>
              <td>{freelancer.email}</td>
              <td>{freelancer.phone}</td>
              <td>
                <StatusUpdate
                  data={freelancer}
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

              <td>{convertDate(freelancer.created)}</td>
              <td>
                <Link
                  to={{
                    pathname: "/freelancer-details",
                    state: { freelancer },
                  }}
                  className='btn btn-primary btn-sm'
                >
                  View
                </Link>{" "}
                <Link
                  to={{
                    pathname: "/edit-freelancer",
                    state: { freelancer },
                  }}
                  className='btn btn-info btn-sm'
                >
                  Edit
                </Link>{" "}
                <DeleteData
                  view='Freelancer'
                  classes='btn-sm'
                  table='users'
                  data={freelancer.id}
                  ondelete={() => deleteDataLocal(key)}
                >
                  Delete
                </DeleteData>
              </td>
            </tr>
          ))}
          {userLists.length === 0 && (
            <tr className='no-record-tr'>
              <td colSpan='10'>
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
};

export default Freelancer;
