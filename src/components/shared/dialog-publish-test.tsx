"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@convex/_generated/api";
import type { DataModel } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { CalendarIcon, ClockIcon, LockIcon, TriangleAlert, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { utcToLocalDateTimeString, localDateTimeStringToUtc } from "@/lib/date-utils";

const DialogPublishTest = ({
  onPublished,
  test,
}: {
  onPublished?: () => void;
  test: DataModel["test"]["document"];
}) => {
  const testSection = useQuery(api.organizer.testSection.getByTestId, {
    testId: test._id,
  });
  
  // Check if test is already scheduled
  const isScheduled = test.scheduledStartAt && !test.isPublished;
  
  const [isOpen, setIsOpen] = useState(false);
  const [startOption, setStartOption] = useState<"now" | "schedule">(
    isScheduled ? "schedule" : "now"
  );
  const [scheduledStartAt, setScheduledStartAt] = useState(
    utcToLocalDateTimeString(test.scheduledStartAt)
  );
  
  // Track if we have a duration to maintain when start time changes
  const [maintainDuration, setMaintainDuration] = useState(
    Boolean(test.scheduledStartAt && test.scheduledEndAt)
  );
  const [scheduledEndAt, setScheduledEndAt] = useState(
    utcToLocalDateTimeString(test.scheduledEndAt)
  );
  const [duration, setDuration] = useState(() => {
    if (test.scheduledStartAt && test.scheduledEndAt) {
      const durationMinutes = Math.floor((test.scheduledEndAt - test.scheduledStartAt) / (60 * 1000));
      return durationMinutes > 0 ? durationMinutes.toString() : "";
    }
    return "";
  });

  const publishTest = useMutation(api.organizer.test.publishTest);

  const testSectionWithNoQuestions = useMemo(() => {
    return testSection?.filter((section) => !section.numOfQuestions);
  }, [testSection]);

  // Calculate end time from duration or vice versa
  const handleStartTimeChange = (newStartTime: string) => {
    const oldStartTime = scheduledStartAt;
    setScheduledStartAt(newStartTime);
    
    // If we have an end time and duration, maintain the duration
    if (newStartTime && scheduledEndAt && oldStartTime && maintainDuration) {
      const oldStart = new Date(oldStartTime);
      const oldEnd = new Date(scheduledEndAt);
      const durationMs = oldEnd.getTime() - oldStart.getTime();
      
      // Apply same duration to new start time
      const newStart = new Date(newStartTime);
      const newEnd = new Date(newStart.getTime() + durationMs);
      
      // Format for datetime-local input
      const year = newEnd.getFullYear();
      const month = String(newEnd.getMonth() + 1).padStart(2, '0');
      const day = String(newEnd.getDate()).padStart(2, '0');
      const hours = String(newEnd.getHours()).padStart(2, '0');
      const minutes = String(newEnd.getMinutes()).padStart(2, '0');
      
      setScheduledEndAt(`${year}-${month}-${day}T${hours}:${minutes}`);
      
      // Update duration display
      const durationMinutes = Math.floor(durationMs / (60 * 1000));
      setDuration(durationMinutes > 0 ? durationMinutes.toString() : "");
    }
  };
  
  const handleDurationChange = (newDuration: string) => {
    setDuration(newDuration);
    setMaintainDuration(Boolean(newDuration)); // Track that we have a duration to maintain
    if (newDuration && scheduledStartAt) {
      // Parse the local datetime string properly
      const startDate = new Date(scheduledStartAt);
      const durationMs = parseInt(newDuration) * 60 * 1000;
      const endDate = new Date(startDate.getTime() + durationMs);
      
      // Format for datetime-local input
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      const hours = String(endDate.getHours()).padStart(2, '0');
      const minutes = String(endDate.getMinutes()).padStart(2, '0');
      
      setScheduledEndAt(`${year}-${month}-${day}T${hours}:${minutes}`);
    } else if (newDuration && !scheduledStartAt) {
      // If no start time, use current time
      const now = new Date();
      const durationMs = parseInt(newDuration) * 60 * 1000;
      const endDate = new Date(now.getTime() + durationMs);
      
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      const hours = String(endDate.getHours()).padStart(2, '0');
      const minutes = String(endDate.getMinutes()).padStart(2, '0');
      
      setScheduledEndAt(`${year}-${month}-${day}T${hours}:${minutes}`);
    } else {
      setScheduledEndAt("");
    }
  };

  const handleEndTimeChange = (newEndTime: string) => {
    setScheduledEndAt(newEndTime);
    setMaintainDuration(Boolean(newEndTime)); // Track that we have an end time
    if (newEndTime && scheduledStartAt) {
      // Both are local datetime strings, parse them properly
      const startDate = new Date(scheduledStartAt);
      const endDate = new Date(newEndTime);
      const durationMinutes = Math.floor((endDate.getTime() - startDate.getTime()) / (60 * 1000));
      setDuration(durationMinutes > 0 ? durationMinutes.toString() : "");
    } else if (newEndTime && !scheduledStartAt) {
      // If no start time, calculate from now
      const now = new Date();
      const endDate = new Date(newEndTime);
      const durationMinutes = Math.floor((endDate.getTime() - now.getTime()) / (60 * 1000));
      setDuration(durationMinutes > 0 ? durationMinutes.toString() : "");
    } else {
      setDuration("");
    }
  };

  const handlePublish = () => {
    // Convert local datetime strings to UTC timestamps for backend
    const scheduledStartTimestamp = localDateTimeStringToUtc(scheduledStartAt);
    const scheduledEndTimestamp = localDateTimeStringToUtc(scheduledEndAt);

    publishTest({
      testId: test._id,
      startOption,
      scheduledStartAt: scheduledStartTimestamp,
      scheduledEndAt: scheduledEndTimestamp,
    });
    onPublished?.();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Publish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="size-5" />
            Publish test
          </DialogTitle>
          <DialogDescription className="dashboard-description">
            {testSectionWithNoQuestions?.length &&
            testSectionWithNoQuestions?.length > 0
              ? "This test can be published after all sections have questions"
              : "Configure when and how long your test will be available."}
          </DialogDescription>
        </DialogHeader>
        {testSectionWithNoQuestions &&
          testSectionWithNoQuestions?.length > 0 && (
            <div className="bg-warning p-3 rounded-md border border-warning-foreground/20">
              <h1 className="flex flex-row gap-2 items-center text-warning-foreground">
                <TriangleAlert className="size-4" /> Missing questions in sections
              </h1>
              <ul className="flex flex-col gap-1 mt-2 text-sm">
                {testSectionWithNoQuestions.map((section) => (
                  <li key={section._id} className="text-warning-foreground/80">
                    • {section.title || `Section ${section.order}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
        {(!testSectionWithNoQuestions || testSectionWithNoQuestions.length === 0) && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">When to start</Label>
              <RadioGroup
                value={startOption}
                onValueChange={(value) => setStartOption(value as "now" | "schedule")}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="now" />
                  <Label htmlFor="now" className="text-sm cursor-pointer">
                    Start immediately
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="schedule" id="schedule" />
                  <Label htmlFor="schedule" className="text-sm cursor-pointer">
                    Schedule for later
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {startOption === "schedule" && (
              <div className="space-y-3 p-3 bg-secondary/50 rounded-md border border-border">
                <div className="space-y-2">
                  <Label htmlFor="start-time" className="text-sm font-medium flex items-center gap-2">
                    <ClockIcon className="size-4" />
                    Start date & time
                  </Label>
                  <Input
                    id="start-time"
                    type="datetime-local"
                    value={scheduledStartAt}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="w-full"
                    min={utcToLocalDateTimeString(Date.now())}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 p-3 bg-secondary/30 rounded-md border border-border">
              <Label className="text-sm font-medium text-muted-foreground">
                End time (optional)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="duration" className="text-xs text-muted-foreground">
                      Duration (minutes)
                    </Label>
                    {duration && (
                      <button
                        type="button"
                        onClick={() => {
                          setDuration("");
                          setScheduledEndAt("");
                          setMaintainDuration(false);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <XIcon className="size-3" />
                        Clear
                      </button>
                    )}
                  </div>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g. 60"
                    value={duration}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="end-time" className="text-xs text-muted-foreground">
                      Or end date & time
                    </Label>
                    {scheduledEndAt && (
                      <button
                        type="button"
                        onClick={() => {
                          setScheduledEndAt("");
                          setDuration("");
                          setMaintainDuration(false);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <XIcon className="size-3" />
                        Clear
                      </button>
                    )}
                  </div>
                  <Input
                    id="end-time"
                    type="datetime-local"
                    value={scheduledEndAt}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    min={scheduledStartAt || utcToLocalDateTimeString(Date.now())}
                  />
                  {scheduledEndAt && scheduledStartAt && (() => {
                    const startDate = new Date(scheduledStartAt);
                    const endDate = new Date(scheduledEndAt);
                    return endDate <= startDate ? (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <span>⚠️</span>
                        End time must be after start time
                      </p>
                    ) : null;
                  })()}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty for unlimited duration. You can change this later.
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={
              (testSectionWithNoQuestions && testSectionWithNoQuestions?.length > 0) ||
              (startOption === "schedule" && !scheduledStartAt) ||
              (() => {
                if (!scheduledEndAt || !scheduledStartAt) return false;
                const startDate = new Date(scheduledStartAt);
                const endDate = new Date(scheduledEndAt);
                return endDate <= startDate;
              })()
            }
            onClick={handlePublish}
            className="min-w-[100px]"
          >
            {testSectionWithNoQuestions && testSectionWithNoQuestions?.length > 0 ? (
              <LockIcon className="size-4 mr-2" />
            ) : startOption === "schedule" || isScheduled ? (
              <CalendarIcon className="size-4 mr-2" />
            ) : null}
            {isScheduled 
              ? "Update Schedule" 
              : startOption === "now" 
                ? "Publish Now" 
                : "Schedule Test"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPublishTest;
