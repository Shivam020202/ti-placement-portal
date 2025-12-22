import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import { getLogoUrl, getCompanyInitials } from "@/utils/logoHelper";

const CompanySelector = ({ value, onChange, error }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const auth = useRecoilValue(authState);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_URI}/super-admin/company`,
        {
          headers: { Authorization: auth.token },
        }
      );
      return response.data.data;
    },
  });

  // Find selected company name
  const selectedCompany = companies?.find((c) => c.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={selectedCompany ? selectedCompany.name : searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search companies..."
          className={`input input-bordered w-full pr-10 ${
            error ? "input-error" : ""
          }`}
        />
        <RiSearchLine
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          size={20}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-base-200 max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="loading loading-spinner loading-sm text-red"></div>
            </div>
          ) : companies?.length === 0 ? (
            <div className="p-4 text-center text-muted">No companies found</div>
          ) : (
            (companies || [])
              .filter((company) =>
                company.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((company) => (
                <button
                  key={company.id}
                  className="w-full px-4 py-2 text-left hover:bg-base-100 flex items-center gap-3"
                  onClick={() => {
                    onChange(company);
                    setIsOpen(false);
                  }}
                >
                  {getLogoUrl(company.logo) ? (
                    <img
                      src={getLogoUrl(company.logo)}
                      alt={company.name}
                      className="w-8 h-8 rounded object-contain bg-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-dark text-white flex items-center justify-center text-sm">
                      {getCompanyInitials(company.name)}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-muted">
                      {company.headOfficeAddress}
                    </div>
                  </div>
                </button>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
