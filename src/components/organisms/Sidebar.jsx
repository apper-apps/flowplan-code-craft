import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Tasks", href: "/", icon: "CheckSquare" },
    { name: "Projects", href: "/projects", icon: "FolderOpen" },
    { name: "Schedule", href: "/schedule", icon: "Calendar" },
    { name: "Analytics", href: "/analytics", icon: "BarChart3" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Sparkles" size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              FlowPlan AI
            </h2>
            <p className="text-xs text-text-secondary">Intelligent Planning</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              cn(
                "sidebar-nav-item",
                isActive && "active"
              )
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Sparkles" size={16} className="text-primary-600" />
            <span className="text-sm font-medium text-primary-800">AI Powered</span>
          </div>
          <p className="text-xs text-primary-700">
            Smart scheduling and time estimation for maximum productivity.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;