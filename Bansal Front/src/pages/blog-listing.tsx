import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import { postApi } from "../services/services";
import { APIPATH, IMAGE_URL } from "../api/urls";
import LoaderWithBackground from "../components/LoaderWithBackground";
export interface blog {
    id: number;
    title: string;
    description: string;
    slug: string;
    formatted_date: string;
    image: string;
}
const Blogs = () => {
    const [loading, setLoading] = useState(false);
    const [blogList, setBlogList] = useState<blog[]>([])
    const { token, logout } = useAuthStore();
    useEffect(() => {
        getBlogList()
    }, [])
    const getBlogList = async () => {
        setLoading(true)
        try {
            const resp = await postApi(APIPATH.blogList, {}, token, logout);
            console.log(resp, 'blogList')
            const { data } = resp
            setBlogList(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    const latestBlog = blogList?.[0];
    const topBlogs = blogList?.slice(1, 5) || [];


    return (
        <>
         <style
      dangerouslySetInnerHTML={{
        __html: `
          .blog-cards .blog-title {
            font-size: 17px;
            font-weight: 600;
          }
            .blog-image-card img{width:100%}
        `,
      }}
    />
            <LoaderWithBackground visible={loading} />
            <section>
                <div className="blog-page blog-page-padding">
                    <div className="container">
                        <h2 className="sub-heading mb-4">Blogs</h2>

                        <div className="row">
                            {/* Latest Blog */}
                            {/* {latestBlog && (
                                <div className="col-md-6 mb-4">
                                    <Link to={`/blogs/${latestBlog.slug}`} className="text-decoration-none">
                                        <div className="letest-blog-card">
                                            <img
                                                src={`${IMAGE_URL}${latestBlog?.image}`}
                                                alt={latestBlog?.title}
                                                className="img-fluid"
                                            />
                                            <h4 className="latest-blog-content text-capitalize">{latestBlog?.title}</h4>
                                            <p className="mb-0 text font-500">{latestBlog?.formatted_date}</p>
                                        </div>
                                    </Link>
                                </div>
                            )} */}

                            {/* Top Blogs */}
                            {/* <div className="col-xxl-6 mb-4">
                                <div className="row">
                                    {topBlogs.map((blog) => (
                                        <div key={blog?.id} className="col-md-6 mb-4">
                                            <div className="blog-cards">
                                                <div className="blog-heading">
                                                    <h3 className="blog-title text-capitalize">{blog.title}</h3>
                                                    <p
                                                        className="blog-sort-disc text"
                                                        dangerouslySetInnerHTML={{ __html: blog.description }}
                                                    />
                                                    <p className="blog-post-date">{blog.formatted_date}</p>
                                                </div>
                                                <div className="blog-link-action">
                                                    <Link className="btn blog-arrow-btn" to={`/blogs/${blog.slug}`}>
                                                        <i className="fa-solid fa-arrow-right" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div> */}
                        </div>

                        {/* Other Blogs */}
                        <div className="row">
                            {latestBlog && (
                                <div className="col-lg-4 col-sm-6 mb-4">
                                  
                                        <div className="blog-image-card">
                                            <img
                                                src={`${IMAGE_URL}${latestBlog?.image}`}
                                                alt={latestBlog?.title}
                                                className="img-fluid"
                                            />
                                            <div className="blog-cards">
                                            <div className="blog-heading">
                                                <h3 className="blog-title text-capitalize">{latestBlog.title}</h3>
                                                {/* <p
                                                    className="blog-sort-disc text"
                                                    dangerouslySetInnerHTML={{ __html: blog.description }}
                                                /> */}
                                                <p className="blog-post-date">{latestBlog.formatted_date}</p>
                                            </div>
                                            <div className="blog-link-action">
                                                <Link className="btn blog-arrow-btn" to={`/blog/${latestBlog.slug}`}>
                                                    <i className="fa-solid fa-arrow-right" />
                                                </Link>
                                            </div>
                                        </div>
                                           
                                        </div>
                                  
                                </div>
                            )}
                            {topBlogs.map((blog) => (
                                <div key={blog.id} className="col-lg-4 col-sm-6 mb-4">
                                    <div className="blog-image-card">
                                        <img
                                            src={`${IMAGE_URL}${blog.image}`}
                                            alt={blog.title}
                                            className="img-fluid"
                                        />
                                        <div className="blog-cards">
                                            <div className="blog-heading">
                                                <h3 className="blog-title text-capitalize">{blog.title}</h3>
                                                {/* <p
                                                    className="blog-sort-disc text"
                                                    dangerouslySetInnerHTML={{ __html: blog.description }}
                                                /> */}
                                                <p className="blog-post-date">{blog.formatted_date}</p>
                                            </div>
                                            <div className="blog-link-action">
                                                <Link className="btn blog-arrow-btn" to={`/blog/${blog.slug}`}>
                                                    <i className="fa-solid fa-arrow-right" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


        </>
    );
}

export default Blogs;