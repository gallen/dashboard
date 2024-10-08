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

export interface Property {
  id: string;
  picture: string;
  pictureHandle: string;
  address: { city: string; state: string; country: string; street: string };
  BuyTime: Timestamp | null;
  BuyPrice: string;
  SellTime: Timestamp | null;
  SellPrice: string;
  externalIds: { channel: string; account: string }[];
}

interface PropertiesTableProps {
  count?: number;
  page?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  rows?: Property[];
  rowsPerPage?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  onDelete?: (properties: Set<string>) => void;
  onEdit?: (property: Set<string>) => void;
  onRental?: (property: Set<string>, anchor: HTMLElement) => void;
}

export function PropertiesTable({
  count = 0,
  rows = [],
  onDelete = noop,
  onEdit = noop,
  onRental = noop
}: PropertiesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((property) => property.id);
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
                  <Button variant="contained" onClick={(event) => onRental(selected, event.currentTarget)}> 
                    Rent 
                  </Button>
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
              <TableCell>Address</TableCell>
              <TableCell>BuyTime</TableCell>
              <TableCell>BuyPrice</TableCell>
              <TableCell>SellTime</TableCell>
              <TableCell>SellPrice</TableCell>
              <TableCell>External</TableCell>
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
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.pictureHandle} variant='rounded'/>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {row.address.city}, {row.address.state}, {row.address.country}
                  </TableCell>
                  <TableCell>{row.BuyTime && dayjs(row.BuyTime.toDate()).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{row.BuyPrice}</TableCell>
                  <TableCell>{row.SellTime && dayjs(row.SellTime.toDate()).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{row.SellPrice}</TableCell>
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
                      row.externalIds.map((external) => {
                        return <MenuItem key={`${row.id}-${external.channel}`} value = {external.channel}> {external.channel} : {external.account} </MenuItem>
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

function applyPagination(rows: Property[], page: number, rowsPerPage: number): Property[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

var _DefaultProp = {
  id : '',
  picture: '',
  pictureHandle: '',
  address: {
      city: '',
      state: '',
      country: '',
      street: '',
  },
  BuyTime: null,
  BuyPrice: '',
  SellTime: null,
  SellPrice: '',
  externalIds: [],
} as unknown as Property;

export var DefaultProp = {..._DefaultProp} as Property;
export function SetDefault(property: Property){ DefaultProp = {...property} as Property; }
export function RevertDefault(){ DefaultProp = {..._DefaultProp}; }