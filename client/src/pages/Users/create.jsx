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
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import InputField from "../../components/common/InputField";
import Dropdown from "../../components/common/DropDown";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Create = ({ onCancel }) => {
  const userjson = JSON.parse(localStorage.getItem("user")) || "{}";
  const authToken = userjson?.idToken || {};
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!formData.employeeID) newErrors.employeeID = "Employee ID is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/\s/g, "")))
      newErrors.mobileNumber = "Invalid mobile number format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

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
  const response = await axios.post("http://localhost:3000/users", newUser, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  console.log("User created successfully:", response.data);

  if (response.status === 201) {
    Swal.fire({
      title: "User Created",
      text: "The user has been successfully created.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      setIsLoading(false);
      navigate("/users");
    });
  } else {
    setIsLoading(false);
    setErrors({ form: "Failed to create user" });
  }
} catch (error) {
  console.log("Error creating user:", error);
  setIsLoading(false);
  setErrors({ form: "Error creating user" });
}


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Users
            </button>
          </div>
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

        <Card className="mb-6">
          <div className="flex items-center justify-between p-6">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    step <= currentStep
                      ? "bg-amber-600 text-white"
                      : step === currentStep + 1
                      ? "bg-amber-200 text-amber-800"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      step <= currentStep ? "text-amber-900" : "text-gray-500"
                    }`}
                  >
                    {step === 1 && "Personal Info"}
                    {step === 2 && "Account Setup"}
                  </p>
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-4 rounded ${
                      step < currentStep ? "bg-amber-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <Card title="Personal Information" className="mb-6">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-amber-600 rounded-full flex items-center justify-center relative">
                    {formData.profilePicture ? (
                      <img
                        src={
                          URL.createObjectURL(formData.profilePicture) ||
                          "/placeholder.svg"
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-white" />
                    )}
                    <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-amber-50 transition-colors">
                      <Camera size={16} className="text-amber-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-amber-900 mb-2">
                      Profile Picture
                    </h3>
                    <p className="text-sm text-amber-600 mb-3">
                      Upload a profile picture for the user
                    </p>
                    <Button variant="outline" size="small" type="button">
                      <Upload size={16} className="mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Username"
                    value={formData.username}
                    onChange={(value) => handleInputChange("username", value)}
                    error={errors.username}
                    icon={User}
                    placeholder="Enter username"
                    required
                  />

                  <Dropdown
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
                      handleInputChange(
                        "employeeID",
                        option ? option.value : ""
                      )
                    }
                    placeholder="Choose an employee"
                    icon={User}
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
                    onChange={(value) =>
                      handleInputChange("mobileNumber", value)
                    }
                    type="tel"
                    error={errors.mobileNumber}
                    icon={Phone}
                    placeholder="Enter mobile number"
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-amber-900 flex items-center gap-2">
                      <Shield size={16} />
                      Role
                      <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      options={roles}
                      value={
                        roles.find((role) => role.value === formData.role) ||
                        null
                      }
                      onChange={(option) =>
                        handleInputChange("role", option ? option.value : "")
                      }
                      placeholder="Select role"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <div className="p-6 flex z-40 justify-between">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[140px]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};}

export default Create;