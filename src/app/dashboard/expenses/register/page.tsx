'use client';

import * as React from 'react';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {Table, TableCell, TableRow, TableHead, TextareaAutosize} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { DefaultExpense } from '@/components/dashboard/expenses/expenses-table';
import { Property } from '@/components/dashboard/properties/properties-table';
import { ImportTable } from '@/components/dashboard/table-filters';
import Webcam from 'react-webcam'

import { doc, setDoc } from "firebase/firestore";
import { ref } from 'firebase/storage';
import { dbHandle, storageHandle } from '@/components/firebase'
import { uploadBytes } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';
import dayjs from 'dayjs';
import { styled } from '@mui/system';

const videoConstraints = {
    width: 640,
    height: 360,
    facingMode: "environment",
};

enum CameraState {
    Idle,
    Recording,
    Picture,
}

export default function Page(): React.JSX.Element {
    const [propertiesBase, setPropertiesBase] = React.useState<Property[]>([]);

    const webcamRef = React.useRef<Webcam>(null);
    const [fileUrl, setFileUrl] = React.useState<string>('');
    const [camera, setCamera] = React.useState<CameraState>(CameraState.Idle);
    var expenseRef = React.useRef(DefaultExpense);
    
    useEffect(() => {
        if(expenseRef.current.id == '') expenseRef.current.id = Math.random().toString(36).substring(7);
        if(expenseRef.current.InvoiceHandle != '') {setFileUrl(expenseRef.current.InvoiceHandle); setCamera(CameraState.Picture);}
        ImportTable('Properties').then(async (properties : Property[]) => { setPropertiesBase(properties as Property[])});
    }, []);


    const router = useRouter();

    const TakeScreenshot = async () => {
        if(webcamRef.current == null) return;
        const imageSrc = webcamRef.current.getScreenshot();
        setFileUrl(imageSrc as string);
    }; 

    function SetProperty(propertyId: string){expenseRef.current.propertyId = propertyId;}

    function RenderText() {
        switch(camera) {
            case CameraState.Recording:
                return "Click To Capture";
            case CameraState.Picture:
                return "Click To Retake Picture";
            default:
                return "Click To Take Picture";
        }
    }

    async function handleExport(){
        if(fileUrl == '') return;
        expenseRef.current.Invoice = expenseRef.current.id + '.png';
        var docRef = doc(dbHandle, "Expenses", expenseRef.current.id);
        var storageRef = ref(storageHandle, 'Expenses/' + expenseRef.current.Invoice);

        let response = await fetch(fileUrl);
        let data = await response.blob();
        let file = new File([data], expenseRef.current.Invoice);

        await setDoc(docRef, expenseRef.current);
        await uploadBytes(storageRef, file);
        router.push('../expenses');
    }

    const Textarea = styled(TextareaAutosize)(
        ({ theme }) => `
        box-sizing: border-box;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5;
        padding: 8px 12px;
        border-radius: 8px;
    `,);

    return (
    <Stack spacing={3}>
        <Typography variant = "h1"> Information </Typography>
        <Stack spacing={2}>
            <Stack direction = "row" spacing = {2}>
                <Button sx = {{
                    height: camera != CameraState.Idle ? videoConstraints.height : 200, 
                    width: camera != CameraState.Idle ? videoConstraints.width : 200,
                    borderRadius: 0,
                    border: '1px dashed black',
                    bgcolor: 'gray',
                    color: 'primary.contrastText',
                    backgroundImage: camera == CameraState.Picture ?  `url(${fileUrl})` : 'none',
                }}  onClick = {() => {
                    if(camera != CameraState.Recording ) setCamera(CameraState.Recording);
                    else {TakeScreenshot(); setCamera(CameraState.Picture);}
                }}>
                    {camera == CameraState.Recording &&
                    <Webcam
                        ref = {webcamRef}
                        audio = {false}
                        videoConstraints = {videoConstraints}
                        screenshotFormat = "image/png"
                    />
                    }
                    <Box textAlign="center"
                        sx={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Image src = '/assets/camera_icon.png' alt = "image" width = {100} height = {100}/>
                    <Typography variant = "h6" color = "black"> 
                        {RenderText()}
                    </Typography>
                    </Box>
                </Button>

                <Stack spacing={2} sx={{ flexGrow: 1}} >
                    <Select
                        variant="standard"
                        placeholder="Property"
                        defaultValue={expenseRef.current.propertyId}
                        sx = {{maxWidth: 500}}
                        onChange = {(e) => SetProperty(e.target.value)}
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
                    <TextField 
                        id = "filled-basic" 
                        type = "date" 
                        InputLabelProps={{ shrink: true }} 
                        label="Date" 
                        defaultValue = {expenseRef.current.Date && dayjs(expenseRef.current.Date.toDate()).format('YYYY-MM-DD')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => expenseRef.current.Date = Timestamp.fromDate(new Date(e.target.value))}
                    />
                    <TextField 
                        id = "filled-basic" 
                        label = "Amount" 
                        defaultValue = {expenseRef.current.Amount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => expenseRef.current.Amount = e.target.value} 
                    />
                </Stack>
            </Stack>
            <Typography variant="h4">Description</Typography> 
            {/* Fix for UI here -> https://github.com/mui/material-ui/issues/8131 */}
            <Textarea 
                id = "filled-basic" 
                placeholder = "Describe the Transaction" 
                defaultValue = {expenseRef.current.Description}
                
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => expenseRef.current.Description = e.target.value} 
            />
            <Box
                alignSelf="flex-end" sx = {{
                    height: 350, 
                    width: 400,
                }} textAlign = 'end'
            >
                <Button variant = "outlined" color = 'error' onClick = {() => router.push('../expenses')}> Cancel </Button>
                <Button variant = "outlined" color = 'success' onClick = {handleExport} > Submit </Button>
            </Box>
            
        </Stack>
    </Stack>
    );
}