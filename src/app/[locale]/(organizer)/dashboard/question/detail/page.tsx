import { Suspense } from "react";
import EditQuestion from "./page.client";

export const dynamic = "force-static";

const Page = () => {
  return (
    <Suspense>
      <EditQuestion />
    </Suspense>
  );
};

export default Page;
