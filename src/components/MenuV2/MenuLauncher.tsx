import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "../../VendorComponents/Menu/MenuLauncher.scss";
@observer
class MenuLauncher extends React.Component<any, {}> {
  state: any = {};
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false
    };
  }
  goToMasterMenu = () => {
    this.props.onSelect("master_menu");
  }
  goToCrewMenu = () => {
    this.props.onSelect("crew_menu");
  }
  goToTechMenu = () => {
    this.props.onSelect("tech_menu");
  }
  openScanQr = () => {
    this.props.openScanQr();
    this.toggleServiceMenu();
  }
  toggleServiceMenu = () => {
    const menuState = this.state.menuVisible;
    this.setState({
      menuVisible: !menuState
    });
  }
  render() {
    const { menuVisible } = this.state;
    const { globalMachineState, disabledMenuOpen } = this.props;
    console.log(disabledMenuOpen);
    return (
      <div>
        { (globalMachineState === "beverageConfig.selection") && (
          <div>
            <div className={styles.menuBackground} style={{ opacity: menuVisible ? 0.5 : 0, zIndex: menuVisible ? 3 : -1 }} />
            <div className={styles.menuContainer} style={{ right: menuVisible ? "0" : "-100%" }}>
              {menuVisible && <div className={styles.arrowRight} style={{ top: "50px", left: "0" }} />}
              {menuVisible && (
                <div onClick={this.toggleServiceMenu} className={styles.box} style={{ top: "15px", left: "-25px" }} />
              )}
              {!menuVisible && !disabledMenuOpen && <div className={styles.arrowLeft} style={{ top: "50px", left: "-20px" }} />}
              {!menuVisible &&
                !disabledMenuOpen && (
                  <div onClick={this.toggleServiceMenu} className={styles.box} style={{ top: "15px", left: "-80px" }} />
                )}
              <div className={styles.menuBox} onClick={this.openScanQr}>
                <div className={styles.menuBoxText}>TEST QR CODE</div>
              </div>
              <div className={styles.menuBox} onClick={this.goToCrewMenu}>
                <div className={styles.menuBoxText}>CREW MENU</div>
              </div>
              <div className={styles.menuBox} onClick={this.goToTechMenu}>
                <div className={styles.menuBoxText}>TECH MENU</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default MenuLauncher;
