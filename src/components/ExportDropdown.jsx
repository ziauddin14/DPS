import { useState, useRef, useEffect } from 'react';
import { Download, MessageCircle, FileText, Table, FileSpreadsheet, Printer, ChevronDown, ChevronRight } from 'lucide-react';

/**
 * ExportDropdown component - Professional dropdown for export options
 */
function ExportDropdown({ onExportWhatsApp, onExportPDF, onExportExcel, onExportCSV, onPrint, label = 'Export' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPdfLangs, setShowPdfLangs] = useState(true);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = (exportFn, arg) => {
    if (typeof exportFn === 'function') {
      exportFn(arg);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Export options"
        aria-expanded={isOpen}
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">{label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="py-1">
            {onExportWhatsApp && (
              <button
                type="button"
                onClick={() => handleExport(onExportWhatsApp)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <MessageCircle className="w-4 h-4 text-primary-600" aria-hidden="true" />
                <span>Share via WhatsApp</span>
              </button>
            )}

            {onExportPDF && (
              <div className="border-y border-slate-100 my-1 py-0.5">
                <button
                  type="button"
                  onClick={() => setShowPdfLangs(!showPdfLangs)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors text-left"
                  aria-expanded={showPdfLangs}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-rose-600" aria-hidden="true" />
                    <span>Export PDF</span>
                  </div>
                  {showPdfLangs ? (
                    <ChevronDown className="w-4 h-3.5 text-slate-400" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="w-4 h-3.5 text-slate-400" aria-hidden="true" />
                  )}
                </button>

                {showPdfLangs && (
                  <div className="bg-slate-50/80 py-1 space-y-0.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleExport(onExportPDF, 'en')}
                      className="w-full flex items-center justify-between pl-11 pr-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-white hover:text-primary-600 transition-colors text-left"
                    >
                      <span>English</span>
                      <span className="text-[10px] text-slate-400 font-mono">EN</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport(onExportPDF, 'ur')}
                      className="w-full flex items-center justify-between pl-11 pr-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-white hover:text-primary-600 transition-colors text-left"
                    >
                      <span>اردو</span>
                      <span className="text-[10px] text-slate-400 font-mono">UR</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {onExportExcel && (
              <button
                type="button"
                onClick={() => handleExport(onExportExcel)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Table className="w-4 h-4 text-primary-600" aria-hidden="true" />
                <span>Export as Excel</span>
              </button>
            )}

            {onExportCSV && (
              <button
                type="button"
                onClick={() => handleExport(onExportCSV)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <FileSpreadsheet className="w-4 h-4 text-primary-600" aria-hidden="true" />
                <span>Export as CSV</span>
              </button>
            )}

            {onPrint && (
              <button
                type="button"
                onClick={() => handleExport(onPrint)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Printer className="w-4 h-4 text-slate-600" aria-hidden="true" />
                <span>Print</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExportDropdown;
export { ExportDropdown };
