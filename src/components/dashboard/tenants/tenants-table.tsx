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
import InputLabel from '@mui/material/InputLabel';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface Tenant {
  id: string;
  picture: string;
  pictureHandle: string;
  name: string;
  ssn: string;
  gender: string;
  age: number;
  paymentChannels: {channel: string, account: string}[];
}

interface TenantTableProps {
  count?: number;
  page?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  rows?: Tenant[];
  rowsPerPage?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  onDelete?: (tenants: Set<string>) => void;
  onEdit?: (tenants: Set<string>) => void;
  onRental?: (tenants: Set<string>, anchor: HTMLElement) => void;
}


export function TenantsTable({
  count = 0,
  rows = [],
  onDelete = noop,
  onEdit = noop,
  onRental = noop
}: TenantTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((tenant) => tenant.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const selectedAny = (selected?.size ?? 0) > 0;
  const selectedOne = (selected?.size ?? 0) === 1;
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPage] = React.useState(5);
  const paginatedTenants = applyPagination(rows, page, rowsPerPage);

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
                  <Button variant="contained" onClick={(event) => onRental(selected, event.currentTarget)}> 
                    Rent 
                  </Button>
                  <Button variant="contained" onClick = {() => onEdit(selected)}> {/* To Be Implemented */}
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
              <TableCell>Tenant</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>SSN</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Payment</TableCell>
              </>
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTenants.map((row) => {
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
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.pictureHandle} />
                    </Stack>
                  </TableCell>
                  <TableCell>{ row.name }</TableCell>
                  <TableCell>{ row.ssn }</TableCell>
                  <TableCell>{ row.gender }</TableCell>
                  <TableCell>{ row.age }</TableCell>
                  <TableCell>
                    <Select 
                      variant='standard'
                      defaultValue='None'
                      sx = {{ m: 1, minWidth: 120}}
                    >
                    <MenuItem value='None'>
                      <em>None</em>
                    </MenuItem>
                    { 
                      row.paymentChannels.map((channel) => {
                        return <MenuItem key={`${row.id}-${channel.channel}`} value = {channel.channel}> {channel.channel} : {channel.account} </MenuItem>
                      }) 
                    }
                    </Select>
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

function applyPagination(rows: Tenant[], page: number, rowsPerPage: number): Tenant[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

var _DefaultTenant = {
  id : '',
  picture : '',
  pictureHandle : '',
  name : '',
  ssn : '',
  gender: '',
  age: 0,
  paymentChannels: [],
} as unknown as Tenant;

export var DefaultTenant = {..._DefaultTenant};

export function SetDefault(tenant: Tenant){ DefaultTenant = {...tenant}; }
export function RevertDefault(){ DefaultTenant = {..._DefaultTenant}; }