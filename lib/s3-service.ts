import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { resolve } from 'path';
import {exec, execFile, spawn, fork} from 'child_process'
import path from 'path'
import { fileURLToPath } from "url"
import {dirname} from 'path'
import { Fira_Code } from "next/font/google"

//const __dirname = dirname(fileURLToPath(import.meta.url))

//const forkProcessorPath = path.resolve(__dirname,'NFCReaderGUI.py')
//const forkedChild = fork("NFCReaderGUI.py")
//forkedChild.on('message',msg => {
//  console.log('Message from data processor exchange', msg)
//});
// Creates a new WebSocket connection to the specified URL.

import { readFileSync } from 'fs';

//const configPath = resolve(__dirname, '../new-hr-portal\new-hr-portal\lib\resume.json');
// Define interface for type safety
interface User {
  resume: string;
}

// Read and parse JSON file
const readUsers = (): User[] => {
  try {
    const data = readFileSync('C:/Users/Ye Ye Taut/Desktop/Nexswap/new-hr-portal/new-hr-portal/lib/resume.json', 'utf-8');
    return JSON.parse(data) as User[];
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
};

// Usage
const users = readUsers();

console.log(users[0]?.resume); // Type-safe access


// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

const bucketName = process.env.S3_BUCKET_NAME || ""

// List all resumes in the bucket
export async function listResumes() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: "company_nexswap/", // Target the company_nexswap/ folder
    })

    const response = await s3Client.send(command)
    return response.Contents || []
  } catch (error) {
    console.error("Error listing resumes from S3:", error)
    throw error
  }
}

// Generate a pre-signed URL for viewing a resume
export async function getResumeViewUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    // URL expires in 15 minutes
    return await getSignedUrl(s3Client, command, { expiresIn: 900 })
  } catch (error) {
    console.error("Error generating view URL:", error)
    throw error
  }
}

// Generate a pre-signed URL for downloading a resume
export async function getResumeDownloadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${key.split("/").pop()}"`,
    })

    // URL expires in 15 minutes
    return await getSignedUrl(s3Client, command, { expiresIn: 900 })
  } catch (error) {
    console.error("Error generating download URL:", error)
    throw error
  }
}

//const {spawn} = require('child_process')
//const child = spawn('pwd')

// Extract metadata from the S3 key (assuming a naming convention)
export function extractMetadataFromKey(key: string) {
  const users = readUsers()
  // Example key format: company_nexswap/john-doe_software-developer.pdf
  const filename = key.split("/").pop() || ""
  for(var i in users){
    if(filename == users[i].resume){
  // Skip if it's not a PDF
      if (!filename || !filename.toLowerCase().endsWith(".pdf")) {
        return null
      }

      // Parse the filename to extract metadata

      const parts = filename.replace(".pdf", "").split("_")
      
      if (parts.length >= 2) {
        // Extract name parts (assuming format: firstname-lastname)
        const nameParts = parts[0].split("-")
        let formattedName = "Unknown"

        if (nameParts.length >= 2) {
          // Format name with proper capitalization
          formattedName = nameParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
        } else if (nameParts.length === 1) {
          // Handle single name
          formattedName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
        }

        // Extract role parts (assuming format: role-title)
        const roleParts = parts[1].split("-")
        let formattedRole = "Unspecified Role"

        if (roleParts.length >= 1) {
          // Format role with proper capitalization
          formattedRole = roleParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
        }

        // Randomly assign a status for demonstration
        const statuses: ("new" | "reviewed" | "shortlisted" | "rejected")[] = ["new", "reviewed", "shortlisted", "rejected"]
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
        
        return {
          applicantName: formattedName,
          roleApplied: formattedRole,
          submissionTime: new Date().toISOString(), // We'll update this with the actual LastModified in the API route
          status: "new",
        }
      }
    }
  }

  // Fallback for files that don't match the expected format
  //return {
  //  applicantName: filename.replace(".pdf", ""),
  //  roleApplied: "Unspecified Role",
  //  submissionTime: new Date().toISOString(),
  //  status: "new" as const,
  //}

}
