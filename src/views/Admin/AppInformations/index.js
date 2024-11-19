import React, { Fragment, useState, useEffect } from "react";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Button,
  Form,
} from "reactstrap";
import { updateAppInfo, appInfo } from "Apis/admin";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NotificationManager } from "components/common/react-notifications";

const AppInformation = () => {
  const [currentInfo, setCurrentInfo] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [info, setInfo] = useState([]);

  const updateInfo = (event) => {
    event.preventDefault();
    setIsLoading(true);

    updateAppInfo(currentInfo)
      .then(() => {
        NotificationManager.success(
          "Information Updated Successfully",
          "Success",
          3000,
          null,
          null,
          ""
        );
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
        setIsLoading(false);
      });
  };
  useEffect(() => {
    setIsLoading(true);
    appInfo()
      .then((res) => {
        const { data } = res;
        const appInfo = data.data.map((value) => {
          return {
            label: value.name,
            id: value.id,
            key: value.name,
            value: value?.value,
          };
        });
        setInfo(appInfo);
        if (data.data.length > 0) {
          setCurrentInfo({ ...data.data[0] });
        }
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
        setIsLoading(false);
      });
  }, []);

  const handleOnChange = ({ target: { value } }) => {
    const selectedOne = info.find((data) => data.id === Number(value));
    console.log(selectedOne);
    if (selectedOne) {
      setCurrentInfo(selectedOne);
    }
  };

  return (
    <Fragment>
      <Row>
        <Colxx xxs='12'>
          <h1>App Contents</h1>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row className='mb-4'>
        <Colxx xxs='12'>
          <Card>
            <CardBody>
              <CardTitle>App Contents</CardTitle>
              <Form onSubmit={updateInfo}>
                <FormGroup row>
                  <Colxx sm={12}>
                    <FormGroup>
                      <Label>Name</Label>
                      <select
                        className='form-control'
                        value={currentInfo?.id}
                        onChange={handleOnChange}
                      >
                        <option>--Please select Information type--</option>
                        {info?.map(({ label, id }) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </FormGroup>
                  </Colxx>
                  <Colxx sm={12}>
                    <FormGroup>
                      <Label>Description</Label>
                      <CKEditor
                        editor={ClassicEditor}
                        data={currentInfo.value}
                        onInit={(editor) => {
                          // You can store the "editor" and use when it is needed.
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setCurrentInfo((currState) => ({
                            ...currState,
                            value: data,
                          }));
                        }}
                        onBlur={(event, editor) => {
                          console.log("Blur.", editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log("Focus.", editor);
                        }}
                      />
                    </FormGroup>
                  </Colxx>
                </FormGroup>

                <Button disabled={loading} type='submit' color='primary'>
                  Update Infomations
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </Fragment>
  );
};

export default AppInformation;
