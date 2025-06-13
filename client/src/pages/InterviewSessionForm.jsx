"use client";
import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import Card from "../components/common/Card";


const InterviewSessionForm = ({ onBack, onCreate }) => {
    const [errors, setErrors] = useState({});

   const [formData, setFormData] = useState({
    sessionName: "",
    requirementDescription: "",
    vacantDesignation: "",
    sessionStartDate: "",
    sessionEndDate: "",
    applicationCloseDate: "",
    interviewStartDate: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  

   const designationOptions = [
    "General Director",
    "General Director",
    "General Director",
    "General Director",
  ];

const handleSubmit = () => {
  const newErrors = {};
  if (!formData.sessionName.trim()) newErrors.sessionName = "Session Name is required";
  if (!formData.requirementDescription.trim()) newErrors.requirementDescription = "Requirement Description is required";

  
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    console.log("Form submitted:", formData);
    onCreate?.(formData);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-100 p-6">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 text-amber-900 font-semibold text-lg">
          <ArrowLeft onClick={onBack} className="cursor-pointer" />
          Interview session
        </div>
        <h2 className="text-2xl font-bold text-amber-800">Create new interview session</h2>

        <div className="space-y-4">
          <InputField
            label="Session Name"
            value={formData.sessionName}
            onChange={(val) => handleChange("sessionName", val)}
            placeholder="Enter session name"
          />
          {errors.sessionName && (
            <p className="text-red-600 text-sm mt-1">{errors.sessionName}</p>
     )}
          <InputField
            label="Requirement Description"
            value={formData.requirementDescription}
            onChange={(val) => handleChange("requirementDescription", val)}
            placeholder="Enter requirement description"
          />
          {errors.requirementDescription && (
           <p className="text-red-600 text-sm mt-1">{errors.requirementDescription}</p>
    )}

          <div className="relative">
            <label className="block text-sm font-medium text-amber-700 mb-1">Vacant Designation</label>
            <select
                value={formData.vacantDesignation}
                onChange={(e) => handleChange("vacantDesignation", e.target.value)}
                className="w-full p-3 bg-amber-100 border rounded-lg text-amber-700 appearance-none"
              >
                <option value="" disabled>
                  Select Designation
                </option>
                {designationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            <ChevronDown size={16}
             className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none"
                />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField
              label="Session Start Date"
              type="date"
              icon={CalendarDays}
              value={formData.sessionStartDate}
              onChange={(val) => handleChange("sessionStartDate", val)}
            />
            <InputField
              label="Session End Date"
              type="date"
              icon={CalendarDays}
              value={formData.sessionEndDate}
              onChange={(val) => handleChange("sessionEndDate", val)}
            />
            <InputField
              label="Application Close Date"
              type="date"
              icon={CalendarDays}
              value={formData.applicationCloseDate}
              onChange={(val) => handleChange("applicationCloseDate", val)}
            />
            <InputField
              label="Interview Start Date"
              type="date"
              icon={CalendarDays}
              value={formData.interviewStartDate}
              onChange={(val) => handleChange("interviewStartDate", val)}
            />
          </div>

          <div className="flex gap-4 items-center mt-6">
            <button className="flex items-center gap-2 text-amber-800 font-medium hover:underline">
              <Plus size={16} />
              Create Applicant Form
            </button>
            <button className="flex items-center gap-2 text-amber-800 font-medium hover:underline">
              <Plus size={16} />
              Create Mark Sheet
            </button>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSubmit}
              className="px-8 py-2 rounded-xl bg-amber-800 text-white hover:bg-amber-700"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionForm;
