'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import { ClipboardText } from '@phosphor-icons/react';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';
import { Timestamp } from 'firebase/firestore';

function noop(): void {
  // do nothing
}

export interface Expense {
  id: string;
  propertyId: string;
  Date: Timestamp | null;
  Amount: string;
  Description: string;
  Invoice: string;
  InvoiceHandle: string;
}

interface ExpensesTableProps {
  count?: number;
  page?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  rows?: Expense[];
  rowsPerPage?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  onDelete?: (properties: Set<string>) => void;
  onEdit?: (expense: Set<string>) => void;
}

export function ExpensesTable({
  count = 0,
  rows = [],
  onDelete = noop,
  onEdit = noop,
}: ExpensesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((expense) => expense.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const selectedAny = (selected?.size ?? 0) > 0;
  const selectedOne = (selected?.size ?? 0) === 1;
  const selectedSome = selectedAny && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPage] = React.useState(5);
  const paginatedProperties = applyPagination(rows, page, rowsPerPage);
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              { selectedAny ? 
              <>
              <TableCell>
              <Typography variant="body2" color="textSecondary">
                {selected?.size} selected
              </Typography>
              </TableCell>
              <TableCell>
              <Stack direction = "row" spacing={3}>
                {selectedOne && 
                  <>
                  <Button variant="contained" onClick={() => onEdit(selected)}> 
                    Edit 
                  </Button>
                  </>
                }
                <Button variant="contained" onClick={() => onDelete(selected)}>
                  Delete
                </Button>
              </Stack>
              </TableCell>
              </>
              : <>
              <TableCell>Property</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Invoice</TableCell>
              </>
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProperties.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell> {row.propertyId} </TableCell>
                  <TableCell>{row.Date && dayjs(row.Date.toDate()).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{row.Amount}</TableCell>
                  <TableCell>{row.Description}</TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <ClipboardText size={24}/>
                      }
                    >
                      <Avatar src={row.InvoiceHandle} sx={{ width: 100, height: 100}} variant="square"/>
                    </Badge>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={(event, number) => setPage(number)}
        onRowsPerPageChange={(element) => setRowsPage(parseInt(element.target.value))}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

function applyPagination(rows: Expense[], page: number, rowsPerPage: number): Expense[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


var _DefaultExpense = {
  id: '',
  propertyId: '',
  Date: null,
  Amount: '',
  Description: '',
  Invoice: '',
  InvoiceHandle: '',
} as unknown as Expense;

export var DefaultExpense = {..._DefaultExpense};
export function SetDefault(expense: Expense){ DefaultExpense = {...expense}; }
export function RevertDefault(){ DefaultExpense = {..._DefaultExpense}; }