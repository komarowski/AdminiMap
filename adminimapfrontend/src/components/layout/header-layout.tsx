import AdminiLogo from "../../assets/files/onmap.svg";

interface IProps {
  children?:  JSX.Element
}

export const HeaderLayout: React.FunctionComponent<IProps> = ({ children }) => {
  return (
    <header className="w4-header w4-theme">
        <div className="w4-navbar w4-flex">
          <a href="/" className="w4-button w4-logo">
            <img src={AdminiLogo} alt="AdminiMap logo" width="26" /> &nbsp; AdminiMap 
          </a>
          {children}
        </div>
      </header>
  );
};