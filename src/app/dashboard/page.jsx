'use client';
import DashboardSideBar from "../components/Dashboard/DashboardSidebar";

const Dashboard = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <DashboardSideBar/>
      <div className="flex-1">{children} hello</div>
    </div>
  );
};

export default Dashboard;
