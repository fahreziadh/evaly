"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Info, PencilLine, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { DataModel } from "convex/_generated/dataModel";
import { useUploadFile } from "@convex-dev/r2/react";
import { env } from "@/lib/env.client";

export const dynamic = "force-static";

const Settings = () => {
  return (
    <div className="container dashboard-margin">
      <div className="flex flex-col">
        <h1 className="dashboard-title">Settings</h1>
        <p className="dashboard-description">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="flex flex-col gap-4 mt-10">
        <Profile />
        <Organization />
      </div>
    </div>
  );
};

// const General = () => {
//   const { theme, setTheme } = useTheme();
//   const [fontMono, setFontMono] = useLocalStorage("font-mono", true);

//   return (
//     <Card>
//       <CardHeader className="border-b border-dashed">
//         <CardTitle className="font-medium">General</CardTitle>
//         <CardDescription>
//           Manage your general account settings and preferences. You can update
//           your appearance settings and customize your experience.
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-6">
//         <div>
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <Label className="text-sm font-medium text-foreground">
//                 Dark Mode
//               </Label>
//               <Switch
//                 checked={theme === "dark"}
//                 onCheckedChange={() =>
//                   setTheme(theme === "dark" ? "light" : "dark")
//                 }
//                 aria-label="Toggle dark mode"
//               />
//             </div>

//             {/* Font Style */}
//             <div className="flex items-center justify-between">
//               <Label className="text-sm font-medium text-foreground">
//                 Classic Font
//               </Label>
//               <Switch
//                 checked={fontMono}
//                 onCheckedChange={setFontMono}
//                 aria-label="Toggle monospace font"
//               />
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

const Profile = () => {
  const user = useQuery(api.organizer.profile.getProfile);
  const uploadFile = useUploadFile(api.common.storage);
  const updateProfile = useMutation(api.organizer.profile.updateProfile);

  const [isUpdating, setIsUpdating] = useState(false);

  // Define form for profile
  const {
    control,
    reset,
    formState: { isDirty },
    handleSubmit,
    setValue,
    watch,
  } = useForm<DataModel["users"]["document"] & { imageFile?: File }>({
    defaultValues: {
      name: "",
    },
  });

  const [previewURL, setPreviewURL] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onImagePreviewChange = (e: File) => {
    const objectUrl = URL.createObjectURL(e);
    setPreviewURL(objectUrl);
  };

  const onUpdateProfile = async (
    data: DataModel["users"]["document"] & { imageFile?: File }
  ) => {
    setIsUpdating(true);
    let imageUrl = data.image;

    if (data.imageFile) {
      try {
        const key = await uploadFile(data.imageFile);
        imageUrl = `${env.NEXT_PUBLIC_CLOUDFLARE_CDN_URL}/evaly/${key}`;
      } catch (error) {
        console.error(error);
      }
    }

    updateProfile({ name: data.name || "", image: imageUrl });
    setIsUpdating(false);
  };

  if (user === undefined || !watch("email")) {
    return <Skeleton className="w-full h-80" />;
  }

  return (
    <Card>
      <CardHeader className="border-b border-dashed">
        <CardTitle className="font-medium">Profile</CardTitle>
        <CardDescription>
          Manage your profile settings. You can update your profile information.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-6" onSubmit={handleSubmit(onUpdateProfile)}>
          <div className="flex flex-col md:flex-row gap-6">
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <div className="relative w-max h-max">
                  <Avatar className="size-24 rounded-full">
                    {previewURL ? (
                      <AvatarImage
                        src={previewURL}
                        alt="Profile"
                        className="object-cover"
                      >
                        <Image
                          src={previewURL}
                          alt="Profile"
                          width={256}
                          height={256}
                        />
                      </AvatarImage>
                    ) : field.value ? (
                      <AvatarImage
                        src={field.value}
                        alt="Profile"
                        className="object-cover bg-foreground/5"
                        asChild
                      >
                        <Image
                          src={field.value}
                          alt="Profile"
                          width={256}
                          height={256}
                        />
                      </AvatarImage>
                    ) : (
                      <AvatarFallback className="text-4xl">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-row gap-2 absolute right-1 bottom-1">
                    <Button
                      variant="default"
                      size="icon"
                      type="button"
                      onClick={() => {
                        document.getElementById("profile-image")?.click();
                      }}
                      rounded
                    >
                      <PencilLine />
                    </Button>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Set the file in the form
                          setValue("imageFile", file, {
                            shouldDirty: true,
                          });
                          onImagePreviewChange(file);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            />
            <div className="space-y-4 w-full">
              <Controller
                control={control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <div>
                    <Label className="flex flex-row gap-2 mb-1">
                      Email Address
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Email address cannot be changed</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      {...field}
                      placeholder="Your email address"
                      disabled
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="name"
                rules={{ required: "Full name is required" }}
                render={({ field }) => (
                  <div>
                    <Label>Full Name</Label>
                    <Input {...field} placeholder="Your full name" />
                  </div>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                {isDirty ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset();
                      setPreviewURL(null);
                    }}
                  >
                    Cancel
                  </Button>
                ) : null}
                <Button type="submit" disabled={!isDirty || isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const Organization = () => {
  const user = useQuery(api.organizer.profile.getProfile);
  const organization = user?.organization;

  return (
    <Card>
      <CardHeader className="border-b border-dashed">
        <CardTitle className="font-medium">Organization</CardTitle>
        <CardDescription>
          Manage your organization settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {organization ? (
          <div className="text-muted-foreground">
            Organization settings coming soon...
          </div>
        ) : (
          <div className="text-muted-foreground">
            No organization data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Settings;
