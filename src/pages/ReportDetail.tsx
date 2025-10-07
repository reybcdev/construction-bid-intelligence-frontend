import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

interface ReportDetail {
  id: number
  project_name: string
  client_name: string
  location: string
  project_type: string
  budget_min: number
  budget_max: number
  duration_months: number
  risk_score: number
  risk_level: string
  participation_recommendation: string
  deadline_date: string
  award_date: string
  start_date: string
  created_at: string
  executive_summary: {
    description: string
    requirements: string[]
    selection_method: string
  }
  cost_analysis: {
    budget_breakdown: Array<{ category: string; amount: number; percentage: number }>
    guarantees: Array<{ type: string; amount: number; percentage: number }>
    payment_terms: { advance: number; progress: number; retention: number }
    pricing_strategy: string
  }
  risk_assessment: {
    categories: Array<{ name: string; level: string; items: string[] }>
    red_flags: string[]
    mitigation_actions: string[]
  }
  recommendations: {
    strategic_advice: string
    priority_actions: string[]
  }
}

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState<ReportDetail | null>(null)
  const [expandedRisks, setExpandedRisks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReport()
  }, [id])

  const loadReport = async () => {
    try {
      const response = await axios.get(`/api/reports/${id}`)
      setReport(response.data)
      // Expand first risk category by default
      if (response.data?.risk_assessment?.categories?.[0]) {
        setExpandedRisks([response.data.risk_assessment.categories[0].name])
      }
    } catch (err) {
      console.error('Error loading report:', err)
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

  const getRiskColor = (level: string) => {
    const levelUpper = level.toUpperCase()
    if (levelUpper.includes('LOW')) return 'bg-green-100 text-green-800 border-green-200'
    if (levelUpper.includes('MEDIUM')) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (levelUpper.includes('HIGH') || levelUpper.includes('VERY')) return 'bg-red-100 text-red-800 border-red-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation === 'YES') return 'bg-green-500 text-white'
    if (recommendation === 'NO') return 'bg-red-500 text-white'
    return 'bg-yellow-500 text-white'
  }

  const toggleRiskCategory = (categoryName: string) => {
    setExpandedRisks(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Report not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {report.project_name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{report.client_name}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>
              <div className="font-medium">{report.project_type}</div>
            </div>
            <div>
              <span className="text-gray-500">Location:</span>
              <div className="font-medium">{report.location}</div>
            </div>
            <div>
              <span className="text-gray-500">Budget Range:</span>
              <div className="font-medium">
                {formatCurrency(report.budget_min)} - {formatCurrency(report.budget_max)}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Duration:</span>
              <div className="font-medium">{report.duration_months} months</div>
            </div>
          </div>

          <div className="mt-4 flex gap-4 items-center">
            <div className={`px-4 py-2 rounded-lg border-2 ${getRiskColor(report.risk_level)}`}>
              <span className="text-xs font-medium">RISK SCORE</span>
              <div className="text-2xl font-bold">{report.risk_score.toFixed(1)}/10</div>
              <div className="text-xs">{report.risk_level}</div>
            </div>
            <div className={`px-6 py-3 rounded-lg ${getRecommendationColor(report.participation_recommendation)}`}>
              <div className="text-xs font-medium opacity-90">RECOMMENDATION</div>
              <div className="text-lg font-bold">{report.participation_recommendation}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Executive Summary</h2>
        <p className="text-gray-700 mb-4">{report.executive_summary.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Key Dates</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Proposal Deadline:</span>
                <span className="font-medium">{new Date(report.deadline_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Award Date:</span>
                <span className="font-medium">{new Date(report.award_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Project Start:</span>
                <span className="font-medium">{new Date(report.start_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
            <ul className="space-y-1">
              {report.executive_summary.requirements.map((req, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-sm">
              <span className="text-gray-600">Selection Method:</span>
              <span className="ml-2 font-medium text-blue-600">{report.executive_summary.selection_method}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Cost Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Budget Breakdown</h3>
            <div className="space-y-2">
              {report.cost_analysis.budget_breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm text-gray-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[100px] text-right">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Guarantees Required</h3>
            <div className="space-y-2">
              {report.cost_analysis.guarantees.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">{item.type}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(item.amount)}</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 font-bold">
                <span className="text-gray-900">Total Guarantees</span>
                <span className="text-gray-900">
                  {formatCurrency(report.cost_analysis.guarantees.reduce((sum, g) => sum + g.amount, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Payment Terms</h3>
            <div className="flex gap-4">
              <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{report.cost_analysis.payment_terms.advance}%</div>
                <div className="text-xs text-gray-600">Advance</div>
              </div>
              <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{report.cost_analysis.payment_terms.progress}%</div>
                <div className="text-xs text-gray-600">Progress</div>
              </div>
              <div className="flex-1 bg-yellow-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-600">{report.cost_analysis.payment_terms.retention}%</div>
                <div className="text-xs text-gray-600">Retention</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">💡 AI Pricing Strategy</h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">{report.cost_analysis.pricing_strategy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Risk Assessment</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Risk Categories</h3>
          <div className="space-y-2">
            {report.risk_assessment.categories.map((category, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleRiskCategory(category.name)}
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getRiskColor(category.level)}`}>
                      {category.level}
                    </span>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <span className="text-gray-400">
                    {expandedRisks.includes(category.name) ? '▼' : '▶'}
                  </span>
                </button>
                {expandedRisks.includes(category.name) && (
                  <div className="px-4 pb-4">
                    <ul className="space-y-2">
                      {category.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {report.risk_assessment.red_flags.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">🚩 Red Flags Detected</h3>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <ul className="space-y-2">
                {report.risk_assessment.red_flags.map((flag, idx) => (
                  <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">⚠️</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Mitigation Actions</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <ul className="space-y-2">
              {report.risk_assessment.mitigation_actions.map((action, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5 rounded" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Recommendations</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Strategic Advice</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700">{report.recommendations.strategic_advice}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Priority Actions (Next 7 Days)</h3>
          <div className="space-y-2">
            {report.recommendations.priority_actions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-700">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => alert('PDF export functionality would be implemented here')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          📥 Export as PDF
        </button>
        <button
          onClick={() => alert('JSON export functionality would be implemented here')}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
        >
          📄 Export as JSON
        </button>
      </div>
    </div>
  )
}
