import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { parseGmailMessage, ParsedEmail } from '../utils/gmailParser';
import { useAuth } from '../context/AuthContext';

export interface EmailsPage {
  emails: ParsedEmail[];
  nextPageToken?: string;
}

const fetchEmailsPage = async (token: string, pageParam: string | undefined): Promise<EmailsPage> => {
  let url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15';
  if (pageParam) {
    url += `&pageToken=${pageParam}`;
  }

  const listRes = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!listRes.ok) throw new Error('Failed to fetch messages list');
  const listData = await listRes.json();
  const messages = listData.messages || [];
  const nextPageToken = listData.nextPageToken;

  if (messages.length === 0) return { emails: [], nextPageToken };

  const emailPromises = messages.map(async (msg: any) => {
    const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const detailData = await detailRes.json();
    return parseGmailMessage(detailData);
  });

  const emails = await Promise.all(emailPromises);
  return { emails, nextPageToken };
};

export function useEmails() {
  const { accessToken } = useAuth();
  
  return useInfiniteQuery({
    queryKey: ['emails'],
    queryFn: ({ pageParam }) => fetchEmailsPage(accessToken!, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

const archiveEmailRequest = async (emailId: string, token: string) => {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      removeLabelIds: ['INBOX'],
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to archive email');
  }

  return res.json();
};

export function useArchiveEmail() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (emailId: string) => archiveEmailRequest(emailId, accessToken!),
    onMutate: async (emailId: string) => {
      await queryClient.cancelQueries({ queryKey: ['emails'] });
      
      // Snapshot the previous infinite query data
      const previousEmails = queryClient.getQueryData<InfiniteData<EmailsPage>>(['emails']);

      // Optimistically update pages structure in InfiniteQuery data
      queryClient.setQueryData<InfiniteData<EmailsPage>>(['emails'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            emails: page.emails.filter((email) => email.id !== emailId),
          })),
        };
      });

      return { previousEmails };
    },
    onError: (err, emailId, context) => {
      if (context?.previousEmails) {
        queryClient.setQueryData(['emails'], context.previousEmails);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });
}

const sendEmailRequest = async (rawMessage: string, token: string) => {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: rawMessage,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to send email');
  }

  return res.json();
};

export function useSendEmail() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rawMessage: string) => sendEmailRequest(rawMessage, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });
}
