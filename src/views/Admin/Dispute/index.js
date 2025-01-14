import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import ListPageHeading from "containers/pages/ListPageHeading";
import Pagination from "containers/pages/Pagination";
import { NotificationManager } from "components/common/react-notifications";
import { Link } from "react-router-dom";
import ReactLoading from "components/Loading";
import DeleteData from "components/DeleteData";
import { convertDate } from "constants/defaultValues";
import useDebouncedCallback from "hooks/usedebouncedcallback";
import { getLastChatList } from "../Chat/apis";
import StatusUpdate from "components/UpdateStatus";

const additional = {
  currentPage: 1,
  totalItemCount: 0,
  totalPage: 1,
  search: "",
  pageSizes: [10, 20, 50, 100],
};

const Dispute = (props) => {
  const [pageInfo, setPageInfo] = useState(additional);
  const [disputeList, setDisputeList] = useState([]);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLastChatList({
      limit: selectedPageSize,
      page: currentPage,
    })
      .then(({ data }) => {
        const { pagination } = data.data;
        setDisputeList(data.data?.data);
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
  }, [selectedPageSize, currentPage, searchText]);

  const onSearchKey = useDebouncedCallback(({ target: { value } }) => {
    setSearchText(value);
  });

  const changePageSize = useCallback((value) => {
    setSelectedPageSize(value);
  }, []);

  const onChangePage = useCallback((value) => {
    setCurrentPage(value);
  }, []);

  const handleOnUpdate = useCallback((key) => {
    setDisputeList((currentState) => {
      const copy = JSON.parse(JSON.stringify(currentState));
      const isResolved = copy[key].isResolved;
      copy[key].isResolved = isResolved === 0 ? 1 : 0;
      return copy;
    });
  }, []);

  const handleOnDelete = useCallback((key) => {
    setDisputeList((currentState) => {
      const copy = JSON.parse(JSON.stringify(currentState));
      copy.splice(key, 1);
      return copy;
    });
  }, []);

  const startIndex = useMemo(
    () => (currentPage - 1) * selectedPageSize,
    [currentPage, selectedPageSize]
  );
  const endIndex = useMemo(
    () => currentPage * selectedPageSize,
    [currentPage, selectedPageSize]
  );

  return (
    <Fragment>
      <ListPageHeading
        match={props.match}
        heading='Dispute list'
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

      <table className='table table-striped animate__animated  animate__zoomIn animate__fadeInDown mb-5'>
        <thead>
          <tr>
            <th>#</th>
            <th>Job Name</th>
            <th>User Name</th>
            <th>Freelancer Name</th>
            <th>Dispute By</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Dispute Date</th>
            <th>Chat</th>
          </tr>
        </thead>
        <tbody>
          {disputeList.map((dispute, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>
                <Link
                  to={{
                    pathname: `chat/${dispute.id}`,
                    state: { dispute },
                  }}
                  className='d-flex'
                >
                  {dispute.name}
                </Link>
              </td>
              <td> {dispute.userName}</td>
              <td>{dispute.freelancerName}</td>
              <td>{dispute.disputeBy === 0 ? "Freelancer" : "User"}</td>
              <td>
                <StatusUpdate
                  data={dispute}
                  table='jobDisputes'
                  statusMessage={{
                    0: "Not Resolved",
                    1: "Dispute Resolved",
                  }}
                  updateKey='isResolved'
                  onUpdate={() => handleOnUpdate(key)}
                  isButton
                />
              </td>
              <td>{dispute.reason}</td>
              <td>{convertDate(dispute.created)}</td>
              <td>
                <Link
                  to={{
                    pathname: `chat/${dispute.id}`,
                    state: { dispute },
                  }}
                  className='btn btn-primary btn-sm'
                >
                  Chat
                </Link>{" "}
                <DeleteData
                  classes='btn-sm'
                  table='disputeJobs'
                  data={dispute.id}
                  view=' Dispute'
                  ondelete={() => handleOnDelete(key)}
                >
                  Delete
                </DeleteData>
              </td>
            </tr>
          ))}

          {disputeList.length === 0 && !loading && (
            <tr className='no-record-tr'>
              <td colSpan='10'>
                <h2 className='no-record'>No record Found</h2>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPage={pageInfo.totalPage}
        onChangePage={(i) => onChangePage(i)}
      />
    </Fragment>
  );
};

export default Dispute;
