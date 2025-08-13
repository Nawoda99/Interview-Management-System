import { DesignationStatus } from "../utils/enums";

export const formatDesignationStatusText = (status) => {
  switch (status) {
    case DesignationStatus.ACTIVE:
      return "Active";
    case DesignationStatus.INACTIVE:
      return "Inactive";
    default:
      return "Unknown";
  }
};
