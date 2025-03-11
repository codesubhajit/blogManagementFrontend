import { useEffect, useState } from "react";
import API from "../services/api";
import BlogCard from "../components/BlogCard";
import { toast } from "react-toastify";

const Home = () => {
  const [blogs, setBlogs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    API.get("/blogs")
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setBlogs(res.data.data);
        } else {
          setBlogs([]);
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch blogs");
        setLoading(false);
      });

   
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?._id) {
            setCurrentUser(parsedUser);
          } else {
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Error parsing user from localStorage", error);
        }
      } else {
        setCurrentUser(null);
      }
    };

    updateUser(); 
    window.addEventListener("storage", updateUser); 
    return () => window.removeEventListener("storage", updateUser);
  }, []);
  
  

  
  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">All Blogs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : blogs.length > 0 ? (
        <div className="row">
          {blogs?.map((blog) => (
            <BlogCard key={blog._id} blog={blog} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
};

export default Home;
