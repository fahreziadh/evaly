import { Suspense } from "react";
import PageClient from "./page.client";

export const dynamic = "force-static";
const page = () => {
  return (
    <Suspense>
      <PageClient />
    </Suspense>
  );
};

export default page;
