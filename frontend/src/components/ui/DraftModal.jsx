import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { draftJobsState } from '@/store/atoms/jobFormAtom';
import { useNavigate } from 'react-router-dom';
import { RiAddLine, RiDeleteBin6Line, RiEdit2Line, RiFileList2Line } from 'react-icons/ri';
import { Toast } from '@/components/ui/toast';

const DraftModal = ({ isOpen, onClose }) => {
  const [drafts, setDrafts] = useRecoilState(draftJobsState);
  const navigate = useNavigate();

  useEffect(() => {
    // Load drafts from localStorage on mount
    const savedDrafts = localStorage.getItem('jobDrafts');
    if (savedDrafts && drafts.length === 0) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  const handleDeleteDraft = (draftId) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
    localStorage.setItem('jobDrafts', 
      JSON.stringify(drafts.filter(d => d.id !== draftId))
    );
    Toast.success('Draft deleted');
  };

  const handleContinueDraft = (draft) => {
    navigate('/super-admin/create-job', { state: { draft } });
    onClose();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'No date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-5xl bg-base-100 p-0">
        {/* Header */}
        <div className="p-6 border-b border-base-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-dark">Job Listing Drafts</h3>
              <p className="text-sm text-base-content/60 mt-1">Continue working on your saved job listings</p>
            </div>
            <button 
              className="btn bg-red hover:bg-red/80 text-white gap-2"
              onClick={() => {
                navigate('/super-admin/create-job');
                onClose();
              }}
            >
              <RiAddLine size={20} />
              Create New Listing
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map(draft => (
              <div 
                key={draft.id} 
                className="card bg-base-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="card-body p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-lg text-dark">
                        {draft.title || 'Untitled Job'}
                      </h2>
                      <p className="text-sm text-base-content/60 mt-1">
                        Last edited: {formatDate(draft.lastEdited)}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="btn btn-ghost btn-sm btn-square text-red hover:bg-red/10"
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/60">Completion</span>
                      <span className="font-medium">{draft.progress}%</span>
                    </div>
                    <div className="w-full bg-base-300 rounded-full h-2">
                      <div 
                        className="bg-red h-2 rounded-full transition-all duration-300"
                        style={{ width: `${draft.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-base-content/60">
                      <span>Step {draft.currentStep} of 6</span>
                      <span>{6 - draft.currentStep} steps remaining</span>
                    </div>
                  </div>

                  <button 
                    className="btn btn-block bg-dark hover:bg-dark/90 text-white gap-2 mt-4"
                    onClick={() => handleContinueDraft(draft)}
                  >
                    <RiEdit2Line />
                    Continue Editing
                  </button>
                </div>
              </div>
            ))}

            {drafts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
                <div className="bg-base-200 p-4 rounded-full mb-4">
                  <RiFileList2Line size={32} className="text-base-content/40" />
                </div>
                <p className="text-base-content/60 text-center">No drafts available</p>
                <p className="text-sm text-base-content/40 text-center mt-1">
                  Start creating a new job listing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default DraftModal;