"use client";

import * as XLSX from 'xlsx';
import { STUDENTS, SUBJECTS, formatDate } from './attendance-data';
import { getAttendanceData, calculateStudentAttendance } from './storage';

export function exportToExcel(): void {
  const workbook = XLSX.utils.book_new();
  const data = getAttendanceData();

  SUBJECTS.forEach(subject => {
    const records = data[subject.id] || [];
    const sheetData: (string | number)[][] = [];

    const headerRow: (string | number)[] = ['S.No', 'Roll Number', 'Name'];
    
    records.forEach(record => {
      headerRow.push(`${formatDate(record.date)} (${record.time})`);
    });
    
    headerRow.push('Held', 'Attended', 'Percentage');
    sheetData.push(headerRow);

    STUDENTS.forEach((student, index) => {
      const row: (string | number)[] = [index + 1, student.rollNo, student.name];
      
      records.forEach(record => {
        const isAbsent = record.absentStudents.includes(student.rollNo);
        row.push(isAbsent ? 'A' : 'P');
      });

      const { held, attended, percentage } = calculateStudentAttendance(
        subject.id, 
        student.rollNo, 
        records
      );
      
      row.push(held, attended, `${percentage}%`);
      sheetData.push(row);
    });

    if (records.length > 0) {
      sheetData.push([]);
      sheetData.push(['Session Details:']);
      records.forEach((record, idx) => {
        sheetData.push([
          `Session ${idx + 1}`,
          formatDate(record.date),
          record.time,
          `Classes: ${record.numberOfClasses}`,
          `Notes: ${record.notes || 'N/A'}`
        ]);
      });
    }

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 35 },
      ...records.map(() => ({ wch: 18 })),
      { wch: 8 },
      { wch: 10 },
      { wch: 12 }
    ];

    const sheetName = subject.shortName.substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  const overallSheetData: (string | number)[][] = [];
  overallSheetData.push(['S.No', 'Roll Number', 'Name', 'Total Held', 'Total Attended', 'Overall %']);

  STUDENTS.forEach((student, index) => {
    let totalHeld = 0;
    let totalAttended = 0;

    SUBJECTS.forEach(subject => {
      const records = data[subject.id] || [];
      const { held, attended } = calculateStudentAttendance(subject.id, student.rollNo, records);
      totalHeld += held;
      totalAttended += attended;
    });

    const percentage = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 0;
    overallSheetData.push([index + 1, student.rollNo, student.name, totalHeld, totalAttended, `${percentage}%`]);
  });

  const overallWorksheet = XLSX.utils.aoa_to_sheet(overallSheetData);
  overallWorksheet['!cols'] = [
    { wch: 5 },
    { wch: 15 },
    { wch: 35 },
    { wch: 12 },
    { wch: 14 },
    { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(workbook, overallWorksheet, 'Overall');

  XLSX.writeFile(workbook, 'Student_Attendance_Report.xlsx');
}
