"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Printer, Share2 } from "lucide-react"

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedExam, setSelectedExam] = useState("final")

  // Sample data for reports
  const examResults = [
    {
      id: 1,
      student: "Emily Davis",
      class: "10A",
      subject: "Mathematics",
      exam: "Mid-term",
      score: 85,
      grade: "A",
      status: "Pass",
    },
    {
      id: 2,
      student: "James Wilson",
      class: "11B",
      subject: "Science",
      exam: "Final",
      score: 92,
      grade: "A+",
      status: "Pass",
    },
    {
      id: 3,
      student: "Olivia Martinez",
      class: "12C",
      subject: "English",
      exam: "Mid-term",
      score: 78,
      grade: "B+",
      status: "Pass",
    },
    {
      id: 4,
      student: "William Anderson",
      class: "10A",
      subject: "Mathematics",
      exam: "Final",
      score: 65,
      grade: "C",
      status: "Pass",
    },
    {
      id: 5,
      student: "Sophia Thomas",
      class: "11B",
      subject: "Science",
      exam: "Mid-term",
      score: 45,
      grade: "F",
      status: "Fail",
    },
    {
      id: 6,
      student: "Benjamin Jackson",
      class: "12C",
      subject: "English",
      exam: "Final",
      score: 88,
      grade: "A",
      status: "Pass",
    },
    {
      id: 7,
      student: "Isabella White",
      class: "10A",
      subject: "Mathematics",
      exam: "Mid-term",
      score: 72,
      grade: "B",
      status: "Pass",
    },
    {
      id: 8,
      student: "Ethan Harris",
      class: "11B",
      subject: "Science",
      exam: "Final",
      score: 58,
      grade: "D",
      status: "Pass",
    },
  ]

  // Filter results based on selections
  const filteredResults = examResults.filter(
    (result) =>
      (selectedClass === "all" || result.class === selectedClass) &&
      (selectedSubject === "all" || result.subject === selectedSubject) &&
      (selectedExam === "all" || result.exam.toLowerCase() === selectedExam),
  )

  // Calculate statistics
  const totalStudents = filteredResults.length
  const passCount = filteredResults.filter((result) => result.status === "Pass").length
  const failCount = filteredResults.filter((result) => result.status === "Fail").length
  const passRate = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0
  const averageScore =
    totalStudents > 0 ? Math.round(filteredResults.reduce((sum, result) => sum + result.score, 0) / totalStudents) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Results</h1>
        <p className="text-muted-foreground">Generate and view examination reports and results</p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate}%</div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}</div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pass/Fail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {passCount}/{failCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="10A">Class 10A</SelectItem>
              <SelectItem value="11B">Class 11B</SelectItem>
              <SelectItem value="12C">Class 12C</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="English">English</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              <SelectItem value="mid-term">Mid-term</SelectItem>
              <SelectItem value="final">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
            <span className="sr-only">Print</span>
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Exam Results</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Class Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Examination Results</CardTitle>
              <CardDescription>View detailed examination results for students</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.student}</TableCell>
                      <TableCell>{result.class}</TableCell>
                      <TableCell>{result.subject}</TableCell>
                      <TableCell>{result.exam}</TableCell>
                      <TableCell>{result.score}</TableCell>
                      <TableCell>{result.grade}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            result.status === "Pass"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {result.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Analyze student performance across different subjects and exams</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Performance Charts</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Performance analysis charts and graphs will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Class Comparison</CardTitle>
              <CardDescription>Compare performance between different classes and subjects</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Comparison Charts</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Class comparison charts and graphs will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

