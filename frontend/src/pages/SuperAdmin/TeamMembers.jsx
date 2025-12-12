import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "axios";
import DashboardLayout from "@/components/layouts/Dashboard";
import TeamTable from "@/components/team/TeamTable";
import { usePagination } from "@/hooks/usePagination";
import InviteAdminModal from "@/components/team/InviteAdminModal";
import { Toast } from "@/components/ui/Toast";
import { RiUserAddLine } from "react-icons/ri";

const TeamMembers = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();

  const { data: pendingInvites, error: pendingInvitesError } = useQuery({
    queryKey: ["pending-invites"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URI}/super-admin/invite/`,
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );
        return response.data;
      } catch (error) {
        Toast.error(
          error.response?.data?.message || "Failed to fetch pending invites"
        );
        throw error;
      }
    },
  });

  const {
    data: teamData,
    isLoading,
    error: teamDataError,
  } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URI}/super-admin/admin/`,
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );
        // Combine admins and superAdmins arrays
        const allMembers = [
          ...(response.data.admins || []),
          ...(response.data.superAdmins || []),
        ];
        return allMembers;
      } catch (error) {
        Toast.error(
          error.response?.data?.message || "Failed to fetch team members"
        );
        throw error;
      }
    },
  });

  useEffect(() => {
    if (pendingInvitesError) {
      Toast.error(pendingInvitesError.message);
    }
    if (teamDataError) {
      Toast.error(teamDataError.message);
    }
  }, [pendingInvitesError, teamDataError]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedMembers,
  } = usePagination(teamData || [], 10);

  return (
    <DashboardLayout>
      <div className="container h-[80vh] bg-white rounded-xl p-7 flex flex-col">
        {/* Header Section */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Team Members</h1>
            <div className="bg-dark w-8 h-8 text-white flex items-center justify-center rounded-full text-lg">
              {teamData?.length || 0}
            </div>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="text-red border-2 rounded-full border-red hover:bg-red hover:text-white px-4 py-2 flex items-center gap-2"
          >
            <RiUserAddLine />
            Invite Admin
          </button>
        </div>

        {/* Table Section with hidden scrollbar */}
        <div className="flex-1 min-h-0">
          <TeamTable members={paginatedMembers} isLoading={isLoading} />
        </div>

        {/* Pagination Section */}
        <div className="mt-6 flex justify-center gap-2 pt-4 border-t">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Modal */}
        {showInviteModal && (
          <InviteAdminModal
            onClose={() => setShowInviteModal(false)}
            onSuccess={() => {
              setShowInviteModal(false);
              queryClient.invalidateQueries(["team-members"]);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeamMembers;
