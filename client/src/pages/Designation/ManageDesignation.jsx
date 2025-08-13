import { Edit, Eye, MoreVertical, Plus, Search, Users } from "lucide-react";
import PageHeader from "../../components/common/Header";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import CommonTable from "../../components/common/CommonTable";
import IconButton from "../../components/common/IconButton";
import { useEffect, useState } from "react";
import designationController from "../../Controllers/designationController";
import { formatDesignationStatusText } from "../../formatter/CommonFomatters";
import DesignationModal from "../../Modals/DesignationModal";

const ManageDesignation = () => {
  const [designationData, setDesignationData] = useState([]);
  const [openDesignationModal, setOpenDesignationModal] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [state, setState] = useState("");

  useEffect(() => {
    fetchDesignations();
  }, []);
  const fetchDesignations = async () => {
    try {
      const response = await designationController.findAllDesignations();
      if (response.status === 200) {
        setDesignationData(response.data);
      }
    } catch (error) {}
  };

  const columns = [
    { label: "Name", accessor: "description" },
    {
      label: "Status",
      accessor: "status",
      render: (value) => (
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
            value === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {formatDesignationStatusText(value)}
        </span>
      ),
    },
    {
      label: "Actions",
      accessor: "actions",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <IconButton
            icon={Edit}
            onClick={() => {
              setSelectedDesignation(row);
              setState("edit");
              setOpenDesignationModal(true);
            }}
            color="text-amber-600"
            hoverBg="hover:bg-amber-400"
            iconClassName="w-4 h-4"
          />
          <IconButton
            icon={Eye}
            onClick={() => {
              setSelectedDesignation(row);
              setState("view");
              setOpenDesignationModal(true);
            }}
            color="text-amber-600"
            hoverBg="hover:bg-amber-400"
            iconClassName="w-4 h-4"
          />
        </div>
      ),
    },
  ];
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          icon={Users}
          title="Manage Designations"
          subtitle="Create, edit, and delete designations"
        />
        <DesignationModal
          isOpen={openDesignationModal}
          onClose={() => setOpenDesignationModal(false)}
          state={state}
          Data={selectedDesignation}
        />
        <Card>
          <div className="p-6 border-b border-amber-200">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
              <div className="flex flex-col flex-1 gap-4 sm:flex-row">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute transform -translate-y-1/2 left-3 top-1/2 text-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Search users..."
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border rounded-lg border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 sm:w-64"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button
                  onClick={() => {
                    setState("create");
                    setSelectedDesignation(null);

                    setOpenDesignationModal(true);
                  }}
                  variant="primary"
                >
                  <span className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add User
                  </span>
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <CommonTable columns={columns} data={designationData} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManageDesignation;
