'use client';

import * as React from 'react';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { DefaultProp, RevertDefault } from '@/components/dashboard/properties/properties-table';

import { doc, setDoc } from "firebase/firestore";
import { ref } from 'firebase/storage';
import { dbHandle, storageHandle } from '@/components/firebase'
import { uploadBytes } from 'firebase/storage';
import { ListInput } from '@/components/dashboard/list-input';
import { Timestamp } from 'firebase/firestore';
import dayjs from 'dayjs';

export default function Page(): React.JSX.Element {
    const [fileUrl, setFileUrl] = React.useState<string>('');
    const [reload, setReload] = React.useState<boolean>(false);
    const external = React.useRef<{ channel: string; account: string }>({channel: '', account: ''});
    var propertyRef = React.useRef(DefaultProp);
    
    useEffect(() => {
        if(propertyRef.current.id == '') propertyRef.current.id = Math.random().toString(36).substring(7);
        if(propertyRef.current.pictureHandle != '') setFileUrl(propertyRef.current.pictureHandle);
    }, []);

    function IdToString(item: { channel: string; account: string }){
        return item.channel + ': ' + item.account;
    }

    const router = useRouter();
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            setFileUrl(URL.createObjectURL(e.target.files[0]));
        }
    }; 

    async function handleExport(){
        if(fileUrl == '') return;
        propertyRef.current.picture = propertyRef.current.id + '.png';
        var docRef = doc(dbHandle, "Properties", propertyRef.current.id);
        var storageRef = ref(storageHandle, 'Properties/' + propertyRef.current.picture);

        let response = await fetch(fileUrl);
        let data = await response.blob();
        let file = new File([data], propertyRef.current.picture);

        await setDoc(docRef, propertyRef.current);
        await uploadBytes(storageRef, file);
        router.push('../properties');
    }

    function SetExternalIds(externalIds: any[]){
        propertyRef.current.externalIds = externalIds;
        setReload(!reload);
    }

    function SetExternalInput(externalId: any){
        external.current = externalId;
        setReload(!reload);
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
                    backgroundImage: fileUrl == '' ? 'none' : `url(${fileUrl})`,
                    contentVisibility: fileUrl == '' ? 'visible' : 'hidden',
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
                        <TextField 
                            id="filled-basic" 
                            label="Street" 
                            defaultValue = {propertyRef.current.address.street}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => propertyRef.current.address.street = e.target.value} 
                        />
                        <TextField 
                            id="filled-basic" 
                            label="State" 
                            defaultValue = {propertyRef.current.address.state}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => propertyRef.current.address.state = e.target.value} 
                        />
                        <TextField 
                            id="filled-basic" 
                            label="City" 
                            defaultValue = {propertyRef.current.address.city}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => propertyRef.current.address.city = e.target.value} 
                        />
                        <TextField 
                            id="filled-basic" 
                            label="Country" 
                            defaultValue = {propertyRef.current.address.country}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => propertyRef.current.address.country = e.target.value} 
                        />
                </Stack> 
            </Stack>
            <Typography variant="h4">Transactions</Typography> 
            {/* Fix for UI here -> https://github.com/mui/material-ui/issues/8131 */}
            <TextField 
                id = "filled-basic" 
                type = "date" 
                InputLabelProps={{ shrink: true }} 
                label="Buy Time" 
                defaultValue = {propertyRef.current.BuyTime && dayjs(propertyRef.current.BuyTime.toDate()).format('YYYY-MM-DD')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => propertyRef.current.BuyTime = Timestamp.fromDate(new Date(e.target.value))}
            />
            <TextField 
                id = "filled-basic" 
                label = "BuyPrice" 
                defaultValue = {propertyRef.current.BuyPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => propertyRef.current.BuyPrice = e.target.value} 
            />
            <TextField 
                id = "filled-basic" 
                type = "date" 
                InputLabelProps={{ shrink: true }} 
                label = "SellTime" 
                defaultValue = {propertyRef.current.SellTime && dayjs(propertyRef.current.SellTime.toDate()).format('YYYY-MM-DD')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => propertyRef.current.SellTime = Timestamp.fromDate(new Date(e.target.value))} 
            />
            <TextField 
                id = "filled-basic" 
                label = "SellPrice" 
                defaultValue = {propertyRef.current.SellPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => propertyRef.current.SellPrice = e.target.value} 
            />
            <Typography variant="h4">External References</Typography>
            <ListInput 
                rows = {propertyRef.current.externalIds} 
                toString= {IdToString}
                onItemsChange = {SetExternalIds}
                onInputChange={SetExternalInput}
                InputUI={
                    <Stack direction = "row" spacing = {2}>
                        <TextField variant = "standard" label="Channel" defaultValue = {external.current.channel} onChange={(event) => {
                            external.current.channel = event.target.value;
                        }}/>
                        <TextField variant = "standard" label="Account" defaultValue = {external.current.account} onChange = {(event) => {
                            external.current.account = event.target.value;
                        }}/>
                        <Button onClick = {() => {SetExternalIds([...propertyRef.current.externalIds, structuredClone(external.current)])}}>Add</Button>
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