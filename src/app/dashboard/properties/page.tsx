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

import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { dbHandle } from '@/components/firebase'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs';

import { getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { storageHandle } from '@/components/firebase';
import { boolean } from 'zod';

//export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

const customers = [
  {
    id: 'USR-010',
    picture: 'avatar-10.png',
    pictureHandle: '',
    address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321' },
  },
  {
    id: 'USR-009',
    picture: 'avatar-9.png',
    pictureHandle: '',
    address: { city: 'Carson City', country: 'USA', state: 'Nevada', street: '2188 Armbrester Drive' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'},
  },
  {
    id: 'USR-008',
    picture: 'avatar-8.png',
    pictureHandle: '',
    address: { city: 'North Canton', country: 'USA', state: 'Ohio', street: '4894 Lakeland Park Drive' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow : '123456', redin: '654321' },
  },
  {
    id: 'USR-007',
    picture: 'avatar-7.png',
    pictureHandle: '',
    address: { city: 'Salt Lake City', country: 'USA', state: 'Utah', street: '368 Lamberts Branch Road' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
  {
    id: 'USR-006',
    picture: 'avatar-6.png',
    pictureHandle: '',
    address: { city: 'Murray', country: 'USA', state: 'Utah', street: '3934 Wildrose Lane' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
  {
    id: 'USR-005',
    picture: 'avatar-5.png',
    pictureHandle: '',
    address: { city: 'Atlanta', country: 'USA', state: 'Georgia', street: '1865 Pleasant Hill Road' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },

  {
    id: 'USR-004',
    picture: 'avatar-4.png',
    pictureHandle: '',
    address: { city: 'Berkeley', country: 'USA', state: 'California', street: '317 Angus Road' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
  {
    id: 'USR-003',
    picture: 'avatar-3.png',
    pictureHandle: '',
    address: { city: 'Cleveland', country: 'USA', state: 'Ohio', street: '2849 Fulton Street' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
  {
    id: 'USR-002',
    picture: 'avatar-2.png',
    pictureHandle: '', 
    address: { city: 'Los Angeles', country: 'USA', state: 'California', street: '1798 Hickory Ridge Drive' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
  {
    id: 'USR-001',
    picture: 'avatar-1.png',
    pictureHandle: '',
    address: { city: 'San Diego', country: 'USA', state: 'California', street: '75247' },
    BuyTime: dayjs().subtract(2, 'hours').toDate(),
    BuyPrice: '€ 1,200,000',
    SellTime: dayjs().subtract(2, 'hours').toDate(),
    SellPrice: '€ 1,500,000',
    externalIds: { zillow: '123456', redin: '654321'}
  },
] satisfies Property[];

export default function Page(): React.JSX.Element {

  const [properties, setProperties] = React.useState<Property[]>([]);
  const router = useRouter();

  useEffect(() => {
    ImportProperties().then((properties) => setProperties(properties));
  }, []);

  async function DeleteProperties(propertyIds: Set<string>){
    let newProperties = new Array<Property>(); console.log("here");
    let promises = properties.map(async (property) => {
      if(!propertyIds.has(property.id)){
        newProperties.push(property);
        return;
      }

      await deleteDoc(doc(dbHandle, "Properties", property.id));
      const storageRef = ref(storageHandle, 'Properties/' + property.picture);
      await deleteObject(storageRef);
    });
    await Promise.all(promises);

    setProperties(newProperties);
  }

  function IsMatch(pObj: object, filter: string){
    let isMatch = false;
    Object.entries(pObj).forEach(([key, value]: [string, any]) => {
      if(typeof value == 'string' && value.toLowerCase().includes(filter.toLowerCase()))
        isMatch ||= true;
      else if (typeof value == 'object')
        isMatch ||= IsMatch(value, filter);
    });
    return isMatch;
  }

  function FilterProperties(filter: string){
    let newProperties = new Array<Property>();
    let oldProperties = new Array<Property>();
    properties.forEach((property) => {
      if(IsMatch(property, filter)) newProperties.push(property);
      else oldProperties.push(property);
    });
    newProperties.push(...oldProperties);

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
      <PropertiesFilters 
        onSearch = {FilterProperties}
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

async function ImportProperties(){
  const querySnapshot = await getDocs(collection(dbHandle, "Properties"));
  let properties = new Array<Property>();
  const promises = querySnapshot.docs.map(async (doc) => {
    let property = doc.data() as Property;

    property.pictureHandle = await getDownloadURL(ref(storageHandle, 'Properties/' + property.picture));
    properties.push(property);
  }); 
  await Promise.all(promises);
  return properties;
}

async function handleExport(properties: Property[]){
  properties.forEach(async (property) => {
      var docRef = doc(dbHandle, "Properties", property.id);
      await setDoc(docRef, property);
  });
}
