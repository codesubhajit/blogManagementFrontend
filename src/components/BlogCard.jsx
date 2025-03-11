import { Link } from "react-router-dom";
import "./BlogCard.css"; 
import API from "../services/api";
import { toast } from "react-toastify";

const BlogCard = ({ blog, currentUser }) => {
  

  const isOwner = currentUser?._id === blog.author?._id; 
  const handleDelete = async () => {
   
  
    try {
      await API.delete(`/blogs/${blog._id}`);
      toast.success("Blog deleted successfully!");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog.");
    }
  };
  return (
    <div className="col-md-4 mb-4">
      <div className="card blog-card shadow-sm">
        <img src={blog.image} className="card-img-top blog-image" alt={blog.title} />
        <div className="card-body">
          <h5 className="card-title">{blog.title}</h5>
          <p className="card-text">{blog?.content}</p>
          <p className="text-muted"><strong>Author:</strong> {blog.author?.name || "Unknown"}</p>

          <div className="d-flex justify-content-between">
            {/* <Link to={`/blog/${blog._id}`} className="btn btn-primary btn-sm">
              Read More
            </Link> */}

            {isOwner ? (
              <div className="btn-group">
                <Link to={`/edit/${blog._id}`} className="btn btn-warning btn-sm">
                  ✏️ Edit
                </Link>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>🗑 Delete</button>
              </div>
            ) : (
              <p className="text-danger"></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default BlogCard;