import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, admin } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema";
import * as authSchema from "../db/auth-schema";
import resend from "@yapyup/server/src/lib/resend";
import { desc, eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: authSchema,
  }),
  trustedOrigins: [process.env.CORS_ORIGIN!],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({user, url, token}, request) => {
      await resend.emails.send({
        from: "Yapyup <onboarding@notifications.yapyup.com>", // You could add your custom domain
        to: 'delivered@resend.dev', // email of the user to want to end
        subject: "Reset your password", // Main subject of the email
        html: `<a href=${url}>Click here to reset your password</a>`, // Content of the email
        // you could also use "React:" option for sending the email template and there content to user
      });
    },
  },
  databaseHooks: {
    session: {
      create: {
        async before(session) {
          const lastSession = await db
            .select({ activeOrganizationId: authSchema.session.activeOrganizationId })
            .from(authSchema.session)
            .where(eq(authSchema.session.userId, session.userId))
            .orderBy(desc(authSchema.session.createdAt))
            .limit(1)

          const activeOrganizationId = lastSession[0]?.activeOrganizationId || null

          return {
            data: {
              ...session,
              activeOrganizationId,
            },
          }
        },
      },
      // update: {
      //   async after(session) {
      //     await usersRepo.setUserDefaultOrganization(
      //       session.userId,
      //       (session as any).activeOrganizationId,
      //     )
      //   },
      // },
    },
  },
  plugins: [
    organization({
      // Optional: Configure organization plugin options here
      creatorRole: "owner",
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.CORS_ORIGIN!}/accept-invitation/${data.id}`
        await resend.emails.send({
          from: "YapYup <onboarding@notifications.yapyup.com>", // You could add your custom domain
          to: 'delivered@resend.dev', // email of the user to want to end
          subject: "Invitation to Yapyup", // Main subject of the email
          html: `<a href="${inviteLink}">Click here to accept invitation to Yapyup`, // Content of the email
          // you could also use "React:" option for sending the email template and there content to user
        });
      }
    }),
    admin(),
  ],
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  // },
});
