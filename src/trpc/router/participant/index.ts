import { deleteFileFromR2 } from "@/services/common/delete-file-from-r2";
import { updateProfile } from "@/services/common/update-profile";
import { uploadFileToR2 } from "@/services/common/upload-file-to-r2";
import { participantProcedure, publicProcedure, router } from "@/trpc";
import { ulid } from "ulidx";
import { z } from "zod";
import { testRouter } from "./test.router";
import { attemptRouter } from "./attempt.router";
import db from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const participantRouter = router({
  profile: publicProcedure.query(async ({ ctx }) => {
    const dataUser = await db.query.user.findFirst({
      where: eq(user.id, ctx.user?.id ?? ""),
    });

    return { user: dataUser, session: ctx.session };
  }),
  updateProfile: participantProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ input, ctx: { user } }) => {
      const imageFile = input.get("imageFile");
      const fullName = input.get("fullName") as string;

      let newImageUrl: string | undefined = undefined;

      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        try {
          const extension = imageFile.name.split(".").pop();
          const imageUrl = await uploadFileToR2(
            imageFile,
            `user/${user.id}/profile-${ulid()}.${extension}`
          );

          if (user.image) {
            await deleteFileFromR2(user.image, true);
          }

          if (imageUrl) {
            newImageUrl = imageUrl;
          }
        } catch (e) {
          console.error(e);
          throw new Error("Failed to upload image");
        }
      }

      console.log(
        "Update profile",
        JSON.stringify({
          id: user.id,
          name: fullName,
          image: newImageUrl,
        })
      );

      return updateProfile({
        id: user.id,
        name: fullName,
        image: newImageUrl,
      });
    }),
  test: testRouter,
  attempt: attemptRouter,
});
