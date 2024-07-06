'use client';

import * as React from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { PropertiesFilters } from '@/components/dashboard/properties/properties-filters';
import { PropertiesTable } from '@/components/dashboard/properties/properties-table';
import type { Property } from '@/components/dashboard/properties/properties-table';

import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { dbHandle } from '@/components/firebase'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs';

//export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

const customers = [
  {
    id: 'USR-010',
    picture: '/assets/avatar-10.png',
    address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321' },
  },
  {
    id: 'USR-009',
    picture: '/assets/avatar-9.png',
    address: { city: 'Carson City', country: 'USA', state: 'Nevada', street: '2188 Armbrester Drive' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'},
  },
  {
    id: 'USR-008',
    picture: '/assets/avatar-8.png',
    address: { city: 'North Canton', country: 'USA', state: 'Ohio', street: '4894 Lakeland Park Drive' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow : '123456', redin: '654321' },
  },
  {
    id: 'USR-007',
    picture: '/assets/avatar-7.png',
    address: { city: 'Salt Lake City', country: 'USA', state: 'Utah', street: '368 Lamberts Branch Road' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
  {
    id: 'USR-006',
    picture: '/assets/avatar-6.png',
    address: { city: 'Murray', country: 'USA', state: 'Utah', street: '3934 Wildrose Lane' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
  {
    id: 'USR-005',
    picture: '/assets/avatar-5.png',
    address: { city: 'Atlanta', country: 'USA', state: 'Georgia', street: '1865 Pleasant Hill Road' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },

  {
    id: 'USR-004',
    picture: '/assets/avatar-4.png',
    address: { city: 'Berkeley', country: 'USA', state: 'California', street: '317 Angus Road' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
  {
    id: 'USR-003',
    picture: '/assets/avatar-3.png',
    address: { city: 'Cleveland', country: 'USA', state: 'Ohio', street: '2849 Fulton Street' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
  {
    id: 'USR-002',
    picture: '/assets/avatar-2.png',
    address: { city: 'Los Angeles', country: 'USA', state: 'California', street: '1798 Hickory Ridge Drive' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
  {
    id: 'USR-001',
    picture: '/assets/avatar-1.png',
    address: { city: 'San Diego', country: 'USA', state: 'California', street: '75247' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
] satisfies Property[];

export default function Page(): React.JSX.Element {

  const [properties, setCustomers] = React.useState<Property[]>([]);
  const router = useRouter();

  useEffect(() => {
    ImportCustomers().then((properties) => setCustomers(properties));
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Properties</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
            onClick = {() => handleExport(properties)}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained"
          onClick = {() => router.push('./properties/register')}>
            Add
          </Button>
        </div>
      </Stack>
      <PropertiesFilters />

      {customers.length != 0 && 
        <PropertiesTable
          count={properties.length}
          rows={properties}
        />
      }
    </Stack>
  );
}

async function ImportCustomers(){
  const querySnapshot = await getDocs(collection(dbHandle, "Properties"));
  let customers = new Array<Property>();
  querySnapshot.forEach((doc) => {
    customers.push(doc.data() as Property);
  }); 
  return customers;
}

async function handleExport(properties: Property[]){
  properties.forEach(async (property) => {
      var docRef = doc(dbHandle, "Properties", property.id);
      await setDoc(docRef, property);
  });
}
