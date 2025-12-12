import {
  RiUserAddLine,
  RiEditLine,
  RiBuildingLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { useState } from 'react';

const CompanyCard = ({
  company,
  onEdit,
  onDelete,
  onInviteHR,
}) => {
  const [imageError, setImageError] = useState(false);
  const logoUrl = company.logo
    ? `${import.meta.env.VITE_URI}${company.logo}`
    : null;

  return (
    <div className={`bg-background rounded-xl p-6`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center">
              {logoUrl && !imageError ? (
                <img
                  src={logoUrl}
                  alt={company.name}
                  className="w-full h-full object-contain rounded-lg"
                  onError={() => setImageError(true)}
                />
              ) : (
                <RiBuildingLine size={32} className="text-muted" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold">{company.name}</h3>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red hover:underline text-sm"
              >
                {company.website}
              </a>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-muted">
              <span className="font-medium w-20">Email:</span>
              <span>{company.headOfficeEmail}</span>
            </div>
            <div className="flex items-center text-sm text-muted">
              <span className="font-medium w-20">Phone:</span>
              <span>{company.headOfficePhone}</span>
            </div>
            <div className="flex items-center text-sm text-muted">
              <span className="font-medium w-20">Address:</span>
              <span>{company.headOfficeAddress}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => onEdit(company)}
            className="p-2 w-10 h-10 items-center justify-center border-2 border-transparent text-dark hover:border-dark hover:bg-dark hover:text-white rounded-full transition-colors"
            title="Edit Company"
          >
            <RiEditLine size={20} />
          </button>
          <button
            onClick={() => onDelete(company)}
            className="p-2 w-10 h-10 items-center justify-center border-2 border-transparent text-red hover:border-red hover:bg-red hover:text-white rounded-full transition-colors"
            title="Delete Company"
          >
            <RiDeleteBin6Line size={20} />
          </button>
          <button
            onClick={() => onInviteHR(company)}
            className="p-2 w-10 h-10 items-center justify-center border-2 border-red text-red hover:bg-red hover:text-white rounded-full transition-colors"
            title="Invite HR"
          >
            <RiUserAddLine size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
