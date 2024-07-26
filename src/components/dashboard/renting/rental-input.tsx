'use client';

import * as React from 'react';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';

import { Table, TableHead, TableBody, TableRow, TableCell, Menu } from '@mui/material';
import { Property } from '@/components/dashboard/properties/properties-table';
import { Tenant } from '@/components/dashboard/tenants/tenants-table';
import { ImportTable } from '@/components/dashboard/table-filters';
import { ListInput } from '../list-input';
import { Rental } from './rental-table';

import { doc, setDoc } from "firebase/firestore";
import { dbHandle } from '@/components/firebase'
import { Timestamp } from 'firebase/firestore';

var DefaultRental = {
    id: '',
    propertyId: '',
    tenantId: [],
    startDate: null,
    endDate: null,
    price: ''
} as unknown as Rental;

  interface RentalInputProps {
    defaultRental?: Rental;
    close?: () => void;
    searchRentals?: (callback: (rental: Rental) => boolean) => Rental | null;
  }

export function RentalInput({
    defaultRental = DefaultRental,
    close = () => {},
    searchRentals = () => {return null;}
}: RentalInputProps): React.JSX.Element {
    const [propertiesBase, setPropertiesBase] = React.useState<Property[]>([]);
    const [tenantsBase, setTenantsBase] = React.useState<Tenant[]>([]);
    const [reload, Reload] = React.useState<boolean>(false);
    const rental = React.useRef<Rental>(defaultRental);
    const selectedTenant = React.useRef<string>('');

    useEffect(() => {
        ImportTable('Properties').then(async (properties : Property[]) => { setPropertiesBase(properties as Property[])});
        ImportTable('Tenants').then(async (tenants : Tenant[]) => { setTenantsBase(tenants as Tenant[])});
        if(rental.current.id == '') rental.current.id = Math.random().toString(36).substring(7);
    }, []);

    function AddProperty(propertyId: string){
        let nRental = searchRentals((rental) => rental.propertyId == propertyId);
        if(nRental == null) {
            rental.current.id = Math.random().toString(36).substring(7);
            rental.current.propertyId = propertyId;
            return;
        };

        nRental.tenantId = [...rental.current.tenantId, ...nRental.tenantId.filter((tenant) => !rental.current.tenantId.includes(tenant))];
        rental.current = nRental;
        Reload(!reload);
    }

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

    return (
        <>
        <Table  sx={{ minWidth: '600px', maxWidth: '900px'}}>
            <TableHead>
                <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Tenant</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Price</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell sx={{alignContent: "start"}}>
                    {/* Property */}
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
                        {propertiesBase.map((property) => (
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
            <Button variant = "outlined" color = 'success' onClick = {handleExport}> Submit </Button>
        </Box>
        </>
    );
}