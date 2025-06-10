import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, admin } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema";
import * as authSchema from "../db/auth-schema";
import resend from "@yapyup/server/src/lib/resend";
import { desc, eq } from "drizzle-orm";
import React from "react";
import resendInvitation from "@yapyup/server/src/utils/resend-invitation.tsx";
import {user} from "../db/auth-schema";

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

          let activeOrganizationId = lastSession[0]?.activeOrganizationId || null

          if (!activeOrganizationId) {
            const organizationId = await db
              .select({ organizationId: authSchema.member.organizationId })
              .from(authSchema.member)
              .where(eq(authSchema.member.userId, session.userId))
              .orderBy(desc(authSchema.member.createdAt))
              .limit(1)

            activeOrganizationId = organizationId[0]?.organizationId || null
          }


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
        const userExist = await db
          .select({ id: user.id  })
          .from(user)
          .where(eq(user.email, data?.email))
          .limit(1);

        console.log(userExist)
        console.log(data.email)

        const step = userExist.length ? 'login' : 'signup'
        const inviteLink = `${process.env.CORS_ORIGIN!}/accept-invitation/${data.id}?step=${step}&email=${data.email}`;

        await resend.emails.send(resendInvitation(data, inviteLink))
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
