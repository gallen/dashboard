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

import { doc, setDoc } from "firebase/firestore";
import { ref } from 'firebase/storage';
import { dbHandle, storageHandle } from '@/components/firebase'
import { uploadBytes } from 'firebase/storage';
import { ListInput } from '@/components/dashboard/list-input';
import dayjs from 'dayjs';

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
    const external = React.useRef<{ channel: string; account: string }>({channel: '', account: ''});
    const [externalIds, setExternalIds] = React.useState<{ channel: string; account: string }[]>([]);

    function IdToString(item: { channel: string; account: string }){
        return item.channel + ': ' + item.account;
    }

    const router = useRouter();
    var fileUrl = '';
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            fileUrl = URL.createObjectURL(e.target.files[0]);
        }
    }; 

    async function handleExport(){
        if(file == null) return;
        let propertyId = Math.random().toString(36).substring(7);
        var newProperty = {
            id: propertyId,
            picture: propertyId + '.png',
            address: addressRef.current,
            BuyTime: buyTime.current,
            BuyPrice: buyPrice.current,
            SellTime: sellTime.current,
            SellPrice: sellPrice.current,
            externalIds: externalIds,
        } as unknown as Property;

        var docRef = doc(dbHandle, "Properties", newProperty.id);
        await setDoc(docRef, newProperty);

        var storageRef = ref(storageHandle, 'Properties/' + newProperty.picture);
        uploadBytes(storageRef, file as File);
        router.push('../properties');
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
                        <TextField id="filled-basic" label="Street" onChange={(e: React.ChangeEvent<HTMLInputElement>) => addressRef.current.street = e.target.value} />
                        <TextField id="filled-basic" label="State" onChange={(e: React.ChangeEvent<HTMLInputElement>) => addressRef.current.state = e.target.value} />
                        <TextField id="filled-basic" label="City" onChange={(e: React.ChangeEvent<HTMLInputElement>) => addressRef.current.city = e.target.value} />
                        <TextField id="filled-basic" label="Country" onChange={(e: React.ChangeEvent<HTMLInputElement>) => addressRef.current.country = e.target.value} />
                </Stack> 
            </Stack>
            <Typography variant="h4">Transactions</Typography> 
            {/* Fix for UI here -> https://github.com/mui/material-ui/issues/8131 */}
            <TextField id = "filled-basic" type = "date" InputLabelProps={{ shrink: true }} label="Buy Time" onChange={(e: React.ChangeEvent<HTMLInputElement>) => buyTime.current = new Date(e.target.value)}/>
            <TextField id = "filled-basic" label = "BuyPrice" onChange={(e: React.ChangeEvent<HTMLInputElement>) => buyPrice.current = e.target.value} />
            <TextField id = "filled-basic" type = "date" InputLabelProps={{ shrink: true }} label = "SellTime" onChange={(e: React.ChangeEvent<HTMLInputElement>) => sellTime.current = new Date(e.target.value)} />
            <TextField id = "filled-basic" label = "SellPrice" onChange={(e: React.ChangeEvent<HTMLInputElement>) => sellPrice.current = e.target.value} />
            <Typography variant="h4">External References</Typography>
            <ListInput 
                rows = {externalIds} 
                toString= {IdToString}
                onItemsChange = {setExternalIds}
                InputUI={
                    <Stack direction = "row" spacing = {2}>
                        <TextField variant = "standard" label="Channel" onChange={(event) => {
                            external.current.channel = event.target.value;
                        }}/>
                        <TextField variant = "standard" label="Account" onChange = {(event) => {
                            external.current.account = event.target.value;
                        }}/>
                        <Button onClick = {(event) => {setExternalIds([...externalIds, structuredClone(external.current)])}}>Add</Button>
                    </Stack>
                }
            />
            <Box
                alignSelf="flex-end" sx = {{
                    height: 350, 
                    width: 400,
                }} textAlign = 'end'
            >
                <Button variant = "outlined" color = 'error' onClick = {() => router.push('../properties')}> Cancel </Button>
                <Button variant = "outlined" color = 'success' onClick = {handleExport} > Submit </Button>
            </Box>
            
        </Stack>
    </Stack>
    );
}