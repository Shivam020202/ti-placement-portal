import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/atoms/authAtom";
import axios from "axios";
import { Toast } from "@/components/ui/toast";
import { RiUpload2Line, RiCloseLine, RiInformationLine } from "react-icons/ri";

const AddCompanyModal = ({ onClose }) => {
  const auth = useRecoilValue(authState);
  const queryClient = useQueryClient();
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    headOfficeEmail: "",
    headOfficePhone: "",
    headOfficeAddress: "",
    description: "",
    logo: null,
  });
  const fileInputRef = useRef(null);

  const addCompanyMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'logo' && data[key]) {
          formDataToSend.append('logo', data[key]);
        } else {
          formDataToSend.append(key, data[key] || '');
        }
      });

      const response = await axios.post(
        `${import.meta.env.VITE_URI}/super-admin/company`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': auth.token
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]);
      Toast.success("Company added successfully");
      onClose();
    },
    onError: (error) => {
      Toast.error(error.message || "Failed to add company");
    },
  });

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      Toast.error("Please select a valid image file (PNG, JPG, GIF, WEBP)");
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      Toast.error("Image size should be less than 2MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setFormData(prev => ({ ...prev, logo: file }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields including logo
    if (!formData.name || !formData.website || !formData.description) {
      Toast.error("Please fill all required fields");
      return;
    }

    // Add logo validation
    if (!formData.logo) {
      Toast.error("Please upload a company logo");
      return;
    }

    addCompanyMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-dark/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center border-b border-muted/50 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-dark">Add New Company</h2>
              <p className="text-sm text-base-content/60 mt-1">
                Fill in the details to add a new company to the platform
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-circle btn-sm text-white bg-dark hover:bg-red transition-colors"
            >
              <RiCloseLine size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-8 pt-4 pb-8"
            id="addCompanyForm"
          >
            <div className="flex gap-10">
              <div className="shrink-0">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="w-52 h-44 rounded-xl border-2 border-dashed border-muted flex items-center justify-center overflow-hidden cursor-pointer hover:border-red transition-colors relative group"
                >
                  {logoPreview ? (
                    <div className="relative w-full h-full p-4">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-dark/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLogoPreview(null);
                            setFormData((prev) => ({ ...prev, logo: null }));
                          }}
                          className="btn btn-sm btn-circle btn-ghost text-white hover:bg-red"
                        >
                          <RiCloseLine size={24} />
                        </button>
                        <span className="text-md text-white/80">
                          Click to change
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="p-3 rounded-full bg-base-200 inline-flex mb-3">
                        <RiUpload2Line className="h-8 w-8 text-muted" />
                      </div>
                      <p className="text-sm text-base-content/60">
                        Drop logo here or click to select
                      </p>
                      <p className="text-xs text-base-content/40 mt-2">
                        PNG, JPG, GIF (max 2MB)
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>

              <div className="flex-1 mt-[-10px] space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-dark">
                      Company Name *
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input input-bordered focus:input-primary h-12"
                    placeholder="Enter company name"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-dark">
                      Website *
                    </span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="input input-bordered focus:input-primary h-12"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-dark">
                      Email
                    </span>
                  </label>
                  <input
                    type="email"
                    value={formData.headOfficeEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        headOfficeEmail: e.target.value,
                      })
                    }
                    className="input input-bordered focus:input-primary h-12"
                    placeholder="office@company.com"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-dark">
                      Phone
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={formData.headOfficePhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        headOfficePhone: e.target.value,
                      })
                    }
                    className="input input-bordered focus:input-primary h-12"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-dark">
                    Address
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.headOfficeAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      headOfficeAddress: e.target.value,
                    })
                  }
                  className="input input-bordered focus:input-primary h-12"
                  placeholder="Complete address"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-dark">
                    Description *
                  </span>
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="textarea textarea-bordered focus:textarea-primary h-32 resize-none"
                  placeholder="Brief description about the company"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="pb-8 mx-8 pt-4 border-t border-muted/50">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline hover:bg-dark hover:text-white border-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="addCompanyForm"
              disabled={addCompanyMutation.isLoading}
              className="btn bg-red hover:bg-dark text-white border-2 min-w-[120px]"
            >
              {addCompanyMutation.isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                "Add Company"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;
