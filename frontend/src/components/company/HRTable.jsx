import { RiUserLine, RiBuildingLine, RiDeleteBin6Line } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "@/utils/axiosConfig";
import { Toast } from "@/components/ui/toast";

const HRTable = ({ representatives }) => {
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();

  const deleteRecruiterMutation = useMutation({
    mutationFn: async (email) => {
      await axios.delete(
        `${import.meta.env.VITE_URI}/super-admin/recruiter/${email}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]);
      queryClient.invalidateQueries(["recruiters"]);
      Toast.success("HR removed successfully");
    },
    onError: (error) => {
      Toast.error(error.response?.data?.message || "Failed to remove HR");
    },
  });

  const handleDelete = (recruiter) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${recruiter.User.firstName} ${recruiter.User.lastName} as HR?`
      )
    ) {
      deleteRecruiterMutation.mutate(recruiter.User.email);
    }
  };

  if (!representatives?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <RiUserLine size={48} className="mx-auto text-muted mb-3" />
        <h3 className="text-lg font-medium text-dark">No HR Representatives</h3>
        <p className="text-sm text-muted">
          There are no HR representatives added yet
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg">
      <table className="w-full text-sm rounded-lg text-left">
        <thead className="text-xs uppercase bg-muted rounded-xl sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 font-semibold text-white">Name</th>
            <th className="px-6 py-4 font-semibold text-white">Email</th>
            <th className="px-6 py-4 font-semibold text-white">Company</th>
            <th className="px-6 py-4 font-semibold text-white">Status</th>
            <th className="px-6 py-4 font-semibold text-white">Joined Date</th>
            <th className="px-6 py-4 font-semibold text-white">Actions</th>
          </tr>
        </thead>

        <tbody>
          {representatives.map((recruiter) => (
            <tr
              key={recruiter.id}
              className="border-b transition-colors hover:bg-base-100"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <RiUserLine size={20} className="text-dark" />
                  </div>
                  <span className="font-medium text-dark">
                    {recruiter.User.firstName} {recruiter.User.lastName}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-muted">{recruiter.User.email}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    {recruiter.Company?.logo ? (
                      <img
                        src={`${import.meta.env.VITE_URI}${
                          recruiter.Company.logo
                        }`}
                        alt={recruiter.Company.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <RiBuildingLine size={18} className="text-muted" />
                    )}
                  </div>
                  <span className="text-dark">{recruiter.Company?.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    recruiter.User.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {recruiter.User.status === "active" ? "Active" : "Pending"}
                </span>
              </td>
              <td className="px-6 py-4 text-muted">
                {new Date(recruiter.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(recruiter)}
                  disabled={deleteRecruiterMutation.isLoading}
                  className="p-2 text-red hover:bg-red hover:text-white rounded-full transition-colors disabled:opacity-50"
                  title="Remove HR"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HRTable;
