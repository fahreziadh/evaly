"use client";
import LoadingTest from "@/components/shared/loading/loading-test";
import { FileSpreadsheet } from "lucide-react";
import DialogCreateTest from "@/components/shared/dialog/dialog-create-test";
import CardTest from "@/components/shared/card/card-test";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

const DashboardPageClient = () => {

  const t = useTranslations("DashboardTest");

  const data = useQuery(api.organizer.test.getTests)


  if (data === undefined) {
    return (
      <div className="container">
        <div className="flex flex-row items-start justify-between mb-10">
          <div>
            <h1 className="dashboard-title">{t("dashboardTitle")}</h1>
            <p className="dashboard-description">{t("dashboardDescription")}</p>
          </div>
          <DialogCreateTest />
        </div>
        <LoadingTest />
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-[30vh] text-center">
        <FileSpreadsheet className="size-16 text-muted-foreground mb-6" />
        <h1 className="text-xl font-medium">{t("noTestsYet")}</h1>
        <h2 className="max-w-md mt-2 text-muted-foreground mb-4">
          {t("noTestsDescription")}
        </h2>
        <DialogCreateTest />
      </div>
    );
  }
  return (
    <div className="container">
      <div className="flex flex-row items-start justify-between">
        <div>
          <h1 className="dashboard-title">{t("dashboardTitle")}</h1>
          <p className="dashboard-description">{t("dashboardDescription")}</p>
        </div>
        <DialogCreateTest />
      </div>
      <div className="flex flex-col mt-10 min-h-dvh gap-4">
        <AnimatePresence>
          {data.map((e) => (
            <motion.div
              key={e._id}
              layout
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1 }}
            >
              <CardTest
                data={e}
                key={e._id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPageClient;
