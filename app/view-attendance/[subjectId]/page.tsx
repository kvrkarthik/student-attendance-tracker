"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUBJECTS, STUDENTS, formatDate, getAttendancePercentageColor, getAttendanceBadgeColor } from "@/lib/attendance-data";
import { getSubjectAttendance, calculateStudentAttendance, deleteAttendanceRecord, AttendanceRecord } from "@/lib/storage";
import { ArrowLeft, Calendar, Clock, BookOpen, Edit2, Trash2, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ViewAttendancePage({ params }: { params: Promise<{ subjectId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  const subject = SUBJECTS.find(s => s.id === resolvedParams.subjectId);

  useEffect(() => {
    setMounted(true);
    if (subject) {
      setRecords(getSubjectAttendance(subject.id));
    }
  }, [subject]);

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this attendance record?")) {
      try {
        deleteAttendanceRecord(resolvedParams.subjectId, index);
        setRecords(getSubjectAttendance(resolvedParams.subjectId));
        toast({
          title: "Deleted",
          description: "Attendance record has been deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete attendance record. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Subject not found</h1>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  const totalClasses = records.reduce((sum, r) => sum + r.numberOfClasses, 0);

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
                <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
                <p className="text-gray-500 text-sm">
                  {records.length} sessions • {totalClasses} classes held
                </p>
              </div>
            </div>
            <Link href={`/post-attendance?subject=${subject.id}`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Post New Attendance
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {records.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No attendance records yet</h2>
              <p className="text-gray-500 mb-4">Start by posting attendance for this subject.</p>
              <Link href={`/post-attendance?subject=${subject.id}`}>
                <Button>Post First Attendance</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow border">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    S.No
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-12 bg-gray-50 z-10 min-w-[120px]">
                    Roll No
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-36 bg-gray-50 z-10 min-w-[200px]">
                    Name
                  </th>
                  {records.map((record, idx) => (
                    <th key={idx} className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(record.date)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-3 w-3" />
                          {record.time}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({record.numberOfClasses} class{record.numberOfClasses > 1 ? 'es' : ''})
                        </span>
                        <div className="flex gap-1 mt-1">
                          <Link href={`/edit-attendance/${subject.id}/${idx}`}>
                            <button className="p-1 hover:bg-blue-100 rounded" title="Edit">
                              <Edit2 className="h-3 w-3 text-blue-600" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(idx)} 
                            className="p-1 hover:bg-red-100 rounded" 
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                    Held (H)
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50">
                    Attended (A)
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {STUDENTS.map((student, idx) => {
                  const { held, attended, percentage } = calculateStudentAttendance(
                    subject.id,
                    student.rollNo,
                    records
                  );
                  const percentageColor = getAttendancePercentageColor(percentage);
                  const badgeColor = getAttendanceBadgeColor(percentage);

                  return (
                    <tr key={student.rollNo} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-600 sticky left-0 bg-white">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 sticky left-12 bg-white">
                        {student.rollNo}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800 sticky left-36 bg-white" title={student.name}>
                        <div className="truncate max-w-[180px]">{student.name}</div>
                      </td>
                      {records.map((record, recIdx) => {
                        const isAbsent = record.absentStudents.includes(student.rollNo);
                        return (
                          <td key={recIdx} className="px-2 py-2 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                              isAbsent 
                                ? 'bg-red-500 text-white' 
                                : 'bg-green-500 text-white'
                            }`}>
                              {isAbsent ? 'A' : 'P'}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-3 py-2 text-center text-sm font-medium bg-blue-50">
                        {held}
                      </td>
                      <td className="px-3 py-2 text-center text-sm font-medium bg-green-50">
                        {attended}
                      </td>
                      <td className={`px-3 py-2 text-center`}>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {records.length > 0 && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {records.map((record, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">{formatDate(record.date)}</span>
                        <span>{record.time}</span>
                        <span>{record.numberOfClasses} class(es)</span>
                      </div>
                      {record.notes && (
                        <p className="mt-2 text-gray-800">{record.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
