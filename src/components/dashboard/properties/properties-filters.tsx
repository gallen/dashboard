import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

function noop(): void {
  // do nothing
}

interface PropertiesFilterProps {
  onSearch?: (filter: string) => void;
}

export function PropertiesFilters(
  { onSearch = noop }: PropertiesFilterProps
): React.ReactElement {
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search Properties"
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
