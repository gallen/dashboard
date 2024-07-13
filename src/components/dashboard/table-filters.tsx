import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { doc, setDoc, getDocs, collection, deleteDoc, DocumentData, DocumentReference, Firestore } from 'firebase/firestore';
import { dbHandle } from '@/components/firebase';

function noop(): void {
  // do nothing
}

interface TableFilterProps {
  onSearch?: (filter: string) => void;
  placeHolder?: string;
}

export function TableFilters(
  { onSearch = noop,
    placeHolder = 'Search'
  }: TableFilterProps
): React.ReactElement {
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder={placeHolder}
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
        onChange={(e) => onSearch(e.target.value)}
      />
    </Card>
  );
}

export async function ImportTable(path: string){
  const querySnapshot = await getDocs(collection(dbHandle, path));
  let table = new Array<any>();
  querySnapshot.docs.map((doc) => {
    let element = doc.data();
    table.push(element);
  }); 
  return table;
}

export async function ExportTable(table: any[], path: string, getExtension: (element: any) => string){
  table.forEach(async (element) => {
      var docRef = doc(dbHandle, path, getExtension(element));
      await setDoc(docRef, element);
  });
}

export async function DeleteElements(elements: any[], IsDeleted: (element: any) => boolean, Delete: (element: any) => Promise<void>){
  let newElements = new Array<any>(); 
  let promises = elements.map(async (element) => {
    if(!IsDeleted(element)){
      newElements.push(element);
      return;
    }
    await Delete(element);
  });
  await Promise.all(promises);
  return newElements;
}

function IsMatch(pObj: object, filter: string){
  let isMatch = false;
  Object.entries(pObj).forEach(([key, value]: [string, any]) => {
    if(typeof value == 'string' && value.toLowerCase().includes(filter.toLowerCase()))
      isMatch ||= true;
    else if (typeof value == 'object')
      isMatch ||= IsMatch(value, filter);
  });
  return isMatch;
}

export function FilterTable(elements: any[], filter: string){
  let newElements = new Array<any>();
  let oldElements = new Array<any>();
  elements.forEach((element) => {
    if(IsMatch(element, filter)) newElements.push(element);
    else oldElements.push(element);
  });
  newElements.push(...oldElements);
  return newElements;
}