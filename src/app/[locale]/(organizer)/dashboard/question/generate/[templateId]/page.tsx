// "use client";

// import CardQuestion from "@/components/shared/card/card-question";
// import { Question } from "@/types/question";
// import { QuestionGenerated } from "@/types/question.generated";
// import { motion } from "motion/react";
// import React, { useEffect, useTransition } from "react";
// import { experimental_useObject as useObject } from "@ai-sdk/react";
// import { useParams, useSearchParams } from "next/navigation";
// import LoadingScreen from "@/components/shared/loading/loading-screen";
// import { cn } from "@/lib/utils";
// import { TextShimmer } from "@/components/ui/text-shimmer";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// import { trpc } from "@/trpc/trpc.client";
// import { useProgressRouter } from "@/components/shared/progress-bar";
// const Page = () => {
//   const { templateId } = useParams();
//   const [isRedirecting, setIsRedirecting] = useTransition();
//   const searchParams = useSearchParams();
//   const router = useProgressRouter();
//   const { data: dataTemplate, isPending: isPendingTemplate } =
//     trpc.organization.questionTemplate.getById.useQuery({
//       id: templateId as string,
//     });
//   const { data: dataQuestions, isPending: isPendingQuestions } =
//     trpc.organization.question.getAll.useQuery({
//       referenceId: templateId as string,
//     });

//   const { isLoading, object, submit } = useObject({
//     api: "/api/ai/generate-question",
//     credentials: "include",
//     schema: QuestionGenerated,
//     onFinish({}) {
//       // refetchQuestions();
//     },
//   });

//   const { mutateAsync: tranferQuestion, isPending: isPendingTransferQuestion } =
//     trpc.organization.question.transferBetweenReference.useMutation({
//       onError(error) {
//         toast.error(error.message || "Failed to transfer question");
//       },
//       onSuccess() {
//         toast.success("Question transferred successfully");
//       },
//     });

//   async function onSave() {
//     const order = searchParams.get("order");
//     const toReferenceId = searchParams.get("referenceid");
//     const testid = searchParams.get("testid");

//     const fromReferenceId = dataTemplate?.id;

//     if (order !== undefined && testid && toReferenceId && fromReferenceId) {
//       const transferredQuestion = await tranferQuestion({
//         order: Number(order),
//         toReferenceId: toReferenceId as string,
//         fromReferenceId,
//       });
//       if (transferredQuestion && transferredQuestion.length > 0) {
//         setIsRedirecting(() => {
//           router.replace(
//             `/dashboard/tests/${testid}?tabs=questions&selected-section=${toReferenceId}`
//           );
//           toast.success("Questions added successfully to your test!");
//         });
//       }
//     } else {
//       setIsRedirecting(() => {
//         router.replace(`/dashboard/question/${templateId}`);
//         toast.success("Questions saved successfully");
//       });
//     }

//     // TODO add support for add question to another template
//   }

//   useEffect(() => {
//     if (dataTemplate?.aiContents?.length === 1 && !isPendingTemplate) {
//       submit({ prompt: dataTemplate?.aiContents?.at(0)?.prompt, templateId: templateId as string, context: "educational" });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dataTemplate, isPendingTemplate]);

//   if (
//     (isLoading && !object?.questions?.length) ||
//     isPendingTemplate ||
//     isPendingQuestions
//   ) {
//     return <LoadingScreen />;
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//       className="pb-20 relative"
//     >
//       <div
//         onClick={() => {
//           toast(
//             "You need to save these questions first before you can edit them",
//             {
//               description: "Click the Save button below to continue.",
//               descriptionClassName: "opacity-50 mt-2",
//             }
//           );
//         }}
//         className={cn(
//           "flex flex-col container max-w-4xl my-10",
//           isLoading ? "animate-pulse" : ""
//         )}
//       >
//         {isLoading || !dataQuestions?.length
//           ? object?.questions?.map((question, index) => (
//               <React.Fragment key={index}>
//                 <CardQuestion
//                   previewOnly
//                   key={`qst-${index}`}
//                   className="p-0"
//                   data={question as Question}
//                 />
//                 {index !== 9 && (
//                   <div className="border-b border-border border-dashed w-full my-6" />
//                 )}
//               </React.Fragment>
//             ))
//           : dataQuestions?.map((question, index) => (
//               <React.Fragment key={index}>
//                 <CardQuestion
//                   previewOnly
//                   key={question.id}
//                   className="p-0"
//                   data={question as Question}
//                 />
//                 {index !== 9 && (
//                   <div className="border-b border-border border-dashed w-full my-6" />
//                 )}
//               </React.Fragment>
//             ))}
//       </div>
//       <div className="border-t fixed bottom-0 z-10 w-full bg-background ">
//         <div className="flex flex-row justify-between h-14  items-center  container max-w-4xl ">
//           <div>
//             {isLoading ? (
//               <TextShimmer>Generting your questions...</TextShimmer>
//             ) : null}
//           </div>
//           <div>
//             <Button
//               disabled={isLoading || isRedirecting || isPendingTransferQuestion}
//               onClick={() => {
//                 onSave();
//               }}
//             >
//               {isPendingTransferQuestion || isRedirecting ? (
//                 <Loader2 className="animate-spin" />
//               ) : null}
//               {isRedirecting
//                 ? "Redirecting back..."
//                 : isPendingTransferQuestion
//                   ? "Transferring your question!"
//                   : "Save"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Page;


const page = () => {
  return (
    <div>page</div>
  )
}

export default page
