import { Alert, Box, LinearProgress } from '@mui/material';
import { DataGrid, GridColDef, GridSortCellParams } from '@mui/x-data-grid';
import mockdata from '../data/mockdata.json'
import Stock from '../Stock';
import
{
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

export interface StockTableProps
{
  stocks: Stock[];
}

function sort(v1: number, v2: number, param1: GridSortCellParams<any>, param2: GridSortCellParams<any>)
{
  let name1: string = param1.api.getCellValue(param1.id, 'companyName');
  let name2: string = param2.api.getCellValue(param2.id, 'companyName');

  if (v1 === v2)
  {
    if (!name1 || name1 < name2)
    {
      return -1
    }
    else if (!name2 || name1 > name2)
    {
      return 1
    }
  }

  if (v1 > v2)
  {
    return 1;
  }

  if (v1 < v2)
  {
    return -1;
  }

  return 0
}

const columns: GridColDef[] = [
  { field: 'companyName', headerName: 'Company', minWidth: 200 },
  { field: 'companyStock', headerName: 'Stock', minWidth: 150 },
  { field: 'listedSince', headerName: 'Listed Since', type: 'date', minWidth: 150 },
  { field: 'mktCap', headerName: 'Mkt. Cap.', type: 'number', minWidth: 150 },
  { field: 'paysDividends', headerName: 'Pays Dividends', type: 'boolean', minWidth: 200 },
  {
    field: 'price', headerName: 'Price', type: 'number', minWidth: 150, sortComparator: sort,
  }
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

type Dataset = {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
}

type LineData = {
  labels: string[]
  datasets: Dataset[]
}


const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export default function StockTable(props: StockTableProps)
{
  var rows: any[] = mockdata
  rows.forEach(element => element.listedSince = new Date(element.listedSince))
  const [data, setData] = useState<LineData>({ labels: [], datasets: [] })
  const [loading, setLoading] = useState<boolean>(false)


  useEffect(() =>
  {
    async function fetchData(companyStock: string): Promise<any>
    {
      while(true)
      {
        let response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${companyStock}&apikey=GPGUUDRY2X6XD0FD`).then(response => response.json())
        if(response === undefined || (response['Note'] !== undefined && response['Note'].includes('5 calls per minute')))
        {
          setLoading(true)
          await delay(60000)
          continue
        }
        setLoading(false)
        return response;
      }
    }

    async function get()
    {
      let labels: string[] = []
      let datasets: Dataset[] = []
      for (let i = 0; i < props.stocks.length; i++)
      {
        const element = props.stocks[i];
        
        let response = await fetchData(element.companyStock)
        if (response !== undefined)
        {
          labels = (labels.length <= 0) ? Object.keys(response['Weekly Time Series']).splice(0, 10).reverse() : labels
          let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          datasets.push({
            label: element.companyStock,
            data: Object.values(response['Weekly Time Series']).map((val: any) => Number(val["4. close"])).splice(0, 10).reverse(),
            borderColor: color,
            backgroundColor: color
          })
        }
      }
      let newData = { labels: labels, datasets: datasets }
      setData(newData);
    }

    get().catch(console.error);

  }, [])

  return (
    <Box sx={{ height: 800, width: '100%' }}>
      {loading && <Alert severity="warning">Due Alpha Vantage API's limitation we need to wait some time to request live prices</Alert>}
      {loading && <LinearProgress />}
      {data?.datasets.length > 0 && <Line options={options} data={data} />}
      <DataGrid
        getRowId={(row) => row?.companyStock}
        rows={props.stocks}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
          sorting: {
            sortModel: [{ field: 'price', sort: 'asc' }]
          }
        }}
        pageSizeOptions={[5, 10, 20]}
      />
    </Box>
  );
}