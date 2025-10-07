import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Upload() {
  const navigate = useNavigate()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a PDF file')
      return
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    setUploadProgress(0)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)
      
      await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadComplete(true)
      
      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Bid Document</h1>
        <p className="text-gray-600 mb-8">
          Upload your PDF bid document for AI-powered analysis. The system will automatically generate comprehensive reports.
        </p>

        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="mb-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Click to upload
              </label>
              <span className="text-gray-600"> or drag and drop</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={handleFileSelect}
              />
            </div>
            <p className="text-sm text-gray-500">PDF files up to 10MB</p>
          </div>
        ) : (
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                {!uploading && (
                  <button
                    onClick={() => setFile(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {uploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="font-medium text-gray-900">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {uploadComplete && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Upload successful!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    🤖 AI analysis starting... You'll be redirected to the dashboard shortly.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Valid PDF format</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Size under 10MB</span>
                </div>
              </div>
            </div>

            {!uploading && !uploadComplete && (
              <button
                onClick={handleUpload}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Upload and Analyze
              </button>
            )}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>File is validated and text content is extracted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>AI analyzes the document with 3 specialized prompts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Executive Summary, Cost Analysis, and Risk Assessment are generated</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Report is saved to your dashboard (typically 30-90 seconds)</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
