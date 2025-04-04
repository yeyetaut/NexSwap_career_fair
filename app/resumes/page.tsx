import { ResumesTable } from "@/components/resumes-table"
import { ResumesFilter } from "@/components/resumes-filter"

export default function ResumesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Uploaded Resumes</h1>
      </div>

      <ResumesFilter />
      <ResumesTable />
    </div>
  )
}

