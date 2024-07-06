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
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface Property {
  id: string;
  picture: string;
  address: { city: string; state: string; country: string; street: string };
  BuyTime: Date;
  BuyPrice: string;
  SellTime: Date;
  SellPrice: string;
  externalIds: { zillow: string; redin: string };
}

interface PropertiesTableProps {
  count?: number;
  page?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
  rows?: Property[];
  rowsPerPage?: { state: number; update: React.Dispatch<React.SetStateAction<number>>};
}


export function PropertiesTable({
  count = 0,
  rows = [],
}: PropertiesTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((property) => property.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
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
              <TableCell>Property</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>BuyTime</TableCell>
              <TableCell>BuyPrice</TableCell>
              <TableCell>SellTime</TableCell>
              <TableCell>SellPrice</TableCell>
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
                      <Avatar src={row.picture} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {row.address.city}, {row.address.state}, {row.address.country}
                  </TableCell>
                  <TableCell>{dayjs(row.BuyTime).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{row.BuyPrice}</TableCell>
                  <TableCell>{dayjs(row.SellTime).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{row.SellPrice}</TableCell>
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

