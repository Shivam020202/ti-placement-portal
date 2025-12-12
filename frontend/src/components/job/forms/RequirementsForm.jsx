import React, { useState } from 'react';
import { RiAddLine, RiCloseLine, RiDragMove2Fill, RiLinkM } from 'react-icons/ri';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import RichTextEditor from '@/components/ui/RichTextEditor';
import FileUploadSection from './FileUploadSection';

const SortableItem = ({ id, content, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg group hover:shadow-md transition-all duration-200"
    >
      <button 
        type="button" 
        className="text-gray-400 cursor-grab active:cursor-grabbing" 
        {...attributes} 
        {...listeners}
      >
        <RiDragMove2Fill size={20} />
      </button>
      <span className="flex-1 text-gray-700">{content}</span>
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <RiCloseLine size={20} />
      </button>
    </div>
  );
};

const RequirementsForm = ({ formData, setFormData, errors }) => {
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      const requirements = formData.requirements 
        ? String(formData.requirements).split('\n').filter(Boolean)
        : [];
      setFormData({
        ...formData,
        requirements: [...requirements, newRequirement.trim()].join('\n')
      });
      setNewRequirement('');
    }
  };

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      const responsibilities = formData.responsibilities 
        ? String(formData.responsibilities).split('\n').filter(Boolean)
        : [];
      setFormData({
        ...formData,
        responsibilities: [...responsibilities, newResponsibility.trim()].join('\n')
      });
      setNewResponsibility('');
    }
  };

  const handleRemoveRequirement = (id) => {
    const requirements = formData.requirements.split('\n').filter(Boolean);
    const updatedRequirements = requirements.filter(req => req !== id);
    setFormData({
      ...formData,
      requirements: updatedRequirements.join('\n')
    });
  };

  const handleRemoveResponsibility = (id) => {
    const responsibilities = formData.responsibilities.split('\n').filter(Boolean);
    const updatedResponsibilities = responsibilities.filter(resp => resp !== id);
    setFormData({
      ...formData,
      responsibilities: updatedResponsibilities.join('\n')
    });
  };

  const handleDragEndRequirements = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const requirements = formData.requirements.split('\n').filter(Boolean);
      const oldIndex = requirements.findIndex(req => req === active.id);
      const newIndex = requirements.findIndex(req => req === over.id);
      
      const newRequirements = arrayMove(requirements, oldIndex, newIndex);
      setFormData({
        ...formData,
        requirements: newRequirements.join('\n')
      });
    }
  };

  const handleDragEndResponsibilities = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const responsibilities = formData.responsibilities.split('\n').filter(Boolean);
      const oldIndex = responsibilities.findIndex(resp => resp === active.id);
      const newIndex = responsibilities.findIndex(resp => resp === over.id);
      
      const newResponsibilities = arrayMove(responsibilities, oldIndex, newIndex);
      setFormData({
        ...formData,
        responsibilities: newResponsibilities.join('\n')
      });
    }
  };

  return (
    <div className="space-y-12">
      {/* File Upload Section */}
      <section className="space-y-6 p-6 bg-white rounded-lg border border-muted/10 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Description File</h3>
          <span className="text-sm text-muted">Optional</span>
        </div>
        <FileUploadSection 
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      </section>

      {/* Web Links Section */}
      <section className="space-y-6 p-6 bg-white rounded-lg border border-muted/10 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Web Links</h3>
          <span className="text-sm text-muted">Optional</span>
        </div>

        <div className="space-y-4">
          {/* Added Links */}
          <div className="space-y-3">
            {formData.webLinks?.map((link, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 bg-base-100 rounded-lg group hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="bg-base-200 p-2 rounded-lg">
                      <RiLinkM className="text-xl text-muted" />
                    </div>
                    <div>
                      <span className="font-medium">{link.title || 'Untitled Link'}</span>
                      <a 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red hover:underline text-sm block"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newLinks = formData.webLinks.filter((_, i) => i !== index);
                    setFormData({ ...formData, webLinks: newLinks });
                  }}
                  className="text-red opacity-0 group-hover:opacity-100 transition-all"
                >
                  <RiCloseLine size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Link */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Link title (optional)"
              className="flex-1 input input-bordered"
              value={newLink?.title || ''}
              onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
            />
            <input
              type="url"
              placeholder="URL (https://...)"
              className="flex-1 input input-bordered"
              value={newLink?.url || ''}
              onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => {
                if (!newLink?.url) return;

                // URL validation
                try {
                  new URL(newLink.url);
                  setFormData(prev => ({
                    ...prev,
                    webLinks: [...(prev.webLinks || []), newLink]
                  }));
                  setNewLink({ title: '', url: '' });
                } catch {
                  Toast.error('Please enter a valid URL');
                }
              }}
              className="btn bg-red hover:bg-red/80 text-white px-4"
            >
              <RiAddLine size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Job Description */}
      <section className="space-y-6 p-6 bg-white rounded-lg border border-muted/10 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Job Description</h3>
          <span className="text-sm text-muted">* Required</span>
        </div>
        <RichTextEditor
          content={formData.descriptionText}
          onChange={(content) => setFormData({ ...formData, descriptionText: content })}
          error={errors?.descriptionText}
          maxLength={5000}
        />
      </section>

      {/* Requirements Section */}
      <section className="space-y-6 p-6 bg-white rounded-lg border border-muted/10 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Requirements</h3>
          <span className="text-sm text-muted">* Required</span>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndRequirements}
        >
          <SortableContext
            items={formData.requirements?.split('\n').filter(Boolean) || []}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {formData.requirements?.split('\n').filter(Boolean).map((req) => (
                <SortableItem
                  key={req}
                  id={req}
                  content={req}
                  onRemove={handleRemoveRequirement}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="flex gap-3">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="Add a requirement"
            className="flex-1 input input-bordered focus:border-none"
            onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
          />
          <button
            type="button"
            onClick={handleAddRequirement}
            className="btn bg-red hover:bg-red/80 text-white px-4 transition-colors"
          >
            <RiAddLine size={20} />
          </button>
        </div>
        {errors?.requirements && (
          <p className="text-red text-sm mt-2">{errors.requirements}</p>
        )}
      </section>

      {/* Responsibilities Section */}
      <section className="space-y-6 p-6 bg-white rounded-lg border border-muted/10 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Responsibilities</h3>
          <span className="text-sm text-muted">* Required</span>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndResponsibilities}
        >
          <SortableContext
            items={formData.responsibilities?.split('\n').filter(Boolean) || []}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {formData.responsibilities?.split('\n').filter(Boolean).map((resp) => (
                <SortableItem
                  key={resp}
                  id={resp}
                  content={resp}
                  onRemove={handleRemoveResponsibility}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="flex gap-3">
          <input
            type="text"
            value={newResponsibility}
            onChange={(e) => setNewResponsibility(e.target.value)}
            placeholder="Add a responsibility"
            className="flex-1 input input-bordered focus:border-none transition-colors"
            onKeyPress={(e) => e.key === 'Enter' && handleAddResponsibility()}
          />
          <button
            type="button"
            onClick={handleAddResponsibility}
            className="btn bg-red hover:bg-red/80 text-white px-4 transition-colors"
          >
            <RiAddLine size={20} />
          </button>
        </div>
        {errors?.responsibilities && (
          <p className="text-red-500 text-sm mt-2">{errors.responsibilities}</p>
        )}
      </section>
    </div>
  );
};

export default RequirementsForm;