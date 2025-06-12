"use client";
import { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Save,
  ArrowLeft,
  Key,
  Clock,
  Smartphone,
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Axios from "axios";
import Swal from "sweetalert2";
import PasswordField from "../components/common/PasswordField";

const ChangePassword = ({ user, onClose }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const userjson = JSON.parse(localStorage.getItem("user")) || "{}";

  const authToken = userjson?.idToken || {};

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
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

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      await Axios.post(
        "http://localhost:3000/users/updatePassword",
        {
          uid: user.uid,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              title: "Success!",
              text: "Your password has been changed.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
            });
          }

          setIsLoading(false);
          onClose();
        })
        .catch((error) => {
          console.log("Error changing password:", error);

          setIsLoading(false);

          if (error.response && error.response.data) {
            setErrors({
              currentPassword:
                error.response.data.error || "Error updating password",
            });
          } else {
            setErrors({
              currentPassword: "An unexpected error occurred",
            });
          }
        });
    } catch (error) {}
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-amber-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Security Settings</h2>
                <p className="text-amber-200">Manage your account security</p>
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
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            <Card title="Change Password">
              <div className="space-y-6">
                <PasswordField
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(value) =>
                    handlePasswordChange("currentPassword", value)
                  }
                  error={errors.currentPassword}
                  showPassword={showPasswords.current}
                  onToggleVisibility={() => togglePasswordVisibility("current")}
                  placeholder="Enter current password"
                />

                <PasswordField
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(value) =>
                    handlePasswordChange("newPassword", value)
                  }
                  error={errors.newPassword}
                  showPassword={showPasswords.new}
                  onToggleVisibility={() => togglePasswordVisibility("new")}
                  placeholder="Enter new password"
                />

                <PasswordField
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(value) =>
                    handlePasswordChange("confirmPassword", value)
                  }
                  error={errors.confirmPassword}
                  showPassword={showPasswords.confirm}
                  onToggleVisibility={() => togglePasswordVisibility("confirm")}
                  placeholder="Confirm new password"
                />

                <div className="bg-amber-100/50 rounded-lg p-4 border border-amber-200">
                  <h4 className="text-sm font-medium text-amber-800 mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• At least 6 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                    <li>• Include at least one special character</li>
                    <li>• Must be different from current password</li>
                  </ul>
                </div>
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
            className="min-w-[140px]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Changing...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Save size={16} className="mr-2" />
                <span>Change Password</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
