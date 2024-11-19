import React, {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";

import ListPageHeading from "containers/pages/ListPageHeading";
import Pagination from "containers/pages/Pagination";
import Actions from "components/Actions";
import { getCoupons } from "Apis/admin";

import StatusUpdate from "components/UpdateStatus";
import { additional, convertDate } from "constants/defaultValues";
import useDebouncedCallback from "hooks/usedebouncedcallback";
import { NotificationManager } from "components/common/react-notifications";
import ImageView from "components/ImageView";
import ImagePreView from "components/PerviewImage/ModalView";
import { ApiEndPoints } from "Apis/constant";

const Coupons = ({ match, history }) => {
  const [pageInfo, setPageInfo] = useState(additional);
  const [totalCoupons, setTotalCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(undefined);
  const [viewImage, setViewImage] = useState(false);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    getCoupons({
      limit: selectedPageSize,
      page: currentPage,
      search: searchText,
    })
      .then(({ data }) => {
        const { pagination } = data.data;
        setIsLoading(false);
        setTotalCoupons(data?.data?.data ?? []);
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
    setTotalCoupons((currCat) => {
      const copy = JSON.parse(JSON.stringify(currCat));
      copy.splice(key, 1);
      return copy;
    });
  }, []);

  const updateStatus = useCallback((key) => {
    setTotalCoupons((currCat) => {
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

  return isLoading ? (
    <div className='loading' />
  ) : (
    <Fragment>
      <ListPageHeading
        match={match}
        heading='Coupons'
        addShow
        Addname='+ Add New Coupons'
        onClick={() => history.push("/add-coupon")}
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
            <th>Title</th>
            <th>Image</th>
            <th>Percentage</th>
            <th>Code</th>
            <th>Coupon Use Limit</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {totalCoupons.map((coupon, key) => (
            <>
              <tr key={key}>
                <td>{(currentPage - 1) * selectedPageSize + key + 1}</td>
                <td>
                  <Link
                    to={{
                      pathname: "/edit-coupon",
                      state: { coupon },
                    }}
                    className='d-flex'
                  >
                    {" "}
                    {coupon.title}
                  </Link>
                </td>

                <td>
                  <ImageView
                    onClick={() => {
                      setImagePath(coupon.image);
                      setViewImage(true);
                    }}
                    name={coupon.title}
                    imageURL={coupon.image}
                    className='list-thumbnail responsive border-0 card-img-left'
                  />
                </td>
                <td>{`${coupon?.percentage} %`}</td>
                <td>{coupon?.code}</td>
                <td>{coupon?.couponUseLimit}</td>
                <td>
                  <StatusUpdate
                    data={coupon}
                    table={ApiEndPoints.coupons}
                    statusMessage={{
                      0: "Inactive",
                      1: "Active",
                    }}
                    updateKey='status'
                    onUpdate={() => updateStatus(key)}
                    isButton
                  />
                </td>

                <td>{convertDate(coupon.created)}</td>
                <td>
                  <Actions
                    key={key}
                    isView={false}
                    isEdit={true}
                    apiName={ApiEndPoints.categories}
                    view='Coupon'
                    onDelete={onDeleteSuccess}
                    data={coupon}
                    editPath='/edit-coupon'
                    name='coupon'
                    table='coupons'
                  />
                </td>
              </tr>
            </>
          ))}
        </tbody>
        {totalCoupons.length === 0 && (
          <tr className='no-record-tr'>
            <td colSpan='10'>
              <h2 className='no-record'>No coupons Found</h2>
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

export default Coupons;
