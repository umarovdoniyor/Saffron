import { useParams } from "react-router-dom";
import LayoutV5 from "../../components/layouts/LayoutV5";
import BlogSingleContent from "../../components/blog/BlogSingleContent";
import BlogData from "../../assets/jsonData/blog/BlogData.json";

const BlogSinglePage = () => {
  const { id } = useParams();
  const blogId = parseInt(id || "1");
  const data = BlogData.find((blog) => blog.id === blogId);

  return (
    <>
      <LayoutV5 title={data?.title || "Blog Single"} breadCrumb="blog-single">
        <BlogSingleContent data={data} />
      </LayoutV5>
    </>
  );
};

export default BlogSinglePage;
