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
import { getCategory } from "Apis/admin";

import StatusUpdate from "components/UpdateStatus";
import { convertDate } from "constants/defaultValues";
import { additional } from "./Constants";
import useDebouncedCallback from "hooks/usedebouncedcallback";
import { NotificationManager } from "components/common/react-notifications";
import ImageView from "components/ImageView";
import ImagePreView from "components/PerviewImage/ModalView";
import { ApiEndPoints } from "Apis/constant";

const Categories = ({ match, history }) => {
  const [pageInfo, setPageInfo] = useState(additional);
  const [totalCategories, setTotalCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(undefined);
  const [viewImage, setViewImage] = useState(false);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    getCategory({
      limit: selectedPageSize,
      page: currentPage,
      search: searchText,
    })
      .then(({ data }) => {
        const { pagination } = data.data;
        setIsLoading(false);
        setTotalCategories(data?.data?.data ?? []);
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
    setTotalCategories((currCat) => {
      const copy = JSON.parse(JSON.stringify(currCat));
      copy.splice(key, 1);
      return copy;
    });
  }, []);

  const updateStatus = useCallback((key) => {
    setTotalCategories((currCat) => {
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
        heading='Categories'
        addShow
        Addname='+ Add New Category'
        onClick={() => history.push("/add-category")}
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
            <th>Name</th>
            <th>Image</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {totalCategories.map((category, key) => (
            <>
              <tr key={key}>
                <td>{key + 1}</td>
                <td>
                  <Link
                    to={{
                      pathname: "/edit-category",
                      state: { category },
                    }}
                    className='d-flex'
                  >
                    {" "}
                    {category.name}
                  </Link>
                </td>

                <td>
                  <ImageView
                    onClick={() => {
                      setImagePath(category.image);
                      setViewImage(true);
                    }}
                    name={category.name}
                    imageURL={category.image}
                    className='list-thumbnail responsive border-0 card-img-left'
                  />
                </td>

                <td>
                  <StatusUpdate
                    data={category}
                    table={ApiEndPoints.category}
                    statusMessage={{
                      0: "Inactive",
                      1: "Active",
                    }}
                    updateKey='status'
                    onUpdate={() => updateStatus(key)}
                    isButton
                  />
                </td>

                <td>{convertDate(category.created)}</td>
                <td>
                  <Actions
                    key={key}
                    isView={false}
                    isEdit={true}
                    apiName={ApiEndPoints.categories}
                    view='Category'
                    onDelete={onDeleteSuccess}
                    data={category}
                    editPath='/edit-category'
                    name='category'
                    table='categories'
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
        totalPage={pageInfo.totalPage}
        onChangePage={(i) => onChangePage(i)}
      />
    </Fragment>
  );
};

export default Categories;
