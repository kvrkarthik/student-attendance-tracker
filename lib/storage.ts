"use client";

import { SubjectAttendance, SUBJECTS } from "./attendance-data";
import type { AttendanceRecord } from "./attendance-data";
export type { AttendanceRecord } from "./attendance-data";

const STORAGE_KEY = "attendance_data";

export function getAttendanceData(): SubjectAttendance {
  if (typeof window === "undefined") {
    return initializeEmptyData();
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initializeEmptyData();
    }
  }
  return initializeEmptyData();
}

function initializeEmptyData(): SubjectAttendance {
  const data: SubjectAttendance = {};
  SUBJECTS.forEach(subject => {
    data[subject.id] = [];
  });
  return data;
}

export function saveAttendanceData(data: SubjectAttendance): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save attendance data:", error);
      // Check if it's a quota exceeded error
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        throw new Error("Storage quota exceeded. Please export and clear old data.");
      }
      throw error;
    }
  }
}

export function addAttendanceRecord(subjectId: string, record: AttendanceRecord): void {
  // Validate input
  if (!subjectId || !SUBJECTS.find(s => s.id === subjectId)) {
    throw new Error("Invalid subject ID");
  }
  if (!record.date || !record.time || !record.numberOfClasses || record.numberOfClasses < 1) {
    throw new Error("Invalid attendance record data");
  }
  
  const data = getAttendanceData();
  if (!data[subjectId]) {
    data[subjectId] = [];
  }
  data[subjectId].push(record);
  saveAttendanceData(data);
}

export function updateAttendanceRecord(
  subjectId: string, 
  recordIndex: number, 
  record: AttendanceRecord
): void {
  // Validate input
  if (!subjectId || !SUBJECTS.find(s => s.id === subjectId)) {
    throw new Error("Invalid subject ID");
  }
  if (!record.date || !record.time || !record.numberOfClasses || record.numberOfClasses < 1) {
    throw new Error("Invalid attendance record data");
  }
  
  const data = getAttendanceData();
  if (!data[subjectId]) {
    throw new Error("Subject not found");
  }
  if (recordIndex < 0 || recordIndex >= data[subjectId].length) {
    throw new Error("Invalid record index");
  }
  
  data[subjectId][recordIndex] = record;
  saveAttendanceData(data);
}

export function deleteAttendanceRecord(subjectId: string, recordIndex: number): void {
  const data = getAttendanceData();
  if (!data[subjectId]) {
    throw new Error("Subject not found");
  }
  if (recordIndex < 0 || recordIndex >= data[subjectId].length) {
    throw new Error("Invalid record index");
  }
  
  data[subjectId].splice(recordIndex, 1);
  saveAttendanceData(data);
}

// Export function to backup data
export function exportDataAsJSON(): string {
  const data = getAttendanceData();
  return JSON.stringify(data, null, 2);
}

// Import function to restore data
export function importDataFromJSON(jsonString: string): void {
  try {
    const data = JSON.parse(jsonString);
    // Basic validation
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid data format");
    }
    saveAttendanceData(data);
  } catch (error) {
    console.error("Failed to import data:", error);
    throw new Error("Failed to import data. Please check the JSON format.");
  }
}

export function getSubjectAttendance(subjectId: string): AttendanceRecord[] {
  const data = getAttendanceData();
  return data[subjectId] || [];
}

export interface StudentAttendanceSummary {
  rollNo: string;
  name: string;
  held: number;
  attended: number;
  percentage: number;
}

export function calculateStudentAttendance(
  subjectId: string, 
  studentRollNo: string,
  records: AttendanceRecord[]
): { held: number; attended: number; percentage: number } {
  let held = 0;
  let attended = 0;

  records.forEach(record => {
    held += record.numberOfClasses;
    const isAbsent = record.absentStudents.includes(studentRollNo);
    if (!isAbsent) {
      attended += record.numberOfClasses;
    }
  });

  const percentage = held > 0 ? Math.round((attended / held) * 100) : 0;
  return { held, attended, percentage };
}

export function calculateOverallAttendance(
  studentRollNo: string
): { held: number; attended: number; percentage: number } {
  const data = getAttendanceData();
  let totalHeld = 0;
  let totalAttended = 0;

  Object.keys(data).forEach(subjectId => {
    const records = data[subjectId];
    const { held, attended } = calculateStudentAttendance(subjectId, studentRollNo, records);
    totalHeld += held;
    totalAttended += attended;
  });

  const percentage = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 0;
  return { held: totalHeld, attended: totalAttended, percentage };
}

export function getSubjectStats(subjectId: string): { totalClasses: number; totalRecords: number } {
  const records = getSubjectAttendance(subjectId);
  const totalClasses = records.reduce((sum, r) => sum + r.numberOfClasses, 0);
  return { totalClasses, totalRecords: records.length };
}
