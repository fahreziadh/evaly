import { useState } from "react";
import { FileSpreadsheet, FileText, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Submission } from "./types";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

interface ExportDialogProps {
  data: Submission[];
  testName?: string;
}

export const ExportDialog = ({
  data,
  testName = "Test",
}: ExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Prepare data for export
  const prepareData = () => {
    return data.map((submission) => ({
      Rank: submission.rank,
      Name: submission.name,
      Email: submission.email,
      Score: `${submission.score}%`,
      Answered: `${submission.answered}/${submission.totalQuestions}`,
      Correct: `${submission.correct}/${submission.totalQuestions}`,
      Wrong: `${submission.wrong}/${submission.totalQuestions}`,
      Unanswered: submission.unanswered,
      Status: 
        submission.status === "in-progress" ? "In Progress" : 
        submission.status === "test-ended" ? "Time&apos;s up" : 
        submission.status === "completed" ? "Completed" : 
        "Not Started",
      Submitted: submission.submittedAt
        ? new Date(submission.submittedAt).toLocaleString()
        : submission.status === "in-progress"
        ? "In Progress"
        : submission.status === "test-ended"
        ? "Not Submitted (Time&apos;s up)"
        : "Not Submitted",
    }));
  };

  // Export to Excel
  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const exportData = prepareData();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

      // Set column widths
      const colWidths = [
        { wch: 5 }, // Rank
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 8 }, // Score
        { wch: 10 }, // Answered
        { wch: 10 }, // Correct
        { wch: 10 }, // Wrong
        { wch: 10 }, // Unanswered
        { wch: 12 }, // Status
        { wch: 20 }, // Submitted
      ];
      worksheet["!cols"] = colWidths;

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Save file
      saveAs(
        blob,
        `${testName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_submissions_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );

      toast.success("Submissions exported as Excel successfully");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to export as Excel. Please try again.");
    } finally {
      setIsExporting(false);
      setOpen(false);
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const exportData = prepareData();

      // Create PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text(`${testName} - Submissions Report`, 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
      doc.text(`Total Submissions: ${exportData.length}`, 14, 28);

      // Use autoTable directly as a function
      autoTable(doc, {
        head: [
          [
            "Rank",
            "Name",
            "Email",
            "Score",
            "Answered",
            "Correct",
            "Wrong",
            "Status",
          ],
        ],
        body: exportData.map((item) => [
          item.Rank,
          item.Name,
          item.Email,
          item.Score,
          item.Answered,
          item.Correct,
          item.Wrong,
          item.Status,
        ]),
        startY: 35,
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 45 },
          3: { cellWidth: 15 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
        },
      });

      // Save PDF
      doc.save(
        `${testName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_submissions_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      toast.success("Submissions exported as PDF successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export as PDF. Please try again.");
    } finally {
      setIsExporting(false);
      setOpen(false);
    }
  };

  // Export to CSV
  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const exportData = prepareData();

      // Create CSV headers
      const headers = Object.keys(exportData[0]).join(",");

      // Create CSV rows
      const rows = exportData.map((item) =>
        Object.values(item)
          .map((value) => `"${value}"`) // Wrap values in quotes to handle commas
          .join(",")
      );

      // Combine headers and rows
      const csvContent = [headers, ...rows].join("\n");

      // Create blob and save
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      saveAs(
        blob,
        `${testName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_submissions_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );

      toast.success("Submissions exported as CSV successfully");
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error("Failed to export as CSV. Please try again.");
    } finally {
      setIsExporting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FileJson />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Submissions</DialogTitle>
          <DialogDescription>
            Choose a format to export the submissions data
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={exportToExcel}
            disabled={isExporting}
          >
            <FileSpreadsheet className="size-8 text-green-600" />
            <span>Excel</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={exportToPDF}
            disabled={isExporting}
          >
            <FileText className="size-8 text-red-600" />
            <span>PDF</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={exportToCSV}
            disabled={isExporting}
          >
            <FileJson className="size-8 text-blue-600" />
            <span>CSV</span>
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Note: The export will include all {data.length} submissions with the
          current filters applied.
        </div>
      </DialogContent>
    </Dialog>
  );
};
