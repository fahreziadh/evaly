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
import { api } from "@convex/_generated/api";
import type { DataModel } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ClockIcon, EditIcon, XIcon } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { utcToLocalDateTimeString, localDateTimeStringToUtc, formatLocalDateTime } from "@/lib/date-utils";

dayjs.extend(relativeTime);

const DialogEditSchedule = ({
  test,
  onUpdated,
}: {
  test: DataModel["test"]["document"];
  onUpdated?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scheduledStartAt, setScheduledStartAt] = useState(
    utcToLocalDateTimeString(test.scheduledStartAt)
  );
  const [scheduledEndAt, setScheduledEndAt] = useState(
    utcToLocalDateTimeString(test.scheduledEndAt)
  );
  const [duration, setDuration] = useState(() => {
    if (test.scheduledEndAt) {
      const now = Date.now();
      const durationMinutes = Math.floor((test.scheduledEndAt - now) / (60 * 1000));
      return durationMinutes > 0 ? durationMinutes.toString() : "";
    }
    return "";
  });
  const [maintainDuration, setMaintainDuration] = useState(
    Boolean(test.scheduledStartAt && test.scheduledEndAt)
  );

  const publishTest = useMutation(api.organizer.test.publishTest);

  // Calculate end time from duration or vice versa
  const handleDurationChange = (newDuration: string) => {
    setDuration(newDuration);
    if (newDuration) {
      const now = new Date();
      const durationMs = parseInt(newDuration) * 60 * 1000;
      const endDate = new Date(now.getTime() + durationMs);
      
      // Format for datetime-local input
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
    if (newEndTime) {
      const now = new Date();
      const endDate = new Date(newEndTime);
      const durationMinutes = Math.floor((endDate.getTime() - now.getTime()) / (60 * 1000));
      setDuration(durationMinutes > 0 ? durationMinutes.toString() : "");
    } else {
      setDuration("");
    }
  };

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
  
  const handleSave = () => {
    // Convert local datetime strings to UTC timestamps for backend
    const scheduledStartTimestamp = localDateTimeStringToUtc(scheduledStartAt);
    const scheduledEndTimestamp = localDateTimeStringToUtc(scheduledEndAt);
    
    // Use publishTest to handle rescheduling (it cancels old jobs and creates new ones)
    publishTest({
      testId: test._id,
      startOption: "schedule", // Keep it scheduled
      scheduledStartAt: scheduledStartTimestamp,
      scheduledEndAt: scheduledEndTimestamp,
    });
    
    onUpdated?.();
    setIsOpen(false);
  };

  const currentEndTime = formatLocalDateTime(test.scheduledEndAt);
  const now = Date.now();
  const timeRemaining = test.scheduledEndAt && test.scheduledEndAt > now ? 
    dayjs(test.scheduledEndAt).fromNow() : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <EditIcon className="size-4" />
          Edit Schedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClockIcon className="size-5" />
            Edit Test Schedule
          </DialogTitle>
          <DialogDescription className="dashboard-description">
            Modify when this active test will end. Changes take effect immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Schedule Info */}
          <div className="p-3 bg-secondary/30 rounded-md border border-border">
            <h4 className="text-sm font-medium mb-2">Current Schedule</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {test.scheduledStartAt && (
                <div>Starts: {formatLocalDateTime(test.scheduledStartAt)}</div>
              )}
              {currentEndTime ? (
                <div>Ends: {currentEndTime}</div>
              ) : (
                <div>No end time set - test runs indefinitely</div>
              )}
              {timeRemaining && (
                <div className="text-warning-foreground">
                  Time remaining: {timeRemaining}
                </div>
              )}
            </div>
          </div>

          {/* Update Schedule */}
          <div className="space-y-3 p-3 bg-secondary/50 rounded-md border border-border">
            <Label className="text-sm font-medium">Update Schedule</Label>
            
            {/* Start Time (only show if test is scheduled but not active yet) */}
            {test.scheduledStartAt && !test.isPublished && (
              <div className="space-y-2">
                <Label htmlFor="edit-start-time" className="text-xs text-muted-foreground flex items-center gap-2">
                  <ClockIcon className="size-4" />
                  Start date & time
                </Label>
                <Input
                  id="edit-start-time"
                  type="datetime-local"
                  value={scheduledStartAt}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  min={utcToLocalDateTimeString(Date.now())}
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-duration" className="text-xs text-muted-foreground">
                    Duration from now (minutes)
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
                  id="edit-duration"
                  type="number"
                  placeholder="e.g. 120"
                  value={duration}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-end-time" className="text-xs text-muted-foreground">
                    Or set end date & time
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
                  id="edit-end-time"
                  type="datetime-local"
                  value={scheduledEndAt}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  min={utcToLocalDateTimeString(Date.now())}
                />
                {scheduledEndAt && (() => {
                  const now = new Date();
                  const endDate = new Date(scheduledEndAt);
                  return endDate <= now ? (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span>⚠️</span>
                      End time must be in the future
                    </p>
                  ) : null;
                })()}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Leave empty to remove end time (test runs indefinitely)
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            className="min-w-[100px]"
            disabled={(() => {
              if (!scheduledEndAt) return false;
              const now = new Date();
              const endDate = new Date(scheduledEndAt);
              return endDate <= now;
            })()}
          >
            <ClockIcon className="size-4 mr-2" />
            Update Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditSchedule;