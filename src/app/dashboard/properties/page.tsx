'use client';

import * as React from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { Popper } from '@mui/base/Popper';
import Box from '@mui/material/Box';

import { TableFilters, ImportTable, ExportTable, DeleteElements, FilterTable } from '@/components/dashboard/table-filters';
import { DefaultProp, PropertiesTable } from '@/components/dashboard/properties/properties-table';
import type { Property } from '@/components/dashboard/properties/properties-table';
import { SetDefault, RevertDefault } from '@/components/dashboard/properties/properties-table';

import { doc, deleteDoc } from "firebase/firestore";
import { dbHandle } from '@/components/firebase'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs';

import { getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { storageHandle } from '@/components/firebase';
import { Timestamp } from 'firebase/firestore';
import { PropertyRentalInput } from '@/components/dashboard/properties/property-rental';

//export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const selectedId = React.useRef<string>('');
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

  async function AddRental(property: Set<string>, anchor: HTMLElement){
    selectedId.current = property.values().next().value;
    setAnchorEl(anchorEl ? null : anchor);
  }

  async function DeleteProperties(propertyIds: Set<string>){
    let newProperties = await DeleteElements(properties, (property: Property) => propertyIds.has(property.id), 
      async (property: Property) => {
      await deleteDoc(doc(dbHandle, "Properties", property.id));
      const storageRef = ref(storageHandle, 'Properties/' + property.picture);
      await deleteObject(storageRef);
    });
    setProperties(newProperties);
  }

  async function EditProperty(propertyId: Set<string>){
    let property = properties.find((property) => property.id === propertyId.values().next().value);
    SetDefault(property as Property);
    router.push('./properties/register');
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
            onClick = {() => ExportTable(properties, 'Properties', (element: Property) => element.id)}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained"
          onClick = {() => {RevertDefault(); router.push('./properties/register');}}>
            Add
          </Button>
        </div>
      </Stack>
      <TableFilters 
        onSearch = {FilterProperties}
        placeHolder='Search Properties...'
      />

      {properties.length != 0 && 
        <PropertiesTable
          count={properties.length}
          rows={properties}
          onDelete={DeleteProperties}
          onEdit={EditProperty}
          onRental={AddRental}
        />
      }
      <Popper open={anchorEl != null} anchorEl={anchorEl} placement = {'right-start'}>
        <Box sx = {{
          border: 1,
          borderColor: 'divider',
          borderStyle: 'solid',
          padding: 1,
          backgroundColor: 'background.paper',
        }}>
          <PropertyRentalInput
            propertyId={selectedId.current}
            close = {() => {setAnchorEl(null);}}
          />
        </Box>
      </Popper>
    </Stack>
  );
}
