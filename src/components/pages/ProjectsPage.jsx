import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#5B47E0"
  });

  const colorOptions = [
    "#5B47E0", "#4ECDC4", "#FF6B6B", "#FFD93D", 
    "#4D96FF", "#FF9F43", "#1DD1A1", "#FF6B9D"
  ];

  const loadProjects = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsCreating(true);
    try {
      let result;
      if (editingProject) {
        result = await projectService.update(editingProject.Id, formData);
        setProjects(prev => prev.map(p => p.Id === editingProject.Id ? result : p));
        toast.success("Project updated successfully!");
      } else {
        result = await projectService.create(formData);
        setProjects(prev => [...prev, result]);
        toast.success("Project created successfully!");
      }
      
      setFormData({ name: "", description: "", color: "#5B47E0" });
      setEditingProject(null);
    } catch (error) {
      toast.error(editingProject ? "Failed to update project" : "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      color: project.color
    });
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project? This will affect all associated tasks.")) return;

    try {
      await projectService.delete(projectId);
      setProjects(prev => prev.filter(p => p.Id !== projectId));
      toast.success("Project deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
    setFormData({ name: "", description: "", color: "#5B47E0" });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProjects} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <ApperIcon name="FolderOpen" size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Project Management</h1>
          <p className="text-text-secondary">Organize your tasks into projects for better team collaboration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Form */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Plus" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                {editingProject ? "Edit Project" : "Create New Project"}
              </h2>
              <p className="text-sm text-text-secondary">
                {editingProject ? "Update project details" : "Add a new project to organize your tasks"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Project Name"
              placeholder="Enter project name..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <FormField
              label="Description (Optional)"
              placeholder="Describe the project..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            >
              <textarea
                placeholder="Describe the project..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
              />
            </FormField>

            <div>
              <label className="text-sm font-medium text-text-primary mb-3 block">
                Project Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange("color", color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ApperIcon name="Loader2" size={16} />
                    </motion.div>
                    {editingProject ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name={editingProject ? "Save" : "Plus"} size={16} />
                    {editingProject ? "Update Project" : "Create Project"}
                  </>
                )}
              </Button>
              
              {editingProject && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Project List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              Projects ({projects.length})
            </h2>
            <Button variant="ghost" size="sm" onClick={loadProjects}>
              <ApperIcon name="RefreshCw" size={16} />
              Refresh
            </Button>
          </div>

          {projects.length === 0 ? (
            <Empty />
          ) : (
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div
                  key={project.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 hover:shadow-card-hover transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: project.color }}
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-text-primary mb-1">
                            {project.name}
                          </h3>
                          {project.description && (
                            <p className="text-text-secondary mb-3">
                              {project.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-text-muted">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Calendar" size={14} />
                              <span>
                                {new Date(project.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Activity" size={14} />
                              <span className="capitalize">{project.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project)}
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.Id)}
                          className="text-accent-coral hover:text-accent-coral hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectsPage;