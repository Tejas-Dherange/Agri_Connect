import Link from "next/link"

export default function PestAlertSuccess() {
  return (
    <div className="max-w-md mx-auto text-center mt-10">
      <div className="card">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-4">Pest Alert Submitted!</h1>

        <p className="mb-6">
          Thank you for submitting your pest alert. Our agricultural experts will review your report and provide
          guidance as soon as possible.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard/farmer" className="btn btn-primary">
            Return to Dashboard
          </Link>
          <Link href="/pest-alerts/report" className="btn btn-secondary">
            Submit Another Report
          </Link>
        </div>
      </div>
    </div>
  )
}

