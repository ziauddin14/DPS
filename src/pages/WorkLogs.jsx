import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import WorkLogStats from '../components/WorkLogStats';
import WorkLogFilters from '../components/WorkLogFilters';
import WorkLogTable from '../components/WorkLogTable';
import WorkLogTableSkeleton from '../components/WorkLogTableSkeleton';
import EmptyState from '../components/EmptyState';
import WorkLogModal from '../components/WorkLogModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import ExportDropdown from '../components/ExportDropdown';
import { PageHeader } from '../components/ui';
import useToast from '../hooks/useToast';
import workLogService from '../services/workLogService';
import { exportToPDF, exportToExcel, exportToCSV, printWorkLogs } from '../utils/exportWorkLogs';
import { generateFilteredWorkLogsMessage, openWhatsApp } from '../utils/whatsappShareWorkLogs';
import { useSettings } from '../context/SettingsContext';

// Default filter state
const DEFAULT_FILTERS = {
  search: '',
  category: 'All',
  department: 'All',
  dateFilter: 'All',
};

/**
 * WorkLogs Page component.
 * Records daily work activities with filtering and CRUD operations.
 */
function WorkLogs() {
  const [workLogs, setWorkLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { settings } = useSettings();

  // Toast notification system
  const { toasts, showToast, removeToast } = useToast();

  // Filter state
  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [category, setCategory] = useState(DEFAULT_FILTERS.category);
  const [department, setDepartment] = useState(DEFAULT_FILTERS.department);
  const [dateFilter, setDateFilter] = useState(DEFAULT_FILTERS.dateFilter);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedWorkLog, setSelectedWorkLog] = useState(null);

  // Delete confirmation state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [workLogToDelete, setWorkLogToDelete] = useState(null);

  // Fetch work logs
  const fetchWorkLogs = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.department && filters.department !== 'All') params.department = filters.department;
    if (filters.dateFilter) params.dateFilter = filters.dateFilter;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    try {
      const response = await workLogService.getWorkLogs(params);
      if (response.success) {
        setWorkLogs(response.data ?? []);
      } else {
        setError(response.message || 'Failed to fetch work logs.');
      }
    } catch {
      setError('Could not retrieve work logs from server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchWorkLogs();
  }, [fetchWorkLogs]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWorkLogs({
        search,
        category,
        department,
        dateFilter,
        startDate: exportStartDate,
        endDate: exportEndDate,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, category, department, dateFilter, exportStartDate, exportEndDate, fetchWorkLogs]);

  // Modal handlers
  const handleAdd = () => {
    setModalMode('add');
    setSelectedWorkLog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (workLog) => {
    setModalMode('edit');
    setSelectedWorkLog(workLog);
    setIsModalOpen(true);
  };

  const handleDelete = (workLog) => {
    setWorkLogToDelete(workLog);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!workLogToDelete) return;

    try {
      const response = await workLogService.deleteWorkLog(workLogToDelete._id);
      if (response.success) {
        showToast('Work log deleted successfully', 'success');
        fetchWorkLogs({
          search,
          category,
          department,
          dateFilter,
          startDate: exportStartDate,
          endDate: exportEndDate,
        });
      } else {
        showToast(response.message || 'Failed to delete work log', 'error');
      }
    } catch {
      showToast('Could not delete work log. Please check your connection.', 'error');
    } finally {
      setIsConfirmOpen(false);
      setWorkLogToDelete(null);
    }
  };

  const handleSave = async (workLogData) => {
    try {
      let response;
      if (modalMode === 'add') {
        response = await workLogService.createWorkLog(workLogData);
      } else {
        response = await workLogService.updateWorkLog(selectedWorkLog._id, workLogData);
      }

      if (response.success) {
        showToast(
          `Work log ${modalMode === 'add' ? 'created' : 'updated'} successfully`,
          'success'
        );
        setIsModalOpen(false);
        fetchWorkLogs({
          search,
          category,
          department,
          dateFilter,
          startDate: exportStartDate,
          endDate: exportEndDate,
        });
      } else {
        showToast(response.message || `Failed to ${modalMode} work log`, 'error');
      }
    } catch {
      showToast(`Could not ${modalMode} work log. Please check your connection.`, 'error');
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearch(DEFAULT_FILTERS.search);
    setCategory(DEFAULT_FILTERS.category);
    setDepartment(DEFAULT_FILTERS.department);
    setDateFilter(DEFAULT_FILTERS.dateFilter);
    setExportStartDate('');
    setExportEndDate('');
  };

  // Export handlers
  const currentFilters = useMemo(() => ({
    search,
    category,
    department,
    dateFilter,
    startDate: exportStartDate,
    endDate: exportEndDate,
  }), [search, category, department, dateFilter, exportStartDate, exportEndDate]);

  const handleExportWhatsApp = useCallback(() => {
    if (workLogs.length === 0) {
      showToast('No work logs available to export.', 'error');
      return;
    }

    const message = generateFilteredWorkLogsMessage(workLogs, currentFilters);
    if (message) {
      openWhatsApp(message);
    }
  }, [workLogs, currentFilters, showToast]);

  const handleExportPDF = useCallback((lang = 'en') => {
    if (workLogs.length === 0) {
      showToast('No work logs available to export.', 'error');
      return;
    }

    const success = exportToPDF(workLogs, currentFilters, settings, lang);
    if (success) {
      showToast('PDF exported successfully', 'success');
    } else {
      showToast('Failed to export PDF', 'error');
    }
  }, [workLogs, currentFilters, settings, showToast]);

  const handleExportExcel = useCallback(() => {
    if (workLogs.length === 0) {
      showToast('No work logs available to export.', 'error');
      return;
    }

    const success = exportToExcel(workLogs);
    if (success) {
      showToast('Excel exported successfully', 'success');
    } else {
      showToast('Failed to export Excel', 'error');
    }
  }, [workLogs, showToast]);

  const handleExportCSV = useCallback(() => {
    if (workLogs.length === 0) {
      showToast('No work logs available to export.', 'error');
      return;
    }

    const success = exportToCSV(workLogs);
    if (success) {
      showToast('CSV exported successfully', 'success');
    } else {
      showToast('Failed to export CSV', 'error');
    }
  }, [workLogs, showToast]);

  const handlePrint = useCallback(() => {
    if (workLogs.length === 0) {
      showToast('No work logs available to print.', 'error');
      return;
    }

    const success = printWorkLogs(workLogs, currentFilters);
    if (success) {
      showToast('Print dialog opened', 'success');
    } else {
      showToast('Failed to open print dialog', 'error');
    }
  }, [workLogs, currentFilters, showToast]);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto relative min-h-[calc(100vh-70px)]">
      {/* Header */}
      <PageHeader
        title="Daily Work Log"
        subtitle="Record your daily work activities"
        icon={<Plus />}
        actions={
          <ExportDropdown
            onExportWhatsApp={handleExportWhatsApp}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onExportCSV={handleExportCSV}
            onPrint={handlePrint}
          />
        }
      />

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between gap-3 p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-semibold rounded-xl">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <WorkLogStats workLogs={workLogs} />

      {/* Filters */}
      <WorkLogFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        department={department}
        onDepartmentChange={setDepartment}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        exportStartDate={exportStartDate}
        onExportStartDateChange={setExportStartDate}
        exportEndDate={exportEndDate}
        onExportEndDateChange={setExportEndDate}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      {isLoading ? (
        <WorkLogTableSkeleton />
      ) : workLogs.length === 0 ? (
        <EmptyState
          title="No work logs found"
          description="Start by recording your first work activity"
          actionLabel="Add Work Log"
          onAction={handleAdd}
        />
      ) : (
        <WorkLogTable
          workLogs={workLogs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={handleAdd}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-40"
        aria-label="Add work log"
      >
        <Plus className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Modals */}
      <WorkLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        workLog={selectedWorkLog}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Work Log"
        message="Are you sure you want to delete this work log? This action cannot be undone."
      />

      {/* Toast */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default WorkLogs;
export { WorkLogs };
