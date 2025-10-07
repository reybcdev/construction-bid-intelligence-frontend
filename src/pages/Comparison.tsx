import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

interface ComparisonReport {
  id: number
  project_name: string
  client_name: string
  location: string
  budget_min: number
  budget_max: number
  duration_months: number
  risk_score: number
  risk_level: string
  participation_recommendation: string
  deadline_date: string
  risk_assessment: {
    red_flags: string[]
  }
}

export default function Comparison() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [reports, setReports] = useState<ComparisonReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComparison()
  }, [])

  const loadComparison = async () => {
    try {
      const ids = searchParams.get('ids')?.split(',').map(Number) || []
      if (ids.length < 2) {
        navigate('/')
        return
      }

      const response = await axios.post('/api/reports/compare', ids)
      setReports(response.data.reports)
    } catch (err) {
      console.error('Error loading comparison:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getBestValue = (key: 'budget_min' | 'budget_max' | 'risk_score' | 'duration_months', reports: ComparisonReport[]) => {
    if (key === 'risk_score') {
      return Math.min(...reports.map(r => r.risk_score))
    }
    if (key === 'duration_months') {
      return Math.min(...reports.map(r => r.duration_months))
    }
    if (key === 'budget_max') {
      return Math.max(...reports.map(r => r.budget_max))
    }
    return Math.min(...reports.map(r => r.budget_min))
  }

  const getWorstValue = (key: 'budget_min' | 'budget_max' | 'risk_score' | 'duration_months', reports: ComparisonReport[]) => {
    if (key === 'risk_score') {
      return Math.max(...reports.map(r => r.risk_score))
    }
    if (key === 'duration_months') {
      return Math.max(...reports.map(r => r.duration_months))
    }
    if (key === 'budget_max') {
      return Math.min(...reports.map(r => r.budget_max))
    }
    return Math.max(...reports.map(r => r.budget_min))
  }

  const getValueColor = (value: number, key: 'budget_min' | 'budget_max' | 'risk_score' | 'duration_months') => {
    const best = getBestValue(key, reports)
    const worst = getWorstValue(key, reports)
    
    if (value === best) return 'bg-green-100 text-green-800 font-bold'
    if (value === worst) return 'bg-red-100 text-red-800'
    return ''
  }

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation === 'YES') return 'bg-green-500 text-white'
    if (recommendation === 'NO') return 'bg-red-500 text-white'
    return 'bg-yellow-500 text-white'
  }

  const findBestOpportunity = () => {
    if (reports.length === 0) return null
    
    // Score each report (lower is better)
    const scores = reports.map(report => {
      let score = 0
      score += report.risk_score * 10 // Risk is important
      score += report.risk_assessment.red_flags.length * 5 // Red flags matter
      score += report.participation_recommendation === 'NO' ? 50 : 0
      score += report.participation_recommendation === 'YES' ? -20 : 0
      return { report, score }
    })
    
    scores.sort((a, b) => a.score - b.score)
    return scores[0].report
  }

  const bestOpportunity = findBestOpportunity()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Comparing {reports.length} Reports
          </h1>
          <button
            onClick={() => alert('CSV export functionality would be implemented here')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            📥 Export CSV
          </button>
        </div>

        {bestOpportunity && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">💡 AI Recommendation</h3>
            <p className="text-green-800">
              <strong>Best opportunity: {bestOpportunity.project_name}</strong> - 
              Lowest risk ({bestOpportunity.risk_score.toFixed(1)}), 
              {bestOpportunity.risk_assessment.red_flags.length} red flags, 
              recommendation: {bestOpportunity.participation_recommendation}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                Metric
              </th>
              {reports.map(report => (
                <th key={report.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  {report.project_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Client */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                Client
              </td>
              {reports.map(report => (
                <td key={report.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {report.client_name}
                </td>
              ))}
            </tr>

            {/* Location */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                Location
              </td>
              {reports.map(report => (
                <td key={report.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {report.location}
                </td>
              ))}
            </tr>

            {/* Budget Range */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                Budget Range
              </td>
              {reports.map(report => (
                <td key={report.id} className={`px-6 py-4 whitespace-nowrap text-sm ${getValueColor(report.budget_max, 'budget_max')}`}>
                  {formatCurrency(report.budget_min)} - {formatCurrency(report.budget_max)}
                </td>
              ))}
            </tr>

            {/* Risk Score */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                Risk Score
              </td>
              {reports.map(report => (
                <td key={report.id} className={`px-6 py-4 whitespace-nowrap text-sm ${getValueColor(report.risk_score, 'risk_score')}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{report.risk_score.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">/ 10</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Risk Level */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                Risk Level
              </td>
              {reports.map(report => (
                <td key={report.id} className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.risk_level.includes('LOW') ? 'bg-green-100 text-green-800' :
                    report.risk_level.includes('MEDIUM') ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.risk_level}
                  </span>
                </td>
              ))}
            </tr>

            {/* Duration */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                Duration
              </td>
              {reports.map(report => (
                <td key={report.id} className={`px-6 py-4 whitespace-nowrap text-sm ${getValueColor(report.duration_months, 'duration_months')}`}>
                  {report.duration_months} months
                </td>
              ))}
            </tr>

            {/* Red Flags */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                Red Flags
              </td>
              {reports.map(report => {
                const count = report.risk_assessment.red_flags.length
                return (
                  <td key={report.id} className={`px-6 py-4 whitespace-nowrap text-sm ${
                    count === 0 ? 'bg-green-100 text-green-800 font-bold' :
                    count >= 3 ? 'bg-red-100 text-red-800' : ''
                  }`}>
                    {count} {count === 1 ? 'flag' : 'flags'}
                  </td>
                )
              })}
            </tr>

            {/* Deadline */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                Proposal Deadline
              </td>
              {reports.map(report => (
                <td key={report.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(report.deadline_date).toLocaleDateString()}
                </td>
              ))}
            </tr>

            {/* Recommendation */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                Recommendation
              </td>
              {reports.map(report => (
                <td key={report.id} className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-4 py-2 rounded-lg font-bold ${getRecommendationColor(report.participation_recommendation)}`}>
                    {report.participation_recommendation}
                  </span>
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                Actions
              </td>
              {reports.map(report => (
                <td key={report.id} className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => navigate(`/report/${report.id}`)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Full Report →
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">📊 Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-blue-700">Average Risk Score</div>
            <div className="text-2xl font-bold text-blue-900">
              {(reports.reduce((sum, r) => sum + r.risk_score, 0) / reports.length).toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-blue-700">Average Budget</div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(reports.reduce((sum, r) => sum + (r.budget_min + r.budget_max) / 2, 0) / reports.length)}
            </div>
          </div>
          <div>
            <div className="text-blue-700">Average Duration</div>
            <div className="text-2xl font-bold text-blue-900">
              {Math.round(reports.reduce((sum, r) => sum + r.duration_months, 0) / reports.length)} months
            </div>
          </div>
          <div>
            <div className="text-blue-700">Total Red Flags</div>
            <div className="text-2xl font-bold text-blue-900">
              {reports.reduce((sum, r) => sum + r.risk_assessment.red_flags.length, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
