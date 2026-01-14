/**
 * Command Palette Component
 * Premium UX Feature: Cmd+K power user interface
 * Provides fuzzy search across all platform actions
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './CommandPalette.css';

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Toggle with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      // Close on Escape
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open]);

  // Actions configuration
  const actions = [
    // Recent
    {
      id: 'analytics',
      label: t('commandPalette.viewAnalytics'),
      icon: '📊',
      shortcut: 'Cmd+Shift+A',
      category: 'Recent',
      action: () => navigate('/admin/analytics'),
    },
    {
      id: 'new-cohort',
      label: t('commandPalette.createCohort'),
      icon: '➕',
      shortcut: 'Cmd+N',
      category: 'Recent',
      action: () => navigate('/admin/cohorts/new'),
    },
    {
      id: 'export',
      label: t('commandPalette.exportData'),
      icon: '📤',
      shortcut: 'Cmd+E',
      category: 'Recent',
      action: () => {
        // Export functionality - TODO: Implement export
      },
    },

    // Students
    {
      id: 'find-student',
      label: t('commandPalette.findStudent'),
      icon: '🔍',
      shortcut: 'Cmd+F',
      category: 'Students',
      action: () => navigate('/admin/students'),
    },
    {
      id: 'add-student',
      label: t('commandPalette.addStudent'),
      icon: '👤',
      shortcut: 'Cmd+Shift+N',
      category: 'Students',
      action: () => navigate('/admin/students/new'),
    },
    {
      id: 'all-students',
      label: t('commandPalette.viewAllStudents'),
      icon: '👥',
      shortcut: 'Cmd+Shift+S',
      category: 'Students',
      action: () => navigate('/admin/students'),
    },

    // Cohorts
    {
      id: 'manage-cohorts',
      label: t('commandPalette.manageCohorts'),
      icon: '📚',
      shortcut: 'Cmd+M',
      category: 'Cohorts',
      action: () => navigate('/admin/cohorts'),
    },
    {
      id: 'schedule-class',
      label: t('commandPalette.scheduleClass'),
      icon: '📅',
      shortcut: 'Cmd+Shift+C',
      category: 'Cohorts',
      action: () => navigate('/admin/classes/new'),
    },

    // Courses
    {
      id: 'manage-courses',
      label: t('commandPalette.manageCourses'),
      icon: '📖',
      shortcut: 'Cmd+Shift+M',
      category: 'Courses',
      action: () => navigate('/admin/courses'),
    },
    {
      id: 'create-course',
      label: t('commandPalette.createCourse'),
      icon: '✨',
      shortcut: 'Cmd+Shift+C',
      category: 'Courses',
      action: () => navigate('/admin/courses/new'),
    },

    // Settings
    {
      id: 'settings',
      label: t('commandPalette.openSettings'),
      icon: '⚙️',
      shortcut: 'Cmd+,',
      category: 'Settings',
      action: () => navigate('/admin/settings'),
    },
    {
      id: 'logout',
      label: t('commandPalette.logout'),
      icon: '🚪',
      shortcut: 'Cmd+Shift+Q',
      category: 'Settings',
      action: () => {
        // Logout functionality
        window.location.href = '/sign-out';
      },
    },
  ];

  const categories = ['Recent', 'Students', 'Cohorts', 'Courses', 'Settings'];

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="command-palette-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

          {/* Command Palette */}
          <motion.div
            className="command-palette-container"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <Command className="command-palette" shouldFilter={true}>
              <Command.Input
                placeholder={t('commandPalette.searchPlaceholder')}
                value={search}
                onValueChange={setSearch}
                className="command-input"
                autoFocus
              />

              <Command.List className="command-list">
                <Command.Empty className="command-empty">
                  {t('commandPalette.noResults')}
                </Command.Empty>

                {categories.map((category) => {
                  const categoryActions = actions.filter(
                    (action) => action.category === category
                  );
                  
                  if (categoryActions.length === 0) return null;

                  return (
                    <Command.Group
                      key={category}
                      heading={category}
                      className="command-group"
                    >
                      {categoryActions.map((action) => (
                        <Command.Item
                          key={action.id}
                          value={`${action.label} ${action.category}`}
                          onSelect={() => {
                            action.action();
                            setOpen(false);
                            setSearch('');
                          }}
                          className="command-item"
                        >
                          <span className="command-icon">{action.icon}</span>
                          <span className="command-label">{action.label}</span>
                          {action.shortcut && (
                            <span className="command-shortcut">
                              {action.shortcut.replace('Cmd', navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')}
                            </span>
                          )}
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
              </Command.List>
            </Command>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
