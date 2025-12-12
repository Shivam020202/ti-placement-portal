import { RiErrorWarningLine } from "react-icons/ri";

const DeleteCompanyModal = ({ company, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red/10 text-red flex items-center justify-center mx-auto mb-4">
            <RiErrorWarningLine size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-2">Delete Company</h2>
          <p className="text-base-content/60 mb-8">
            Are you sure you want to delete <span className="font-medium text-dark">{company.name}</span>? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="btn btn-outline hover:bg-dark hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="btn bg-red hover:bg-red/90 text-white"
            >
              Delete Company
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCompanyModal;