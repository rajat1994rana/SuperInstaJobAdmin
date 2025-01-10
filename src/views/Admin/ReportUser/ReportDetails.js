import React, { useCallback, useEffect, useState } from "react";
import { getReportUsersDetails } from "Apis/admin";
import Actions from "components/Actions";
import ImageView from "components/ImageView";
import Loading from "components/Loading";
import ImagePreView from "components/PerviewImage/ModalView";
import { convertDate } from "constants/defaultValues";
import Pagination from "containers/pages/Pagination";
import BlockUserForm from "components/common/BlockUserForm";

const ReportDetails = (props) => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportList, setReportList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [reportForm, setReportForm] = useState(false);
  const [isBlock, setIsBlock] = useState(
    props?.location?.state?.reportUsers?.isBlock
  );

  useEffect(() => {
    setLoading(true);
    getReportUsersDetails({
      page: currentPage,
      limit: 20,
      userId: props?.location?.state?.reportUsers?.userId,
    })
      .then(({ data }) => {
        setTotalRecords(data?.data?.pagination?.totalPage);
        setReportList(data?.data?.data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, props?.location?.state?.reportUsers?.userId]);

  const handleOnPageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const onDeleteSuccess = useCallback((key) => {
    setReportList((currCat) => {
      const copy = JSON.parse(JSON.stringify(currCat));
      copy.splice(key, 1);
      return copy;
    });
  }, []);

  return (
    <div>
      {loading && <Loading />}
      <div className='d-flex justify-content-between'>
        <h1>Reported User ({props?.location?.state?.reportUsers?.userName})</h1>
        {!isBlock ? (
          <button
            type='button'
            className='btn btn-info'
            onClick={() => setReportForm(true)}
          >
            Block User
          </button>
        ) : (
          <div>
            <span className='badge badge-danger'>User black listed</span>
          </div>
        )}
      </div>
      <hr />
      <table className='table table-striped'>
        <tr>
          <th>#</th>
          <th>User Name</th>
          <th>Report By</th>
          <th>Reason</th>
          <th>Description</th>
          <th>Image</th>
          <th>created</th>
          <th>Action</th>
        </tr>
        <tbody>
          {reportList.map((reportUsers, key) => (
            <>
              <tr key={reportUsers.id}>
                <td>{(currentPage - 1) * currentPage + key + 1}</td>
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
                <td>{reportUsers.reason}</td>
                <td>{reportUsers.description}</td>

                <td>
                  {reportUsers.images?.map((val) => (
                    <ImageView
                      key={val}
                      onClick={() => {
                        setImagePath(val);
                        setViewImage(true);
                      }}
                      name={reportUsers.userName}
                      imageURL={val}
                      className='list-thumbnail responsive border-0 card-img-left'
                    />
                  ))}
                </td>

                <td>{convertDate(reportUsers.created)}</td>
                <td>
                  <Actions
                    key={key}
                    isView={false}
                    isEdit={false}
                    view='reportUsers'
                    onDelete={onDeleteSuccess}
                    data={reportUsers}
                    name='reportUsers'
                    table='reportUsers'
                  />
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <ImagePreView
        imagePath={imagePath}
        showModel={viewImage}
        onClose={(value) => setViewImage(value)}
      />
      <Pagination
        currentPage={currentPage}
        totalPage={totalRecords}
        onChangePage={handleOnPageChange}
      />
      {reportForm && (
        <BlockUserForm
          onClose={() => setReportForm(false)}
          userId={props?.location?.state?.reportUsers?.userId}
          userName={props?.location?.state?.reportUsers?.userName}
          showModel
          onSuccess={() => {
            setReportForm(false);
            setIsBlock(true);
          }}
        />
      )}
    </div>
  );
};

export default ReportDetails;
