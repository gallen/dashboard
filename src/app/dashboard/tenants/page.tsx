'use client';

import * as React from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { TableFilters, ImportTable, ExportTable, DeleteElements, FilterTable } from '@/components/dashboard/table-filters';
import { TenantsTable } from '@/components/dashboard/tenants/tenants-table';
import type { Tenant } from '@/components/dashboard/tenants/tenants-table';

import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { dbHandle } from '@/components/firebase'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs';

import { getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { storageHandle } from '@/components/firebase';

//export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

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

export default function Page(): React.JSX.Element {

  const [tenants, setTenants] = React.useState<Tenant[]>([]);
  const router = useRouter();

  useEffect(() => {
    ImportTable('Tenants').then(async (tenants : Tenant[]) => {
      let promises = tenants.map(async (tenant) => {
        tenant.pictureHandle = await getDownloadURL(ref(storageHandle, 'Tenants/' + tenant.picture));
      })
      await Promise.all(promises);
      setTenants(tenants as Tenant[]);
    });
  }, []);

  async function DeleteTenants(tenantIds: Set<string>){
    let newTenants = await DeleteElements(tenants, (tenant: Tenant) => tenantIds.has(tenant.id), 
    async (tenant: Tenant) => {
      await deleteDoc(doc(dbHandle, "Tenants", tenant.id));
      const storageRef = ref(storageHandle, 'Tenants/' + tenant.picture);
      await deleteObject(storageRef);
    });
    setTenants(newTenants);
  }

  function FilterTenants(filter: string){
    let newTenants = FilterTable(tenants, filter);
    setTenants(newTenants);
  }


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Tenants</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
            onClick = {() => ExportTable(customers, 'Tenants', (element: Tenant) => element.id)}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained"
          onClick = {() => router.push('./tenants/register')}>
            Add
          </Button>
        </div>
      </Stack>
      
      <TableFilters 
        onSearch = {FilterTenants}
        placeHolder='Search Tenants...'
      />

      {customers.length != 0 && 
        <TenantsTable
          count={tenants.length}
          rows={tenants}
          onDelete={DeleteTenants}
        />
      }
    </Stack>
  );
}
