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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';
import { Timestamp } from 'firebase/firestore';

function noop(): void {
  // do nothing
}

export interface Rental {
  id: string;
  propertyId: string;
  tenantId: string[];
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  price: string;
}

interface RentalTableProps {
  count?: number;
  page?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  rows?: Rental[];
  rowsPerPage?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  onDelete?: (rentals: Set<string>) => void;
  onEdit?: (rentals: Set<string>, event: React.MouseEvent<HTMLElement>) => void;
}

interface SelectValues {
  [key: string]: string;
}

export function RentalTable({
  count = 0,
  rows = [],
  onDelete = noop,
  onEdit = noop
}: RentalTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((rental) => rental.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const selectedAny = (selected?.size ?? 0) > 0;
  const selectedOne = (selected?.size ?? 0) === 1;
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPage] = React.useState(5);
  const paginatedRentals = applyPagination(rows, page, rowsPerPage);
  
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
              <Stack direction = "row" spacing={2}>
                {selectedOne && 
                  <Button variant="contained" onClick = {(event) => onEdit(selected, event)}> {/* To Be Implemented */}
                    Edit 
                  </Button>
                }
                <Button variant="contained" onClick={() => onDelete(selected)}>
                  Delete
                </Button>
              </Stack>
              </TableCell>
              </>
              : <>
              <TableCell>Property</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>StartDate</TableCell>
              <TableCell>EndDate</TableCell>
              <TableCell>Price</TableCell>
              </>
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRentals.map((row) => {
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
                  <TableCell>{row.propertyId}</TableCell>
                  <TableCell>
                    <Select 
                        variant='standard'
                        defaultValue=''
                        sx = {{ m: 1, minWidth: 100, maxWidth: 200}}
                      >
                      {row.tenantId.map((tenant) => {
                          return <MenuItem key={`${row.id}-${tenant}`} value = {tenant}> {tenant} </MenuItem>
                      })}
                    </Select>
                  </TableCell>
                  <TableCell>{ row.startDate && dayjs(row.startDate.toDate()).format('MMM D, YYYY') }</TableCell>
                  <TableCell>{ row.endDate && dayjs(row.endDate.toDate()).format('MMM D, YYYY') }</TableCell>
                  <TableCell>{ row.price }</TableCell>
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

function applyPagination(rows: Rental[], page: number, rowsPerPage: number): Rental[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
