import { Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react';
import Stock from '../Stock';
import TabPanel from '../components/TabPanel';
import StockTable from './StockTable';
import StockForm from './StockForm';

function Dashboard()
{
    const [value, setValue] = useState(0);
    const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) =>
    {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Dashboard" {...a11yProps(0)} />
                    <Tab label="Form" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <StockTable stocks={selectedStocks}></StockTable>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <StockForm notifyDashboard={(stock: Stock) =>
                {
                    if (!selectedStocks.some(s => s.companyStock === stock.companyStock))
                    {
                        setSelectedStocks(selectedStocks => [...selectedStocks, stock]);
                    }
                }}></StockForm>
            </TabPanel>
        </Box>
    )
}

function a11yProps(index: number)
{
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default Dashboard;