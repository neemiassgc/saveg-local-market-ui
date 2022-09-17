import { Component } from "react"
import * as net from "./net"
import { DataGrid } from '@mui/x-data-grid';
import * as utils from "./utils"
import Chip from "@mui/material/Chip"
import { ImHappy } from "react-icons/im"
import { ImSad } from "react-icons/im"

export default class DataTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datagrid: {
        products: [],
        isLoading: false,
      },
      pagination: {
        rowCount: 0,
        page: 0,
        pageSize: 5,
      }
    }
  }

  setProducts(products) {
    this.setObjectState("datagrid", { products })
  }

  setIsLoading(isLoading) {
    this.setObjectState("datagrid", { isLoading })
  }

  setRowCount(rowCount) {
    this.setObjectState("pagination", { rowCount })
  }

  setPageAndLoadData(page) {
    this.setObjectState("pagination", { page })
    this.loadData({ page })
  }

  setPageSizeAndLoadData(pageSize) {
    this.setObjectState("pagination", { pageSize })
    this.loadData({ pageSize })
  }

  componentDidMount() {
    const { page, pageSize } = this.state.datagrid;
    this.loadData({ page, pageSize });
  }

  setObjectState(objectName, properties) {
    this.setState(prevState => {
      for (const key in properties)
        prevState[objectName][key] = properties[key]
      return {
        [objectName]: prevState[objectName]
      }
    })
  }

  buildCols() {
    const dateFormatter = ({ value }) => value ? utils.formatDate(value) : "nothing"
    const priceFormatter = ({ value }) => value ? utils.formatPrice(value) : "nothing"

    return [
      {
        field: "description", type: "string", headerName: "Description", headerAlign: "left", align: "left", width: 300,
      },
      { field: "sequenceCode", type: "number", headerName: "Sequence Code", headerAlign: "left", align: "left", width: 150 },
      { field: "barcode", type: "string", headerName: "Barcode", headerAlign: "left", align: "left", width: 150 },
      {
        field: "currentPrice", type: "number", headerName: "Current Price", headerAlign: "left", width: 150,
        valueFormatter: priceFormatter, align: "left",
      },
      {
        field: "currentPriceDate", type: "string", headerName: "Current Price Date", headerAlign: "left", align: "left", width: 150,
        valueFormatter: dateFormatter,
      },
      {
        field: "previousPrice", type: "number", headerName: "Previous Price", headerAlign: "left", align: "left", width: 150,
        valueFormatter: priceFormatter,
      },
      {
        field: "previousPriceDate", type: "string", headerName: "Previous Price Date", headerAlign: "left", align: "left", width: 150,
        valueFormatter: dateFormatter,
      },
      {
        field: "priceDifference", type: "number", headerName: "Price difference", headerAlign: "left", align: "left", width: 150,
        valueFormatter: priceFormatter,
      },
    ];
  }

  buildRows() {
    return this.state.datagrid.products.map((value, index) => {
      return {
        id: index + 1,
        description: value.description,
        sequenceCode: value.sequenceCode,
        barcode: value.barcode,
        currentPrice: value.currentPrice,
        currentPriceDate: value.currentPriceDate,
        previousPrice: value.previousPrice,
        previousPriceDate: value.previousPriceDate,
        priceDifference: value.priceDifference,
      }
    });
  }

  handlePageChange(page) {
    this.loadPage({ page })
  }

  handlePageSizeChange(pageSize) {
    this.loadPage({ pageSize })
  }
  
  loadData(pagination) {
    this.setIsLoading(true)

    const {
      page = this.state.pagination.page,
      pageSize = this.state.pagination.pageSize,
    } = pagination

    net.getPagedProducts({ page, pageSize })
      .then(({ products, rowCount }) => {
        this.setProducts(products);
        this.setIsLoading(false);
        this.setRowCount(rowCount)
      })
      .catch(console.error)
  }

  render() {
    return (
      <DataGrid
        columns={this.buildCols()}
        rows={this.buildRows()}
        initialState={{
          sorting: {
            sortModel: [{ field: "description", sort: "asc" }]
          }
        }}
        rowsPerPageOptions={[5, 10, 15, 20, 30]}
        onPageChange={this.setPageAndLoadData.bind(this)}
        onPageSizeChange={this.setPageSizeAndLoadData.bind(this)}
        page={this.state.pagination.page}
        pageSize={this.state.pagination.pageSize}
        pagination={true}
        paginationMode="server"
        rowCount={this.state.pagination.rowCount}
        loading={this.state.datagrid.isLoading}
        getRowClassName={_ => "hover:text-purple-700"}
      />
    )
  }
}