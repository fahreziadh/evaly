CREATE TABLE "test_invitation" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"test_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"is_email_sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
