import type { Tenant } from '@/components/dashboard/tenants/tenants-table';

const customers = [
    {
      id: 'USR-011',
      picture: 'avatar-1.png',
      pictureHandle: '',
      name: 'Alice Smith',
      ssn: '123-45-6789',
      gender: 'female',
      age: 28,
      paymentChannels: [{ channel: 'Paypal', account: '917263' }]
    },
    {
      id: 'USR-012',
      picture: 'avatar-2.png',
      pictureHandle: '',
      name: 'Bob Johnson',
      ssn: '987-65-4321',
      gender: 'male',
      age: 42,
      paymentChannels: [{ channel: 'Venmo', account: '562738' }]
    },
    {
      id: 'USR-013',
      picture: 'avatar-3.png',
      pictureHandle: '',
      name: 'Carol Davis',
      ssn: '234-56-7890',
      gender: 'female',
      age: 30,
      paymentChannels: [{ channel: 'Paypal', account: '483920' }]
    },
    {
      id: 'USR-014',
      picture: 'avatar-4.png',
      pictureHandle: '',
      name: 'David Miller',
      ssn: '345-67-8901',
      gender: 'male',
      age: 36,
      paymentChannels: [{ channel: 'CashApp', account: '719283' }]
    },
    {
      id: 'USR-015',
      picture: 'avatar-5.png',
      pictureHandle: '',
      name: 'Eve Wilson',
      ssn: '456-78-9012',
      gender: 'female',
      age: 25,
      paymentChannels: [{ channel: 'Paypal', account: '102938' }]
    },
    {
      id: 'USR-016',
      picture: 'avatar-6.png',
      pictureHandle: '',
      name: 'Frank Brown',
      ssn: '567-89-0123',
      gender: 'male',
      age: 50,
      paymentChannels: [{ channel: 'Venmo', account: '209384' }]
    },
    {
      id: 'USR-017',
      picture: 'avatar-7.png',
      pictureHandle: '',
      name: 'Grace Moore',
      ssn: '678-90-1234',
      gender: 'female',
      age: 32,
      paymentChannels: [{ channel: 'CashApp', account: '304958' }]
    },
    {
      id: 'USR-018',
      picture: 'avatar-8.png',
      pictureHandle: '',
      name: 'Henry Taylor',
      ssn: '789-01-2345',
      gender: 'male',
      age: 45,
      paymentChannels: [{ channel: 'Paypal', account: '123456' }]
    },
    {
      id: 'USR-019',
      picture: 'avatar-9.png',
      pictureHandle: '',
      name: 'Ivy Anderson',
      ssn: '890-12-3456',
      gender: 'female',
      age: 29,
      paymentChannels: [{ channel: 'Venmo', account: '654321' }]
    },
    {
      id: 'USR-020',
      picture: 'avatar-10.png',
      pictureHandle: '',
      name: 'Jack Thomas',
      ssn: '901-23-4567',
      gender: 'male',
      age: 39,
      paymentChannels: [{ channel: 'CashApp', account: '789012' }]
    }
  ] satisfies Tenant[];