import Sidebar from "../components/ui/sidebar";
import TopBar from "../components/ui/topbar";

const AdminLayout = ({ children, onSelectPage }) => {
    return (
        <div className="flex h-screen">
            <Sidebar onSelect={onSelectPage} />
            <div className="flex-1 flex flex-col overflow-hidden dark:text-white dark:bg-slate-700">
                <TopBar />
                <div className="p-6 dark:bg-gray-700 min-h-screen dark:text-white">{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;