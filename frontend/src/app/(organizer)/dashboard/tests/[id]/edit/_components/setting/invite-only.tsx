import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { $api } from "@/lib/api";
import { useTestInvitationByTestId } from "@/query/organization/test/use-test-invitation-by-test-id";
import { TestInvitation } from "@evaly/backend/types/test";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight, Loader2, XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const InviteOnly = ({ testId }: { testId: string }) => {
  const { data, isPending } = useTestInvitationByTestId(testId);
  const [emailInput, setEmailInput] = useState("");
  const [listInvited, setListInvited] = useState<TestInvitation[]>([]);

  useEffect(() => {
    setListInvited(data?.data?.data || []);
  }, [data]);

  const {
    mutateAsync: addInvitedParticipant,
    isPending: isPendingAddInvitedParticipant,
  } = useMutation({
    mutationKey: ["add-invited-participant"],
    mutationFn: async (emails: string[]) => {
      const response = await $api.organization
        .test({ id: testId })
        .invitation.post({
          emails,
        });

      if (response.error?.value.message) {
        return toast.error(response.error?.value.message);
      }

      if (response.data && response.data.data.length > 0) {
        toast.success(`${response.data.data.length} participants added`);
        setListInvited([...listInvited, ...response.data.data]);
      }

      setEmailInput("");

      return response.data;
    },
  });

  const listInvitedPreview = useMemo(() => {
    return listInvited.slice(0, 10);
  }, [listInvited]);

  const {
    mutateAsync: deleteInvitedParticipant,
    isPending: isPendingDeleteInvitedParticipant,
  } = useMutation({
    mutationKey: ["delete-invited-participant"],
    mutationFn: async (email: string) => {
      const response = await $api.organization
        .test({ id: testId })
        .invitation({ email })
        .delete();

      if (response.error?.value.message) {
        return toast.error(response.error?.value.message);
      }

      if (response.data) {
        toast.success("Participant removed");
        setListInvited(listInvited.filter((item) => item.email !== email));
      }

      return response.data;
    },
  });

  return (
    <div>
      <Label className="text-sm">
        Only candidates with an invitation can access and take this
      </Label>
      <div className="mt-4 p-4 border">
        <div className="flex flex-row gap-2">
          <Input
            placeholder="fathia@gmail.com, arumi@gmail.com, shahfika@gmail.com...."
            className="w-full max-w-2xs"
            inputMode="email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            disabled={isPendingAddInvitedParticipant}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const listEmails = emailInput
                  .trim()
                  .toLowerCase()
                  .split(",")
                  .map((email) => email.trim());

                if (listEmails.length > 0) {
                  addInvitedParticipant(listEmails);
                }
              }
            }}
          />
          <Button
            onClick={() => {
              const listEmails = emailInput
                .trim()
                .toLowerCase()
                .split(",")
                .map((email) => email.trim());
              if (listEmails.length > 0) {
                addInvitedParticipant(listEmails);
              }
            }}
            type="button"
            variant="outline-solid"
            disabled={isPendingAddInvitedParticipant}
          >
            {isPendingAddInvitedParticipant ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </div>
        <div className="flex flex-row mt-4 flex-wrap gap-2">
          {listInvitedPreview.map((item) => (
            <div
              key={item.email}
              className="relative group pl-0.5 py-0.5 pr-4 rounded-full flex items-center gap-2 border text-sm"
            >
              <Avatar>
                {item.image ? (
                  <AvatarImage
                    src={item.image || ""}
                    alt={item.email}
                    className="size-8 rounded-full"
                  />
                ) : (
                  <AvatarFallback className="size-8 rounded-full font-bold">
                    {item?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
                <Button
                  variant={"destructive"}
                  rounded
                  size={"icon-sm"}
                  onClick={() => deleteInvitedParticipant(item.email)}
                  disabled={isPendingDeleteInvitedParticipant}
                  className="absolute opacity-0 group-hover:opacity-100 transition-all"
                >
                  {isPendingDeleteInvitedParticipant ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <XIcon />
                  )}
                </Button>
              </Avatar>
              {item.email}
            </div>
          ))}
          {listInvitedPreview?.length === 0 ? (
            <div className="text-muted-foreground">
              No invited participants, start by adding one
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button rounded variant={"secondary"} className="h-9">
                  See detail <ChevronRight className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invited Participants</DialogTitle>
                  <DialogDescription>
                    {listInvited.length} participants invited
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[50vh]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listInvited.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="flex flex-row items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={item.image || ""}
                                alt={item.email}
                                className="size-7 rounded-full"
                              />
                              <AvatarFallback className="size-7 rounded-full font-bold">
                                {item?.email?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {item.email}
                          </TableCell>
                          <TableCell>{item.name || "-"}</TableCell>
                          <TableCell>
                            <Button
                              disabled={isPendingDeleteInvitedParticipant}
                              variant={"ghost"}
                              size={"icon-xs"}
                              onClick={() =>
                                deleteInvitedParticipant(item.email)
                              }
                            >
                              <XIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant={"outline"}>Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {isPending && (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {listInvited.length > 10 ? (
            <Button rounded variant={"outline"} className="h-9">
              ...
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InviteOnly;
