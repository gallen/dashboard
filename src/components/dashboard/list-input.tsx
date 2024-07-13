import React from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelection } from '@/hooks/use-selection';
import Typography from "@mui/material/Typography";

interface ListProps {
    rows?: any[];
    InputUI?: React.ReactElement;
    toString?: (item: any) => string;
    onItemsChange?: (items: any[]) => void;
}

export function ListInput(
{
    rows = [],
    InputUI = <></>,
    toString = (item: any) => item.toString(),
    onItemsChange = (items: any[]) => {},
}: ListProps) : React.ReactElement{ 
    const rowIds = React.useMemo(() => {
        return rows.map((row) => toString(row));
    }, [rows]);

    const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
    const selectedAny = (selected?.size ?? 0) > 0;
    const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
    const selectedAll = rows.length > 0 && selected?.size === rows.length;

    function Delete(){
        let newRows = rows.filter((row) => !selected?.has(toString(row)));
        onItemsChange(newRows);
    }

    return(
    <Paper sx={{ flexDirection: 'row', flexGrow: 1, overflow: "auto" }}> 
        <Stack direction={"row"} spacing = {2}>
            <Checkbox
                checked={selectedAll}
                indeterminate={selectedSome}
                onChange={(event) => {
                if (event.target.checked) { selectAll();} 
                else { deselectAll(); }
                }}
            />
            {selectedAny ? 
                <>
                <Typography variant="body2" color="textSecondary" >
                    {selected?.size} selected
                </Typography> 
                <Button onClick={Delete}>
                    Delete
                </Button>
                <Button> {/* To Be Implemented */}
                    Edit 
                </Button>
                </>
                :
                InputUI
            }
        </Stack>
        <List dense component="div" role="list"> 
            {rows.map((row: any) => { 
                const labelId = `transfer-list-item-${row}-label`; 
                const rowId = toString(row);
                const isSelected = selected?.has(rowId);

                return ( 
                    <ListItem 
                        key={rowId} 
                        role="listitem"
                    > 
                        <ListItemIcon> 
                            <Checkbox 
                                tabIndex={-1} 
                                disableRipple 
                                color="success"
                                inputProps={{ 
                                    "aria-labelledby": labelId, 
                                }} 
                                checked={isSelected}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        selectOne(rowId);
                                    } else {
                                        deselectOne(rowId);
                                    }
                                }}
                            /> 
                        </ListItemIcon> 
                        <ListItemText id={labelId} primary= 
                            {toString(row)} /> 
                    </ListItem> 
                ); 
            })} 
            <ListItem /> 
        </List> 
    </Paper> 
    )
}