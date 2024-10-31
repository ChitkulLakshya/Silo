export interface ParsedEmail {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  sender: string;
}

export function parseGmailMessage(message: any): ParsedEmail {
  const headers = message.payload?.headers || [];
  
  const getHeader = (name: string) => {
    const header = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
  };

  return {
    id: message.id,
    threadId: message.threadId,
    snippet: message.snippet,
    subject: getHeader('Subject'),
    sender: getHeader('From'),
  };
}

export function buildMimeMessage(to: string, subject: string, body: string): string {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    body
  ].join('\r\n');

  // Convert to UTF-8 and base64url encode
  const utf8Encoded = unescape(encodeURIComponent(message));
  const base64 = btoa(utf8Encoded);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
