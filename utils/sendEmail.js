import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (to, resetLink) => {
  await resend.emails.send({
    from: "Probit <onboarding@resend.dev>",
    to,
    subject: "Reset Password Probit",
    html: `
      <h2>Reset Password</h2>
      <p>Klik tombol di bawah untuk mengganti password Anda.</p>

      <a href="${resetLink}"
         style="
            display:inline-block;
            padding:12px 20px;
            background:#16a34a;
            color:#fff;
            text-decoration:none;
            border-radius:8px;
         ">
         Reset Password
      </a>

      <p>Link ini berlaku selama 1 jam.</p>
    `,
  });
};
