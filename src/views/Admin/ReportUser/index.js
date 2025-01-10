import React, {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import ListPageHeading from "containers/pages/ListPageHeading";
import Pagination from "containers/pages/Pagination";
import Actions from "components/Actions";
import { getReportUsers } from "Apis/admin";

import StatusUpdate from "components/UpdateStatus";
import { additional, convertDate } from "constants/defaultValues";
import useDebouncedCallback from "hooks/usedebouncedcallback";
import { NotificationManager } from "components/common/react-notifications";
import ImageView from "components/ImageView";
import ImagePreView from "components/PerviewImage/ModalView";
import { ApiEndPoints } from "Apis/constant";
import Loading from "components/Loading";

const ReportUser = ({ match, history }) => {
  const [pageInfo, setPageInfo] = useState(additional);
  const [totalReportsUsers, setTotalReportUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(undefined);
  const [viewImage, setViewImage] = useState(false);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    getReportUsers({
      limit: selectedPageSize,
      page: currentPage,
      search: searchText,
    })
      .then(({ data }) => {
        const { pagination } = data.data;
        setIsLoading(false);
        setTotalReportUsers(data?.data?.data ?? []);
        additional.totalItemCount = pagination.totalRecord;
        additional.selectedPageSize = pagination.limit;
        additional.totalPage = pagination.totalPage;
        setPageInfo({ ...additional });
      })
      .catch((err) => {
        setIsLoading(false);
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
  }, [selectedPageSize, currentPage, searchText]);

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

  const onDeleteSuccess = useCallback((key) => {
    setTotalReportUsers((currCat) => {
      const copy = JSON.parse(JSON.stringify(currCat));
      copy.splice(key, 1);
      return copy;
    });
  }, []);

  const updateStatus = useCallback((key) => {
    setTotalReportUsers((currCat) => {
      const copy = JSON.parse(JSON.stringify(currCat));
      copy[key].status = copy[key].status ? 1 : 0;
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
      {isLoading && <Loading />}
      <ListPageHeading
        match={match}
        heading='Report Users'
        changePageSize={changePageSize}
        selectedPageSize={selectedPageSize}
        totalItemCount={pageInfo.totalItemCount}
        startIndex={startIndex}
        endIndex={endIndex}
        onSearchKey={onSearchKey}
        orderOptions={pageInfo.orderOptions}
        pageSizes={pageInfo.pageSizes}
      />
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>#</th>
            <th>User Name</th>
            <th>Image</th>
            <th>Status</th>
            <th>Reported Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {totalReportsUsers.map((reportUsers, key) => (
            <>
              <tr key={key}>
                <td>{(currentPage - 1) * selectedPageSize + key + 1}</td>
                <td>{reportUsers.userName}</td>

                <td>
                  <ImageView
                    onClick={() => {
                      setImagePath(reportUsers.profile);
                      setViewImage(true);
                    }}
                    name={reportUsers.userName}
                    imageURL={reportUsers.profile}
                    className='list-thumbnail responsive border-0 card-img-left'
                  />
                </td>
                <td>
                  <StatusUpdate
                    data={{ ...reportUsers, id: reportUsers?.userId }}
                    table={ApiEndPoints.users}
                    statusMessage={{
                      0: "Block",
                      1: "Un-Block",
                    }}
                    updateKey='isBlock'
                    onUpdate={() => updateStatus(key)}
                  />
                </td>

                <td>{convertDate(reportUsers.created)}</td>
                <td>
                  <Actions
                    key={key}
                    isView
                    view='reportUsers'
                    onDelete={onDeleteSuccess}
                    data={reportUsers}
                    viewPath={`/report-user-details/${reportUsers.userId}`}
                    name='reportUsers'
                    table='reportUsers'
                  />
                </td>
              </tr>
            </>
          ))}
        </tbody>

        {totalReportsUsers.length === 0 && (
          <tr className='no-record-tr'>
            <td colSpan='10'>
              <h2 className='no-record'>No Report User Found</h2>
            </td>
          </tr>
        )}
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

export default ReportUser;
