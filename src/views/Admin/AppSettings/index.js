import React, { Fragment, useState, useEffect } from "react";
import { getAppSettings, updateSetting } from "Apis/admin";
import { NotificationManager } from "components/common/react-notifications";
import { Input, Button } from "reactstrap";
import Loading from "components/Loading";

const AppSettings = React.memo(() => {
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAppSettings()
      .then((res) => {
        const { data } = res;
        setIsLoading(false);
        setSettings(data.data);
      })
      .catch((err) => {
        setIsLoading(false);
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
  }, []);
  const updateValues = ({ id, value }) => {
    if (!value) {
      return false;
    }
    setIsLoading(true);
    updateSetting({ id, value })
      .then(() => {
        setIsLoading(false);
        NotificationManager.success(
          "Success",
          "Setting Updated successfully",
          3000,
          null,
          null,
          ""
        );
      })
      .catch((err) => {
        setIsLoading(false);

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

  const handleChange = ({ index, value }) => {
    if (value < 0) return false;
    setSettings((currState) => {
      const copySettings = JSON.parse(JSON.stringify(currState));
      copySettings[index].value = value;
      return copySettings;
    });
  };

  return (
    <Fragment>
      <h1>App settings</h1>
      <hr />
      <table className='table table-striped animate__animated  animate__zoomIn animate__fadeInDown'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <Loading loading />}
          {settings.map((setting, key) => (
            <React.Fragment key={setting.id}>
              <tr>
                <td>{key + 1}</td>
                <td>{setting.name}</td>
                <td>
                  <Input
                    onChange={({ target: { value } }) => {
                      handleChange({ index: key, value });
                    }}
                    type='number'
                    value={setting.value}
                    step='0'
                    min='1'
                  />
                </td>
                <td>
                  <Button
                    onClick={() =>
                      updateValues({ id: setting.id, value: setting.value })
                    }
                  >
                    Update
                  </Button>
                </td>
              </tr>
            </React.Fragment>
          ))}
          {setSettings.length === 0 && (
            <tr className='no-record-tr'>
              <td colSpan='4'>
                <h2 className='no-record'>No record Found</h2>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Fragment>
  );
});

export default AppSettings;
