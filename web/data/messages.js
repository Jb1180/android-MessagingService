'use strict';

/**
 * Sample message log for the web UI, mirroring the conversations the Android
 * MessagingService sample posts. Sorted newest first.
 */
module.exports = [
    {
        id: 'msg-8',
        direction: 'outgoing',
        contact: { name: 'Sam Whitfield', address: '+44 7700 900233' },
        body: 'Everything green on staging, logging 3 messages per conversation.',
        sentAt: '2026-11-15T18:05:00Z'
    },
    {
        id: 'msg-7',
        direction: 'incoming',
        contact: { name: 'Meera Kapoor', address: '+44 7700 900412' },
        body: 'One more thing — the timestamp formatting looks off on my phone.',
        sentAt: '2026-11-15T16:58:00Z'
    },
    {
        id: 'msg-6',
        direction: 'outgoing',
        contact: { name: 'Priya Raman', address: '+44 7700 900187' },
        body: 'Got it, added to the conversation list. Thanks!',
        sentAt: '2026-11-15T13:41:00Z'
    },
    {
        id: 'msg-5',
        direction: 'incoming',
        contact: { name: 'Priya Raman', address: '+44 7700 900187' },
        body: 'Sent you the contact card for the new intake group.',
        sentAt: '2026-11-15T13:26:00Z'
    },
    {
        id: 'msg-4',
        direction: 'outgoing',
        contact: { name: 'Sam Whitfield', address: '+44 7700 900233' },
        body: "Great. I'll run the reply flow against it this afternoon.",
        sentAt: '2026-11-15T11:02:00Z'
    },
    {
        id: 'msg-3',
        direction: 'incoming',
        contact: { name: 'Sam Whitfield', address: '+44 7700 900233' },
        body: 'The messaging service rebuild is deployed to staging.',
        sentAt: '2026-11-15T10:47:00Z'
    },
    {
        id: 'msg-2',
        direction: 'outgoing',
        contact: { name: 'Meera Kapoor', address: '+44 7700 900412' },
        body: "Yes — I'll bring the notification demo.",
        sentAt: '2026-11-15T08:15:00Z'
    },
    {
        id: 'msg-1',
        direction: 'incoming',
        contact: { name: 'Meera Kapoor', address: '+44 7700 900412' },
        body: 'Hi! Are we still on for the standup at 9?',
        sentAt: '2026-11-15T08:12:00Z'
    }
];
