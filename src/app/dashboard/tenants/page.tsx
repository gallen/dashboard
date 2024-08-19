'use client';

import * as React from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { Popper } from '@mui/base/Popper';
import Box from '@mui/material/Box';

import { TableFilters, ImportTable, ExportTable, DeleteElements, FilterTable } from '@/components/dashboard/table-filters';
import { TenantsTable } from '@/components/dashboard/tenants/tenants-table';
import type { Tenant } from '@/components/dashboard/tenants/tenants-table';

import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { dbHandle } from '@/components/firebase'
import { useRouter } from 'next/navigation'
import { SetDefault, RevertDefault } from '@/components/dashboard/tenants/tenants-table';

import { getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { storageHandle } from '@/components/firebase';
import { TenantRentalInput } from '@/components/dashboard/tenants/tenant-rental';

//export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const selectedId = React.useRef<string>('');
  const [tenants, setTenants] = React.useState<Tenant[]>([]);
  const router = useRouter();

  useEffect(() => {
    ImportTable('Tenants').then(async (tenants : Tenant[]) => {
      let promises = tenants.map(async (tenant) => {
        tenant.pictureHandle = await getDownloadURL(ref(storageHandle, 'Tenants/' + tenant.picture));
      })
      await Promise.all(promises);
      setTenants(tenants as Tenant[]);
    });
  }, []);

  async function DeleteTenants(tenantIds: Set<string>){
    let newTenants = await DeleteElements(tenants, (tenant: Tenant) => tenantIds.has(tenant.id), 
    async (tenant: Tenant) => {
      await deleteDoc(doc(dbHandle, "Tenants", tenant.id));
      const storageRef = ref(storageHandle, 'Tenants/' + tenant.picture);
      await deleteObject(storageRef);
    });
    setTenants(newTenants);
  }

  async function AddRental(property: Set<string>, anchor: HTMLElement){
    selectedId.current = property.values().next().value;
    setAnchorEl(anchorEl ? null : anchor);
  }

  async function EditTenants(tenantIds: Set<string>){
    let tenant = tenants.find((tenant) => tenant.id === tenantIds.values().next().value);
    SetDefault(tenant as Tenant);
    router.push('./tenants/register');
  }

  function FilterTenants(filter: string){
    let newTenants = FilterTable(tenants, filter);
    setTenants(newTenants);
  }

  const DownloadJSON = (data : any, fileName : string) => {
      const jsonData = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const jsonURL = URL.createObjectURL(jsonData);
      const link = document.createElement('a');
      link.href = jsonURL;
      link.download = `${fileName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  
  const UploadJSON = (e : React.ChangeEvent<HTMLInputElement>) => {
    async function ExportTenants(tenants: Tenant[]){
      for(let tenant of tenants){
        var docRef = doc(dbHandle, "Tenants", tenant.id);
        await setDoc(docRef, tenant);
      }
    }

    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if(!e.target) return;
        const data = e.target.result;
        const newTenants = (JSON.parse(data as string) as Tenant[]).filter((tenant) => !tenants.some((t) => t.id === tenant.id));
        setTenants([...tenants, ...newTenants]);
        ExportTenants(newTenants);
      }
      reader.readAsText(e.target.files[0]);
    }
  }


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Tenants</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" component="label" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              <input type = "file" id = "fileInput" accept = ".json,application/json" onChange={UploadJSON} hidden/>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
            onClick = {() => DownloadJSON(tenants, "Tenants")}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained"
          onClick = {() => {RevertDefault(); router.push('./tenants/register');}}>
            Add
          </Button>
        </div>
      </Stack>
      
      <TableFilters 
        onSearch = {FilterTenants}
        placeHolder='Search Tenants...'
      />

      {tenants.length != 0 && 
        <TenantsTable
          count={tenants.length}
          rows={tenants}
          onDelete={DeleteTenants}
          onEdit={EditTenants}
          onRental={AddRental}
        />
      }
      <Popper open={anchorEl != null} anchorEl={anchorEl} placement = {'right-start'}>
        <Box sx = {{
          border: 1,
          borderColor: 'divider',
          borderStyle: 'solid',
          padding: 1,
          backgroundColor: 'background.paper',
        }}>
          <TenantRentalInput
            tenantId = {selectedId.current}
            close = {() => {setAnchorEl(null);}}
          />
        </Box>
      </Popper>
    </Stack>
  );
}
