const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`layout-main ${isCollapsed ? "collapsed" : ""}`}>
        <Topbar />
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
};
export default MainLayout;