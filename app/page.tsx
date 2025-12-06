"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUBJECTS, STUDENTS } from "@/lib/attendance-data";
import { getSubjectStats } from "@/lib/storage";
import { exportToExcel } from "@/lib/excel-export";
import { BookOpen, FlaskConical, Users, Eye, PenLine, BarChart3, Download, GraduationCap } from "lucide-react";

export default function HomePage() {
  const [subjectStats, setSubjectStats] = useState<{ [key: string]: { totalClasses: number; totalRecords: number } }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stats: { [key: string]: { totalClasses: number; totalRecords: number } } = {};
    SUBJECTS.forEach(subject => {
      stats[subject.id] = getSubjectStats(subject.id);
    });
    setSubjectStats(stats);
  }, []);

  const theorySubjects = SUBJECTS.filter(s => s.type === "theory");
  const labSubjects = SUBJECTS.filter(s => s.type === "lab");

  const handleExport = () => {
    exportToExcel();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-10 w-10 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Attendance Tracker</h1>
                <p className="text-gray-500 mt-1">{STUDENTS.length} Students • {SUBJECTS.length} Subjects</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/post-attendance">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <PenLine className="h-4 w-4 mr-2" />
                  Post Attendance
                </Button>
              </Link>
              <Link href="/overall-attendance">
                <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overall Attendance
                </Button>
              </Link>
              <Button variant="outline" onClick={handleExport} className="border-green-600 text-green-600 hover:bg-green-50">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Theory Subjects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theorySubjects.map(subject => (
              <SubjectCard 
                key={subject.id} 
                subject={subject} 
                stats={subjectStats[subject.id] || { totalClasses: 0, totalRecords: 0 }}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Lab Subjects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labSubjects.map(subject => (
              <SubjectCard 
                key={subject.id} 
                subject={subject}
                stats={subjectStats[subject.id] || { totalClasses: 0, totalRecords: 0 }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow border">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
            Attendance Percentage Legend
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">Above 75%</span>
              <span className="text-gray-600 text-sm">Safe Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-white">65% - 75%</span>
              <span className="text-gray-600 text-sm">Warning Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">Below 65%</span>
              <span className="text-gray-600 text-sm">Danger Zone</span>
            </div>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500 text-white">P</span>
              <span className="text-gray-600 text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500 text-white">A</span>
              <span className="text-gray-600 text-sm">Absent</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SubjectCard({ 
  subject, 
  stats 
}: { 
  subject: { id: string; name: string; shortName: string; type: string };
  stats: { totalClasses: number; totalRecords: number };
}) {
  const isLab = subject.type === "lab";
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className={`pb-3 ${isLab ? 'bg-purple-50' : 'bg-blue-50'} rounded-t-lg`}>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{subject.name}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${isLab ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
            {subject.shortName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{STUDENTS.length} students</span>
          </div>
          <div>
            <span className="font-medium">{stats.totalClasses}</span> classes held
          </div>
          <div>
            <span className="font-medium">{stats.totalRecords}</span> sessions
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/view-attendance/${subject.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
          <Link href={`/post-attendance?subject=${subject.id}`} className="flex-1">
            <Button className={`w-full ${isLab ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`} size="sm">
              <PenLine className="h-4 w-4 mr-2" />
              Post
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
