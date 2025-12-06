"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SUBJECTS, STUDENTS, TIME_SLOTS, formatDate } from "@/lib/attendance-data";
import { getSubjectAttendance, updateAttendanceRecord, AttendanceRecord } from "@/lib/storage";
import { ArrowLeft, Check, X, Users, CheckSquare, Square, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function EditAttendancePage({ 
  params 
}: { 
  params: Promise<{ subjectId: string; recordIndex: string }> 
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [numberOfClasses, setNumberOfClasses] = useState(1);
  const [notes, setNotes] = useState("");
  const [absentStudents, setAbsentStudents] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const subject = SUBJECTS.find(s => s.id === resolvedParams.subjectId);
  const recordIndex = parseInt(resolvedParams.recordIndex);

  useEffect(() => {
    setMounted(true);
    if (subject) {
      const records = getSubjectAttendance(subject.id);
      const record = records[recordIndex];
      if (record) {
        setDate(record.date);
        setTime(record.time);
        setNumberOfClasses(record.numberOfClasses);
        setNotes(record.notes || "");
        setAbsentStudents(new Set(record.absentStudents));
      }
    }
    setLoading(false);
  }, [subject, recordIndex]);

  const toggleAbsent = (rollNo: string) => {
    const newAbsent = new Set(absentStudents);
    if (newAbsent.has(rollNo)) {
      newAbsent.delete(rollNo);
    } else {
      newAbsent.add(rollNo);
    }
    setAbsentStudents(newAbsent);
  };

  const selectAllAbsent = () => {
    setAbsentStudents(new Set(STUDENTS.map(s => s.rollNo)));
  };

  const clearAllAbsent = () => {
    setAbsentStudents(new Set());
  };

  const handleSubmit = () => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive"
      });
      return;
    }

    try {
      updateAttendanceRecord(resolvedParams.subjectId, recordIndex, {
        date,
        time,
        numberOfClasses,
        notes,
        absentStudents: Array.from(absentStudents)
      });

      toast({
        title: "Success!",
        description: `Attendance updated for ${subject?.name}. ${STUDENTS.length - absentStudents.size} present, ${absentStudents.size} absent.`,
      });

      router.push(`/view-attendance/${resolvedParams.subjectId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update attendance. Please try again.",
        variant: "destructive"
      });
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

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  const presentCount = STUDENTS.length - absentStudents.size;
  const absentCount = absentStudents.size;

  const columns = 4;
  const studentsPerColumn = Math.ceil(STUDENTS.length / columns);
  const studentColumns: typeof STUDENTS[] = [];
  for (let i = 0; i < columns; i++) {
    studentColumns.push(STUDENTS.slice(i * studentsPerColumn, (i + 1) * studentsPerColumn));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/view-attendance/${subject.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Attendance</h1>
                <p className="text-gray-500 text-sm">{subject.name} - {formatDate(date)}</p>
              </div>
            </div>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Update Attendance
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject.name}
                    disabled
                    className="mt-1 bg-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time *</Label>
                  <select
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="classes">Number of Classes *</Label>
                  <Input
                    id="classes"
                    type="number"
                    min="1"
                    max="10"
                    value={numberOfClasses}
                    onChange={(e) => setNumberOfClasses(parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (What was taught)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Topics covered in this session..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-green-600">
                      <Check className="h-4 w-4" />
                      Present: {presentCount}
                    </span>
                    <span className="flex items-center gap-2 text-red-600">
                      <X className="h-4 w-4" />
                      Absent: {absentCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Edit Attendance
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={selectAllAbsent}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Select All Absent
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearAllAbsent}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Click on a student to toggle their attendance. Ticked students are ABSENT.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {studentColumns.map((column, colIndex) => (
                    <div key={colIndex} className="space-y-1">
                      {column.map((student, idx) => {
                        const isAbsent = absentStudents.has(student.rollNo);
                        const globalIndex = colIndex * studentsPerColumn + idx + 1;
                        return (
                          <button
                            key={student.rollNo}
                            onClick={() => toggleAbsent(student.rollNo)}
                            className={`w-full text-left p-2 rounded-md border transition-all ${
                              isAbsent 
                                ? 'bg-red-50 border-red-300 hover:bg-red-100' 
                                : 'bg-green-50 border-green-300 hover:bg-green-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isAbsent 
                                  ? 'bg-red-500 border-red-500 text-white' 
                                  : 'border-gray-300'
                              }`}>
                                {isAbsent && <Check className="h-3 w-3" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-600 truncate">
                                  {globalIndex}. {student.rollNo}
                                </div>
                                <div className="text-xs text-gray-800 truncate" title={student.name}>
                                  {student.name}
                                </div>
                              </div>
                              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                isAbsent 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-green-500 text-white'
                              }`}>
                                {isAbsent ? 'A' : 'P'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
