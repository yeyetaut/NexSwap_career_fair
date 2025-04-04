import { NextResponse } from "next/server"
import { listResumes, getResumeViewUrl, getResumeDownloadUrl, extractMetadataFromKey } from "@/lib/s3-service"

export async function GET() {
  try {
    // Get list of resume objects from S3
    const objects = await listResumes()

    // Process each object to create our resume data
    const resumesPromises = objects.map(async (object) => {
      if (!object.Key) return null

      // Skip the folder itself
      if (object.Key.endsWith("/")) {
        return null
      }

      // Extract metadata from the filename
      const metadata = extractMetadataFromKey(object.Key)
      if (!metadata) return null

      // Use the actual LastModified date from S3 if available
      if (object.LastModified) {
        metadata.submissionTime = object.LastModified.toISOString()
      }

      // Generate pre-signed URLs for viewing and downloading
      const viewUrl = await getResumeViewUrl(object.Key)
      const downloadUrl = await getResumeDownloadUrl(object.Key)

      return {
        id: object.ETag?.replace(/"/g, "") || object.Key,
        applicantName: metadata.applicantName,
        roleApplied: metadata.roleApplied,
        submissionTime: metadata.submissionTime,
        status: metadata.status,
        view_url: viewUrl,
        resume_url: downloadUrl,
        s3Key: object.Key,
      }
    })

    // Wait for all promises to resolve and filter out nulls
    const resumes = (await Promise.all(resumesPromises)).filter(Boolean)

    // Sort by submission time (newest first)
    resumes.sort((a, b) => new Date(b?.submissionTime || 0).getTime() - new Date(a?.submissionTime || 0).getTime())

    return NextResponse.json(resumes)
  } catch (error) {
    console.error("Error fetching resumes:", error)
    return NextResponse.json(
      { error: "Failed to fetch resumes", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

