import { Component } from "react/";

class ScannerModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      videoStream: undefined,
    }

    this.videoPlayer = createRef();
  }

  render() {
    
  }
}

export default ScannerModal;