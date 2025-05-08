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
import { Submission, Section } from "./types";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

interface Question {
  id: string;
  sectionId: string;
  text?: string | null;
  type?: string | null;
  correctAnswer?: string | null;
  participantAnswer?: string | null;
  isCorrect?: boolean | null;
}

interface ExportDialogDetailsProps {
  submission: Submission | null;
  testName?: string;
  questions?: Question[];
  sections?: Section[];
}

export const ExportDialogDetails = ({
  submission,
  testName = "Test",
  questions = [],
  sections = [],
}: ExportDialogDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!submission) return null;

  // Prepare submission data for export
  const prepareSubmissionData = () => {
    return {
      Name: submission.name,
      Email: submission.email,
      Score: `${submission.score}%`,
      Rank: submission.rank || "N/A",
      Answered: `${submission.answered}/${submission.totalQuestions}`,
      Correct: `${submission.correct}/${submission.totalQuestions}`,
      Wrong: `${submission.wrong}/${submission.totalQuestions}`,
      Unanswered: submission.unanswered,
      Status: 
        submission.status === "in-progress" ? "In Progress" : 
        submission.status === "test-ended" ? "Time&apos;s up" : 
        submission.status === "completed" ? "Completed" : 
        "Not Started",
      StartedAt: submission.startedAt
        ? new Date(submission.startedAt).toLocaleString()
        : "Unknown",
      SubmittedAt: submission.submittedAt
        ? new Date(submission.submittedAt).toLocaleString()
        : submission.status === "in-progress"
        ? "In Progress"
        : submission.status === "test-ended"
        ? "Not Submitted (Time&apos;s up)"
        : "Not Submitted",
    };
  };

  // Prepare questions data for export
  const prepareQuestionsData = () => {
    return questions.map((question, index) => {
      const section = sections.find((s) => s.id === question.sectionId);
      const sectionIndex = sections.findIndex((s) => s.id === question.sectionId);
      const sectionName = section?.name || `Section ${sectionIndex + 1}`;
      
      return {
        QuestionNumber: index + 1,
        Section: sectionName,
        Type: question.type?.replace(/_/g, " ") || "Unknown",
        Question: question.text?.replace(/<[^>]*>?/gm, "") || "",
        CorrectAnswer: question.correctAnswer?.replace(/<[^>]*>?/gm, "") || "",
        ParticipantAnswer: question.participantAnswer?.replace(/<[^>]*>?/gm, "") || "Not answered",
        Status: question.isCorrect === true 
          ? "Correct" 
          : question.isCorrect === false 
          ? "Wrong" 
          : "Unanswered",
      };
    });
  };

  // Prepare sections data for export
  const prepareSectionsData = () => {
    return sections.map((section, index) => {
      const answered = submission.sectionAnswers?.[section.id] || 0;
      const correct = submission.sectionCorrect?.[section.id] || 0;
      const wrong = submission.sectionWrong?.[section.id] || 0;
      const total = section.questionsCount || 0;
      const unanswered = total - answered;
      const score = total > 0 ? Math.round((correct / total) * 100) : 0;

      return {
        Section: section.name || `Section ${index + 1}`,
        Score: `${score}%`,
        Answered: `${answered}/${total}`,
        Correct: correct,
        Wrong: wrong,
        Unanswered: unanswered,
      };
    });
  };

  // Export to Excel
  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const submissionData = prepareSubmissionData();
      const questionsData = prepareQuestionsData();
      const sectionsData = prepareSectionsData();

      const workbook = XLSX.utils.book_new();

      // Summary sheet
      const summaryWorksheet = XLSX.utils.json_to_sheet([submissionData]);
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

      // Sections sheet
      if (sectionsData.length > 0) {
        const sectionsWorksheet = XLSX.utils.json_to_sheet(sectionsData);
        XLSX.utils.book_append_sheet(workbook, sectionsWorksheet, "Sections");
      }

      // Questions sheet
      if (questionsData.length > 0) {
        const questionsWorksheet = XLSX.utils.json_to_sheet(questionsData);
        XLSX.utils.book_append_sheet(workbook, questionsWorksheet, "Questions");
      }

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
        `${testName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${submission.email.split("@")[0]}_details_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );

      toast.success("Details exported as Excel successfully");
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
      const submissionData = prepareSubmissionData();
      const questionsData = prepareQuestionsData();
      const sectionsData = prepareSectionsData();

      // Create PDF document
      const doc = new jsPDF();
      let yPos = 15;

      // Add title
      doc.setFontSize(16);
      doc.text(`${testName} - Submission Details`, 14, yPos);
      yPos += 10;

      // Add participant info
      doc.setFontSize(12);
      doc.text(`Participant: ${submissionData.Name} (${submissionData.Email})`, 14, yPos);
      yPos += 7;
      doc.text(`Score: ${submissionData.Score} | Rank: ${submissionData.Rank}`, 14, yPos);
      yPos += 7;
      doc.text(`Status: ${submissionData.Status}`, 14, yPos);
      yPos += 7;
      doc.text(`Started: ${submissionData.StartedAt}`, 14, yPos);
      yPos += 7;
      doc.text(`Submitted: ${submissionData.SubmittedAt}`, 14, yPos);
      yPos += 10;

      // Add sections table
      if (sectionsData.length > 0) {
        doc.setFontSize(14);
        doc.text("Section Performance", 14, yPos);
        yPos += 7;

        autoTable(doc, {
          head: [["Section", "Score", "Answered", "Correct", "Wrong", "Unanswered"]],
          body: sectionsData.map((item) => [
            item.Section,
            item.Score,
            item.Answered,
            item.Correct,
            item.Wrong,
            item.Unanswered,
          ]),
          startY: yPos,
          styles: { fontSize: 8, cellPadding: 2 },
        });

        // Access lastAutoTable property safely
        const lastTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
        yPos = lastTableY + 10;
      }

      // Add questions table (if it fits, otherwise new page)
      if (questionsData.length > 0) {
        if (yPos > 200) {
          doc.addPage();
          yPos = 15;
        }

        doc.setFontSize(14);
        doc.text("Questions", 14, yPos);
        yPos += 7;

        autoTable(doc, {
          head: [["#", "Section", "Question", "Status", "Participant Answer"]],
          body: questionsData.map((item) => [
            item.QuestionNumber,
            item.Section,
            item.Question.substring(0, 50) + (item.Question.length > 50 ? "..." : ""),
            item.Status,
            item.ParticipantAnswer.substring(0, 50) + (item.ParticipantAnswer.length > 50 ? "..." : ""),
          ]),
          startY: yPos,
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 60 },
            3: { cellWidth: 20 },
            4: { cellWidth: 60 },
          },
        });
      }

      // Save PDF
      doc.save(
        `${testName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${submission.email.split("@")[0]}_details_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      toast.success("Details exported as PDF successfully");
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
      const submissionData = prepareSubmissionData();
      const questionsData = prepareQuestionsData();
      const sectionsData = prepareSectionsData();

      // Create CSV content for summary
      const summaryHeaders = Object.keys(submissionData).join(",");
      const summaryRow = Object.values(submissionData)
        .map((value) => `"${value}"`)
        .join(",");
      const summaryContent = `# Summary\n${summaryHeaders}\n${summaryRow}\n\n`;

      // Create CSV content for sections
      let sectionsContent = "";
      if (sectionsData.length > 0) {
        const sectionsHeaders = Object.keys(sectionsData[0]).join(",");
        const sectionsRows = sectionsData
          .map((item) =>
            Object.values(item)
              .map((value) => `"${value}"`)
              .join(",")
          )
          .join("\n");
        sectionsContent = `# Sections\n${sectionsHeaders}\n${sectionsRows}\n\n`;
      }

      // Create CSV content for questions
      let questionsContent = "";
      if (questionsData.length > 0) {
        const questionsHeaders = Object.keys(questionsData[0]).join(",");
        const questionsRows = questionsData
          .map((item) =>
            Object.values(item)
              .map((value) => `"${value}"`)
              .join(",")
          )
          .join("\n");
        questionsContent = `# Questions\n${questionsHeaders}\n${questionsRows}`;
      }

      // Combine all content
      const csvContent = summaryContent + sectionsContent + questionsContent;

      // Create blob and save
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      saveAs(
        blob,
        `${testName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${submission.email.split("@")[0]}_details_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );

      toast.success("Details exported as CSV successfully");
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
        <Button variant="default">
          <FileJson className="mr-2" /> Export details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Submission Details</DialogTitle>
          <DialogDescription>
            Choose a format to export {submission.name}&apos;s submission details
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
          Note: The export will include submission summary, section performance, and question details.
        </div>
      </DialogContent>
    </Dialog>
  );
}; 