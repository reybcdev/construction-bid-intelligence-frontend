import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Report {
  id: number
  project_name: string
  client_name: string
  risk_score: number
  risk_level: string
  budget_avg: number
  created_at: string
}

interface Stats {
  total_documents: number
  analyzed: number
  pending: number
  average_risk_score: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReports, setSelectedReports] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/reports')
      ])
      setStats(statsRes.data)
      setReports(reportsRes.data.reports)
    } catch (err) {
      console.error('Error loading dashboard:', err)
    }
  }

  const getRiskColor = (level: string) => {
    if (level.includes('LOW')) return 'bg-green-100 text-green-800'
    if (level.includes('MEDIUM')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const toggleReportSelection = (reportId: number) => {
    setSelectedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const handleCompare = () => {
    if (selectedReports.length >= 2 && selectedReports.length <= 5) {
      navigate(`/compare?ids=${selectedReports.join(',')}`)
    }
  }

  const filteredReports = reports.filter(report =>
    report.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Total Documents
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total_documents}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Analyzed
            </div>
            <div className="text-3xl font-bold text-green-600">
              {stats.analyzed}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Pending
            </div>
            <div className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Avg Risk Score
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.average_risk_score.toFixed(1)}
            </div>
          </div>
        </div>
      )}

      {/* Search and Actions */}
      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search projects or clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={() => navigate('/upload')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Upload Document
        </button>
        {selectedReports.length >= 2 && (
          <button
            onClick={handleCompare}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            Compare ({selectedReports.length})
          </button>
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Reports
          </h2>
          {selectedReports.length > 0 && (
            <button
              onClick={() => setSelectedReports([])}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Selection
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReports.length === reports.length && reports.length > 0}
                    onChange={(e) => {
                      setSelectedReports(e.target.checked ? reports.map(r => r.id) : [])
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => toggleReportSelection(report.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {report.project_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {report.client_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(report.risk_level)}`}>
                      {report.risk_score.toFixed(1)} - {report.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatCurrency(report.budget_avg)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => navigate(`/report/${report.id}`)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
