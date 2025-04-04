import Sidebar from "../components/ui/sidebar";
import TopBar from "../components/ui/topbar";

const AdminLayout = ({ children, onSelectPage }) => {
    return (
        <div className="flex">
            <Sidebar onSelect={onSelectPage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar />
                <div className="p-6 bg-gray-50 min-h-screen">{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;