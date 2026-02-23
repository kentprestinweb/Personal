import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, Trash2, Download, Check, X, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const ExcelCleaner = () => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Map columns, 3: Review & Download
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Upload state
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [columns1, setColumns1] = useState([]);
  const [columns2, setColumns2] = useState([]);
  const [fileStats, setFileStats] = useState({ file1_rows: 0, file2_rows: 0 });
  
  // Mapping state
  const [columnMapping, setColumnMapping] = useState({
    business_name: [],
    website: [],
    phone: [],
    email: [],
    address: [],
    opening_hours: []
  });
  
  // Results state
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [contactedIds, setContactedIds] = useState(new Set());

  const allColumns = [...new Set([...columns1, ...columns2])];

  const handleFileChange = (e, fileNumber) => {
    const file = e.target.files[0];
    if (file) {
      if (fileNumber === 1) {
        setFile1(file);
      } else {
        setFile2(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!file1) {
      setError('Please select at least one file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file1', file1);
      if (file2) {
        formData.append('file2', file2);
      }

      const response = await fetch(`${API_URL}/api/excel/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Upload failed');
      }

      const data = await response.json();
      setSessionId(data.session_id);
      setColumns1(data.file1_columns);
      setColumns2(data.file2_columns);
      setFileStats({ file1_rows: data.file1_rows, file2_rows: data.file2_rows });
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleColumnMapping = (field, column) => {
    setColumnMapping(prev => {
      const current = prev[field] || [];
      if (current.includes(column)) {
        return { ...prev, [field]: current.filter(c => c !== column) };
      } else {
        return { ...prev, [field]: [...current, column] };
      }
    });
  };

  const handleProcess = async () => {
    // Validate at least one mapping
    const hasMapping = Object.values(columnMapping).some(arr => arr.length > 0);
    if (!hasMapping) {
      setError('Please map at least one column');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Processing with session:', sessionId, 'mapping:', columnMapping);
      const response = await fetch(`${API_URL}/api/excel/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          column_mapping: columnMapping
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Processing failed');
      }

      const data = await response.json();
      setResults(data.data);
      setStats(data.stats);
      setContactedIds(new Set());
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleContacted = (id) => {
    setContactedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Update contacted status first
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('contacted_ids', JSON.stringify([...contactedIds]));
      
      await fetch(`${API_URL}/api/excel/update-contacted`, {
        method: 'POST',
        body: formData
      });

      // Download the file
      const response = await fetch(`${API_URL}/api/excel/download/${sessionId}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cleaned_leads_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setStep(1);
    setFile1(null);
    setFile2(null);
    setSessionId(null);
    setColumns1([]);
    setColumns2([]);
    setColumnMapping({
      business_name: [],
      website: [],
      phone: [],
      email: [],
      address: [],
      opening_hours: []
    });
    setResults([]);
    setStats(null);
    setContactedIds(new Set());
    setError(null);
  };

  const fieldLabels = {
    business_name: 'Business Name',
    website: 'Website',
    phone: 'Phone Number',
    email: 'Email',
    address: 'Address (can select multiple to combine)',
    opening_hours: 'Opening Hours'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <FileSpreadsheet className="inline-block mr-3 text-teal-400" size={36} />
            Excel Lead Cleaner
          </h1>
          <p className="text-gray-400">Merge Excel files, remove duplicates, and track contacted leads</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold
                  ${step >= s ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  {s}
                </div>
                {s < 3 && (
                  <ChevronRight className={step > s ? 'text-teal-500' : 'text-gray-600'} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Upload Your Excel Files</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* File 1 */}
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors
                ${file1 ? 'border-teal-500 bg-teal-500/10' : 'border-gray-600 hover:border-gray-500'}`}>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => handleFileChange(e, 1)}
                  className="hidden"
                  id="file1-input"
                />
                <label htmlFor="file1-input" className="cursor-pointer">
                  <Upload className={`mx-auto mb-3 ${file1 ? 'text-teal-400' : 'text-gray-500'}`} size={40} />
                  <p className="text-white font-medium mb-1">
                    {file1 ? file1.name : 'File 1 (Required)'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {file1 ? 'Click to change' : 'Excel (.xlsx, .xls) or CSV'}
                  </p>
                </label>
                {file1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile1(null); }}
                    className="mt-3 text-red-400 hover:text-red-300 text-sm"
                  >
                    <Trash2 className="inline mr-1" size={14} /> Remove
                  </button>
                )}
              </div>

              {/* File 2 */}
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors
                ${file2 ? 'border-teal-500 bg-teal-500/10' : 'border-gray-600 hover:border-gray-500'}`}>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => handleFileChange(e, 2)}
                  className="hidden"
                  id="file2-input"
                />
                <label htmlFor="file2-input" className="cursor-pointer">
                  <Upload className={`mx-auto mb-3 ${file2 ? 'text-teal-400' : 'text-gray-500'}`} size={40} />
                  <p className="text-white font-medium mb-1">
                    {file2 ? file2.name : 'File 2 (Optional)'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {file2 ? 'Click to change' : 'Excel (.xlsx, .xls) or CSV'}
                  </p>
                </label>
                {file2 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile2(null); }}
                    className="mt-3 text-red-400 hover:text-red-300 text-sm"
                  >
                    <Trash2 className="inline mr-1" size={14} /> Remove
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file1 || loading}
              className="mt-8 w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed
                text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <><Loader2 className="animate-spin mr-2" size={20} /> Uploading...</>
              ) : (
                <>Upload & Continue <ChevronRight className="ml-2" size={20} /></>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Map Columns */}
        {step === 2 && (
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Map Your Columns</h2>
              <span className="text-gray-400 text-sm">
                {fileStats.file1_rows + fileStats.file2_rows} total rows
              </span>
            </div>
            
            <p className="text-gray-400 mb-6">
              Select which columns from your files correspond to each field. 
              For Address, you can select multiple columns to combine them.
            </p>

            <div className="space-y-6">
              {Object.entries(fieldLabels).map(([field, label]) => (
                <div key={field} className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">{label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {allColumns.map((col) => {
                      const isSelected = columnMapping[field]?.includes(col);
                      return (
                        <button
                          key={col}
                          onClick={() => toggleColumnMapping(field, col)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors
                            ${isSelected 
                              ? 'bg-teal-500 text-white' 
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                        >
                          {isSelected && <Check className="inline mr-1" size={14} />}
                          {col}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleProcess}
                disabled={loading}
                className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed
                  text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</>
                ) : (
                  <>Process & Remove Duplicates <ChevronRight className="ml-2" size={20} /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Download */}
        {step === 3 && (
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white">Review & Download</h2>
              {stats && (
                <div className="flex gap-4 text-sm">
                  <span className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full">
                    {stats.final_count} leads
                  </span>
                  <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full">
                    {stats.duplicates_removed} duplicates removed
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                    {contactedIds.size} marked contacted
                  </span>
                </div>
              )}
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="py-3 px-4 text-gray-400 font-medium">Contacted</th>
                    {results[0] && Object.keys(results[0]).filter(k => k !== 'ID' && k !== 'Contacted').map(key => (
                      <th key={key} className="py-3 px-4 text-gray-400 font-medium">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 100).map((row) => (
                    <tr key={row.ID} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleContacted(row.ID)}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-colors
                            ${contactedIds.has(row.ID) 
                              ? 'bg-teal-500 text-white' 
                              : 'bg-gray-600 text-gray-400 hover:bg-gray-500'}`}
                        >
                          {contactedIds.has(row.ID) && <Check size={16} />}
                        </button>
                      </td>
                      {Object.entries(row).filter(([k]) => k !== 'ID' && k !== 'Contacted').map(([key, value]) => (
                        <td key={key} className="py-3 px-4 text-gray-300 text-sm max-w-xs truncate">
                          {value || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {results.length > 100 && (
                <p className="text-gray-400 text-sm mt-4 text-center">
                  Showing first 100 of {results.length} results. Download to see all.
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetTool}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={handleDownload}
                disabled={loading}
                className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed
                  text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <><Loader2 className="animate-spin mr-2" size={20} /> Preparing...</>
                ) : (
                  <><Download className="mr-2" size={20} /> Download Excel</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelCleaner;
