'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import type { Property } from '@/components/dashboard/properties/properties-table';

import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { dbHandle } from '@/components/firebase'

export default function Page(): React.JSX.Element {
    const [file, setFile] = React.useState<File | null>(null);
    const addressRef = React.useRef<{
        city: string;
        state: string;
        country: string;
        street: string;
    }>({ city: '', state: '', country: '', street: '' });

    const buyTime = React.useRef<Date>();
    const buyPrice = React.useRef('');
    const sellTime = React.useRef<Date>();
    const sellPrice = React.useRef('');

    const router = useRouter();

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }; 

    async function handleExport(){
        var newProperty = {
            id: Math.random().toString(36).substring(7),
            picture: '',
            address: addressRef.current,
            BuyTime: buyTime.current,
            BuyPrice: buyPrice.current,
            SellTime: sellTime.current,
            SellPrice: sellPrice.current,
        } as Property;

        var docRef = doc(dbHandle, "Properties", newProperty.id);
        await setDoc(docRef, newProperty);
    }

    return (
    <Stack spacing={3}>
        <Typography variant = "h1"> Information </Typography>
        <Stack spacing={2}>
            <Stack direction = "row" spacing = {2}>
                <label htmlFor = "fileInput">
                <Box alignSelf="flex-start" sx = {{
                    height: 350, 
                    width: 400,
                    border: '1px dashed black',
                    bgcolor: 'gray',
                    color: 'primary.contrastText',
                    backgroundImage: file == null ? 'none' : `url(${URL.createObjectURL(file)})`,
                    contentVisibility: file == null ? 'visible' : 'hidden',
                }} textAlign = 'center'>
                    
                    <Image src = '/assets/upload.png' alt = "image" width = {200} height = {200}/>
                    <Typography variant = "h6"> Drag & Drop To Upload File </Typography>
                    <Typography variant = "h6"> OR </Typography>
                    <Button variant = "contained" sx = {{bgcolor: 'black', pointerEvents: 'none'}} > Browse </Button>
                    <input type = "file" id = "fileInput" accept = "image/*" onChange={handleFileSelected} hidden/>
                </Box>
                </label>
                <Stack spacing={2} sx={{ flexGrow: 1 }} >
                        <Typography variant="h4">Address</Typography>
                        <TextField id="filled-basic" label="Country" onChange={(e: React.ChangeEvent<HTMLInputElement>) => addressRef.current.country = e.target.value} />
                        <TextField id="filled-basic" label="State" onChange={(e: React.ChangeEvent<HTMLInputElement>) => addressRef.current.state = e.target.value} />
                        <TextField id="filled-basic" label="City" onChange={(e: React.ChangeEvent<HTMLInputElement>) => addressRef.current.city = e.target.value} />
                        <TextField id="filled-basic" label="Street" onChange={(e: React.ChangeEvent<HTMLInputElement>) => addressRef.current.street = e.target.value} />
                </Stack> 
            </Stack>
            <Typography variant="h4">Transactions</Typography>
            <TextField id = "filled-basic" label = "BuyTime (YY-MM-DD)" onChange={(e: React.ChangeEvent<HTMLInputElement>) => buyTime.current = new Date(e.target.value)}/>
            <TextField id = "filled-basic" label = "BuyPrice" onChange={(e: React.ChangeEvent<HTMLInputElement>) => buyPrice.current = e.target.value} />
            <TextField id = "filled-basic" label = "SellTime (YY-MM-DD)" onChange={(e: React.ChangeEvent<HTMLInputElement>) => sellTime.current = new Date(e.target.value)} />
            <TextField id = "filled-basic" label = "SellPrice" onChange={(e: React.ChangeEvent<HTMLInputElement>) => sellPrice.current = e.target.value} />
            <Box
                alignSelf="flex-end" sx = {{
                    height: 350, 
                    width: 400,
                    contentVisibility: file == null ? 'visible' : 'hidden',
                }} textAlign = 'end'
            >
                <Button variant = "outlined" color = 'error' onClick = {() => router.push('../properties')}> Cancel </Button>
                <Button variant = "outlined" color = 'success' onClick = {handleExport} > Submit </Button>
            </Box>
            
        </Stack>
    </Stack>
    );
}