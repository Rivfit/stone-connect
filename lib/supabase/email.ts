// lib/supabase/email.ts  (or lib/email.ts - use whatever path you have)
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // TLS off for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    console.log('📧 Attempting to send email...')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Email config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM,
      hasPassword: !!process.env.EMAIL_PASS
    })

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })

    console.log('✅ Email sent successfully:', info.messageId)
    return info
  } catch (err: any) {
    console.error('❌ Error sending email:', err)
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      command: err.command,
      response: err.response
    })
    throw err  // Throw the error so we can see it in logs
  }
}