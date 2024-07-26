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
interface TenantRentalInputProps {
    tenantId: string;
    close: () => void;
  }
  
  export function TenantRentalInput({
    tenantId = '',
    close = noop
  }: TenantRentalInputProps): React.JSX.Element {
    const [propertiesBase, setPropertiesBase] = React.useState<Property[]>([]);
    const [rentalsBase, setRentalsBase] = React.useState<Rental[]>([]);
    const [reload, Reload] = React.useState<boolean>(false);
    const rental = React.useRef<Rental>({
        id: '',
        propertyId: '',
        tenantId: [tenantId],
        startDate: null,
        endDate: null,
        price: ''
    });

    useEffect(() => {
      ImportTable('Properties').then(async (properties : Property[]) => { setPropertiesBase(properties as Property[])});
      ImportTable('Rentals').then(async (rentals : Rental[]) => { setRentalsBase(rentals as Rental[])});
      if(rental.current.id == '') rental.current.id = Math.random().toString(36).substring(7);
    }, []);

    function AddProperty(propertyId: string){
        let nRental = rentalsBase.find((rental) => rental.propertyId === propertyId);
        if(nRental == undefined) {
            rental.current.id = Math.random().toString(36).substring(7);
            rental.current.propertyId = propertyId;
            return;
        };

        nRental.tenantId = [tenantId, ...nRental.tenantId.filter((tenant) => tenant != tenantId)];
        rental.current = nRental;
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
                <TableCell>Properties</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Price</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell sx={{alignContent: "start"}}>
                    <Select
                        variant="standard"
                        defaultValue={rental.current.propertyId}
                        sx={{ minWidth: 120, maxWidth: 150 }}
                        onChange = {(e) => AddProperty(e.target.value)}
                    >
                        <MenuItem disabled value=''>
                            <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell>Address</TableCell>
                                <TableCell>Buy Time</TableCell>
                                <TableCell>Buy Price</TableCell>
                                <TableCell>Sell Time</TableCell>
                                <TableCell>Sell Price</TableCell>
                                </TableRow>
                            </TableHead>
                            </Table>
                        </MenuItem>
                        {propertiesBase.filter((property) => {
                            let rental = rentalsBase.find((rental) => rental.propertyId == property.id);
                            return rental == undefined || rental.tenantId.includes(tenantId);
                        }).map((property) => (
                            <MenuItem key={property.id} value={property.id} sx={{ display: 'table-row', padding: 0 }}>
                            <TableCell component="div" sx={{ display: 'table-cell', padding: '16px'}}>
                                {property.address.country} {property.address.state} {property.address.city} {property.address.street}
                            </TableCell>
                            <TableCell component="div" sx={{ display: 'table-cell', padding: '16px' }}>
                                {dayjs((property.BuyTime as unknown as dayjs.Dayjs).toDate()).format('MMM D, YYYY')}
                            </TableCell>
                            <TableCell component="div" sx={{ display: 'table-cell', padding: '16px' }}>
                                {property.BuyPrice}
                            </TableCell>
                            <TableCell component="div" sx={{ display: 'table-cell', padding: '16px' }}>
                                {dayjs((property.SellTime as unknown as dayjs.Dayjs).toDate()).format('MMM D, YYYY')}
                            </TableCell>
                            <TableCell component="div" sx={{ display: 'table-cell', padding: '16px' }}>
                                {property.SellPrice}
                            </TableCell>
                            </MenuItem>
                        ))}
                    </Select>
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