import React, { useState, memo, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  Input,
  Label,
} from "reactstrap";
import { blackListClient } from "Apis/admin";
import swal from "sweetalert";

const BlockUserForm = ({
  showModel,
  onClose,
  userId,
  userName = "name",
  onUpdate = () => {},
  onSuccess = () => {},
}) => {
  const [form, setForm] = useState({
    reason: "",
    description: "",
    image: [],
  });
  const [loading, setLoading] = useState(false);

  const handleInput = useCallback(({ target: { name, value } }) => {
    setForm((currForm) => ({ ...currForm, [name]: value }));
  }, []);

  const handleFiles = useCallback(({ target: { files } }) => {
    setForm((currForm) => ({ ...currForm, image: files }));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    blackListClient({ userId, ...form })
      .then(() => {
        swal("success", "User Blocked successfully", "success");
        onSuccess();
      })
      .catch(() => {
        swal("error", "Something went wrong", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal isOpen={showModel} size='lg' toggle={() => onClose(false)}>
      <ModalHeader toggle={() => onClose(false)}>
        Block ({userName})
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Label>Reason</Label>
          <Input
            value={form.reason}
            onChange={handleInput}
            required
            name='reason'
            type='text'
          />
          <Label>Description</Label>
          <textarea
            value={form.description}
            onChange={handleInput}
            required
            name='description'
            className='form form-control'
          />
          <Label>Images</Label>
          <Input
            onChange={handleFiles}
            required
            name='images'
            type='file'
            multiple
          />
          <Button
            disabled={loading}
            className='mt-4 btn-lg btn-info'
            type='submit'
          >
            {loading ? "Please Wait..." : "Save"}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

BlockUserForm.propTypes = {
  showModel: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default memo(BlockUserForm);
