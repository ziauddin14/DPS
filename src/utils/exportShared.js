import jsPDFPackage from 'jspdf';
const jsPDF = jsPDFPackage.jsPDF || jsPDFPackage;
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatDate } from './dateFormatter.js';
import { amiriFontBase64 } from './fonts/amiriFont.js';
import { getReportTranslation } from './translations/index.js';

/**
 * Generate filename with current date
 */
function generateFilename(prefix, extension) {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${prefix}-${year}-${month}-${day}.${extension}`;
}

/**
 * Format duration in minutes to hours and minutes
 */
function formatDuration(minutes) {
  if (!minutes) return '-';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Export generic data as PDF
 */
export function exportToPDF(data, config) {
  if (!data || data.length === 0) return null;

  const {
    title,
    subtitle,
    columns,
    mapRow,
    filters = {},
    prefix = 'export',
    useLandscape = false,
    totalLabel,
    lang = 'en'
  } = config;

  const t = getReportTranslation(lang);
  const isUrdu = lang === 'ur';

  // Use landscape if requested or if table has many columns
  const doc = new jsPDF({
    orientation: useLandscape || columns.length > 6 ? 'landscape' : 'portrait'
  });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Register font if Urdu
  if (isUrdu) {
    if (!doc.existsFileInVFS('Amiri-Regular.ttf')) {
      doc.addFileToVFS('Amiri-Regular.ttf', amiriFontBase64);
      doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    }
    doc.setFont('Amiri', 'normal');
  }

  // Text shaping helper for RTL / Arabic script
  const shapeText = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (isUrdu) {
      return doc.processArabic(str);
    }
    return str;
  };
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text(shapeText(t.appTitle), pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(51, 51, 51);
  doc.text(shapeText(title), pageWidth / 2, 32, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  const generatedDate = new Date().toLocaleString();
  doc.text(shapeText(`${t.generatedOn}: ${generatedDate}`), pageWidth / 2, 42, { align: 'center' });

  // Applied Filters
  let filterText = '';
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'All') {
      filterText += `${key}: ${value} | `;
    }
  });
  
  if (filterText) {
    filterText = filterText.slice(0, -3);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(shapeText(`${t.filters}: ${filterText}`), pageWidth / 2, 48, { align: 'center' });
  }
  
  // Summary Section (if provided)
  let startY = filterText ? 55 : 50;
  if (config.summary) {
    config.summary.forEach((line, index) => {
      doc.setFontSize(10);
      doc.setTextColor(51, 51, 51);
      const textX = isUrdu ? pageWidth - 14 : 14;
      const textAlign = isUrdu ? 'right' : 'left';
      doc.text(shapeText(line), textX, startY + index * 6, { align: textAlign });
    });
    startY += config.summary.length * 6 + 6;
  }
  
  // Table data with processed shaping
  const processedColumns = columns.map((col) => shapeText(col));
  const tableData = data.map(mapRow).map((row) => row.map((cell) => shapeText(cell)));
  
  // Calculate column widths for landscape/portrait
  const totalWidth = pageWidth - 28; // 14 margin on each side
  const columnWidth = totalWidth / columns.length;
  
  // Table styles
  const headStyles = {
    fillColor: [37, 99, 235],
    textColor: 255,
    fontStyle: isUrdu ? 'normal' : 'bold',
    fontSize: 9
  };
  const bodyStyles = {
    fontSize: 8,
    textColor: 51,
    cellPadding: 3,
    overflow: 'linebreak',
    cellWidth: 'auto'
  };

  if (isUrdu) {
    headStyles.font = 'Amiri';
    headStyles.halign = 'right';
    bodyStyles.font = 'Amiri';
    bodyStyles.halign = 'right';
  }

  // Generate table with word wrapping support
  autoTable(doc, {
    startY: startY,
    head: [processedColumns],
    body: tableData,
    theme: 'grid',
    headStyles: headStyles,
    bodyStyles: bodyStyles,
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    styles: isUrdu
      ? { font: 'Amiri', fontStyle: 'normal', overflow: 'linebreak', cellWidth: 'auto', halign: 'right' }
      : { overflow: 'linebreak', cellWidth: 'auto' },
    columnStyles: columns.map(() => ({
      cellWidth: columnWidth
    })),
    margin: { left: 14, right: 14 },
    didParsePage: function (dataPage) {
      dataPage.table.headerRow.forEach((cell) => {
        cell.styles.fillColor = [37, 99, 235];
        cell.styles.textColor = 255;
        cell.styles.fontStyle = isUrdu ? 'normal' : 'bold';
        if (isUrdu) {
          cell.styles.font = 'Amiri';
          cell.styles.halign = 'right';
        }
      });
    },
    rowPageBreak: 'avoid'
  });
  
  // Footer
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  if (isUrdu) {
    doc.setFont('Amiri', 'normal');
  }

  const recordLabel = totalLabel || t.totalTasks || t.totalRecords;
  doc.text(shapeText(`${recordLabel}: ${data.length}`), pageWidth / 2, finalY, { align: 'center' });
  doc.text(shapeText(t.generatedBy), pageWidth / 2, finalY + 8, { align: 'center' });
  
  doc.save(generateFilename(prefix, 'pdf'));
  return true;
}

/**
 * Export generic data as Excel (.xlsx)
 */
export function exportToExcel(data, config) {
  if (!data || data.length === 0) return null;

  const {
    columns,
    mapRow,
    prefix = 'export'
  } = config;

  const worksheetData = [
    columns,
    ...data.map(mapRow)
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, prefix.charAt(0).toUpperCase() + prefix.slice(1));
  
  XLSX.writeFile(workbook, generateFilename(prefix, 'xlsx'));
  return true;
}

/**
 * Export generic data as CSV
 */
export function exportToCSV(data, config) {
  if (!data || data.length === 0) return null;

  const {
    columns,
    mapRow,
    prefix = 'export'
  } = config;

  const headers = columns.join(',');
  const rows = data.map(mapRow).map(row => 
    row.map(cell => {
      if (typeof cell === 'string' && cell.includes(',')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', generateFilename(prefix, 'csv'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return true;
}

/**
 * Print generic data
 */
export function printData(data, config) {
  if (!data || data.length === 0) return null;

  const {
    title,
    subtitle,
    columns,
    mapRow,
    filters = {},
    summary = []
  } = config;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print.');
    return false;
  }

  let filterText = '';
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'All') {
      filterText += `${key}: ${value} | `;
    }
  });
  if (filterText) filterText = filterText.slice(0, -3);

  const tableRows = data.map(mapRow).map(row => `
    <tr>
      ${row.map(cell => `<td>${cell}</td>`).join('')}
    </tr>
  `).join('');

  const summaryHTML = summary.length > 0 ? `
    <div class="summary">
      ${summary.map(line => `<strong>${line}</strong><br>`).join('')}
    </div>
  ` : '';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
        }
        h1 {
          color: #2563eb;
          text-align: center;
          margin-bottom: 10px;
        }
        h2 {
          color: #6b7280;
          text-align: center;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .summary {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .filters {
          font-size: 12px;
          color: #6b7280;
          text-align: center;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background: #2563eb;
          color: white;
          padding: 10px;
          text-align: left;
          font-size: 12px;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 11px;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Digital Personal Secretary</h1>
      <h2>${title}</h2>
      <div class="filters">${filterText || 'No filters applied'}</div>
      ${summaryHTML}
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <div class="footer">
        Generated by Digital Personal Secretary
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
  return true;
}

export { generateFilename, formatDuration };
