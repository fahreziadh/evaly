/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as common_storage from "../common/storage.js";
import type * as http from "../http.js";
import type * as organizer_profile from "../organizer/profile.js";
import type * as organizer_question from "../organizer/question.js";
import type * as organizer_test from "../organizer/test.js";
import type * as organizer_testResult from "../organizer/testResult.js";
import type * as organizer_testSection from "../organizer/testSection.js";
import type * as participant_profile from "../participant/profile.js";
import type * as participant_test from "../participant/test.js";
import type * as participant_testAttempt from "../participant/testAttempt.js";
import type * as participant_testAttemptAnswer from "../participant/testAttemptAnswer.js";
import type * as participant_testPresence from "../participant/testPresence.js";
import type * as participant_testSection from "../participant/testSection.js";
import type * as schemas_organization from "../schemas/organization.js";
import type * as schemas_organizer from "../schemas/organizer.js";
import type * as schemas_question from "../schemas/question.js";
import type * as schemas_test from "../schemas/test.js";
import type * as schemas_testAttempt from "../schemas/testAttempt.js";
import type * as schemas_testSection from "../schemas/testSection.js";
import type * as schemas_users from "../schemas/users.js";
import type * as schemas_whistlist from "../schemas/whistlist.js";
import type * as whistlist from "../whistlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "common/storage": typeof common_storage;
  http: typeof http;
  "organizer/profile": typeof organizer_profile;
  "organizer/question": typeof organizer_question;
  "organizer/test": typeof organizer_test;
  "organizer/testResult": typeof organizer_testResult;
  "organizer/testSection": typeof organizer_testSection;
  "participant/profile": typeof participant_profile;
  "participant/test": typeof participant_test;
  "participant/testAttempt": typeof participant_testAttempt;
  "participant/testAttemptAnswer": typeof participant_testAttemptAnswer;
  "participant/testPresence": typeof participant_testPresence;
  "participant/testSection": typeof participant_testSection;
  "schemas/organization": typeof schemas_organization;
  "schemas/organizer": typeof schemas_organizer;
  "schemas/question": typeof schemas_question;
  "schemas/test": typeof schemas_test;
  "schemas/testAttempt": typeof schemas_testAttempt;
  "schemas/testSection": typeof schemas_testSection;
  "schemas/users": typeof schemas_users;
  "schemas/whistlist": typeof schemas_whistlist;
  whistlist: typeof whistlist;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  r2: {
    lib: {
      deleteMetadata: FunctionReference<
        "mutation",
        "internal",
        { bucket: string; key: string },
        null
      >;
      deleteObject: FunctionReference<
        "mutation",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        null
      >;
      deleteR2Object: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        null
      >;
      getMetadata: FunctionReference<
        "query",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        {
          bucket: string;
          bucketLink: string;
          contentType?: string;
          key: string;
          lastModified: string;
          link: string;
          sha256?: string;
          size?: number;
          url: string;
        } | null
      >;
      insertMetadata: FunctionReference<
        "mutation",
        "internal",
        {
          bucket: string;
          contentType?: string;
          key: string;
          lastModified: string;
          link: string;
          sha256?: string;
          size?: number;
        },
        null
      >;
      listMetadata: FunctionReference<
        "query",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          cursor?: string;
          endpoint: string;
          limit?: number;
          secretAccessKey: string;
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            bucket: string;
            bucketLink: string;
            contentType?: string;
            key: string;
            lastModified: string;
            link: string;
            sha256?: string;
            size?: number;
            url: string;
          }>;
          pageStatus?: null | "SplitRecommended" | "SplitRequired";
          splitCursor?: null | string;
        }
      >;
      store: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          secretAccessKey: string;
          url: string;
        },
        any
      >;
      syncMetadata: FunctionReference<
        "action",
        "internal",
        {
          accessKeyId: string;
          bucket: string;
          endpoint: string;
          key: string;
          secretAccessKey: string;
        },
        null
      >;
    };
  };
};
