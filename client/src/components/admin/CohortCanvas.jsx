/**
 * Cohort Canvas Component
 * Premium drag-and-drop visual organization for cohorts
 * Based on SOFLUENT_PREMIUM_INTERACTIVE_UX.md spec
 */

import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Users, Calendar, DollarSign, Edit, Eye, Trash2, GripVertical } from 'lucide-react';
import axios from 'axios';
import soundEffects from '../../utils/soundEffects';
import './CohortCanvas.css';

/**
 * Cohort Card Component
 * Draggable card for each cohort
 */
const CohortCard = ({ cohort, onEdit, onDelete, onView }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: cohort._id || cohort.id,
    data: cohort
  });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : 1
  };
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="cohort-card"
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        rotate: isDragging ? 3 : 0
      }}
      whileTap={{ scale: 0.98 }}
      animate={{
        x: cohort.position?.x || 0,
        y: cohort.position?.y || 0
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {/* Drag handle */}
      <div {...listeners} {...attributes} className="cohort-card-handle">
        <GripVertical className="w-5 h-5 text-white/50" />
      </div>
      
      {/* Card header */}
      <div className="cohort-card-header">
        <h3 className="cohort-card-title">{cohort.name}</h3>
        <span className={`cohort-status cohort-status-${cohort.status || 'draft'}`}>
          {cohort.status || 'draft'}
        </span>
      </div>
      
      {/* Stats */}
      <div className="cohort-stats">
        <div className="stat">
          <Users className="w-4 h-4" />
          <div>
            <span className="stat-value">{cohort.students?.length || cohort.studentCount || 0}</span>
            <span className="stat-label">students</span>
          </div>
        </div>
        <div className="stat">
          <DollarSign className="w-4 h-4" />
          <div>
            <span className="stat-value">
              R${(cohort.revenue || cohort.pricing?.amount || 0).toLocaleString('pt-BR')}
            </span>
            <span className="stat-label">revenue</span>
          </div>
        </div>
      </div>
      
      {/* Schedule info */}
      {cohort.schedule && (
        <div className="cohort-schedule">
          <Calendar className="w-4 h-4" />
          <span className="schedule-text">
            {new Date(cohort.schedule.startDate).toLocaleDateString('pt-BR', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
      )}
      
      {/* Actions */}
      <div className="cohort-actions">
        <button 
          className="btn-icon" 
          onClick={(e) => { e.stopPropagation(); onView(cohort); }}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button 
          className="btn-icon" 
          onClick={(e) => { e.stopPropagation(); onEdit(cohort); }}
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          className="btn-icon btn-icon-danger" 
          onClick={(e) => { e.stopPropagation(); onDelete(cohort); }}
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Cohort Canvas Component
 * Main canvas for drag-and-drop cohort organization
 */
const CohortCanvas = ({ cohorts = [], onUpdatePosition, backendUrl, getToken }) => {
  const [activeCohort, setActiveCohort] = useState(null);
  const [cohortsState, setCohortsState] = useState(cohorts);
  
  useEffect(() => {
    setCohortsState(cohorts);
  }, [cohorts]);
  
  const handleDragStart = (event) => {
    setActiveCohort(event.active.data.current);
  };
  
  const handleDragEnd = async (event) => {
    const { active, delta } = event;
    
    if (!delta || (!delta.x && !delta.y)) return;
    
    const cohortId = active.id;
    const cohort = cohortsState.find(c => (c._id || c.id) === cohortId);
    
    if (!cohort) return;
    
    // Calculate new position
    const newPosition = {
      x: (cohort.position?.x || 0) + delta.x,
      y: (cohort.position?.y || 0) + delta.y
    };
    
    // Update local state immediately (optimistic update)
    setCohortsState(prev => prev.map(c => 
      (c._id || c.id) === cohortId 
        ? { ...c, position: newPosition } 
        : c
    ));
    
    // Save to backend
    if (onUpdatePosition) {
      onUpdatePosition(cohortId, newPosition);
    } else if (backendUrl && getToken) {
      try {
        const token = await getToken();
        await axios.patch(
          `${backendUrl}/api/admin/cohorts/${cohortId}/position`,
          newPosition,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        // Revert on error
        setCohortsState(cohorts);
      }
    }
    
    // Sound effect
    soundEffects.drop();
    
    // Haptic feedback (mobile)
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    setActiveCohort(null);
  };
  
  const handleEdit = (cohort) => {
    // TODO: Open edit modal
    // Edit cohort functionality
  };
  
  const handleDelete = (cohort) => {
    // TODO: Show delete confirmation
    // Delete cohort functionality
  };
  
  const handleView = (cohort) => {
    // TODO: Navigate to cohort details
    // View cohort functionality
  };
  
  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="cohort-canvas">
        {cohortsState.map(cohort => (
          <CohortCard
            key={cohort._id || cohort.id}
            cohort={cohort}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeCohort && (
          <CohortCard
            cohort={activeCohort}
            onEdit={() => {}}
            onDelete={() => {}}
            onView={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default CohortCanvas;
