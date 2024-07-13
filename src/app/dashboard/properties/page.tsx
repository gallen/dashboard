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
import { PropertiesTable } from '@/components/dashboard/properties/properties-table';
import type { Property } from '@/components/dashboard/properties/properties-table';

import { doc, deleteDoc } from "firebase/firestore";
import { dbHandle } from '@/components/firebase'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs';

import { getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { storageHandle } from '@/components/firebase';

//export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

const customers = [
  {
    id: 'USR-010',
    picture: 'avatar-10.png',
    pictureHandle: '',
    address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
    BuyTime: dayjs().subtract(2, 'hours'),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours'),
    SellPrice: '€ 1,500,000',
    externalIds: [{ channel: "zillow", account: '123456'}, {channel: "redin", account: '654321'}],
  },
  {
    id: 'USR-009',
    picture: 'avatar-9.png',
    pictureHandle: '',
    address: { city: 'Carson City', country: 'USA', state: 'Nevada', street: '2188 Armbrester Drive' },
    BuyTime: dayjs().subtract(2, 'hours'),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours'),
    SellPrice: '€ 1,500,000',
    externalIds: [{ channel: "zillow", account: '123456'}, {channel: "redin", account: '654321'}],
  },
  {
    id: 'USR-008',
    picture: 'avatar-8.png',
    pictureHandle: '',
    address: { city: 'North Canton', country: 'USA', state: 'Ohio', street: '4894 Lakeland Park Drive' },
    BuyTime: dayjs().subtract(2, 'hours'),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours'),
    SellPrice: '€ 1,500,000',
    externalIds: [{ channel: "zillow", account: '123456'}, {channel: "redin", account: '654321'}],
  },
  {
    id: 'USR-007',
    picture: 'avatar-7.png',
    pictureHandle: '',
    address: { city: 'Salt Lake City', country: 'USA', state: 'Utah', street: '368 Lamberts Branch Road' },
    BuyTime: dayjs().subtract(2, 'hours'),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours'),
    SellPrice: '€ 1,500,000',
    externalIds: [{ channel: "zillow", account: '123456'}, {channel: "redin", account: '654321'}],
  },
  {
    id: 'USR-006',
    picture: 'avatar-6.png',
    pictureHandle: '',
    address: { city: 'Murray', country: 'USA', state: 'Utah', street: '3934 Wildrose Lane' },
    BuyTime: dayjs().subtract(2, 'hours'),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours'),
    SellPrice: '€ 1,500,000',
    externalIds: [{ channel: "zillow", account: '123456'}, {channel: "redin", account: '654321'}],
  },
  {
    id: 'USR-005',
    picture: 'avatar-5.png',
    pictureHandle: '',
    address: { city: 'Atlanta', country: 'USA', state: 'Georgia', street: '1865 Pleasant Hill Road' },
    BuyTime: dayjs().subtract(2, 'hours'),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours'),
    SellPrice: '€ 1,500,000',
    externalIds: [{ channel: "zillow", account: '123456'}, {channel: "redin", account: '654321'}],
  },

  {
    id: 'USR-004',
    picture: 'avatar-4.png',
    pictureHandle: '',
    address: { city: 'Berkeley', country: 'USA', state: 'California', street: '317 Angus Road' },
    BuyTime: dayjs().subtract(2, 'hours'),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours'),
    SellPrice: '€ 1,500,000',
    externalIds: [{ channel: "zillow", account: '123456'}, {channel: "redin", account: '654321'}],
  },
  {
    id: 'USR-003',
    picture: 'avatar-3.png',
    pictureHandle: '',
    address: { city: 'Cleveland', country: 'USA', state: 'Ohio', street: '2849 Fulton Street' },
    BuyTime: dayjs().subtract(2, 'hours'),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours'),
    SellPrice: '€ 1,500,000',
    externalIds: [{ channel: "zillow", account: '123456'}, {channel: "redin", account: '654321'}],
  },
  {
    id: 'USR-002',
    picture: 'avatar-2.png',
    pictureHandle: '', 
    address: { city: 'Los Angeles', country: 'USA', state: 'California', street: '1798 Hickory Ridge Drive' },
    BuyTime: dayjs().subtract(2, 'hours'),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours'),
    SellPrice: '€ 1,500,000',
    externalIds: [{ channel: "zillow", account: '123456'}, {channel: "redin", account: '654321'}],
  },
  {
    id: 'USR-001',
    picture: 'avatar-1.png',
    pictureHandle: '',
    address: { city: 'San Diego', country: 'USA', state: 'California', street: '75247' },
    BuyTime: dayjs().subtract(2, 'hours'),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours'),
    SellPrice: '€ 1,500,000',
    externalIds: [{ channel: "zillow", account: '123456'}, {channel: "redin", account: '654321'}],
  },
] satisfies Property[];

export default function Page(): React.JSX.Element {

  const [properties, setProperties] = React.useState<Property[]>([]);
  const router = useRouter();

  useEffect(() => {
    ImportTable('Properties').then(async (properties : Property[]) => {
      let promises = properties.map(async (property) => {
        property.pictureHandle = await getDownloadURL(ref(storageHandle, 'Properties/' + property.picture));
      })
      await Promise.all(promises);
      setProperties(properties as Property[]);
    });
  }, []);

  async function DeleteProperties(propertyIds: Set<string>){
    let newProperties = await DeleteElements(properties, (property: Property) => propertyIds.has(property.id), 
      async (property: Property) => {
      await deleteDoc(doc(dbHandle, "Properties", property.id));
      const storageRef = ref(storageHandle, 'Properties/' + property.picture);
      await deleteObject(storageRef);
    });
    setProperties(newProperties);
  }

  function FilterProperties(filter: string){
    let newProperties = FilterTable(properties, filter);
    setProperties(newProperties);
  }

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
            onClick = {() => ExportTable(customers, 'Properties', (element: Property) => element.id)}>
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
      <TableFilters 
        onSearch = {FilterProperties}
        placeHolder='Search Properties...'
      />

      {customers.length != 0 && 
        <PropertiesTable
          count={properties.length}
          rows={properties}
          onDelete={DeleteProperties}
        />
      }
    </Stack>
  );
}
