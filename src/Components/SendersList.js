import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UnsubscribeButton from './UnsubscribeButton'; // Import the UnsubscribeButton component

const SendersListPage = ({ accessToken }) => {
  const [senders, setSenders] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const uniqueSenderEmails = new Set();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/'); 
    } else {
      fetchGmailSenders(accessToken);
    }
  }, [accessToken, navigate]);

  const extractSenderEmail = (fromHeader) => {
    const match = fromHeader.match(/<(.*)>/);
    return match ? match[1] : fromHeader; 
  };

  const fetchGmailSenders = async (accessToken, pageToken = '') => {
    setLoading(true);
    try {
      const url = `https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10${pageToken ? `&pageToken=${pageToken}` : ''}`;
      const messagesResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const messagesData = await messagesResponse.json();
      if (messagesData.nextPageToken) {
        setNextPageToken(messagesData.nextPageToken);
      } else {
        setNextPageToken(null);
      }

      if (messagesData.messages) {
        const emailSenders = await Promise.all(
          messagesData.messages.map(async (message) => {
            const messageResponse = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            const messageDetails = await messageResponse.json();
            const headers = messageDetails.payload.headers;

            const fromHeader = headers.find(header => header.name === 'From');
            const listUnsubscribeHeader = headers.find(header => header.name === 'List-Unsubscribe');

            return {
              sender: fromHeader ? fromHeader.value : 'No sender info',
              unsubscribeLink: listUnsubscribeHeader ? listUnsubscribeHeader.value : null,
            };
          })
        );

        const newSenders = emailSenders.filter(sender => {
          const senderEmail = extractSenderEmail(sender.sender);
          if (!uniqueSenderEmails.has(senderEmail)) {
            uniqueSenderEmails.add(senderEmail);
            return true;
          }
          return false;
        });

        setSenders(prevSenders => [...prevSenders, ...newSenders]);
      }
    } catch (error) {
      console.error('Error fetching Gmail senders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Email Senders:</h3>
      <ul>
        {senders.length === 0 ? (
          <p>No senders found</p>
        ) : (
          senders.map((sender, index) => (
            <li key={index}>
              {sender.sender}
              {sender.unsubscribeLink ? (
                <UnsubscribeButton unsubscribeLink={sender.unsubscribeLink} />
              ) : (
                <span>No unsubscribe option</span>
              )}
            </li>
          ))
        )}
      </ul>

      {nextPageToken && (
        <button
          onClick={() => fetchGmailSenders(accessToken, nextPageToken)}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default SendersListPage;