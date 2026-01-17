import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendVerificationEmail({
  to,
  url,
  baseUrl,
}: {
  to: string;
  url: string;
  baseUrl: string;
}) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM || 'suporteguildsbook@gmail.com',
    templateId: process.env.SENDGRID_TEMPLATE_ID || 'd-b46b38c79dd84f249c9b76c9657bac6f',
    dynamicTemplateData: {
      url, // Link de verificação - {{url}} no template
      baseUrl, // URL base - {{baseUrl}} no template
      year: new Date().getFullYear(), // {{year}} no template
    },
  };

  try {
    await sgMail.send(msg);
    console.log('Email enviado com sucesso usando template dinâmico do SendGrid');
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email via SendGrid API:', error);
    throw error;
  }
}
