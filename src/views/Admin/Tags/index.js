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
import { getAllTags, getCategory } from "Apis/admin";

import StatusUpdate from "components/UpdateStatus";
import { additional, convertDate } from "constants/defaultValues";
import useDebouncedCallback from "hooks/usedebouncedcallback";
import { NotificationManager } from "components/common/react-notifications";
import ImageView from "components/ImageView";
import ImagePreView from "components/PerviewImage/ModalView";
import { ApiEndPoints } from "Apis/constant";
import { Col, Row } from "reactstrap";

const Tags = ({ match, history }) => {
  const [pageInfo, setPageInfo] = useState(additional);
  const [tagsListing, setTagsListing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(undefined);
  const [viewImage, setViewImage] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    getCategory({ limit: 1000, page: 1 })
      .then(({ data }) => {
        setCategories(data?.data?.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    getAllTags({
      limit: selectedPageSize,
      page: currentPage,
      search: searchText,
      categoryId,
    })
      .then(({ data }) => {
        const { pagination } = data.data;
        setIsLoading(false);
        setTagsListing(data?.data?.data ?? []);
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
  }, [selectedPageSize, currentPage, searchText, categoryId]);

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
    setTagsListing((currCat) => {
      const copy = JSON.parse(JSON.stringify(currCat));
      copy.splice(key, 1);
      return copy;
    });
  }, []);

  const updateStatus = useCallback((key) => {
    setTagsListing((currCat) => {
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

  const handleOnChangeCategory = useCallback(({ target: { value } }) => {
    setCategoryId(value);
  }, []);

  return isLoading ? (
    <div className='loading' />
  ) : (
    <Fragment>
      <ListPageHeading
        match={match}
        heading='Tags Listing'
        addShow
        Addname='+ Add New Tag'
        onClick={() => history.push("/add-tag")}
        changePageSize={changePageSize}
        selectedPageSize={selectedPageSize}
        totalItemCount={pageInfo.totalItemCount}
        startIndex={startIndex}
        endIndex={endIndex}
        onSearchKey={onSearchKey}
        orderOptions={pageInfo.orderOptions}
        pageSizes={pageInfo.pageSizes}
      />

      <Row className='mb-4'>
        <Col md='9'></Col>

        <Col md='3'>
          <select className='form-control' onChange={handleOnChangeCategory}>
            <option value='null'>--Select Category--</option>
            {categories?.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
        </Col>
      </Row>

      <table className='table table-striped'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category Name</th>
            <th>Category Image</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tagsListing.map((tag, key) => (
            <>
              <tr key={tag.id}>
                <td>{key + 1}</td>
                <td>
                  <Link
                    to={{
                      pathname: "/edit-tag",
                      state: { tag },
                    }}
                    className='d-flex'
                  >
                    {" "}
                    {tag.name}
                  </Link>
                </td>

                <td>{tag.categoryName}</td>

                <td>
                  <ImageView
                    onClick={() => {
                      setImagePath(tag.image);
                      setViewImage(true);
                    }}
                    name={tag.categoryName}
                    imageURL={tag.image}
                    className='list-thumbnail responsive border-0 card-img-left'
                  />
                </td>

                <td>
                  <StatusUpdate
                    data={tag}
                    table={ApiEndPoints.tags}
                    statusMessage={{
                      0: "Inactive",
                      1: "Active",
                    }}
                    updateKey='status'
                    onUpdate={() => updateStatus(key)}
                    isButton
                  />
                </td>

                <td>{convertDate(tag.created)}</td>
                <td>
                  <Actions
                    key={key}
                    isView={false}
                    isEdit
                    apiName={ApiEndPoints.tags}
                    view='Tag'
                    onDelete={onDeleteSuccess}
                    data={tag}
                    editPath='/edit-tag'
                    name='tag'
                    table={ApiEndPoints.tags}
                  />
                </td>
              </tr>
            </>
          ))}
          {tagsListing.length === 0 && (
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
        onChangePage={onChangePage}
      />
    </Fragment>
  );
};

export default Tags;
