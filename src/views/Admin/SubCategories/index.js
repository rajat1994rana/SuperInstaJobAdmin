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
import { getCategory, getSubCategory } from "Apis/admin";

import StatusUpdate from "components/UpdateStatus";
import { convertDate } from "constants/defaultValues";
import { additional } from "./constants";
import useDebouncedCallback from "hooks/usedebouncedcallback";
import { NotificationManager } from "components/common/react-notifications";
import ImageView from "components/ImageView";
import ImagePreView from "components/PerviewImage/ModalView";
import { ApiEndPoints } from "Apis/constant";
import { Col, Row } from "reactstrap";

const SubCategories = ({ match, history }) => {
  const [pageInfo, setPageInfo] = useState(additional);
  const [totalSubCategories, setTotalSubCategories] = useState([]);
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
    getSubCategory({
      limit: selectedPageSize,
      page: currentPage,
      search: searchText,
      categoryId,
    })
      .then(({ data }) => {
        const { pagination } = data.data;
        setIsLoading(false);
        setTotalSubCategories(data?.data?.data ?? []);
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
    setTotalSubCategories((currCat) => {
      const copy = JSON.parse(JSON.stringify(currCat));
      copy.splice(key, 1);
      return copy;
    });
  }, []);

  const updateStatus = useCallback((key) => {
    setTotalSubCategories((currCat) => {
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
        heading='Sub Categories'
        addShow
        Addname='+ Add New Sub Category'
        onClick={() => history.push("/add-sub-category")}
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
            <th>Image</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {totalSubCategories.map((category, key) => (
            <>
              <tr key={key}>
                <td>{key + 1}</td>
                <td>
                  <Link
                    to={{
                      pathname: "/edit-sub-category",
                      state: { category },
                    }}
                    className='d-flex'
                  >
                    {" "}
                    {category.name}
                  </Link>
                </td>

                <td>{category.categoryName}</td>

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
                    table={ApiEndPoints.subCategories}
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
                    view='Sub Category'
                    onDelete={onDeleteSuccess}
                    data={category}
                    editPath='/edit-sub-category'
                    name='category'
                    table='subCategories'
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

export default SubCategories;
