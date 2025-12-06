"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUBJECTS, STUDENTS, getAttendanceBadgeColor } from "@/lib/attendance-data";
import { getAttendanceData, calculateStudentAttendance, calculateOverallAttendance } from "@/lib/storage";
import { exportToExcel } from "@/lib/excel-export";
import { ArrowLeft, Download, BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function OverallAttendancePage() {
  const [mounted, setMounted] = useState(false);
  const [subjectData, setSubjectData] = useState<{ [key: string]: { held: number; attended: number; percentage: number }[] }>({});
  
  useEffect(() => {
    setMounted(true);
    const data = getAttendanceData();
    const result: { [key: string]: { held: number; attended: number; percentage: number }[] } = {};
    
    SUBJECTS.forEach(subject => {
      result[subject.id] = STUDENTS.map(student => {
        const records = data[subject.id] || [];
        return calculateStudentAttendance(subject.id, student.rollNo, records);
      });
    });
    
    setSubjectData(result);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  const overallStats = STUDENTS.map(student => calculateOverallAttendance(student.rollNo));
  
  const totalStudents = STUDENTS.length;
  const aboveThreshold = overallStats.filter(s => s.percentage >= 75).length;
  const warningZone = overallStats.filter(s => s.percentage >= 65 && s.percentage < 75).length;
  const dangerZone = overallStats.filter(s => s.percentage < 65 && s.held > 0).length;
  const noClasses = overallStats.filter(s => s.held === 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Overall Attendance</h1>
                <p className="text-gray-500 text-sm">All subjects combined</p>
              </div>
            </div>
            <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700">Above 75%</p>
                <p className="text-2xl font-bold text-green-800">{aboveThreshold}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-yellow-500 rounded-full">
                <Minus className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-yellow-700">65% - 75%</p>
                <p className="text-2xl font-bold text-yellow-800">{warningZone}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-red-500 rounded-full">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-red-700">Below 65%</p>
                <p className="text-2xl font-bold text-red-800">{dangerZone}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-gray-500 rounded-full">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow border text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10 w-10">
                  #
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-10 bg-gray-50 z-10 min-w-[110px]">
                  Roll No
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-32 bg-gray-50 z-10 min-w-[180px]">
                  Name
                </th>
                {SUBJECTS.map(subject => (
                  <th key={subject.id} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase min-w-[90px]" title={subject.name}>
                    {subject.shortName}
                  </th>
                ))}
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-blue-50 min-w-[60px]">
                  H
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-green-50 min-w-[60px]">
                  A
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-indigo-50 min-w-[70px]">
                  Overall %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {STUDENTS.map((student, idx) => {
                const overall = overallStats[idx];
                const overallBadgeColor = getAttendanceBadgeColor(overall.percentage);

                return (
                  <tr key={student.rollNo} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-gray-600 sticky left-0 bg-white">
                      {idx + 1}
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900 sticky left-10 bg-white">
                      {student.rollNo}
                    </td>
                    <td className="px-2 py-2 text-gray-800 sticky left-32 bg-white" title={student.name}>
                      <div className="truncate max-w-[170px]">{student.name}</div>
                    </td>
                    {SUBJECTS.map(subject => {
                      const stats = subjectData[subject.id]?.[idx];
                      if (!stats || stats.held === 0) {
                        return (
                          <td key={subject.id} className="px-2 py-2 text-center text-gray-400">
                            -
                          </td>
                        );
                      }
                      const badgeColor = getAttendanceBadgeColor(stats.percentage);
                      return (
                        <td key={subject.id} className="px-2 py-2 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold ${badgeColor}`}>
                            {stats.percentage}%
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-2 py-2 text-center font-medium bg-blue-50">
                      {overall.held}
                    </td>
                    <td className="px-2 py-2 text-center font-medium bg-green-50">
                      {overall.attended}
                    </td>
                    <td className="px-2 py-2 text-center bg-indigo-50">
                      {overall.held > 0 ? (
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${overallBadgeColor}`}>
                          {overall.percentage}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg shadow border">
          <h3 className="font-semibold text-gray-700 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">H:</span>
              <span>Classes Held</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">A:</span>
              <span>Classes Attended</span>
            </div>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500 text-white">75%+</span>
              <span className="text-gray-600">Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500 text-white">65-75%</span>
              <span className="text-gray-600">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500 text-white">&lt;65%</span>
              <span className="text-gray-600">Danger</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
