'use client'

import * as React from 'react';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { Popper } from '@mui/base/Popper';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';

import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { dbHandle } from '@/components/firebase'

import { TableFilters, ImportTable, ExportTable, FilterTable, DeleteElements } from '@/components/dashboard/table-filters';
import { RentalInput } from '@/components/dashboard/renting/rental-input';
import { RentalTable, Rental } from '@/components/dashboard/renting/rental-table';
import { PopperPlacementType } from '@mui/material';
import { Timestamp } from 'firebase/firestore';

const customers = [
  {
    id: 'USR-011',
    tenantId: ['USR-011'],
    propertyId: 'USR-011',
    startDate: Timestamp.fromDate(dayjs().subtract(2, 'hours').toDate()),
    endDate: Timestamp.fromDate(dayjs().subtract(2, 'hours').toDate()),
    price: "$ 1000",
  },
  {
    id: 'USR-012',
    tenantId: ['USR-012'],
    propertyId: 'USR-012',
    startDate: Timestamp.fromDate(dayjs().subtract(2, 'hours').toDate()),
    endDate: Timestamp.fromDate(dayjs().subtract(2, 'hours').toDate()),
    price: "$ 2000",
  },
] satisfies Rental[];


export default function Page(): React.JSX.Element {

  const [rentals, setRentals] = React.useState<Rental[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const placementEl = React.useRef<PopperPlacementType>('left-start');
  const [selectedRental, selectRental] = React.useState<Rental>(DefaultRental);

  useEffect(() => {
    ImportTable('Rentals').then(async (rentals : Rental[]) => {
      setRentals(rentals);
    });
  }, []);

  async function DeleteRentals(rentalIds: Set<string>){
    let newRentals = await DeleteElements(rentals, (rental: Rental) => rentalIds.has(rental.id), 
      async (rental: Rental) => {
        await deleteDoc(doc(dbHandle, "Rentals", rental.id));
    });
    setRentals(newRentals);
  }

  function SearchRentals(callback: (rental: Rental) => boolean){
    let newRentals = rentals.filter(callback);
    if(newRentals.length == 0) return null;
    return newRentals[0] as Rental;
  }

  function EditRentals(rentalIds: Set<string>, event: React.MouseEvent<HTMLElement>){
    selectRental(rentals.filter((rental: Rental) => rentalIds.has(rental.id))[0]);
    placementEl.current = 'bottom-start';
    setAnchorEl(anchorEl == null ? event.currentTarget : null);
  }

  function TogglePopup(event : React.MouseEvent<HTMLElement>){
    selectRental(DefaultRental);
    placementEl.current = 'left-start';
    setAnchorEl(anchorEl == null ? event.currentTarget : null); 
  }

  function FilterRentals(filter: string){
    let newRentals = FilterTable(rentals, filter);
    setRentals(newRentals);
  }


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Rentals</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
            onClick = {() => ExportTable(customers, 'Rentals', (element: Rental) => element.id)}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained"
          onClick = {TogglePopup}>
            Add
          </Button>
          <Popper open={anchorEl != null} anchorEl={anchorEl} placement = {placementEl.current}>
            <Box sx = {{
              border: 1,
              borderColor: 'divider',
              borderStyle: 'solid',
              padding: 1,
              backgroundColor: 'background.paper',
            }}>
              <RentalInput
                defaultRental={selectedRental}
                close = {() => {setAnchorEl(null);}}
                searchRentals={SearchRentals}
              />
            </Box>
          </Popper>
        </div>
      </Stack>
      
      <TableFilters 
        onSearch = {FilterRentals}
        placeHolder='Search Rentals...'
      />

      {customers.length != 0 && 
        <RentalTable
          count={rentals.length}
          rows={rentals}
          onDelete={DeleteRentals}
          onEdit={EditRentals}
        />
      }
    </Stack>
  );
}

const DefaultRental = {
  id: '',
  propertyId: '',
  tenantId: [],
  startDate: null,
  endDate: null,
  price: ''
} as Rental;