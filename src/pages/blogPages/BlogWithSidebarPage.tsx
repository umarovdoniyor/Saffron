import LayoutV5 from "../../components/layouts/LayoutV5";
import BlogWithSidebarContent from "../../components/blog/BlogWithSidebarContent";

const BlogWithSidebarPage = () => {
  return (
    <>
      <LayoutV5 title="Blog With Sidebar" breadCrumb="blog-with-sidebar">
        <BlogWithSidebarContent />
      </LayoutV5>
    </>
  );
};

export default BlogWithSidebarPage;
