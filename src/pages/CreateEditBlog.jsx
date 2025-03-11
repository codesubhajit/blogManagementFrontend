import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateEditBlog = ({ isEdit }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: "", content: "", image: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id) {
      API.get(`/blogs/${id}`)
        .then((res) => {
          const blogData = res.data.data; 
          setFormData({
            title: blogData.title,
            content: blogData.content,
            image: blogData.image,
          });
        })
        .catch(() => toast.error("Failed to load blog"));
    }
  }, [isEdit, id]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required!");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (isEdit) {
        await API.put(`/blogs/${id}`, formDataToSend);
        toast.success("Blog updated successfully!");
      } else {
        await API.post("/blogs", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Blog created successfully!");
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} blog.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">{isEdit ? "Edit Blog" : "Create a New Blog"}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Enter blog title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea
              name="content"
              className="form-control"
              rows="5"
              placeholder="Write your blog content here..."
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
            {isEdit && formData.image && (
              <div className="mt-2">
                <img src={formData.image} alt="Blog Preview" width="150" className="rounded shadow-sm" />
              </div>
            )}
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (isEdit ? "Updating..." : "Publishing...") : isEdit ? "Update Blog" : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditBlog;
