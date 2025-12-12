import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "axios";
import DashboardLayout from "@/components/layouts/Dashboard";
import { usePagination } from "@/hooks/usePagination";
import { Toast } from "@/components/ui/toast";
import {
  RiBuildingLine,
  RiAddLine,
  RiUserAddLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiUserLine,
} from "react-icons/ri";
import AddCompanyModal from "@/components/company/AddCompanyModal";
import InviteHrModal from "@/components/company/InviteHrModal";
import EditCompanyModal from "@/components/company/EditCompanyModal";
import DeleteCompanyModal from "@/components/company/DeleteCompanyModal";
import EmptyState from "@/components/ui/EmptyState";
import HRTable from "@/components/company/HRTable";

const Companies = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [view, setView] = useState("companies");
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleSearch = (event) => {
      const { searchTerm } = event.detail;
      setSearchQuery(searchTerm);
    };

    window.addEventListener("searchCompanies", handleSearch);
    return () => window.removeEventListener("searchCompanies", handleSearch);
  }, []);

  const {
    data: companies,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URI}/super-admin/company`,
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );

        if (!response.data?.data) {
          return [];
        }

        return response.data.data;
      } catch (error) {
        // More specific error handling
        if (error.response?.status === 404) {
          return []; // Return empty array instead of throwing error
        }
        console.error("API Error:", error.response?.data);
        Toast.error(
          error.response?.data?.reason || "Failed to fetch companies"
        );
        throw error;
      }
    },
    // Add these options
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0, // Disable caching to always get fresh data
  });

  // Add this query
  const {
    data: representatives,
    isLoading: representativesLoading,
    error: representativesError,
  } = useQuery({
    queryKey: ["hr-representatives"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URI}/super-admin/recruiter`,
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );
        return response.data || [];
      } catch (error) {
        console.error("API Error:", error.response?.data);
        Toast.error(
          error.response?.data?.message || "Failed to fetch HR representatives"
        );
        throw error;
      }
    },
    enabled: view === "hr", // Only fetch when HR view is active
  });

  // Filter companies based on search query
  const filteredCompanies = companies?.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.website.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { paginatedItems: paginatedCompanies } = usePagination(
    filteredCompanies || [],
    8
  );

  const handleInviteHR = (company) => {
    setSelectedCompany(company);
    setShowInviteModal(true);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setShowEditModal(true);
  };

  const handleDelete = (company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_URI}/super-admin/company/${selectedCompany.id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      Toast.success("Company deleted successfully");
      queryClient.invalidateQueries(["companies"]);
      setShowDeleteModal(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Delete Error:", error.response?.data);
      Toast.error(error.response?.data?.message || "Failed to delete company");
    }
  };

  return (
    <DashboardLayout>
      <div className="container h-[80vh] bg-white rounded-xl p-7 flex flex-col">
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Companies</h1>
            <div className="bg-dark w-8 h-8 text-white flex items-center justify-center rounded-full text-lg">
              {companies?.length || 0}
            </div>
          </div>
          <div className="ml-6 flex rounded-lg overflow-hidden border-2 border-muted">
            <button
              onClick={() => setView("companies")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                view === "companies"
                  ? "bg-dark text-white"
                  : "hover:bg-muted hover:text-white"
              }`}
            >
              Companies
            </button>
            <button
              onClick={() => setView("hr")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                view === "hr"
                  ? "bg-dark text-white"
                  : "hover:bg-muted hover:text-white"
              }`}
            >
              HR Representatives
            </button>
          </div>
          {view === "companies" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="text-red border-2 rounded-full border-red hover:bg-red hover:text-white px-4 py-2 flex items-center gap-2"
            >
              <RiAddLine />
              Add Company
            </button>
          )}
          {view === "hr" && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="text-red border-2 rounded-full border-red hover:bg-red hover:text-white px-4 py-2 flex items-center gap-2"
            >
              <RiAddLine />
              Invite HR
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto scrollbar-hide">
            {" "}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-red border-t-transparent rounded-full" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Failed to load data
              </div>
            ) : view === "companies" ? (
              paginatedCompanies?.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-4 pb-4 pr-2">
                  {paginatedCompanies?.map((company) => (
                    <div
                      key={company.id}
                      className={`bg-background rounded-xl transition-all duration-300 ${
                        expandedCompany?.id === company.id
                          ? ""
                          : "hover:border-transparent"
                      }`}
                    >
                      {/* Company Row */}
                      <div
                        className="p-4 flex items-center gap-4 cursor-pointer"
                        onClick={() =>
                          setExpandedCompany(
                            expandedCompany?.id === company.id ? null : company
                          )
                        }
                      >
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-base-100">
                          {company.logo ? (
                            <div className="relative w-full h-full">
                              <img
                                src={`${import.meta.env.VITE_URI}${company.logo?.trim()}`} // Add trim() to remove spaces
                                alt={company.name}
                                className="w-full h-full object-contain rounded-lg p-1"
                                onError={(e) => {
                                  console.log('Failed to load:', company.logo); // Add logging
                                  e.target.onerror = null;
                                  e.target.src = '';
                                  const parent = e.target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center">
                                      <RiBuildingLine className="w-6 h-6 text-muted" />
                                    </div>`;
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <RiBuildingLine size={24} className="text-muted" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {company.name}
                            </h3>
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red hover:underline text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {company.website}
                            </a>
                          </div>
                          <div className="text-sm text-muted flex items-center gap-4">
                            <span>{company.headOfficeEmail}</span>
                            <span>•</span>
                            <span>{company.headOfficePhone}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInviteHR(company);
                            }}
                            className="flex items-center border-2 py-2 px-4 rounded-full border-red hover:bg-red hover:text-white text-red gap-4"
                          >
                            <RiUserAddLine /> Invite HR
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(company);
                            }}
                            className="flex items-center border-dark py-2 px-4 rounded-full text-dark"
                          >
                            <RiEditLine />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(company);
                            }}
                            className="flex items-center border-dark py-2 px-4 rounded-full text-red"
                          >
                            <RiDeleteBin6Line size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedCompany?.id === company.id && (
                        <div className="p-6 border-t rounded-xl bg-background animate-slideDown">
                          <div className="grid grid-cols-2 gap-8">
                            {/* Company Details */}
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-medium text-dark mb-4">
                                  Company Details
                                </h4>
                                <div className="space-y-4 text-sm">
                                  <div>
                                    <span className="text-muted">Address</span>
                                    <p className="mt-1">
                                      {company.headOfficeAddress}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted">
                                      Description
                                    </span>
                                    <p className="mt-1">
                                      {company.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* HR List */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-dark">
                                  HR Representatives
                                </h4>
                                <span className="text-xs text-muted">
                                  {company.Recruiters?.length || 0} HR(s)
                                </span>
                              </div>

                              {company.Recruiters &&
                              company.Recruiters.length > 0 ? (
                                <div className="space-y-3">
                                  {company.Recruiters.map((recruiter) => (
                                    <div
                                      key={recruiter.id}
                                      className="flex items-center gap-3 p-3 rounded-lg bg-white"
                                    >
                                      <div className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center">
                                        <RiUserLine className="text-muted" />
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          {recruiter.User?.firstName
                                            ? `${recruiter.User.firstName} ${recruiter.User.lastName}`
                                            : "HR Representative"}
                                        </div>
                                        <div className="text-sm text-muted">
                                          {recruiter.User?.email}
                                        </div>
                                      </div>
                                      <div className="ml-auto">
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs ${
                                            recruiter.User?.isVerified
                                              ? "bg-green-100 text-green-600"
                                              : "bg-yellow-100 text-yellow-600"
                                          }`}
                                        >
                                          {recruiter.User?.isVerified
                                            ? "Active"
                                            : "Pending"}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted rounded-lg bg-background">
                                  No HR representatives added yet
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : // HR Representatives View
            representativesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-red border-t-transparent rounded-full" />
              </div>
            ) : representativesError ? (
              <div className="text-center py-8 text-red-500">
                Failed to load HR representatives
              </div>
            ) : (
              <HRTable representatives={representatives} />
            )}
          </div>
        </div>
      </div>
      {showAddModal && (
        <AddCompanyModal onClose={() => setShowAddModal(false)} />
      )}
      {showInviteModal && (
        <InviteHrModal
          company={selectedCompany}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedCompany(null);
          }}
        />
      )}
      {showEditModal && selectedCompany && (
        <EditCompanyModal
          company={selectedCompany}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCompany(null);
          }}
        />
      )}
      {showDeleteModal && selectedCompany && (
        <DeleteCompanyModal
          company={selectedCompany}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCompany(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashboardLayout>
  );
};

export default Companies;
