import { Autocomplete, Box, TextField } from '@mui/material'
import mockdata from '../data/mockdata.json'
import { useState } from 'react';
import Stock from '../Stock';

export interface StockFormProps
{
    notifyDashboard: (stock: Stock) => void;
}

function StockForm(props: StockFormProps)
{
    const [stock, setStock] = useState<Stock>()
    var rows: any[] = mockdata
    rows.forEach(element => element.listedSince = new Date(element.listedSince))

    return (
        <Box>
            <Autocomplete
                disablePortal
                id="stockSearchField"
                options={mockdata}
                selectOnFocus
                onChange={(event, newValue) =>
                {
                    let value: Stock = Object.assign(new Stock(), newValue)
                    props.notifyDashboard(value)
                    setStock(value);
                }}
                handleHomeEndKeys
                getOptionLabel={(option) => `${option.companyStock} ${option.companyName} ${option.price}`}
                sx={{ width: '100%' }}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {option.companyStock} - {option.companyName} (${option.price})
                    </Box>
                )}
                renderInput={(params) => <TextField {...params} label="Search stocks (by: code, name and price)" />}
            />
            {stock?.companyStock && stock?.companyName && <h1>({stock?.companyStock}) {stock?.companyName}</h1>}
            {stock?.mktCap && <h3>Mkt. Cap: {stock?.mktCap}</h3>}
            {stock?.listedSince && stock?.paysDividends && <h3>Listed Since: {stock?.listedSince.toLocaleDateString('es-ES')} | Pays Dividends: {stock?.paysDividends ? 'Yes' : 'No'}</h3>}
            {stock?.price && <h3>Price (mocked): <b>{stock?.price}</b></h3>}


        </Box>
    )
}

export default StockForm;