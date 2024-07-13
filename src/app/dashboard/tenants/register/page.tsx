'use client';

import * as React from 'react';
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

export default function Page(): React.JSX.Element {
    const [file, setFile] = React.useState<File | null>(null);
    const nameRef = React.useRef('');
    const ssnRef = React.useRef('');
    const genderRef = React.useRef('');
    const ageRef = React.useRef(0);
    const paymentRef = React.useRef('');
    const methodRef = React.useRef<{ channel: string; account: string }>({channel: '', account: ''});
    const [methods, setMethods] = React.useState<{ channel: string; account: string }[]>([]);
    function IdToString(item: { channel: string; account: string }){
        return item.channel + ': ' + item.account;
    }

    const router = useRouter();
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }; 

    async function handleExport(){
        if(file == null) return;
        let tenantId = Math.random().toString(36).substring(7);
        var newTenant = {
            id: tenantId,
            picture: tenantId + '.png',
            name: nameRef.current,
            ssn: ssnRef.current,
            gender: genderRef.current,
            age: ageRef.current,
            paymentChannels: methods,
        } as Tenant;

        var docRef = doc(dbHandle, "Tenants", newTenant.id);
        await setDoc(docRef, newTenant);

        var storageRef = ref(storageHandle, 'Tenants/' + newTenant.picture);
        uploadBytes(storageRef, file as File);
        router.push('../tenants');
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
                        <Typography variant="h4">Personal Info</Typography>
                        <TextField id="filled-basic" label="Name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => nameRef.current = e.target.value} />
                        <TextField id="filled-basic" label="SSN" onChange={(e: React.ChangeEvent<HTMLInputElement>) => ssnRef.current = e.target.value} />
                        <TextField id="filled-basic" label="Gender" onChange={(e: React.ChangeEvent<HTMLInputElement>) => genderRef.current = e.target.value} />
                        <TextField id="filled-basic" label="Age" type = "number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => ageRef.current = parseInt(e.target.value)} />
                </Stack> 
            </Stack>
            <Typography variant="h4">Payment</Typography>
            <ListInput 
                rows = {methods} 
                toString= {IdToString}
                onItemsChange = {setMethods}
                InputUI={
                    <Stack direction = "row" spacing = {2}>
                        <TextField variant = "standard" label="Channel" onChange={(event) => {
                            methodRef.current.channel = event.target.value;
                        }}/>
                        <TextField variant = "standard" label="Account" onChange = {(event) => {
                            methodRef.current.account = event.target.value;
                        }}/>
                        <Button onClick = {(event) => {setMethods([...methods, structuredClone(methodRef.current)])}}>Add</Button>
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