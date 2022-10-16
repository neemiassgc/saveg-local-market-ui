import { Component } from "react"
import Box from "@mui/material/Box"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { MdDescription } from "react-icons/md"
import { AiOutlineBarcode } from "react-icons/ai"
import { SiCoderwall } from "react-icons/si"
import { GiPriceTag } from "react-icons/gi"
import { getByBarcode } from "../net"
import { BiError } from "react-icons/bi"
import { status as statusChecker } from "../utils"

class DialogView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      open: false,
      content: {
        body: null,
        status: null,
      }
    }

    props.actions({
      searchByBarcode: this.searchByBarcode.bind(this),
    })
  }

  searchByBarcode(barcode) {
    this.showLoading();
    getByBarcode(barcode)
      .then(({ body, status }) => {
        this.setContentBody(body);
        this.setContentStatus(status);

        if (statusChecker.isBadRequest(status)) {
          this.suppressLoading();
          this.props.showFieldError(body.violations)
        }
        else this.openModal();
      })
      .catch(console.error)
  }

  showLoading() {
    this.setState({ loading: true })
  }

  suppressLoading() {
    this.setState({ loading: false })
  }

  setContentBody(body) {
    this.setContentState({ body })
  }

  setContentStatus(status) {
    this.setContentState({ status })
  }

  setContentState(property)  {
    this.setState(prevState => {
      const [ firstProp ] = Object.keys(property)
      prevState.content[firstProp] = property[firstProp]
      return {
        content: prevState.content,
      }
    })
  }

  openModal() {
    this.setState({ open: true });
  }

  closeModalAndSuppressLoading() {
    this.suppressLoading();
    this.setState({ open: false })
  }

  chooseSeverityByStatus() {
    const { status } = this.state.content;

    if (statusChecker.isOk(status))
      return  {
        severity: "info",
        msg: "Product is already exist!"
      }

    if (statusChecker.isCreated(status))
      return {
        severity: "success",
        msg: "Product created!"
      }

    return {
      severity: "error",
      msg: "Product not found!"
    }
  }

  render() {
    return (
      <>
        <Backdrop className="z-10" open={this.state.loading}>
          <CircularProgress/>
        </Backdrop>
        <Dialog
          fullWidth={true}
          maxWidth={"sm"}
          open={this.state.open}
          className="bg-transparent"
        >
          <DialogTitle>
            <Alert severity={this.chooseSeverityByStatus().severity} variant="filled">
              <AlertTitle>{this.chooseSeverityByStatus().msg}</AlertTitle>
            </Alert>
          </DialogTitle>
          <DialogContent dividers={this.state.content.status !== 404}>
          {
            this.state.content.status === 404 ?
            <Box className="flex justify-center p-2">
              <BiError className="text-9xl text-black"/>
            </Box> :
            <List>
              <ListItem className="flex gap-0">
                <ListItemIcon className="shrink"><MdDescription className="text-2xl"/></ListItemIcon>
                <ListItemText className="basis-1/2" primary="Description"/>
                <ListItemText className="basis-1/2" primary={this.state.content.body?.description}/>
              </ListItem>
              <ListItem className="flex gap-0">
                <ListItemIcon className="shrink"><AiOutlineBarcode className="text-2xl"/></ListItemIcon>
                <ListItemText className="basis-1/2" primary="Barcode"/>
                <ListItemText className="basis-1/2" primary={this.state.content.body?.barcode}/>
              </ListItem>
              <ListItem className="flex gap-0">
                <ListItemIcon className="shrink"><SiCoderwall className="text-2xl"/></ListItemIcon>
                <ListItemText className="basis-1/2" primary="Sequence code"/>
                <ListItemText className="basis-1/2" primary={this.state.content.body?.sequenceCode}/>
              </ListItem>
              <ListItem className="flex gap-0">
                <ListItemIcon className="shrink"><GiPriceTag className="text-2xl"/></ListItemIcon>
                <ListItemText className="basis-1/2" primary="Price"/>
                <ListItemText className="basis-1/2" primary={this.state.content.body?.currentPrice}/>
              </ListItem>
            </List>
          }
          </DialogContent>
          <DialogActions>
            <Button className="float-right" onClick={this.closeModalAndSuppressLoading.bind(this)}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

export default DialogView