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
import type { Tenant } from '@/components/dashboard/tenants/tenants-table';

import { doc, setDoc } from "firebase/firestore";
import { ref } from 'firebase/storage';
import { dbHandle, storageHandle } from '@/components/firebase'
import { uploadBytes } from 'firebase/storage';
import { ListInput } from '@/components/dashboard/list-input';
import { DefaultTenant, RevertDefault } from '@/components/dashboard/tenants/tenants-table';

export default function Page(): React.JSX.Element {
    const [fileUrl, setFileUrl] = React.useState<string>('');
    const [reload, setReload] = React.useState<boolean>(false);
    const tenantRef = React.useRef(DefaultTenant);
    const methodRef = React.useRef<{ channel: string; account: string }>({channel: '', account: ''});
    const router = useRouter();

    useEffect(() => {
        if(tenantRef.current.id == '') tenantRef.current.id = Math.random().toString(36).substring(7);
        if(tenantRef.current.pictureHandle != '') setFileUrl(tenantRef.current.pictureHandle);
    }, []);

    function IdToString(item: { channel: string; account: string }){
        return item.channel + ': ' + item.account;
    }

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            setFileUrl(URL.createObjectURL(e.target.files[0]));
        }
    }; 

    async function handleExport(){
        if(fileUrl == '') return;
        tenantRef.current.picture = tenantRef.current.id + '.png';
        var docRef = doc(dbHandle, "Tenants", tenantRef.current.id);
        var storageRef = ref(storageHandle, 'Tenants/' + tenantRef.current.picture);

        let response = await fetch(fileUrl);
        let data = await response.blob();
        let file = new File([data], tenantRef.current.picture);

        await setDoc(docRef, tenantRef.current);
        uploadBytes(storageRef, file as File);
        router.push('../tenants');
    }

    function SetPaymentMethods(paymentChannels: any[]){
        tenantRef.current.paymentChannels = paymentChannels;
        setReload(!reload);
    }

    function SetPaymentInput(paymentChannel: any){
        methodRef.current = paymentChannel;
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
                        <Typography variant="h4">Personal Info</Typography>
                        <TextField id="filled-basic" label="Name" defaultValue = {tenantRef.current.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => tenantRef.current.name = e.target.value} />
                        <TextField id="filled-basic" label="SSN" defaultValue = {tenantRef.current.ssn} onChange={(e: React.ChangeEvent<HTMLInputElement>) => tenantRef.current.ssn = e.target.value} />
                        <TextField id="filled-basic" label="Gender" defaultValue = {tenantRef.current.gender} onChange={(e: React.ChangeEvent<HTMLInputElement>) => tenantRef.current.gender = e.target.value} />
                        <TextField id="filled-basic" label="Age" defaultValue = {tenantRef.current.age} type = "number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => tenantRef.current.age = parseInt(e.target.value)} />
                </Stack> 
            </Stack>
            <Typography variant="h4">Payment</Typography>
            <ListInput 
                rows = {tenantRef.current.paymentChannels} 
                toString= {IdToString}
                onItemsChange = {SetPaymentMethods}
                onInputChange={SetPaymentInput}
                InputUI={
                    <Stack direction = "row" spacing = {2}>
                        <TextField variant = "standard" label="Channel" defaultValue = {methodRef.current.channel} onChange={(event) => {
                            methodRef.current.channel = event.target.value;
                        }}/>
                        <TextField variant = "standard" label="Account" defaultValue = {methodRef.current.account} onChange = {(event) => {
                            methodRef.current.account = event.target.value;
                        }}/>
                        <Button onClick = {(event) => {SetPaymentMethods([...tenantRef.current.paymentChannels, structuredClone(methodRef.current)])}}>Add</Button>
                    </Stack> 
                }
            />
            <Box
                alignSelf="flex-end" sx = {{
                    height: 350, 
                    width: 400,
                }} textAlign = 'end'
            >
                <Button variant = "outlined" color = 'error' onClick = {() => router.push('../tenants')}> Cancel </Button>
                <Button variant = "outlined" color = 'success' onClick = {handleExport} > Submit </Button>
            </Box>
            
        </Stack>
    </Stack>
    );
}