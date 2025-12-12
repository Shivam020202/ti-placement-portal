import React, { useState } from 'react';
import { RiAddLine, RiCloseLine, RiDragMove2Fill } from 'react-icons/ri';
import DatePicker from '@/components/ui/datepicker';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';

const PROCESS_TYPES = {
  GROUP_DISCUSSION: 'group_discussion',
  CODING_ROUND: 'coding_round',
  INTERVIEW: 'interview',
  PPT: 'ppt'
};

const VENUE_TYPES = {
  ONLINE: 'online',
  OFFLINE: 'offline'
};

const INTERVIEW_TYPES = {
  TECHNICAL: 'technical',
  HR: 'hr',
  MANAGERIAL: 'managerial'
};

const ProcessCard = ({ process, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: process.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="card bg-base-100 border-2 border-base-200 hover:border-red/30 transition-all duration-200"
    >
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            className="cursor-grab active:cursor-grabbing text-base-content/40 hover:text-base-content/60"
            {...attributes}
            {...listeners}
          >
            <RiDragMove2Fill size={20} />
          </button>
          
          <div className="flex-1">
            <h3 className="font-medium">{process.title}</h3>
            <p className="text-sm text-base-content/60">
              {new Date(process.date.from).toLocaleDateString()} - {new Date(process.date.to).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(process)}
              className="btn btn-sm btn-ghost"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(process.id)}
              className="btn btn-sm btn-ghost text-red hover:bg-red/10"
            >
              <RiCloseLine size={20} />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="badge badge-outline">{process.type.replace('_', ' ').toUpperCase()}</div>
          {process.venue && (
            <div className="badge badge-outline">{process.venue}</div>
          )}
          {process.interviewType && (
            <div className="badge badge-outline">{process.interviewType}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const HiringProcessForm = ({ formData, setFormData, errors }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState(null);
  const [newProcess, setNewProcess] = useState({
    id: '',
    type: PROCESS_TYPES.INTERVIEW,
    title: '',
    venue: VENUE_TYPES.ONLINE,
    interviewType: INTERVIEW_TYPES.TECHNICAL,
    date: {
      from: new Date(),
      to: new Date()
    },
    link: '',
    topic: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddProcess = () => {
    if (editingProcess) {
      setFormData({
        ...formData,
        workflowData: formData.workflowData.map(p => 
          p.id === editingProcess.id ? { ...newProcess, id: p.id } : p
        )
      });
      setEditingProcess(null);
    } else {
      setFormData({
        ...formData,
        workflowData: [
          ...formData.workflowData,
          { ...newProcess, id: Date.now().toString() }
        ]
      });
    }
    setNewProcess({
      id: '',
      type: PROCESS_TYPES.INTERVIEW,
      title: '',
      venue: VENUE_TYPES.ONLINE,
      interviewType: INTERVIEW_TYPES.TECHNICAL,
      date: {
        from: new Date(),
        to: new Date()
      },
      link: '',
      topic: ''
    });
    setShowAddForm(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFormData(formData => {
        const oldIndex = formData.workflowData.findIndex(p => p.id === active.id);
        const newIndex = formData.workflowData.findIndex(p => p.id === over.id);
        return {
          ...formData,
          workflowData: arrayMove(formData.workflowData, oldIndex, newIndex)
        };
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="card-body">
          <div className="flex justify-between items-center border-b border-base-200 pb-4">
            <div>
              <h3 className="text-xl font-semibold text-dark">Hiring Process</h3>
              <p className="text-sm text-base-content/60">Add interview rounds and workflow</p>
            </div>
            {!showAddForm && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary"
              >
                <RiAddLine size={20} />
                Add Round
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="card bg-base-200 mt-4">
              <div className="card-body">
                <h4 className="font-medium mb-4">
                  {editingProcess ? 'Edit Round' : 'Add New Round'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Round Type*</span>
                    </label>
                    <select
                      value={newProcess.type}
                      onChange={(e) => setNewProcess({
                        ...newProcess,
                        type: e.target.value
                      })}
                      className="select select-bordered w-full"
                    >
                      {Object.entries(PROCESS_TYPES).map(([key, value]) => (
                        <option key={value} value={value}>
                          {key.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Round Title*</span>
                    </label>
                    <input
                      type="text"
                      value={newProcess.title}
                      onChange={(e) => setNewProcess({
                        ...newProcess,
                        title: e.target.value
                      })}
                      className="input input-bordered"
                      placeholder="e.g., Technical Interview Round 1"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Start Date & Time*</span>
                    </label>
                    <DatePicker
                      selected={newProcess.date.from}
                      onChange={(date) => setNewProcess({
                        ...newProcess,
                        date: { ...newProcess.date, from: date }
                      })}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">End Date & Time*</span>
                    </label>
                    <DatePicker
                      selected={newProcess.date.to}
                      onChange={(date) => setNewProcess({
                        ...newProcess,
                        date: { ...newProcess.date, to: date }
                      })}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Venue*</span>
                    </label>
                    <select
                      value={newProcess.venue}
                      onChange={(e) => setNewProcess({
                        ...newProcess,
                        venue: e.target.value
                      })}
                      className="select select-bordered w-full"
                    >
                      {Object.entries(VENUE_TYPES).map(([key, value]) => (
                        <option key={value} value={value}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>

                  {newProcess.venue === VENUE_TYPES.ONLINE && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Meeting Link</span>
                      </label>
                      <input
                        type="url"
                        value={newProcess.link}
                        onChange={(e) => setNewProcess({
                          ...newProcess,
                          link: e.target.value
                        })}
                        className="input input-bordered"
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  )}

                  {newProcess.type === PROCESS_TYPES.INTERVIEW && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Interview Type*</span>
                      </label>
                      <select
                        value={newProcess.interviewType}
                        onChange={(e) => setNewProcess({
                          ...newProcess,
                          interviewType: e.target.value
                        })}
                        className="select select-bordered w-full"
                      >
                        {Object.entries(INTERVIEW_TYPES).map(([key, value]) => (
                          <option key={value} value={value}>
                            {key}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {newProcess.type === PROCESS_TYPES.GROUP_DISCUSSION && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Topic</span>
                      </label>
                      <input
                        type="text"
                        value={newProcess.topic}
                        onChange={(e) => setNewProcess({
                          ...newProcess,
                          topic: e.target.value
                        })}
                        className="input input-bordered"
                        placeholder="Discussion topic..."
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProcess(null);
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddProcess}
                    className="btn btn-primary"
                  >
                    {editingProcess ? 'Update' : 'Add'} Round
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Process List */}
          <div className="mt-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formData.workflowData.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {formData.workflowData.map((process, index) => (
                    <ProcessCard
                      key={process.id}
                      process={process}
                      onDelete={(id) => setFormData({
                        ...formData,
                        workflowData: formData.workflowData.filter(p => p.id !== id)
                      })}
                      onEdit={(process) => {
                        setNewProcess(process);
                        setEditingProcess(process);
                        setShowAddForm(true);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringProcessForm;