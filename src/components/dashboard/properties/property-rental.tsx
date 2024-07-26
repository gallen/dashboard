import React from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Property } from '@/components/dashboard/properties/properties-table';
import { Rental } from '@/components/dashboard/renting/rental-table';
import { TableFilters, ImportTable, ExportTable, FilterTable, DeleteElements } from '@/components/dashboard/table-filters';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Box, TextField, Select, MenuItem } from '@mui/material';
import { ListInput } from '@/components/dashboard/list-input';
import { Tenant } from '@/components/dashboard/tenants/tenants-table';

import { doc, setDoc } from "firebase/firestore";
import { dbHandle } from '@/components/firebase';
import { Timestamp } from 'firebase/firestore';
import dayjs from 'dayjs';

var DefaultRental = {
  id: '',
  propertyId: '',
  tenantId: [],
  startDate: null,
  endDate: null,
  price: ''
} as unknown as Rental;

function noop(): void {
    // do nothing
}
interface PropertyRentalInputProps {
    propertyId: string;
    close: () => void;
  }
  
  export function PropertyRentalInput({
    propertyId = '',
    close = noop
  }: PropertyRentalInputProps): React.JSX.Element {
    const [tenantsBase, setTenantsBase] = React.useState<Tenant[]>([]);
    const selectedTenant = React.useRef<string>('');
    const rental = React.useRef<Rental>(DefaultRental);
    const [reload, Reload] = React.useState<boolean>(false);

    useEffect(() => {
      ImportTable('Tenants').then(async (tenants : Tenant[]) => { setTenantsBase(tenants as Tenant[])});
      ImportTable('Rentals').then(async (rentals : Rental[]) => {
        let nRental = rentals.find((rental) => rental.propertyId === propertyId);
        if(nRental === undefined){
          rental.current.id = Math.random().toString(36).substring(7);
          rental.current.propertyId = propertyId;
          console.log("found");
        } else rental.current = nRental;
        Reload(!reload);
      });
    }, []);

    function AddTenant(){
      if(selectedTenant.current == '') return;
      let newTenant = (tenantsBase.find((tenant) => tenant.id == selectedTenant.current) as Tenant).id;
      rental.current.tenantId = [...rental.current.tenantId, newTenant];
      Reload(!reload);
  }

  function SetTenants(tenants: string[]){
      rental.current.tenantId = tenants;
      Reload(!reload);
  }

  function SelectTenant(tenant: string){
      selectedTenant.current = tenant;
      Reload(!reload);
  }

  async function handleExport(){
      var docRef = doc(dbHandle, "Rentals", rental.current.id);
      await setDoc(docRef, rental.current);
      close();
  }

    return(
        <>
          <Table  sx={{ minWidth: '600px', maxWidth: '900px'}}>
            <TableHead>
                <TableRow>
                <TableCell>Tenant</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Price</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell sx={{alignContent: "start"}}>
                    <ListInput
                        rows = {rental.current.tenantId}
                        toString={(tenant) => tenant}
                        onItemsChange={SetTenants}
                        onInputChange={SelectTenant}
                        InputUI={
                            <Stack direction="row" spacing={2}>
                                <Select
                                    variant="standard"
                                    defaultValue={selectedTenant.current}
                                    sx={{ minWidth: 120, maxWidth: 150 }}
                                    onChange = {(e) => selectedTenant.current = e.target.value}
                                >
                                    <MenuItem disabled value=''>
                                        <Table>
                                        <TableHead>
                                            <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>SSN</TableCell>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>Age</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        </Table>
                                    </MenuItem>
                                    {tenantsBase.filter((tenant) => !rental.current.tenantId.includes(tenant.id)).map((tenant) => (
                                        <MenuItem key={tenant.id} value={tenant.id} sx={{ display: 'table-row', padding: 0 }}>
                                            <TableCell component="div" sx={{ display: 'table-cell', padding: '16px'}}>
                                                {tenant.name}
                                            </TableCell>
                                            <TableCell component="div" sx={{ display: 'table-cell', padding: '16px' }}>
                                                {tenant.ssn}
                                            </TableCell>
                                            <TableCell component="div" sx={{ display: 'table-cell', padding: '16px' }}>
                                                {tenant.gender}
                                            </TableCell>
                                            <TableCell component="div" sx={{ display: 'table-cell', padding: '16px' }}>
                                                {tenant.age}
                                            </TableCell>
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Button onClick={AddTenant}>Add</Button>
                            </Stack>
                        }
                    />
                    </TableCell>
                    <TableCell sx={{alignContent: "start"}}>
                        <TextField 
                            id = "filled-basic" 
                            type = "date" 
                            sx = {{minWidth: 100}}
                            defaultValue = {rental.current.startDate && dayjs(rental.current.startDate.toDate()).format('YYYY-MM-DD')}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => rental.current.startDate = Timestamp.fromDate(new Date(e.target.value))}
                        />
                    </TableCell>
                    <TableCell sx={{alignContent: "start"}}>
                        <TextField 
                            id = "filled-basic" 
                            type = "date" 
                            sx = {{minWidth: 100}}
                            defaultValue = {rental.current.endDate && dayjs(rental.current.endDate.toDate()).format('YYYY-MM-DD')}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => rental.current.endDate = Timestamp.fromDate(new Date(e.target.value))}
                        />
                    </TableCell>
                    <TableCell sx={{alignContent: "start"}}>
                        <TextField 
                            id = "filled-basic" 
                            type = "text" 
                            sx = {{minWidth: 75}}
                            defaultValue={rental.current.price}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => rental.current.price = e.target.value}
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <Box alignSelf="flex-end" textAlign = 'end' padding={2} >
            <Button variant = "outlined" color = 'error' onClick={close}> Cancel </Button>
            <Button variant = "outlined" color = 'success' onClick={handleExport}> Submit </Button>
        </Box>
        </>
    );
  }