import React, { useEffect, useState } from "react";
import Modal from "../components/common/Modal";
import InputField from "../components/common/InputField";
import Card from "../components/common/Card";
import CustomDropdown from "../components/common/DropDown";
import Button from "../components/common/Button";
import { Save } from "lucide-react";
import { formatDesignationStatusText } from "../formatter/CommonFomatters";
import { DesignationStatusOptions } from "../utils/DropDownOptions";

const DesignationModal = ({ isOpen, onClose, state, Data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    designationName: "",
    status: "",
  });
  console.log(Data);

  useEffect(() => {
    if ((state === "edit" || state === "view") && Data) {
      setFormData({
        designationName: Data.description,
        status: Data.status,
      });
    } else if (state === "create") {
      setFormData({
        designationName: "",
        status: "",
      });
    }
  }, [Data]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (state === "create") {
        const response = await designationController.createDesignation({
          description: formData.designationName,
        });
        console.log("Designation created:", response);
      }
      if (state === "edit") {
        const response = await designationController.updateDesignation(
          Data.id,
          {
            description: formData.designationName,
            status: formData.status.value,
          }
        );
        console.log("Designation updated:", response);
      }
    } catch (error) {
      console.error("Error submitting designation data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const ModalBody = (
    <div>
      <Card>
        <div className="p-4 ">
          <InputField
            label="Designation Name"
            name="designationName"
            placeholder="Enter designation name"
            value={formData.designationName}
            required
            disabled={state === "view"}
          />
          {console.log(formatDesignationStatusText(formData.status))}
          <CustomDropdown
            label="Status"
            name="status"
            options={DesignationStatusOptions()}
            value={
              formData.status
                ? DesignationStatusOptions().find(
                    (option) => option.value === formData.status
                  )
                : null
            }
            placeholder="Select status"
            required
            width="w-full"
            onChange={(selectedOption) => {
              console.log("Selected option:", selectedOption);

              setFormData((prev) => ({
                ...prev,
                status: selectedOption ? selectedOption.value : "",
              }));
            }}
            disabled={state === "view"}
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-4 p-4">
          <Button type="button" variant="outlineDanger" onClick={onClose}>
            Cancel
          </Button>

          {state !== "view" && (
            <Button
              type="button"
              variant="primary"
              disabled={isLoading}
              className="min-w-[140px]"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  {state === "create" ? "Creating..." : "Updating..."}
                </div>
              ) : (
                <div className="flex items-center">
                  <Save size={16} className="mr-2" />
                  {state === "create" ? "Create" : "Update"}
                </div>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Designation"
      children={ModalBody}
    />
  );
};

export default DesignationModal;
