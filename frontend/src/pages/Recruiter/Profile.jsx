import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import {
  RiBuilding2Line,
  RiMailLine,
  RiPhoneLine,
  RiGlobalLine,
  RiMapPinLine,
} from "react-icons/ri";
import Dashboard from "@/components/layouts/Dashboard";
import { getLogoUrl } from "@/utils/logoHelper";

const Profile = () => {
  const auth = useRecoilValue(authState);
  const user = auth.user;
  const company = auth.role?.Company;
  const companyLogo = getLogoUrl(company?.logo);

  return (
    <Dashboard role="recruiter">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-dark">Profile</h1>
          <p className="text-muted mt-1">
            Manage your account and company information
          </p>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-dark">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-muted">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                Recruiter
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                First Name
              </label>
              <input
                type="text"
                value={user?.firstName || ""}
                disabled
                className="input w-full bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={user?.lastName || ""}
                disabled
                className="input w-full bg-gray-50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted mb-1">
                Email
              </label>
              <div className="flex items-center gap-2">
                <RiMailLine className="w-5 h-5 text-muted" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="input w-full bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        {company && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <RiBuilding2Line className="w-6 h-6" />
              Company Information
            </h2>

            {companyLogo && (
              <div className="mb-6">
                <img
                  src={companyLogo}
                  alt={company.name}
                  className="h-16 object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company.name || ""}
                  disabled
                  className="input w-full bg-gray-50 font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted mb-1">
                  Description
                </label>
                <textarea
                  value={company.description || "No description available"}
                  disabled
                  rows={4}
                  className="input w-full bg-gray-50 resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted mb-1">
                  Head Office Address
                </label>
                <div className="flex items-start gap-2">
                  <RiMapPinLine className="w-5 h-5 text-muted mt-3" />
                  <textarea
                    value={company.headOfficeAddress || "Not specified"}
                    disabled
                    rows={2}
                    className="input w-full bg-gray-50 resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <RiMailLine className="w-5 h-5 text-muted" />
                  <input
                    type="email"
                    value={company.headOfficeEmail || "Not specified"}
                    disabled
                    className="input w-full bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Phone
                </label>
                <div className="flex items-center gap-2">
                  <RiPhoneLine className="w-5 h-5 text-muted" />
                  <input
                    type="tel"
                    value={company.headOfficePhone || "Not specified"}
                    disabled
                    className="input w-full bg-gray-50"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted mb-1">
                  Website
                </label>
                <div className="flex items-center gap-2">
                  <RiGlobalLine className="w-5 h-5 text-muted" />
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  ) : (
                    <span className="text-muted">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default Profile;
