import axiosInstance from "../utils/axiosInstance";

class DesignationController {
  async findAllDesignations() {
    try {
      const response = await axiosInstance.get("/designations");
      return response;
    } catch (error) {}
  }
}
export default new DesignationController();
