'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import Input from '@mui/material/Input';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
        <Typography variant = "h1"> Information </Typography>
        <Stack spacing={2}>
            <Stack direction = "row" spacing = {2}>
                <Box alignSelf="flex-start" sx = {{
                    height: 350, 
                    width: 400,
                    border: '1px dashed black',
                    bgcolor: 'gray',
                    color: 'primary.contrastText',
                }} textAlign = 'center'>

                    <Image src = '/assets/upload.png' alt = "image" width = {200} height = {200}/>
                    <Typography variant = "h6"> Drag & Drop To Upload File </Typography>
                    <Typography variant = "h6"> OR </Typography>
                    <Button variant = "contained" sx = {{bgcolor: 'black' }}> Browse </Button>
                    <input type = "file" hidden/>
                </Box>
                <Stack spacing={2} sx={{ flexGrow: 1 }} >
                    <Typography variant = "h4"> Property </Typography>
                    <TextField id = "filled-basic" label = "Address"></TextField>
                    <TextField id = "filled-basic" label = "Status"></TextField>
                    <Typography variant = "h4"> Tennant </Typography> {/*This will eventually be a dropdown menu*/}
                    <TextField id = "filled-basic" label = "Name"></TextField>
                </Stack> 
            </Stack>
        </Stack>
    </Stack>
  );
}