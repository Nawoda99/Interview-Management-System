import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  BadgeIcon as IdCard,
  Shield,
  Save,
  ArrowLeft,
  UserPlus,
  Camera,
  Upload,
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import InputField from "../components/common/InputField";
import Dropdown from "../components/common/DropDown";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CommonModal from "../components/common/Modal";
import MessagePop from "../components/common/MessagePop";
import CustomDropdown from "../components/common/DropDown";

const CreateUserModal = ({ isOpen, onClose }) => {
  const userjson = JSON.parse(localStorage.getItem("user")) || "{}";
  const authToken = userjson?.idToken || {};
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const employeeList = [
    { id: "emp001", name: "Nawoda Perera" },
    { id: "emp002", name: "Kasun Silva" },
    { id: "emp003", name: "Ishara Fernando" },
    { id: "emp004", name: "Dilani Jayasuriya" },
    { id: "emp005", name: "Sahan Kumara" },
  ];
  const roles = [
    { label: "Interviewer", value: 1 },
    { label: "Interviewee", value: 2 },
    { label: "Admin", value: 3 },
    { label: "Manager", value: 4 },
  ];

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    employeeID: "",
    mobileNumber: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const validateField = (field, value) => {
    switch (field) {
      case "username":
        if (!value) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return "Username can only contain letters, numbers, and underscores";
        return "";

      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return "";

      case "mobileNumber":
        if (!value) return "Mobile number is required";
        if (!/^[0-9]{10}$/.test(value.replace(/\s/g, "")))
          return "Mobile number must be 10 digits";
        return "";

      case "employeeID":
        if (!value) return "Employee selection is required";
        return "";

      case "role":
        if (!value) return "Role selection is required";
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    const errorMessage = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: errorMessage,
    }));
  };

  const handleSubmit = async () => {
    const fieldsToValidate = [
      "username",
      "email",
      "mobileNumber",
      "employeeID",
      "role",
    ];
    const newErrors = {};
    let hasErrors = false;

    fieldsToValidate.forEach((field) => {
      const errorMessage = validateField(field, formData[field]);
      if (errorMessage) {
        newErrors[field] = errorMessage;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    const randomPassword = Math.random().toString(36).slice(-8);
    const newUser = {
      email: formData.email,
      username: formData.username,
      employeeID: formData.employeeID,
      mobileNumber: formData.mobileNumber,
      role: formData.role,
      password: randomPassword,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/users",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("User created successfully:", response.data);
      console.log(response.status);

      if (response.status === 201) {
        setToast({
          type: "success",
          message: "User created successfully",
          onComplete: () => {
            setIsLoading(false);
            navigate("/users");
          },
        });
      } else {
        setIsLoading(false);
        setErrors({ form: "Failed to create user" });
      }
    } catch (error) {
      setToast(null);
      setToast({
        type: "error",
        message: "Error creating user",
        onComplete: () => {
          setIsLoading(false);
        },
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-amber-700 border-t-transparent animate-spin"></div>
          <p className="text-gray-600">
            {loading ? "Loading holidays..." : "Loading enums..."}
          </p>
        </div>
      </div>
    );
  }

  const ModalBody = (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 transition-colors text-amber-600 hover:text-amber-800"
          >
            <ArrowLeft size={20} />
            Back to Users
          </button>
        </div>
        {toast && (
          <MessagePop
            duration={3000}
            type={toast.type}
            message={toast.message}
            onClose={() => {
              setToast(null);
              if (toast.onComplete) toast.onComplete();
            }}
          />
        )}
        <div className="flex items-center gap-3">
          <UserPlus size={32} className="text-amber-700" />
          <div>
            <h1 className="text-3xl font-bold text-amber-900">
              Create New User
            </h1>
            <p className="text-amber-700">
              Add a new user to the interview management system
            </p>
          </div>
        </div>
      </div>

      <div>
        {currentStep === 1 && (
          <Card title="Personal Information" className="mb-6">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputField
                  label="Username"
                  value={formData.username}
                  onChange={(value) => handleInputChange("username", value)}
                  error={errors.username}
                  icon={User}
                  placeholder="Enter username"
                  required
                />

                <CustomDropdown
                  label="Employee Name"
                  options={employeeList.map((emp) => ({
                    label: emp.name,
                    value: emp.id,
                  }))}
                  value={
                    employeeList.find((emp) => emp.id === formData.employeeID)
                      ? {
                          label: employeeList.find(
                            (emp) => emp.id === formData.employeeID
                          ).name,
                          value: formData.employeeID,
                        }
                      : null
                  }
                  onChange={(option) =>
                    handleInputChange("employeeID", option ? option.value : "")
                  }
                  placeholder="Choose an employee"
                  icon={User}
                  required
                  error={errors.employeeID}
                />

                <InputField
                  label="Email Address"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  type="email"
                  error={errors.email}
                  icon={Mail}
                  placeholder="Enter email address"
                  required
                />

                <InputField
                  label="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={(value) => handleInputChange("mobileNumber", value)}
                  type="tel"
                  error={errors.mobileNumber}
                  icon={Phone}
                  placeholder="Enter mobile number"
                  required
                />
                <div className="space-y-2">
                  <CustomDropdown
                    label="Role"
                    options={roles}
                    value={
                      roles.find((role) => role.value === formData.role) || null
                    }
                    onChange={(option) =>
                      handleInputChange("role", option ? option.value : "")
                    }
                    placeholder="Select role"
                    icon={Shield}
                    required
                    error={errors.role}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-end gap-4 p-4">
              <Button type="button" variant="outlineDanger" onClick={onClose}>
                Cancel
              </Button>

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
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save size={16} className="mr-2" />
                    Create User
                  </div>
                )}
              </Button>
            </div>
          </Card>
        )}
        {/* <Card className="flex items-center justify-end h-20">
          
        </Card> */}
      </div>
    </div>
  );

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New User"
      children={ModalBody}
    />
  );
};

export default CreateUserModal;
