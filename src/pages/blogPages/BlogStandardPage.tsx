import LayoutV5 from "../../components/layouts/LayoutV5";
import BlogStandardContent from "../../components/blog/BlogStandardContent";

const BlogStandardPage = () => {
  return (
    <>
      <LayoutV5 title="Blog Standard" breadCrumb="blog-standard">
        <BlogStandardContent />
      </LayoutV5>
    </>
  );
};

export default BlogStandardPage;
