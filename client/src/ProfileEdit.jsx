"use client";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  BadgeIcon as IdCard,
  Shield,
  Save,
  Camera,
  ArrowLeft,
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import InputField from "../components/common/InputField";
import axios from "axios";

const ProfileInformation = ({ user, onClose, onNavigateToView }) => {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    employeeID: user?.employeeID || "",
    mobileNumber: user?.mobileNumber || "",
    role: user?.role || "",
    uid: user?.uid || "",
    username: user?.username || "",
  });
  const userjson = JSON.parse(localStorage.getItem("user")) || "{}";
  const authToken = userjson?.idToken || {};

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.employeeID) {
      newErrors.employeeID = "Employee ID is required";
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/\s/g, ""))) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userId = formData.uid || formData.id;
      const response = await axios.put(
        `http://localhost:3000/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // if using JWT auth
          },
        }
      );

      setIsLoading(false);
      alert("Profile updated successfully!");
    } catch (error) {
      setIsLoading(false);
      alert("Failed to update profile!");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-amber-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center relative">
                <User size={24} className="text-white" />
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Camera size={12} className="text-amber-600" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Profile Information</h2>
                <p className="text-amber-200">Manage your personal details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-amber-200 hover:text-white transition-colors text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="bg-white border-b border-amber-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>
            </div>
            <button
              onClick={onNavigateToView}
              className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ← View Profile
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            <Card title="Profile Picture">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-amber-700 mb-3">
                    Upload a new profile picture
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="small">
                      Choose File
                    </Button>
                    <Button variant="secondary" size="small">
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-amber-600 mt-2">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>
              </div>
            </Card>
            <Card title="Account Information" className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Username"
                  value={formData.username}
                  onChange={() => {}}
                  disabled={true}
                  icon={User}
                  placeholder="Username"
                />

                <InputField
                  label="Role"
                  value={formData.role}
                  onChange={() => {}}
                  disabled={true}
                  icon={Shield}
                  placeholder="Role"
                />
              </div>
            </Card>

            <Card title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Email Address"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  type="email"
                  error={errors.email}
                  icon={Mail}
                  placeholder="Enter email address"
                />

                <InputField
                  label="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={(value) => handleInputChange("mobileNumber", value)}
                  type="tel"
                  error={errors.mobileNumber}
                  icon={Phone}
                  placeholder="Enter mobile number"
                />
              </div>
            </Card>
          </div>
        </div>

        <div className="bg-white border-t border-amber-200 p-6 flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="min-w-[250px]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <Save size={16} className="mr-1" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;