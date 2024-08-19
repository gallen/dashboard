'use client';

import React, { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { TableFilters, ImportTable, ExportTable, DeleteElements, FilterTable } from '@/components/dashboard/table-filters';
import { ExpensesTable, Expense } from '@/components/dashboard/expenses/expenses-table';
import { SetDefault, RevertDefault } from '@/components/dashboard/expenses/expenses-table';

import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { dbHandle } from '@/components/firebase'
import { useRouter } from 'next/navigation'
import { getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { storageHandle } from '@/components/firebase';

export default function Page(): React.JSX.Element {
    const [expenses, setExpenses] = React.useState<Expense[]>([]);
    const router = useRouter();

    useEffect(() => {
      ImportTable('Expenses').then(async (expenses : Expense[]) => {
        let promises = expenses.map(async (expense) => { expense.InvoiceHandle = await getDownloadURL(ref(storageHandle, 'Expenses/' + expense.Invoice)); })
        await Promise.all(promises);
        setExpenses(expenses as Expense[]);
      });
    }, []);

    async function DeleteExpenses(expenseIds: Set<string>){
        let newExpenses = await DeleteElements(expenses, (expense: Expense) => expenseIds.has(expense.id), 
            async (expense: Expense) => {
            await deleteDoc(doc(dbHandle, "Expenses", expense.id));
            const storageRef = ref(storageHandle, 'Expenses/' + expense.Invoice);
            await deleteObject(storageRef);
        });
        setExpenses(newExpenses);
    }
    
    async function EditExpenses(expenseId: Set<string>){
        let expense = expenses.find((expense) => expense.id === expenseId.values().next().value);
        SetDefault(expense as Expense);
        router.push('./expenses/register');
    }

    function FilterExpenses(filter: string){
        let newExpenses = FilterTable(expenses, filter);
        setExpenses(newExpenses);
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
    async function ExportExpenses(expenses: Expense[]){
      for(let expense of expenses){
        var docRef = doc(dbHandle, "Expenses", expense.id);
        await setDoc(docRef, expense);
      }
    }

    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if(!e.target) return;
        const data = e.target.result;
        const newExpenses = (JSON.parse(data as string) as Expense[]).filter((expense) => !expenses.some((e) => e.id === expense.id));
        setExpenses([...expenses, ...newExpenses]);
        ExportExpenses(newExpenses);
      }
      reader.readAsText(e.target.files[0]);
    }
  }

    return (
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Expenses</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Button color="inherit" component="label" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
               <input type = "file" id = "fileInput" accept = ".json,application/json" onChange={UploadJSON} hidden/>
                Import
              </Button>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
              onClick={() => DownloadJSON(expenses, "Expenses")}>
                Export
              </Button>
            </Stack>
          </Stack>
          <div>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained"
            onClick = {() => {RevertDefault(); router.push('./expenses/register');}}>
              Add
            </Button>
          </div>
        </Stack>
        <TableFilters 
          onSearch = {FilterExpenses}
          placeHolder='Search Expenses...'
        />

        <ExpensesTable 
            count = {expenses.length}
            rows = {expenses}
            onDelete = {DeleteExpenses}
            onEdit = {EditExpenses}
        />
      </Stack>
    );
  }