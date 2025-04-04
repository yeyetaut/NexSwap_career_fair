import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recentActivities = [
  {
    id: 1,
    applicant: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      initials: "SJ",
    },
    action: "applied",
    role: "Senior UX Designer",
    time: "2 hours ago",
    status: "new",
  },
  {
    id: 2,
    applicant: {
      name: "Michael Chen",
      avatar: "/placeholder.svg",
      initials: "MC",
    },
    action: "interviewed",
    role: "Software Engineer",
    time: "Yesterday",
    status: "in-progress",
  },
  {
    id: 3,
    applicant: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg",
      initials: "ER",
    },
    action: "matched",
    role: "Product Manager",
    time: "2 days ago",
    status: "matched",
  },
  {
    id: 4,
    applicant: {
      name: "David Kim",
      avatar: "/placeholder.svg",
      initials: "DK",
    },
    action: "rejected",
    role: "Data Scientist",
    time: "3 days ago",
    status: "rejected",
  },
  {
    id: 5,
    applicant: {
      name: "Olivia Wilson",
      avatar: "/placeholder.svg",
      initials: "OW",
    },
    action: "offered",
    role: "Marketing Manager",
    time: "1 week ago",
    status: "offered",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
          New
        </Badge>
      )
    case "in-progress":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-50">
          In Progress
        </Badge>
      )
    case "matched":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
          Matched
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
          Rejected
        </Badge>
      )
    case "offered":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-600 hover:bg-purple-50">
          Offered
        </Badge>
      )
    default:
      return null
  }
}

const getActionText = (action: string, role: string) => {
  switch (action) {
    case "applied":
      return (
        <>
          Applied for <span className="font-medium">{role}</span>
        </>
      )
    case "interviewed":
      return (
        <>
          Interviewed for <span className="font-medium">{role}</span>
        </>
      )
    case "matched":
      return (
        <>
          Matched with <span className="font-medium">{role}</span>
        </>
      )
    case "rejected":
      return (
        <>
          Rejected for <span className="font-medium">{role}</span>
        </>
      )
    case "offered":
      return (
        <>
          Offered position: <span className="font-medium">{role}</span>
        </>
      )
    default:
      return null
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest applicant activities and status changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={activity.applicant.avatar} alt={activity.applicant.name} />
                  <AvatarFallback>{activity.applicant.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{activity.applicant.name}</p>
                  <p className="text-sm text-muted-foreground">{getActionText(activity.action, activity.role)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(activity.status)}
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

